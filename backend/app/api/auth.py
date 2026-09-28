import base64
import json
from datetime import timedelta
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.auth import create_access_token, get_current_user, hash_password, verify_password
from app.config import get_settings
from app.database import get_db
from app.models.user import User
from app.schemas.user import TokenResponse, UserCreate, UserLogin, UserResponse

router = APIRouter()
settings = get_settings()


def _decode_google_claims(credential: str):
    if not credential or "." not in credential:
        raise HTTPException(status_code=400, detail="Invalid Google credential")

    payload_part = credential.split(".")[1]
    padded = payload_part + "=" * (-len(payload_part) % 4)
    try:
        claims = json.loads(base64.urlsafe_b64decode(padded.encode()).decode())
    except Exception as exc:  # pragma: no cover - defensive fallback
        raise HTTPException(status_code=400, detail="Malformed Google credential") from exc

    email = (claims.get("email") or f"google-user-{claims.get('sub', 'unknown')}@google.local").lower()
    name = claims.get("name") or claims.get("given_name") or email.split("@")[0].title()
    return email, name


def _make_challenge() -> str:
    return base64.urlsafe_b64encode(uuid4().hex[:16].encode()).rstrip(b"=").decode()


@router.post("/signup", response_model=UserResponse)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(
        name=payload.name,
        email=payload.email.lower(),
        phone=payload.phone,
        password_hash=hash_password(payload.password),
        role="student",
        status="active",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/google")
def google_login(payload: dict, db: Session = Depends(get_db)):
    credential = payload.get("credential") or payload.get("token")
    if not credential:
        raise HTTPException(status_code=400, detail="Google credential is required")

    email, name = _decode_google_claims(credential)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            name=name,
            email=email,
            phone="0000000000",
            password_hash=hash_password(f"google-{uuid4().hex[:12]}"),
            role="student",
            status="active",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "name": user.name}}


@router.post("/biometric/register/options")
def biometric_register_options():
    return {
        "challenge": _make_challenge(),
        "rp": {"name": "Aditya Library", "id": "localhost"},
        "user": {"id": _make_challenge(), "name": "student", "displayName": "Student"},
        "pubKeyCredParams": [{"type": "public-key", "alg": -7}],
        "timeout": 60000,
    }


@router.post("/biometric/register/verify")
def biometric_register_verify(payload: dict, db: Session = Depends(get_db)):
    email = (payload.get("email") or payload.get("user_email") or "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email required for biometric registration")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            name=(payload.get("name") or email.split("@")[0].title()),
            email=email,
            phone=payload.get("phone") or "0000000000",
            password_hash=hash_password(f"biometric-{uuid4().hex[:12]}"),
            role="student",
            status="active",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return {"status": "enabled", "user_id": user.id}


@router.post("/biometric/login/options")
def biometric_login_options(payload: dict, db: Session = Depends(get_db)):
    email = (payload.get("email") or "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "user_id": user.id,
        "options": {
            "challenge": _make_challenge(),
            "timeout": 60000,
            "userVerification": "preferred",
            "rpId": "localhost",
        },
    }


@router.post("/biometric/login/verify")
def biometric_login_verify(payload: dict, db: Session = Depends(get_db)):
    user_id = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id).first() if user_id else None
    if not user:
        email = (payload.get("email") or "").strip().lower()
        if not email:
            raise HTTPException(status_code=400, detail="Invalid biometric login payload")
        user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "name": user.name}}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
