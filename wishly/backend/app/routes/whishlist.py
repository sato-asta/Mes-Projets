from fastapi import APIRouter, HTTPException, Depends
from app.database import db
from app.models.whislist import Wishlist
from app.auth import get_current_user
from bson import ObjectId
from pydantic import BaseModel

router = APIRouter()


class CollaboratorAction(BaseModel):
    user_email: str


@router.post("/wishlists")
def create_wishlist(wishlist: Wishlist, current_user: dict = Depends(get_current_user)):
    """Creates a new wishlist owned by the authenticated user."""
    try:
        data = wishlist.model_dump()
        data["user_id"] = current_user["email"]
        data["pending_collaborators"] = data.pop("collaborators", [])
        data["accepted_collaborators"] = []
        result = db.wishlists.insert_one(data)
        return {"id": str(result.inserted_id), "message": "wishlist créée"}
    except Exception as e:
        print(f"Error creating wishlist: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/wishlists")
def get_wishlists(current_user: dict = Depends(get_current_user)):
    """Returns all wishlists owned by or shared with the authenticated user."""
    try:
        user_id = current_user["email"]
        wishlists = list(db.wishlists.find({
            "$or": [
                {"user_id": user_id},
                {"accepted_collaborators": user_id},
            ]
        }))
        for w in wishlists:
            w["_id"] = str(w["_id"])
            w["is_collaborative"] = bool(w.get("pending_collaborators") or w.get("accepted_collaborators"))
            w["is_owner"] = w.get("user_id") == user_id
            w["member_count"] = len(w.get("accepted_collaborators", [])) + 1
        return wishlists
    except Exception as e:
        print(f"Error fetching wishlists: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/wishlists/invitations")
def get_wishlist_invitations(current_user: dict = Depends(get_current_user)):
    """Returns pending wishlist collaboration invitations for the authenticated user."""
    try:
        user_email = current_user["email"]
        wishlists = list(db.wishlists.find({"pending_collaborators": user_email}))
        result = []
        for wl in wishlists:
            owner = db.users.find_one({"email": wl["user_id"]})
            owner_name = ""
            if owner:
                owner_name = owner.get("name") or f"{owner.get('firstname', '')} {owner.get('lastname', '')}".strip() or wl["user_id"]
            result.append({
                "_id": str(wl["_id"]),
                "name": wl["name"],
                "emoji": wl.get("emoji", "🛍️"),
                "color": wl.get("color", "#d64550"),
                "owner_name": owner_name,
                "owner_email": wl["user_id"],
            })
        return result
    except Exception as e:
        print(f"Error fetching invitations: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.patch("/wishlists/{wishlist_id}/accept")
def accept_wishlist_invitation(wishlist_id: str, current_user: dict = Depends(get_current_user)):
    """Accepts a pending wishlist collaboration invitation for the authenticated user."""
    try:
        oid = ObjectId(wishlist_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID invalide")

    try:
        wl = db.wishlists.find_one({"_id": oid})
        if not wl:
            raise HTTPException(status_code=404, detail="Liste introuvable")
        
        user_email = current_user["email"]
        if user_email not in wl.get("pending_collaborators", []):
            raise HTTPException(status_code=403, detail="Vous n'avez pas d'invitation pour cette liste")
        
        db.wishlists.update_one(
            {"_id": oid},
            {
                "$pull": {"pending_collaborators": user_email},
                "$addToSet": {"accepted_collaborators": user_email},
            },
        )
        return {"message": "Invitation acceptée"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error accepting invitation: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.patch("/wishlists/{wishlist_id}/decline")
def decline_wishlist_invitation(wishlist_id: str, current_user: dict = Depends(get_current_user)):
    """Declines a pending wishlist collaboration invitation for the authenticated user."""
    try:
        oid = ObjectId(wishlist_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID invalide")

    try:
        wl = db.wishlists.find_one({"_id": oid})
        if not wl:
            raise HTTPException(status_code=404, detail="Liste introuvable")
        
        user_email = current_user["email"]
        if user_email not in wl.get("pending_collaborators", []):
            raise HTTPException(status_code=403, detail="Vous n'avez pas d'invitation pour cette liste")
        
        db.wishlists.update_one(
            {"_id": oid},
            {"$pull": {"pending_collaborators": user_email}},
        )
        return {"message": "Invitation refusée"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error declining invitation: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/wishlists/{wishlist_id}")
def get_wishlist(wishlist_id: str):
    """Returns a single wishlist by its ID."""
    try:
        oid = ObjectId(wishlist_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID invalide")
    wishlist = db.wishlists.find_one({"_id": oid})
    if not wishlist:
        raise HTTPException(status_code=404, detail="Liste introuvable")
    wishlist["_id"] = str(wishlist["_id"])
    return wishlist


@router.get("/wishlists/{wishlist_id}/items")
def get_wishlist_items(wishlist_id: str):
    """Returns all items in a wishlist, hiding the offered_by details from the response."""
    try:
        items = list(db.items.find({"wishlist_id": wishlist_id}))
        for item in items:
            item["_id"] = str(item["_id"])
            item["is_being_offered"] = len(item.get("offered_by", [])) > 0
            item.pop("offered_by", None)
        return items
    except Exception as e:
        print(f"Error fetching items for wishlist {wishlist_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
