from typing import Optional
from pydantic import BaseModel


class TransferCreate(BaseModel):
    source_district_id: int
    destination_district_id: int
    resource_id: int
    quantity: int


class TransferOut(BaseModel):
    id: int
    requester_id: int
    source_district_id: int
    destination_district_id: int
    ressource_id: int
    quantity: int
    status: str
    route_type: str
    transit_district_id: Optional[int] = None
    approved_id: Optional[int] = None
    transit_approved_id: Optional[int] = None

    class Config:
        from_attributes = True
