from fastapi import APIRouter, HTTPException, Depends
from app.models import Category
from app.database import db
from app.auth import get_current_user
from bson import ObjectId

router = APIRouter()

def format_category(category):
    """Converts the category document's ObjectId to a string for JSON serialization."""
    category['_id'] = str(category['_id'])
    return category

@router.get("/categories/{user_id}")
def get_categories(user_id: str, current_user: dict = Depends(get_current_user)):
    """Returns all categories belonging to the given user."""
    if current_user["id"] != user_id:
        raise HTTPException(status_code=403, detail="Accès interdit")
    categories = list(db.categories.find({"user_id": user_id}))
    return [format_category(category) for category in categories]

@router.post("/categories")
def create_category(category: Category, current_user: dict = Depends(get_current_user)):
    """Creates a new category in the database."""
    result = db.categories.insert_one(category.model_dump())
    return {"id": str(result.inserted_id), "message": "Catégorie créée"}

@router.put("/categories/{category_id}")
def update_category(category_id: str, category: Category, current_user: dict = Depends(get_current_user)):
    """Updates an existing category by its ID."""
    result = db.categories.update_one({"_id": ObjectId(category_id)}, {"$set": category.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return {"message": "Catégorie mise à jour"}

@router.delete("/categories/{category_id}")
def delete_category(category_id: str, current_user: dict = Depends(get_current_user)):
    """Deletes a category by its ID."""
    result = db.categories.delete_one({"_id": ObjectId(category_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return {"message": "Catégorie supprimée"}