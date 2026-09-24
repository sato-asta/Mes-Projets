import random
from fastapi import APIRouter, HTTPException
from app.database import db
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()


class CreateSecretSanta(BaseModel):
    name: str
    organizer_id: str
    participants: List[str]
    event_date: Optional[str] = None
    budget: Optional[float] = None


class DeleteSecretSanta(BaseModel):
    user_id: str


def _user_info(email: str) -> dict:
    """Returns basic profile info for a user by email, defaulting to email if not found."""
    u = db.users.find_one({"email": email})
    if not u:
        return {"email": email, "name": email, "avatar": ""}
    return {
        "email": u["email"],
        "name": u.get("name") or f"{u.get('firstname', '')} {u.get('lastname', '')}".strip() or email,
        "avatar": u.get("avatar", ""),
    }


@router.post("/secret-santa")
def create_secret_santa(body: CreateSecretSanta):
    """Creates a Secret Santa event with randomly assigned gift pairs among participants."""
    all_participants = list(dict.fromkeys([body.organizer_id] + body.participants))
    if len(all_participants) < 2:
        raise HTTPException(status_code=400, detail="Il faut au moins 2 participants")

    shuffled = all_participants[:]
    random.shuffle(shuffled)
    assignments = {shuffled[i]: shuffled[(i + 1) % len(shuffled)] for i in range(len(shuffled))}

    doc = {
        "name": body.name,
        "organizer_id": body.organizer_id,
        "event_date": body.event_date,
        "budget": body.budget,
        "participants": [{"email": e, "confirmed": False} for e in all_participants],
        "assignments": assignments,
    }
    result = db.secret_santas.insert_one(doc)
    return {"id": str(result.inserted_id)}


@router.get("/secret-santa")
def list_secret_santas(user_id: str = ""):
    """Returns all Secret Santa events the given user is organizing or participating in."""
    if not user_id:
        return []
    events = list(db.secret_santas.find({
        "$or": [
            {"organizer_id": user_id},
            {"participants.email": user_id},
        ]
    }))
    result = []
    for ev in events:
        ev["_id"] = str(ev["_id"])
        ev.pop("assignments", None)
        participants_enriched = []
        for p in ev.get("participants", []):
            info = _user_info(p["email"])
            participants_enriched.append({**info, "confirmed": p.get("confirmed", False)})
        ev["participants"] = participants_enriched
        result.append(ev)
    return result


@router.get("/secret-santa/{event_id}")
def get_secret_santa(event_id: str, user_id: str = ""):
    """Returns a Secret Santa event's details including the user's assigned recipient and their wishlist."""
    try:
        oid = ObjectId(event_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID invalide")

    ev = db.secret_santas.find_one({"_id": oid})
    if not ev:
        raise HTTPException(status_code=404, detail="Événement introuvable")

    assignments = ev.pop("assignments", {})
    ev["_id"] = str(ev["_id"])

    participants_enriched = []
    for p in ev.get("participants", []):
        info = _user_info(p["email"])
        participants_enriched.append({**info, "confirmed": p.get("confirmed", False)})
    ev["participants"] = participants_enriched

    if user_id and user_id in assignments:
        receiver_email = assignments[user_id]
        receiver_info = _user_info(receiver_email)
        ev["assigned_to"] = receiver_info

        wishlist = db.wishlists.find_one({"user_id": receiver_email, "is_default": True})
        if not wishlist:
            wishlist = db.wishlists.find_one({"user_id": receiver_email, "is_public": True})
        if wishlist:
            items = list(db.items.find({"wishlist_id": str(wishlist["_id"])}))
            for item in items:
                item["_id"] = str(item["_id"])
            ev["assigned_wishlist"] = items
        else:
            ev["assigned_wishlist"] = []

    return ev


@router.delete("/secret-santa/{event_id}")
def delete_secret_santa(event_id: str, body: DeleteSecretSanta):
    """Deletes a Secret Santa event, restricted to the organizer."""
    try:
        oid = ObjectId(event_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID invalide")

    ev = db.secret_santas.find_one({"_id": oid})
    if not ev:
        raise HTTPException(status_code=404, detail="Événement introuvable")
    if ev["organizer_id"] != body.user_id:
        raise HTTPException(status_code=403, detail="Seul l'organisateur peut supprimer")

    db.secret_santas.delete_one({"_id": oid})
    return {"message": "Événement supprimé"}
