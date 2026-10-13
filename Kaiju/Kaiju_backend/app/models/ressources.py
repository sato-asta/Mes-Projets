from sqlalchemy import Column, Integer, String
from app.Database import base

class Resource(base):
    __tablename__ = "resources"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=True)