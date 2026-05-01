from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String) # admin, professor, student

class Request(Base):
    __tablename__ = "requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String)
    form_type = Column(String)
    status = Column(String, default="pending") # pending, validated, issued
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    validated_by = Column(String, nullable=True)
    issued_by = Column(String, nullable=True)
