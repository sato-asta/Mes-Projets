from pydantic import BaseModel
from app.models.User import UserRole


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    district_ids: list[int]


class UpdateRoleIn(BaseModel):
    role: UserRole


class UpdateScopesIn(BaseModel):
    district_ids: list[int]
