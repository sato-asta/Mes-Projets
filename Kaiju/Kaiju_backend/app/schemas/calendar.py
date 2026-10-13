from datetime import datetime
from pydantic import BaseModel


class BookedSlotOut(BaseModel):
    transfer_id: int
    source_district_id: int
    destination_district_id: int
    route_type: str
    scheduled_start: datetime
    scheduled_end: datetime


class FreeWindowOut(BaseModel):
    start: datetime
    end: datetime


class ResourceCalendarOut(BaseModel):
    resource_id: int
    range_start: datetime
    range_end: datetime
    booked: list[BookedSlotOut]
    free: list[FreeWindowOut]
