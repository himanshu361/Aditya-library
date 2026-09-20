import os
import uuid

os.environ["DATABASE_URL"] = "sqlite:///./test_aditya.db"

from fastapi.testclient import TestClient

from app.database import SessionLocal
from app.main import app
from app.models.chapter import Chapter
from app.models.purchase import Purchase
from app.models.user import User

TEST_EMAIL = f"student-{uuid.uuid4().hex[:8]}@example.com"
TEST_PASSWORD = "secret123"

# Reset shared test data to keep test cases independent and deterministic.
with SessionLocal() as db:
    for user in db.query(User).filter(User.email.like("%example.com")).all():
        db.query(Purchase).filter(Purchase.user_id == user.id).delete()
        db.delete(user)
    db.commit()

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_signup_and_login_flow():
    payload = {
        "name": "Test Student",
        "email": TEST_EMAIL,
        "phone": "9876543210",
        "password": TEST_PASSWORD,
        "confirm_password": TEST_PASSWORD,
    }
    signup = client.post("/api/auth/signup", json=payload)
    assert signup.status_code == 200, signup.text

    login = client.post("/api/auth/login", json={"email": payload["email"], "password": payload["password"]})
    assert login.status_code == 200, login.text
    token = login.json()["access_token"]
    assert token

    me = client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == payload["email"]


def test_classes_list():
    response = client.get("/api/classes")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 4


def test_student_notes_are_restricted_to_purchased_chapters():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == TEST_EMAIL).first()
        if user is None:
            user = User(
                name="Test Student",
                email=TEST_EMAIL,
                phone="9876543210",
                password_hash="hashed",
                role="student",
                status="active",
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        chapter = db.query(Chapter).first()
        assert chapter is not None

        existing = db.query(Purchase).filter(Purchase.user_id == user.id, Purchase.chapter_id == chapter.id).first()
        if existing is None:
            db.add(Purchase(user_id=user.id, chapter_id=chapter.id, payment_id="TEST-PURCHASE", amount=269, status="successful"))
            db.commit()

        login = client.post("/api/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
        token = login.json()["access_token"]

        notes = client.get("/api/student/notes", headers={"Authorization": f"Bearer {token}"})
        assert notes.status_code == 200
        assert len(notes.json()) >= 1

        authorized = client.get(f"/api/student/notes/{chapter.id}", headers={"Authorization": f"Bearer {token}"})
        assert authorized.status_code == 200

        another = db.query(Chapter).filter(Chapter.id != chapter.id).first()
        assert another is not None
        blocked = client.get(f"/api/student/notes/{another.id}", headers={"Authorization": f"Bearer {token}"})
        assert blocked.status_code == 403
    finally:
        db.close()
