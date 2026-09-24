from pydantic import BaseModel

class Category(BaseModel):
    name: str
    user_id: str
    icon: str = ""