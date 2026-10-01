"""
Application configuration via Pydantic Settings.

Reads from environment variables and .env file. All settings are
validated at startup — the app will refuse to boot on invalid config.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration sourced from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ──────────────────────────────────────────────
    APP_NAME: str = "Physio Wellness Platform"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"  # development | staging | production

    # ── Server ───────────────────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # ── CORS ─────────────────────────────────────────────────────
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # ── Database ─────────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/physio_wellness"
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 1800  # seconds — recycle connections after 30 min
    DB_ECHO: bool = False  # log SQL statements (noisy; use for debugging)

    # ── Security & Auth ──────────────────────────────────────────
    JWT_SECRET_KEY: str = "dev-secret-key-change-in-production-physio-wellness-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    TOKEN_ISSUER: str = "physio-wellness-auth"

    # ── Notifications ─────────────────────────────────────────────
    EMAIL_PROVIDER: str = "mock"
    WHATSAPP_PROVIDER: str = "mock"
    SMTP_HOST: str = "smtp.example.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    WHATSAPP_API_KEY: str = ""

    # ── AI Integration ─────────────────────────────────────────────
    AI_PROVIDER: str = "mock"
    AI_API_KEY: str = ""
    AI_MODEL_NAME: str = "gemini-2.5-flash"
    AI_TIMEOUT_SECONDS: int = 15
    AI_MAX_RETRIES: int = 3

    # ── Logging ──────────────────────────────────────────────────
    LOG_LEVEL: str = "INFO"

    @property
    def database_url_sync(self) -> str:
        """Return the synchronous variant of the database URL (for Alembic)."""
        return self.DATABASE_URL.replace("+asyncpg", "+psycopg2")

    def model_post_init(self, __context: object) -> None:
        """Enforce strict security validation on application configuration."""
        if self.ENVIRONMENT == "production" and "dev-secret-key" in self.JWT_SECRET_KEY:
            raise ValueError(
                "Refusing to boot in production with default development JWT_SECRET_KEY. "
                "Set a secure JWT_SECRET_KEY environment variable."
            )


settings = Settings()
