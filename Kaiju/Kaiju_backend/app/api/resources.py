from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.Database import get_db
from app.models.ressources import Resource
from app.schemas.resource import ResourceOut

router = APIRouter(prefix="/resources", tags=["resources"])


@router.get("", response_model=list[ResourceOut])
def listResources(db: Session = Depends(get_db)):
    return db.query(Resource).order_by(Resource.name).all()
