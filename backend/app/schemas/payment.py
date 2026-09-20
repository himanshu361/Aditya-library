from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class PaymentCreate(BaseModel):
    chapter_id: int


class PaymentResponse(BaseModel):
    payment_id: str
    amount: int = 269
    status: str
    upi_identifier: str
    qr_code: Optional[str] = None
    deep_link: Optional[str] = None


class PaymentWebhook(BaseModel):
    event: str
    payment_id: str
    status: str
    amount: int
    reference: str
    signature: str
