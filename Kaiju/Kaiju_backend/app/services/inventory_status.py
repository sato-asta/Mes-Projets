from app.models.inventory import Inventory
from app.models.ressources import Resource
from app.services.retention import get_effective_min_retention, getAvailableToTransfer


def getInventoryStatus(db, district_id, resource_id):
    inventory = db.query(Inventory).filter_by(district_id=district_id, resource_id=resource_id).first()
    if inventory is None:
        return None

    resource = db.get(Resource, resource_id)
    min_retention = get_effective_min_retention(db, inventory.initial_quantity)

    return {
        "district_id": district_id,
        "resource_id": resource_id,
        "resource_name": resource.name,
        "quantity": inventory.quantity,
        "min_retention": min_retention,
        "reserved_quantity": inventory.reserved_quantity,
        "available_to_transfer": getAvailableToTransfer(inventory.quantity, min_retention, inventory.reserved_quantity),
    }
