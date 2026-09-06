from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String

from app.database.connection import Base


class LoginOTP(Base):
    __tablename__ = "login_otps"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(20), index=True, nullable=False)
    code_hash = Column(String(64), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    attempts = Column(Integer, default=0, nullable=False)
