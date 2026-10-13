from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.Database import get_db
from app.schemas.calendar import BookedSlotOut, ResourceCalendarOut
from app.services.calendar import getBookedSlots, getFreeWindows

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.get("/resources/{resource_id}", response_model=ResourceCalendarOut)
def getResourceCalendar(
    resource_id: int,
    range_start: datetime = Query(default=None),
    range_end: datetime = Query(default=None),
    db: Session = Depends(get_db),
):
    if range_start is None:
        range_start = datetime.now(timezone.utc)
    if range_end is None:
        range_end = range_start + timedelta(days=7)

    all_booked = getBookedSlots(db, resource_id)
    booked_in_range = [
        slot for slot in all_booked
        if slot.scheduled_start < range_end and slot.scheduled_end > range_start
    ]

    free_windows = getFreeWindows(db, resource_id, range_start, range_end)

    return ResourceCalendarOut(
        resource_id=resource_id,
        range_start=range_start,
        range_end=range_end,
        booked=[
            BookedSlotOut(
                transfer_id=slot.id,
                source_district_id=slot.source_district_id,
                destination_district_id=slot.destination_district_id,
                route_type=slot.route_type.value,
                scheduled_start=slot.scheduled_start,
                scheduled_end=slot.scheduled_end,
            )
            for slot in booked_in_range
        ],
        free=free_windows,
    )
