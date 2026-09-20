from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.config import get_settings
from app.database import get_db
from app.models.chapter import Chapter
from app.models.payment import PaymentTransaction
from app.models.purchase import Purchase
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentWebhook
from app.services.payment_service import PaymentService

router = APIRouter()
settings = get_settings()


@router.post("/payments/create")
def create_payment(payload: PaymentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    chapter = db.query(Chapter).filter(Chapter.id == payload.chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    payment_id = f"PAY-{uuid4().hex[:12].upper()}"
    tx = PaymentTransaction(
        user_id=current_user.id,
        chapter_id=chapter.id,
        transaction_reference=payment_id,
        amount=chapter.price,
        payment_provider="upi",
        status="pending",
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    payment_service = PaymentService()
    upi_link = payment_service.build_upi_link(payment_id, chapter.price, chapter.chapter_name)
    provider_payload = payment_service.build_provider_payload(chapter.price, str(chapter.id))

    return {
        "payment_id": payment_id,
        "amount": chapter.price,
        "status": "pending",
        "upi_identifier": settings.upi_identifier,
        "qr_code": "https://api.qrserver.com/v1/create-qr-code/?data=" + upi_link.replace("?", "%3F").replace("&", "%26"),
        "deep_link": upi_link,
        "provider": provider_payload["provider"],
        "provider_payload": provider_payload,
    }


@router.post("/payments/webhook")
def payment_webhook(payload: PaymentWebhook, db: Session = Depends(get_db)):
    tx = db.query(PaymentTransaction).filter(PaymentTransaction.transaction_reference == payload.reference).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Payment reference not found")
    if tx.status == "successful":
        return {"status": "already_processed"}
    if payload.status == "successful" and payload.amount >= tx.amount:
        tx.status = "successful"
        tx.verified_at = datetime.utcnow()
        existing_purchase = db.query(Purchase).filter(
            Purchase.user_id == tx.user_id,
            Purchase.chapter_id == tx.chapter_id,
            Purchase.status == "successful",
        ).first()
        if not existing_purchase:
            purchase = Purchase(user_id=tx.user_id, chapter_id=tx.chapter_id, payment_id=str(tx.id), amount=tx.amount, status="successful")
            db.add(purchase)
        db.commit()
        return {"status": "verified"}
    return {"status": "failed"}


@router.get("/payments/{payment_id}")
def get_payment(payment_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tx = db.query(PaymentTransaction).filter(PaymentTransaction.transaction_reference == payment_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Payment not found")
    if tx.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"id": tx.id, "status": tx.status, "amount": tx.amount, "transaction_reference": tx.transaction_reference, "chapter_id": tx.chapter_id}


@router.get("/users/me/purchases")
def my_purchases(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    purchases = db.query(Purchase).filter(Purchase.user_id == current_user.id, Purchase.status == "successful").all()
    response = []
    for purchase in purchases:
        chapter = db.query(Chapter).filter(Chapter.id == purchase.chapter_id).first()
        if chapter:
            response.append({
                "id": purchase.id,
                "chapter_id": chapter.id,
                "chapter_name": chapter.chapter_name,
                "amount": purchase.amount,
                "purchased_at": purchase.purchased_at,
            })
    return response
