from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.Database import base

class district(base):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True)
    code = Column(String(1), unique=True, nullable=False)
    name = Column(String(50), nullable=False)
    sea_access = Column(Boolean, default=False, nullable=False)
    is_hub = Column(Boolean, default=False, nullable=False)

    inventories = relationship("Inventory", back_populates="district")