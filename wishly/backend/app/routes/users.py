from fastapi import APIRouter, HTTPException, Depends
from app.database import db
from app.models.user import User
from pydantic import BaseModel
from app.auth import create_access_token, get_current_user
import bcrypt
import re
import secrets
import string


def generate_friend_code() -> str:
    """Generates a unique 8-character alphanumeric friend code."""
    alphabet = string.ascii_uppercase + string.digits
    while True:
        code = "".join(secrets.choice(alphabet) for _ in range(8))
        if not db.users.find_one({"friend_code": code}):
            return code

router = APIRouter()


class LoginCredentials(BaseModel):
    email: str
    password: str


def valide_password(password: str):
    """Validates password strength: max 20 chars, at least 1 uppercase and 2 digits."""
    if len(password) > 20:
        raise HTTPException(status_code=400, detail="Le mot de passe doit contenir au maximum 20 caractères")

    if not any(char.isupper() for char in password):
        raise HTTPException(status_code=400, detail="Le mot de passe doit contenir au moins 1 majuscule")

    if sum(1 for c in password if c.isdigit()) < 2:
        raise HTTPException(status_code=400, detail="Le mot de passe doit contenir au moins 2 chiffres")


def valide_email(email: str):
    """Validates email format and ensures it is not already registered."""
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    if not re.match(pattern, email):
        raise HTTPException(status_code=400, detail="L'email n'est pas valide")

    if db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="L'email est déjà utilisé")


def _resolve_name(user: User) -> str:
    """Resolves the display name from a User object, falling back to firstname/lastname."""
    if user.name:
        return user.name
    return f"{user.firstname or ''} {user.lastname or ''}".strip()


@router.post("/users")
def create_user(user: User):
    """Registers a new user and creates their default wishlist."""
    try:
        display_name = _resolve_name(user)
        existing_user = db.users.find_one({"email": user.email})
        if existing_user:
            if user.provider == "google" and existing_user.get("provider") == "google":
                if not existing_user.get("friend_code"):
                    code = generate_friend_code()
                    db.users.update_one({"email": user.email}, {"$set": {"friend_code": code}})
                    existing_user["friend_code"] = code
                return {
                    "id": str(existing_user["_id"]),
                    "name": existing_user.get("name", display_name),
                    "email": existing_user["email"],
                    "avatar": existing_user.get("avatar", ""),
                    "friend_code": existing_user.get("friend_code", ""),
                }
            else:
                raise HTTPException(status_code=400, detail="L'email est déjà utilisé")

        valide_email(user.email)
        user_dict = user.model_dump()
        user_dict["name"] = display_name
        user_dict["friend_code"] = generate_friend_code()
        user_dict["friends"] = []

        if user.provider == "local":
            valide_password(user.password)
            hashed = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
            user_dict["password"] = hashed.decode("utf-8")
        else:
            user_dict["password"] = ""

        result = db.users.insert_one(user_dict)

        db.wishlists.insert_one({
            "name": "Tous mes articles",
            "user_id": user_dict["email"],
            "is_public": False,
            "emoji": "⭐",
            "description": "Ma liste par défaut",
            "color": "#d64550",
            "visibility": "private",
            "is_default": True,
            "collaborators": [],
            "accepted_collaborators": [],
        })

        return {
            "id": str(result.inserted_id),
            "name": display_name,
            "email": user_dict["email"],
            "avatar": user_dict.get("avatar", ""),
            "friend_code": user_dict["friend_code"],
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating user {user.email}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/users/{email}/profile")
def get_user_profile(email: str, viewer_email: str = ""):
    """Returns a user's public profile along with their visible wishlists and items."""
    try:
        user = db.users.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur introuvable")

        is_self_or_friend = viewer_email == email or viewer_email in user.get("friends", [])
        query = {"user_id": email, "is_default": {"$ne": True}}
        if not is_self_or_friend:
            query["visibility"] = "public"

        wishlists = list(db.wishlists.find(query))
        result = []
        for wl in wishlists:
            wl_id = str(wl["_id"])
            items = list(db.items.find({"wishlist_id": wl_id}))
            for item in items:
                item["_id"] = str(item["_id"])
                item["is_offered_by_me"] = viewer_email in item.get("offered_by", [])
            result.append({
                "_id": wl_id,
                "name": wl["name"],
                "emoji": wl.get("emoji", "🛍️"),
                "description": wl.get("description", ""),
                "color": wl.get("color", "#d64550"),
                "items": items,
            })

        user_name = user.get("name") or f"{user.get('firstname', '')} {user.get('lastname', '')}".strip() or user["email"]
        return {
            "id": str(user["_id"]),
            "name": user_name,
            "email": user["email"],
            "avatar": user.get("avatar", ""),
            "friend_code": user.get("friend_code", ""),
            "wishlists": result,
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching profile for {email}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/users/login")
def login_user(credentials: LoginCredentials):
    """Authenticates a local user and returns a JWT access token."""
    try:
        user = db.users.find_one({"email": credentials.email, "provider": "local"})
        if not user:
            raise HTTPException(status_code=401, detail="Identifiants incorrects")

        if not bcrypt.checkpw(credentials.password.encode("utf-8"), user["password"].encode("utf-8")):
            raise HTTPException(status_code=401, detail="Identifiants incorrects")
        
        token = create_access_token(user["email"])
        
        user_name = user.get("name") or f"{user.get('firstname', '')} {user.get('lastname', '')}".strip() or user["email"]
        return {
            "id": str(user["_id"]),
            "name": user_name,
            "email": user["email"],
            "avatar": user.get("avatar", ""),
            "access_token": token,
            "token_type": "bearer",
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error during login for {credentials.email}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

class TokenRequest(BaseModel):
    email: str


@router.post("/users/token")
def get_token_for_email(body: TokenRequest):
    """Issues a JWT token for the given email without password verification."""
    user = db.users.find_one({"email": body.email})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    token = create_access_token(user["email"])
    return {"access_token": token, "token_type": "bearer"}


@router.patch("/users/name")
def update_user_name(payload: dict):
    """Updates the display name of an existing user."""
    try:
        email = payload.get("email", "").strip()
        name = payload.get("name", "").strip()
        if not email or not name:
            raise HTTPException(status_code=400, detail="Email et nom requis")

        user = db.users.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur introuvable")

        db.users.update_one({"email": email}, {"$set": {"name": name}})

        return {"success": True, "name": name}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating name for {payload.get('email')}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/users")
def get_users():
    """Returns all users in the database."""
    try:
        users = list(db.users.find())
        for user in users:
            user["_id"] = str(user["_id"])
        return users
    except Exception as e:
        print(f"Error fetching users: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
