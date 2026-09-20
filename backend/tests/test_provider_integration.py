from app.services.payment_service import PaymentService


def test_payment_service_uses_phonepe_when_credentials_exist(monkeypatch):
    monkeypatch.setenv("PHONEPE_MERCHANT_ID", "merchant_123")
    monkeypatch.setenv("PHONEPE_MERCHANT_KEY", "merchant_key_456")
    monkeypatch.setenv("UPI_IDENTIFIER", "aditya@upi")

    service = PaymentService()
    payload = service.build_provider_payload(269, "chapter-demo")

    assert payload["provider"] == "phonepe"
    assert payload["amount"] == 269
    assert payload["currency"] == "INR"
    assert payload["notes"]["chapter_id"] == "chapter-demo"
    assert payload["mode"] == "instant-upi"
