from datetime import timedelta
from app.models.transfers import transfer, transferstatus

DELIVERY_HOURS = {
    "direct": 2,
    "transit": 4,
    "maritime": 4,
}


def getDeliveryDuration(route_type):
    hours = DELIVERY_HOURS[route_type]
    return timedelta(hours=hours)


def getBookedSlots(db, resource_id):
    return db.query(transfer).filter(
        transfer.ressource_id == resource_id,
        transfer.status == transferstatus.APPROVED,
        transfer.scheduled_start.isnot(None),
    ).order_by(transfer.scheduled_start).all()


def getFreeWindows(db, resource_id, range_start, range_end):
    booked_slots = getBookedSlots(db, resource_id)

    free_windows = []
    cursor = range_start

    for slot in booked_slots:
        if slot.scheduled_end <= range_start or slot.scheduled_start >= range_end:
            continue

        if slot.scheduled_start > cursor:
            free_windows.append({"start": cursor, "end": slot.scheduled_start})

        if slot.scheduled_end > cursor:
            cursor = slot.scheduled_end

    if cursor < range_end:
        free_windows.append({"start": cursor, "end": range_end})

    return free_windows
