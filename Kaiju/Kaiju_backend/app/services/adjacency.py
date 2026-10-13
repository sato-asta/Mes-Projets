from app.models.adjacency import districtadjacency
from app.models.districts import district
from app.models.inventory import Inventory
from app.services.retention import get_effective_min_retention, getAvailableToTransfer

def getAdjacentId(db, district_id):
    links = db.query(districtadjacency).filter(
        (districtadjacency.district_a_id == district_id) | (districtadjacency.district_b_id == district_id)
    ).all()

    neighbors = []
    for link in links:
        if link.district_a_id == district_id:
            neighbors.append(link.district_b_id)
        else:
            neighbors.append(link.district_a_id)
    return neighbors


def getRouteType(db, source_id, target_id, level=None):
    source_neighbors = getAdjacentId(db, source_id)
    target_neighbors = getAdjacentId(db, target_id)

    if target_id in source_neighbors:
        return "direct"

    transit_neighbor = None
    for neighbor in source_neighbors:
        if neighbor in target_neighbors:
            transit_neighbor = neighbor
            break

    source = db.get(district, source_id)
    target = db.get(district, target_id)
    maritime_available = source.sea_access and target.sea_access

    if level == 5 and maritime_available:
        return "maritime"

    if transit_neighbor is not None:
        return "transit"

    if maritime_available:
        return "maritime"

    return None


def hasAdjacentSupply(db, destination_id, resource_id, quantity):
    for neighbor_id in getAdjacentId(db, destination_id):
        inventory = db.query(Inventory).filter_by(district_id=neighbor_id, resource_id=resource_id).first()
        if inventory is None:
            continue

        min_retention = get_effective_min_retention(db, inventory.initial_quantity)
        available = getAvailableToTransfer(inventory.quantity, min_retention, inventory.reserved_quantity)

        if available >= quantity:
            return True

    return False


def getTransitId(db, source_id, target_id):
    source_neighbors = getAdjacentId(db, source_id)
    target_neighbors = getAdjacentId(db, target_id)

    for neighbor in source_neighbors:
        if neighbor in target_neighbors:
            return neighbor
    return None
