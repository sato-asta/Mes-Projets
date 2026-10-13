from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.Database import get_db
from app.api.dependencies import getcurrentuser
from app.models.User import User
from app.schemas.permissions import MyPermissionsOut
from app.services.permissions import getAllowedActions
from app.services.retention import get_current_disaster_level

router = APIRouter(prefix="/permissions", tags=["permissions"])


@router.get("/me", response_model=MyPermissionsOut)
def getMyPermissions(db: Session = Depends(get_db), user: User = Depends(getcurrentuser)):
    level = get_current_disaster_level(db)
    allowed_actions = getAllowedActions(level, user.role)
    return MyPermissionsOut(level=level, role=user.role.value, allowed_actions=allowed_actions)
