import enum
import re
from sqlalchemy import Column, Integer, ForeignKey, Enum, DateTime, func
from sqlalchemy.orm import relationship
from app.Database import base

class transferstatus(str, enum.Enum):
    PENDING = "pending"
    PENDING_TRANSIT = "pending_transit"
    APPROVED = "approved"
    REJECTED = "rejected"

class routetype(str, enum.Enum):
    DIRECT = "direct"
    TRANSIT = "transit"
    MARITIME = "maritime"

class transfer(base):
    __tablename__ = "transfers"

    id = Column(Integer, primary_key=True)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    source_district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    destination_district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    ressource_id = Column(Integer, ForeignKey("resources.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    status = Column(Enum(transferstatus), default=transferstatus.PENDING, nullable=False)
    route_type = Column(Enum(routetype), nullable=False)
    transit_district_id = Column(Integer, ForeignKey("districts.id"), nullable=True)
    approved_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    transit_approved_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    scheduled_start = Column(DateTime(timezone=True), nullable=True)
    scheduled_end = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    requester = relationship("User", foreign_keys=[requester_id])
    approved_by = relationship("User", foreign_keys=[approved_id])
    transit_approved_by = relationship("User", foreign_keys=[transit_approved_id])
    source_district = relationship("district", foreign_keys=[source_district_id])
    transit_district = relationship("district", foreign_keys=[transit_district_id])
    ressource = relationship("Resource")