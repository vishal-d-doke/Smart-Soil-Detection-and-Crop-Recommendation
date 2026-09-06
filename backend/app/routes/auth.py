from datetime import timedelta
import logging
import re

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config import settings
from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserOut
from app.security import create_access_token, get_current_user, get_password_hash, verify_password

router = APIRouter()
logger = logging.getLogger("smart_soil.auth")


def normalize_phone(phone: str) -> str:
    normalized = re.sub(r"[\s()-]", "", phone)
    if not re.fullmatch(r"\+[1-9]\d{7,14}", normalized):
        raise HTTPException(status_code=400, detail="Use a valid mobile number with country code")
    return normalized


@router.post("/register", response_model=UserOut)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = User(
        full_name=user.full_name,
        email=user.email,
        phone=normalize_phone(user.phone) if user.phone else None,
        password_hash=get_password_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login", response_model=Token)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout_user():
    return {"message": "Logged out successfully"}
