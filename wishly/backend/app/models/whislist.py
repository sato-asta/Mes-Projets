from pydantic import BaseModel
from typing import Optional, List

class Wishlist(BaseModel):
    name: str
    user_id: str
    is_public: bool = False
    emoji: Optional[str] = "🛍️"
    description: Optional[str] = ""
    color: Optional[str] = "#d64550"
    visibility: Optional[str] = "public"
    is_default: bool = False
    type: Optional[str] = "personal"
    event_type: Optional[str] = None
    event_date: Optional[str] = None
    deadline: Optional[str] = None
    collaborators: List[str] = []
    pending_collaborators: List[str] = []
    accepted_collaborators: List[str] = []
