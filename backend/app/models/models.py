from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="student")
    created_at = Column(DateTime, default=datetime.utcnow)

    submissions = relationship("Submission", back_populates="owner")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    file_name = Column(String)
    file_type = Column(String)
    file_size = Column(Integer)
    extracted_text = Column(Text)
    ai_probability = Column(Float)
    human_probability = Column(Float)
    confidence_level = Column(String)
    reliability_score = Column(Integer)
    explanation_json = Column(Text) # Storing as JSON string
    sentence_analysis_json = Column(Text) # Storing as JSON string
    prompt_leakage_json = Column(Text) # Storing as JSON string
    report_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="submissions")
