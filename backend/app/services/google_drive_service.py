import os


class GoogleDriveService:
    def __init__(self):
        self.folder_id = os.getenv("GOOGLE_DRIVE_FOLDER_ID", "placeholder-folder-id")
        self.client_id = os.getenv("GOOGLE_CLIENT_ID", "placeholder-client-id")
        self.client_secret = os.getenv("GOOGLE_CLIENT_SECRET", "placeholder-client-secret")
        self.service_account = os.getenv("GOOGLE_SERVICE_ACCOUNT", "placeholder-service-account")

    def is_live_drive_configured(self) -> bool:
        return bool(
            self.folder_id
            and self.folder_id != "placeholder-folder-id"
            and self.client_id
            and self.client_id != "placeholder-client-id"
            and self.client_secret
            and self.client_secret != "placeholder-client-secret"
        )

    def build_file_url(self, file_id: str) -> str:
        if not file_id or file_id.startswith("placeholder"):
            return "https://drive.google.com/drive/folders/" + self.folder_id
        return f"https://drive.google.com/file/d/{file_id}/view?usp=sharing"

    def build_folder_url(self) -> str:
        return "https://drive.google.com/drive/folders/" + self.folder_id
