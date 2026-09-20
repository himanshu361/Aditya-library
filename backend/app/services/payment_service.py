import os


class PaymentService:
    def __init__(self):
        self.provider_key = os.getenv("PHONEPE_MERCHANT_ID", "demo_phonepe")
        self.provider_secret = os.getenv("PHONEPE_MERCHANT_KEY", "demo_phonepe_key")
        self.upi_identifier = os.getenv("UPI_IDENTIFIER", "336461816324430@cnrb")
        self.phonepe_vpa = os.getenv("PHONEPE_VPA", self.upi_identifier)

    def is_live_provider_configured(self) -> bool:
        return bool(
            self.provider_key
            and self.provider_secret
            and self.provider_key != "demo_phonepe"
            and self.provider_secret != "demo_phonepe_key"
        )

    def build_provider_payload(self, amount_in_rupees: int, chapter_id: str):
        if self.is_live_provider_configured():
            return {
                "provider": "phonepe",
                "amount": amount_in_rupees,
                "currency": "INR",
                "merchant_id": self.provider_key,
                "receipt": f"chapter-{chapter_id}",
                "notes": {"chapter_id": chapter_id},
                "upi_identifier": self.phonepe_vpa,
                "mode": "instant-upi",
            }

        return {
            "provider": "phonepe-demo",
            "amount": amount_in_rupees,
            "currency": "INR",
            "merchant_id": self.provider_key,
            "receipt": f"chapter-{chapter_id}",
            "notes": {"chapter_id": chapter_id},
            "upi_identifier": self.phonepe_vpa,
            "mode": "instant-upi-demo",
        }

    def build_upi_link(self, chapter_id: str, amount_in_rupees: int, chapter_name: str) -> str:
        safe_name = chapter_name.replace(" ", "%20")
        return (
            f"upi://pay?pa={self.phonepe_vpa}&pn=Aditya%20Tuition%20Centre"
            f"&am={amount_in_rupees}&cu=INR&tn={safe_name}&tr={chapter_id}"
        )
