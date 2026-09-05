from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Smart Soil Detection and Crop Recommendation"
    app_env: str = "development"
    app_debug: bool = True
    database_url: str = "sqlite:///./app.db"
    secret_key: str = "dev-secret-key-change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    cors_origins: str = "http://localhost:5173,http://localhost:5174"
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_phone_number: str = ""
    otp_expire_minutes: int = 5

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
