from pydantic import BaseModel
from typing import Optional

class Item(BaseModel):
    name: str
    price: float
    image: str = ""
    url: str = ""
    category: str = ""
    wishlist_id: str = ""
    checked: bool = False
    note: Optional[str] = None
