from pydantic import BaseModel

class DistrictOut(BaseModel):
    id: int
    name: str
    code: str
    sea_access: bool
    is_hub: bool

    class Config:
        from_attributes = True

class InventoryItemOut(BaseModel):
    resource_id: int
    resource_name: str
    quantity: int
    initial_quantity: int
    min_retention: int
    reserved_quantity: int
    available_to_transfer: int

    class Config:
        from_attributes = True


class ReservationIn(BaseModel):
    reserved_quantity: int