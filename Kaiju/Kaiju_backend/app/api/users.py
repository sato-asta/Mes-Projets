from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.Database import get_db
from app.api.dependencies import getcurrentuser
from app.core.errors import apiError, ERR_PERMISSION, ERR_NOT_FOUND
from app.models.User import User, UserRole
from app.models.user_scopes import UserDistrictScope
from app.schemas.user import UserOut, UpdateRoleIn, UpdateScopesIn

router = APIRouter(prefix="/users", tags=["users"])


def requireCD(current_user):
    if current_user.role != UserRole.CD:
        raise apiError(403, ERR_PERMISSION, "Only a City Director can manage users")


def getDistrictIds(db, user_id):
    scopes = db.query(UserDistrictScope).filter_by(user_id=user_id).all()
    return [scope.district_id for scope in scopes]


def toUserOut(db, user):
    return UserOut(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        district_ids=getDistrictIds(db, user.id),
    )


def getTargetUser(db, user_id):
    target = db.get(User, user_id)
    if target is None:
        raise apiError(404, ERR_NOT_FOUND, "User not found")
    return target


@router.get("", response_model=list[UserOut])
def listUsers(db: Session = Depends(get_db), current_user: User = Depends(getcurrentuser)):
    requireCD(current_user)
    users = db.query(User).order_by(User.name).all()
    return [toUserOut(db, user) for user in users]


@router.patch("/{user_id}/role", response_model=UserOut)
def updateUserRole(
    user_id: int,
    payload: UpdateRoleIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(getcurrentuser),
):
    requireCD(current_user)
    target = getTargetUser(db, user_id)

    target.role = payload.role
    db.commit()
    db.refresh(target)
    return toUserOut(db, target)


@router.put("/{user_id}/scopes", response_model=UserOut)
def updateUserScopes(
    user_id: int,
    payload: UpdateScopesIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(getcurrentuser),
):
    requireCD(current_user)
    target = getTargetUser(db, user_id)

    db.query(UserDistrictScope).filter_by(user_id=target.id).delete()
    for district_id in payload.district_ids:
        db.add(UserDistrictScope(user_id=target.id, district_id=district_id))
    db.commit()

    return toUserOut(db, target)
