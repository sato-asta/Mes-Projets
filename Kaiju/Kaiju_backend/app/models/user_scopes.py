from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .districts import district
from app.Database import base

class UserDistrictScope(base):
    __tablename__ = "user_district_scopes"
    __table_args__ = (UniqueConstraint("user_id", "district_id", name="uq_user_district"),)
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    user = relationship("User", back_populates="scopes")
    district = relationship("district")
    