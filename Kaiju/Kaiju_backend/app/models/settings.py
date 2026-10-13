from sqlalchemy import Column, Integer, Boolean
from app.Database import base


class SystemSettings(base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True)
    retention_lowered = Column(Boolean, default=False, nullable=False)
