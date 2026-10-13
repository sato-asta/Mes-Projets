from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.models.ressources import Resource
from app.Database import base

class Inventory(base):
    __tablename__ = 'inventory'
    __tableargs__ = (UniqueConstraint("district_id", "resource_id", name="uq_inventory_district_resource"),)

    id = Column(Integer, primary_key=True)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    initial_quantity = Column(Integer, nullable=False)
    reserved_quantity = Column(Integer, nullable=False, default=0)
    district = relationship("district", back_populates="inventories")
    resource = relationship("Resource")