from pydantic import BaseModel
from typing import Optional, List

class User(BaseModel):
    name: Optional[str] = ""
    firstname: Optional[str] = ""
    lastname: Optional[str] = ""
    email: str
    password: Optional[str] = ""
    avatar: Optional[str] = ""
    bio: Optional[str] = ""
    provider: str = "local"
    is_admin: bool = False
    is_public: bool = False
    friend_code: Optional[str] = ""
    friends: Optional[List[str]] = []
