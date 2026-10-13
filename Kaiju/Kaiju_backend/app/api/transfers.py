from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.Database import get_db
from app.api.dependencies import getcurrentuser
from app.core.errors import (
    apiError, ERR_NO_ROUTE, ERR_RETENTION, ERR_SCOPE, ERR_STOCK, ERR_NOT_FOUND,
    ERR_BAD_STATE, ERR_PERMISSION, ERR_RESERVED, ERR_ADJACENT_SUPPLY, ERR_XENO_PRIORITY,
)
from app.models.districts import district
from app.models.inventory import Inventory
from app.models.transfers import transfer, transferstatus, routetype
from app.models.User import User, UserRole
from app.models.user_scopes import UserDistrictScope
from app.schemas.transfer import TransferCreate, TransferOut
from app.services.adjacency import getRouteType, getTransitId, hasAdjacentSupply
from app.services.permissions import checkPermission, isAllowed
from app.services.retention import get_current_disaster_level, get_effective_min_retention
from app.services.calendar import getDeliveryDuration
from app.services.inventory_status import getInventoryStatus
from app.services import ws_manager
from datetime import datetime, timezone

router = APIRouter(prefix="/transfers", tags=["transfers"])


def checkScope(db, user, district_id):
    if user.role == UserRole.CD:
        return
    scope = db.query(UserDistrictScope).filter_by(user_id=user.id, district_id=district_id).first()
    if scope is None:
        raise apiError(403, ERR_SCOPE, "No access to district " + str(district_id))


def checkTransferInitiationPermission(level, role, route_type):
    if role == UserRole.CD and isAllowed(level, role, "requisition"):
        return

    action = "request_adjacent_transfer" if route_type == "direct" else "organize_transit"
    checkPermission(level, role, action)


def requireApprover(user):
    if user.role not in (UserRole.QC, UserRole.CD):
        raise apiError(403, ERR_PERMISSION, "Only a QC or the CD can approve or reject a transfer")


def getInventory(db, district_id, resource_id):
    inv = db.query(Inventory).filter_by(district_id=district_id, resource_id=resource_id).first()
    if inv is None:
        raise apiError(404, ERR_NOT_FOUND, "Inventory not found")
    return inv


def checkStock(db, inventory, quantity):
    if inventory.quantity < quantity:
        raise apiError(400, ERR_STOCK, "Not enough stock")

    min_retention = get_effective_min_retention(db, inventory.initial_quantity)
    if inventory.quantity - quantity < min_retention:
        raise apiError(409, ERR_RETENTION, "Stock would go below the minimum retention")

    if inventory.quantity - quantity < inventory.reserved_quantity:
        raise apiError(409, ERR_RESERVED, "Stock would go below the quarter's own reservation")


def getApprovableTransfer(db, transfer_id):
    found = db.get(transfer, transfer_id)
    if found is None:
        raise apiError(404, ERR_NOT_FOUND, "Transfer not found")
    if found.status not in (transferstatus.PENDING, transferstatus.PENDING_TRANSIT):
        raise apiError(409, ERR_BAD_STATE, "Transfer is not pending")
    return found


def checkXenoPriority(db, found):
    transit_district = db.get(district, found.transit_district_id)
    if transit_district is None or not transit_district.is_hub:
        return

    own_pending = db.query(transfer).filter(
        transfer.id != found.id,
        transfer.destination_district_id == transit_district.id,
        transfer.ressource_id == found.ressource_id,
        transfer.status.in_([transferstatus.PENDING, transferstatus.PENDING_TRANSIT]),
    ).first()

    if own_pending is not None:
        raise apiError(
            409, ERR_XENO_PRIORITY,
            "Xeno's own pending requests for this resource must be processed first",
        )


def finalizeTransfer(db, found):
    source_inventory = getInventory(db, found.source_district_id, found.ressource_id)
    checkStock(db, source_inventory, found.quantity)

    source_inventory.quantity = source_inventory.quantity - found.quantity

    dest_inventory = db.query(Inventory).filter_by(
        district_id=found.destination_district_id, resource_id=found.ressource_id).first()
    if dest_inventory is None:
        dest_inventory = Inventory(district_id=found.destination_district_id,
            resource_id=found.ressource_id,
            quantity=0,
            initial_quantity=found.quantity,
        )
        db.add(dest_inventory)
    dest_inventory.quantity = dest_inventory.quantity + found.quantity

    found.status = transferstatus.APPROVED
    found.scheduled_start = datetime.now(timezone.utc)
    found.scheduled_end = found.scheduled_start + getDeliveryDuration(found.route_type.value)

    db.commit()
    db.refresh(found)

    ws_manager.broadcast("transfer_status_changed", {
        "id": found.id,
        "status": found.status.value,
    })
    ws_manager.broadcast("resource_status_update", getInventoryStatus(db, found.source_district_id, found.ressource_id))
    ws_manager.broadcast("resource_status_update", getInventoryStatus(db, found.destination_district_id, found.ressource_id))
    return found


@router.post("", response_model=TransferOut, status_code=201)
def createTransfer(payload: TransferCreate, db: Session = Depends(get_db), user: User = Depends(getcurrentuser)):
    level = get_current_disaster_level(db)

    route = getRouteType(db, payload.source_district_id, payload.destination_district_id, level)
    if route is None:
        raise apiError(400, ERR_NO_ROUTE, "No valid route between these districts")

    if route != "direct" and hasAdjacentSupply(db, payload.destination_district_id, payload.resource_id, payload.quantity):
        raise apiError(
            409, ERR_ADJACENT_SUPPLY,
            "An adjacent quarter already has enough surplus to fulfill this request directly",
        )

    checkTransferInitiationPermission(level, user.role, route)
    checkScope(db, user, payload.destination_district_id)

    inv = getInventory(db, payload.source_district_id, payload.resource_id)
    checkStock(db, inv, payload.quantity)

    transit_id = None
    if route == "transit":
        transit_id = getTransitId(db, payload.source_district_id, payload.destination_district_id)

    new_transfer = transfer(requester_id=user.id,
        source_district_id=payload.source_district_id,
        destination_district_id=payload.destination_district_id,
        ressource_id=payload.resource_id,
        quantity=payload.quantity,
        route_type=routetype(route),
        transit_district_id=transit_id,
    )
    db.add(new_transfer)
    db.commit()
    db.refresh(new_transfer)

    ws_manager.broadcast("transfer_created", {
        "id": new_transfer.id,
        "source_district_id": new_transfer.source_district_id,
        "destination_district_id": new_transfer.destination_district_id,
        "status": new_transfer.status.value,
    })

    competing = db.query(transfer).filter(
        transfer.id != new_transfer.id,
        transfer.source_district_id == new_transfer.source_district_id,
        transfer.ressource_id == new_transfer.ressource_id,
        transfer.status.in_([transferstatus.PENDING, transferstatus.PENDING_TRANSIT]),
    ).all()
    if competing:
        ws_manager.broadcast("conflict_notification", {
            "resource_id": new_transfer.ressource_id,
            "district_id": new_transfer.source_district_id,
            "transfer_ids": [new_transfer.id] + [c.id for c in competing],
        })

    return new_transfer


@router.get("", response_model=list[TransferOut])
def listTransfers(db: Session = Depends(get_db), user: User = Depends(getcurrentuser)):
    level = get_current_disaster_level(db)
    checkPermission(level, user.role, "view")
    return db.query(transfer).all()


@router.post("/{transfer_id}/approve", response_model=TransferOut)
def approveTransfer(transfer_id: int, db: Session = Depends(get_db), user: User = Depends(getcurrentuser)):
    requireApprover(user)
    found = getApprovableTransfer(db, transfer_id)

    if found.status == transferstatus.PENDING:
        checkScope(db, user, found.source_district_id)
        found.approved_id = user.id

        if found.route_type == routetype.TRANSIT:
            found.status = transferstatus.PENDING_TRANSIT
            db.commit()
            db.refresh(found)
            ws_manager.broadcast("transfer_status_changed", {"id": found.id, "status": found.status.value})
            return found

        return finalizeTransfer(db, found)

    checkScope(db, user, found.transit_district_id)
    checkXenoPriority(db, found)
    found.transit_approved_id = user.id
    return finalizeTransfer(db, found)


@router.post("/{transfer_id}/reject", response_model=TransferOut)
def rejectTransfer(transfer_id: int, db: Session = Depends(get_db), user: User = Depends(getcurrentuser)):
    requireApprover(user)
    found = getApprovableTransfer(db, transfer_id)

    if found.status == transferstatus.PENDING:
        checkScope(db, user, found.source_district_id)
    else:
        checkScope(db, user, found.transit_district_id)

    found.status = transferstatus.REJECTED
    found.approved_id = user.id
    db.commit()
    db.refresh(found)

    ws_manager.broadcast("transfer_status_changed", {
        "id": found.id,
        "status": found.status.value,
    })
    return found
