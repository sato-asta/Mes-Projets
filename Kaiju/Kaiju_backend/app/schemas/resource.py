from pydantic import BaseModel


class ResourceOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True
