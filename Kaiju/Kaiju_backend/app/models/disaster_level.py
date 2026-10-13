from sqlalchemy import Column, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.Database import base

class disasterlevel(base):
    __tablename__ = "disaster_levels"
    id = Column(Integer, primary_key=True)
    level = Column(Integer, nullable=False)
    changed_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    changed_at = Column(DateTime(timezone=True), server_default=func.now())
    changed_by = relationship("User")
