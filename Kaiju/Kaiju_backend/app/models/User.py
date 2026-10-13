import enum
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from app.Database import base

class UserRole(str, enum.Enum):
    QC = "QC"
    LC = "LC"
    CD = "CD"

class User(base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    scopes = relationship("UserDistrictScope", back_populates="user")