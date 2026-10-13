from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.Database import base


class districtadjacency(base):
    __tablename__ = "district_adjacencies"
    __table_args__ = (
        UniqueConstraint("district_a_id", "district_b_id", name="uq_adjacency_pair"),
    )

    id = Column(Integer, primary_key=True)
    district_a_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    district_b_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    
    district_a = relationship("district", foreign_keys=[district_a_id])
    district_b = relationship("district", foreign_keys=[district_b_id])