from fastapi import APIRouter, HTTPException, Depends
from app.database import db
from app.models.item import Item
from app.auth import get_current_user
from pydantic import BaseModel
from bson import ObjectId

router = APIRouter()


class OfferToggle(BaseModel):
    user_email: str


@router.post("/items")
def add_item(item: Item, current_user: dict = Depends(get_current_user)):
    """Adds a new item to the database linked to the authenticated user."""
    try:
        item_dict = item.model_dump()
        item_dict["created_by"] = current_user["email"]
        result = db.items.insert_one(item_dict)
        return {"id": str(result.inserted_id), "message": "article ajouté"}
    except Exception as e:
        print(f"Error adding item: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/wishlists/{wishlist_id}/items")
def add_item_to_wishlist(wishlist_id: str, item: Item, current_user: dict = Depends(get_current_user)):
    """Adds an item to a specific wishlist, enforcing owner or collaborator access."""
    try:
        wishlist = db.wishlists.find_one({"_id": ObjectId(wishlist_id)})
        if not wishlist:
            raise HTTPException(status_code=404, detail="Wishlist introuvable")
        
        is_owner = wishlist["user_id"] == current_user["email"]
        is_collaborator = current_user["email"] in wishlist.get("accepted_collaborators", [])
        
        if not (is_owner or is_collaborator):
            raise HTTPException(status_code=403, detail="Vous n'avez pas accès à cette wishlist")
        
        item.wishlist_id = wishlist_id
        item_dict = item.model_dump()
        item_dict["created_by"] = current_user["email"]
        result = db.items.insert_one(item_dict)
        return {"id": str(result.inserted_id), "message": "article ajouté à la liste"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error adding item to wishlist {wishlist_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.patch("/items/{item_id}/check")
def toggle_check(item_id: str, current_user: dict = Depends(get_current_user)):
    """Toggles the checked (bought) status of an item."""
    try:
        oid = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID invalide")

    try:
        item = db.items.find_one({"_id": oid})
        if not item:
            raise HTTPException(status_code=404, detail="Article introuvable")

        new_checked = not item.get("checked", False)
        db.items.update_one({"_id": oid}, {"$set": {"checked": new_checked}})
        return {"checked": new_checked}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error toggling check on item {item_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.patch("/items/{item_id}/offer")
def toggle_offer(item_id: str, current_user: dict = Depends(get_current_user)):
    """Toggles the authenticated user's offer status on an item."""
    try:
        oid = ObjectId(item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID invalide")

    try:
        item = db.items.find_one({"_id": oid})
        if not item:
            raise HTTPException(status_code=404, detail="Article introuvable")

        user_email = current_user["email"]
        offered_by = item.get("offered_by", [])
        
        if user_email in offered_by:
            db.items.update_one({"_id": oid}, {"$pull": {"offered_by": user_email}})
            return {"is_offered": False}
        else:
            db.items.update_one({"_id": oid}, {"$addToSet": {"offered_by": user_email}})
            return {"is_offered": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error toggling offer on item {item_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
