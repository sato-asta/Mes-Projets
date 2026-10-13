from pydantic import BaseModel, EmailStr
from app.models.User import UserRole

class Register(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole

class Login(BaseModel):
    email: EmailStr
    password: str

class Out(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole
    district_ids: list[int] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str