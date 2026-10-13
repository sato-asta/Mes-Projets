from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.Database import get_db
from app.models.User import User
from app.models.user_scopes import UserDistrictScope
from app.core.security import *
from app.schemas.auth import *
from app.api import dependencies

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=Out, status_code=status.HTTP_201_CREATED)
def register(payload: Register, db: Session = Depends(get_db)):
    existing = db.query(User).filter_by(email=payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    if db.query(User).filter_by(name=payload.name).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name already registered")
    user = User(
        name=payload.name,
        email=payload.email,
        password=hash(payload.password),
        role=payload.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return Out(id=user.id, name=user.name, email=user.email, role=user.role, district_ids=[])

@router.post("/login", response_model=Token)
def login(payload: Login, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=payload.email).first()
    if not user or not verify(payload.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token = create_token(user.id, user.role.value)
    return Token(access_token=token, token_type="bearer")

@router.get("/me", response_model=Out)
def readcurrentuser(current_user: User = Depends(dependencies.getcurrentuser), db: Session = Depends(get_db)):
    scopes = db.query(UserDistrictScope).filter_by(user_id=current_user.id).all()
    return Out(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        district_ids=[scope.district_id for scope in scopes],
    )