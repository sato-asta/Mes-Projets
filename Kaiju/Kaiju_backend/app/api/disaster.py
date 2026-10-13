from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.Database import get_db
from app.api.dependencies import getcurrentuser
from app.core.errors import apiError, ERR_PERMISSION
from app.models.disaster_level import disasterlevel
from app.models.User import User, UserRole
from app.schemas.disaster import DisasterLevelIn, DisasterLevelOut, RetentionSettingsOut
from app.services.permissions import checkPermission
from app.services.retention import get_current_disaster_level, getSettings, CRITICAL_LEVEL
from app.services import ws_manager

router = APIRouter(prefix="/disaster-level", tags=["disaster"])


@router.get("", response_model=DisasterLevelOut)
def getLevel(db: Session = Depends(get_db)):
    level = get_current_disaster_level(db)
    return DisasterLevelOut(level=level)


@router.post("", response_model=DisasterLevelOut, status_code=201)
def setLevel(
    payload: DisasterLevelIn,
    db: Session = Depends(get_db),
    user: User = Depends(getcurrentuser),
):
    if user.role != UserRole.CD:
        raise apiError(403, ERR_PERMISSION, "Only the City Director can change the disaster level")

    if payload.level < 1 or payload.level > 5:
        raise apiError(422, "ERR_INVALID_LEVEL", "Level must be between 1 and 5")

    new_level = disasterlevel(level=payload.level, changed_by_id=user.id)
    db.add(new_level)

    if payload.level != CRITICAL_LEVEL:
        settings = getSettings(db)
        settings.retention_lowered = False

    db.commit()

    ws_manager.broadcast("disaster_level_changed", {"level": payload.level})
    return DisasterLevelOut(level=payload.level)


@router.get("/retention-settings", response_model=RetentionSettingsOut)
def getRetentionSettings(db: Session = Depends(get_db)):
    settings = getSettings(db)
    return RetentionSettingsOut(retention_lowered=settings.retention_lowered)


@router.post("/lower-retention", response_model=RetentionSettingsOut)
def lowerRetention(db: Session = Depends(get_db), user: User = Depends(getcurrentuser)):
    level = get_current_disaster_level(db)
    checkPermission(level, user.role, "lower_retention_threshold")

    settings = getSettings(db)
    settings.retention_lowered = True
    db.commit()

    ws_manager.broadcast("retention_threshold_lowered", {"retention_lowered": True})
    return RetentionSettingsOut(retention_lowered=True)
