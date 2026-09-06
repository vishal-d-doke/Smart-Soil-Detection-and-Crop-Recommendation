from datetime import datetime, timedelta, timezone
import hashlib
import logging
import re
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config import settings
from app.database.connection import get_db
from app.models.user import User
from app.models.otp import LoginOTP
from app.schemas.user import OTPRequest, OTPVerify, Token, UserCreate, UserLogin, UserOut
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


@router.post("/request-otp")
def request_otp(payload: OTPRequest, db: Session = Depends(get_db)):
    phone = normalize_phone(payload.phone)
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="No account is registered with this mobile number")

    has_twilio = all((settings.twilio_account_sid, settings.twilio_auth_token, settings.twilio_phone_number))
    if not has_twilio and not settings.app_debug:
        raise HTTPException(status_code=503, detail="OTP service is not configured")

    code = f"{secrets.randbelow(1_000_000):06d}"
    db.query(LoginOTP).filter(LoginOTP.phone == phone).delete()
    db.add(LoginOTP(
        phone=phone,
        code_hash=hashlib.sha256(code.encode()).hexdigest(),
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.otp_expire_minutes),
    ))
    db.commit()

    if has_twilio:
        from twilio.rest import Client

        Client(settings.twilio_account_sid, settings.twilio_auth_token).messages.create(
            body=f"Your Smart Soil login OTP is {code}. It expires in {settings.otp_expire_minutes} minutes.",
            from_=settings.twilio_phone_number,
            to=phone,
        )
        return {"message": "OTP sent successfully"}

    logger.warning("DEV MODE OTP for %s: %s", phone, code)
    print(f"\n[DEV MODE] OTP for {phone}: {code}\n")
    return {"message": f"OTP generated (dev mode): {code}" if settings.app_debug else "OTP sent successfully"}


@router.post("/verify-otp", response_model=Token)
def verify_otp(payload: OTPVerify, db: Session = Depends(get_db)):
    phone = normalize_phone(payload.phone)
    user = db.query(User).filter(User.phone == phone).first()
    login_otp = db.query(LoginOTP).filter(LoginOTP.phone == phone).first()
    now = datetime.now(timezone.utc)
    # Handle both naive and aware datetime from database
    expires_at = login_otp.expires_at.replace(tzinfo=timezone.utc) if login_otp and login_otp.expires_at.tzinfo is None else (login_otp.expires_at if login_otp else None)
    if not user or not login_otp or (expires_at and expires_at < now):
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")
    if login_otp.attempts >= 5:
        raise HTTPException(status_code=429, detail="Too many OTP attempts")
    login_otp.attempts += 1
    if not secrets.compare_digest(login_otp.code_hash, hashlib.sha256(payload.otp.encode()).hexdigest()):
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")

    db.delete(login_otp)
    db.commit()
    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=settings.access_token_expire_minutes))
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout_user():
    return {"message": "Logged out successfully"}
