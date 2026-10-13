from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session
from app.Database import get_db
from app.core.security import decode_token
from app.models.User import User, UserRole
from app.models.user_scopes import UserDistrictScope

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def getcurrentuser(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = decode_token(token)
        user_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user

def require_district_scope(district_id: int, current_user: User = Depends(getcurrentuser), db: Session = Depends(get_db))-> User:
    if current_user.role == UserRole.CD:
        return current_user

    has_access = db.query(UserDistrictScope).filter_by(
        user_id=current_user.id, district_id=district_id
    ).first()

    if not has_access:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return current_user
