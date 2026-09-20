from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Aditya Tuition Centre"
    environment: Literal["development", "production"] = "development"
    database_url: str = "sqlite:///./aditya.db"
    jwt_secret: str = "super-secret-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    admin_email: str = "admin@adityatuition.in"
    admin_password: str = "admin123"
    upi_identifier: str = "336461816324430@cnrb"
    upi_id: str = "336461816324430@cnrb"
    google_drive_folder_id: str = "placeholder-folder-id"
    google_client_id: str = "placeholder-client-id"
    google_client_secret: str = "placeholder-client-secret"
    google_service_account: str = "placeholder-service-account"
    payment_provider_key: str = "demo_key"
    payment_provider_secret: str = "demo_secret"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)


@lru_cache
def get_settings() -> Settings:
    return Settings()
