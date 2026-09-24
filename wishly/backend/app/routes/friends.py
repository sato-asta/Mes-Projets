from fastapi import APIRouter, HTTPException, Depends
from app.database import db
from pydantic import BaseModel
from app.auth import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter()


class FriendRequest(BaseModel):
    from_email: str
    friend_code: str


class FriendRequestAction(BaseModel):
    request_id: str
    user_email: str


class RemoveFriend(BaseModel):
    user_email: str
    friend_email: str


def _user_or_404(email: str):
    """Fetches a user by email or raises a 404 HTTP exception if not found."""
    user = db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return user


@router.get("/friends")
def get_friends(current_user: dict = Depends(get_current_user)):
    """Returns the friend list of the authenticated user with their profile info."""
    try:
        email = current_user["email"]
        user = _user_or_404(email)
        friend_emails = user.get("friends", [])
        friends = []
        for fe in friend_emails:
            f = db.users.find_one({"email": fe})
            if f:
                friends.append({
                    "id": str(f["_id"]),
                    "name": f.get("name") or f"{f.get('firstname', '')} {f.get('lastname', '')}".strip() or f["email"],
                    "email": f["email"],
                    "avatar": f.get("avatar", ""),
                    "friend_code": f.get("friend_code", ""),
                })
        return friends
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching friends: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/friends/code")
def get_friend_code(current_user: dict = Depends(get_current_user)):
    """Returns or generates the unique friend code for the authenticated user."""
    try:
        email = current_user["email"]
        user = _user_or_404(email)
        code = user.get("friend_code", "")
        if not code:
            import secrets, string
            alphabet = string.ascii_uppercase + string.digits
            while True:
                code = "".join(secrets.choice(alphabet) for _ in range(8))
                if not db.users.find_one({"friend_code": code}):
                    break
            db.users.update_one({"email": email}, {"$set": {"friend_code": code}})
        return {"friend_code": code}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching friend code: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/friends/requests")
def get_friend_requests(current_user: dict = Depends(get_current_user)):
    """Returns all pending friend requests received by the authenticated user."""
    try:
        email = current_user["email"]
        _user_or_404(email)
        requests = list(db.friend_requests.find({
            "to_email": email,
            "status": "pending",
        }))
        result = []
        for req in requests:
            sender = db.users.find_one({"email": req["from_email"]})
            sender_name = ""
            if sender:
                sender_name = sender.get("name") or f"{sender.get('firstname', '')} {sender.get('lastname', '')}".strip() or req["from_email"]
            result.append({
                "id": str(req["_id"]),
                "from_email": req["from_email"],
                "from_name": sender_name or req["from_email"],
                "from_avatar": sender.get("avatar", "") if sender else "",
                "from_friend_code": sender.get("friend_code", "") if sender else "",
                "created_at": req.get("created_at", "").isoformat() if isinstance(req.get("created_at"), datetime) else "",
            })
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching friend requests: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/friends/request")
def send_friend_request(body: FriendRequest, current_user: dict = Depends(get_current_user)):
    """Sends a friend request to another user identified by their friend code."""
    try:
        from_email = current_user["email"]
        sender = _user_or_404(from_email)

        target = db.users.find_one({"friend_code": body.friend_code})
        if not target:
            raise HTTPException(status_code=404, detail="Code ami introuvable")

        if target["email"] == from_email:
            raise HTTPException(status_code=400, detail="Vous ne pouvez pas vous ajouter vous-même")

        if from_email in target.get("friends", []):
            raise HTTPException(status_code=400, detail="Vous êtes déjà amis")

        existing = db.friend_requests.find_one({
            "from_email": from_email,
            "to_email": target["email"],
            "status": "pending",
        })
        if existing:
            raise HTTPException(status_code=400, detail="Une demande est déjà en attente")

        db.friend_requests.insert_one({
            "from_email": from_email,
            "to_email": target["email"],
            "status": "pending",
            "created_at": datetime.utcnow(),
        })

        target_name = target.get("name") or f"{target.get('firstname', '')} {target.get('lastname', '')}".strip() or target["email"]
        return {"message": "Demande d'ami envoyée", "to": target_name}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error sending friend request: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/friends/accept")
def accept_friend_request(body: FriendRequestAction, current_user: dict = Depends(get_current_user)):
    """Accepts a pending friend request and adds both users as mutual friends."""
    try:
        oid = ObjectId(body.request_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID invalide")
    try:
        req = db.friend_requests.find_one({"_id": oid})
        if not req:
            raise HTTPException(status_code=404, detail="Demande introuvable")
        
        user_email = current_user["email"]
        if req["to_email"] != user_email:
            raise HTTPException(status_code=403, detail="Non autorisé")
        if req["status"] != "pending":
            raise HTTPException(status_code=400, detail="Cette demande n'est plus en attente")

        db.friend_requests.update_one({"_id": oid}, {"$set": {"status": "accepted"}})
        db.users.update_one({"email": req["to_email"]}, {"$addToSet": {"friends": req["from_email"]}})
        db.users.update_one({"email": req["from_email"]}, {"$addToSet": {"friends": req["to_email"]}})

        return {"message": "Demande acceptée"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error accepting friend request: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/friends/decline")
def decline_friend_request(body: FriendRequestAction, current_user: dict = Depends(get_current_user)):
    """Declines a pending friend request."""
    try:
        oid = ObjectId(body.request_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID invalide")
    try:
        req = db.friend_requests.find_one({"_id": oid})
        if not req:
            raise HTTPException(status_code=404, detail="Demande introuvable")
        
        user_email = current_user["email"]
        if req["to_email"] != user_email:
            raise HTTPException(status_code=403, detail="Non autorisé")

        db.friend_requests.update_one({"_id": oid}, {"$set": {"status": "declined"}})
        return {"message": "Demande refusée"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error declining friend request: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.delete("/friends")
def remove_friend(body: RemoveFriend, current_user: dict = Depends(get_current_user)):
    """Removes a friend from both users' friend lists."""
    try:
        user_email = current_user["email"]
        if body.user_email != user_email:
            raise HTTPException(status_code=403, detail="Non autorisé")
        
        _user_or_404(body.user_email)
        _user_or_404(body.friend_email)

        db.users.update_one({"email": body.user_email}, {"$pull": {"friends": body.friend_email}})
        db.users.update_one({"email": body.friend_email}, {"$pull": {"friends": body.user_email}})

        return {"message": "Ami supprimé"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error removing friend: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
