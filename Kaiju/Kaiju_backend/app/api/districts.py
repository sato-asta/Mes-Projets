from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.Database import get_db
from app.api.dependencies import getcurrentuser
from app.core.errors import apiError, ERR_PERMISSION, ERR_SCOPE
from app.models.districts import district
from app.models.inventory import Inventory
from app.models.ressources import Resource
from app.models.User import User
from app.models.user_scopes import UserDistrictScope
from app.schemas.district import DistrictOut, InventoryItemOut, ReservationIn
from app.services.permissions import checkPermission
from app.services.retention import get_current_disaster_level, get_effective_min_retention, getAvailableToTransfer
from app.services.inventory_status import getInventoryStatus
from app.services import ws_manager

router = APIRouter(prefix="/districts", tags=["districts"])


@router.get("", response_model=list[DistrictOut])
def list_districts(db: Session = Depends(get_db)):
    districts = db.query(district).all()
    return districts


@router.get("/{district_id}/inventory", response_model=list[InventoryItemOut])
def get_district_inventory(district_id: int, db: Session = Depends(get_db)):
    target = db.get(district, district_id)
    if target is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"District with ID {district_id} not found")

    rows = (db.query(Inventory, Resource).join(Resource, Inventory.resource_id == Resource.id).filter(Inventory.district_id == district_id).all())

    result = []
    for inventory, resource in rows:
        min_retention = get_effective_min_retention(db, inventory.initial_quantity)
        result.append(InventoryItemOut(
            resource_id=resource.id,
            resource_name=resource.name,
            quantity=inventory.quantity,
            initial_quantity=inventory.initial_quantity,
            min_retention=min_retention,
            reserved_quantity=inventory.reserved_quantity,
            available_to_transfer=getAvailableToTransfer(inventory.quantity, min_retention, inventory.reserved_quantity),
        ))
    return result


@router.put("/{district_id}/inventory/{resource_id}/reservation", response_model=InventoryItemOut)
def reserveInDistrict(
    district_id: int,
    resource_id: int,
    payload: ReservationIn,
    db: Session = Depends(get_db),
    user: User = Depends(getcurrentuser),
):
    level = get_current_disaster_level(db)
    checkPermission(level, user.role, "reserve_own_quarter")

    scope = db.query(UserDistrictScope).filter_by(user_id=user.id, district_id=district_id).first()
    if scope is None:
        raise apiError(403, ERR_SCOPE, "No access to district " + str(district_id))

    inventory = db.query(Inventory).filter_by(district_id=district_id, resource_id=resource_id).first()
    if inventory is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory not found")

    if payload.reserved_quantity < 0 or payload.reserved_quantity > inventory.quantity:
        raise apiError(422, "ERR_INVALID_QUANTITY", "Reserved quantity must be between 0 and the current stock")

    inventory.reserved_quantity = payload.reserved_quantity
    db.commit()
    db.refresh(inventory)

    ws_manager.broadcast("resource_status_update", getInventoryStatus(db, district_id, resource_id))

    resource = db.get(Resource, resource_id)
    min_retention = get_effective_min_retention(db, inventory.initial_quantity)

    return InventoryItemOut(
        resource_id=resource.id,
        resource_name=resource.name,
        quantity=inventory.quantity,
        initial_quantity=inventory.initial_quantity,
        min_retention=min_retention,
        reserved_quantity=inventory.reserved_quantity,
        available_to_transfer=getAvailableToTransfer(inventory.quantity, min_retention, inventory.reserved_quantity),
    )
