"""
FastAPI application entry point.

Wires up CORS, exception handlers, database lifecycle, middleware,
logging, and health-check endpoint. Domain routers will be mounted
here as they are built.
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.core.database import async_engine, close_db, init_db
from app.core.logging import get_logger, setup_logging
from app.domains.admin.router import router as admin_router
from app.domains.ai.router import router as ai_router
from app.domains.appointments.router import router as appointments_router
from app.domains.assessments.router import router as assessments_router
from app.domains.auth.router import router as auth_router
from app.domains.clinics.router import router as clinics_router
from app.domains.exercises.router import router as exercises_router
from app.domains.notifications.router import router as notifications_router
from app.domains.orders.router import router as orders_router
from app.domains.payments.router import router as payments_router
from app.domains.programs.router import router as programs_router
from app.domains.progress.router import router as progress_router
from app.domains.subscriptions.router import router as subscriptions_router
from app.domains.therapists.router import router as therapists_router
from app.domains.treatment_plans.router import router as treatment_plans_router
from app.domains.users.router import router as users_router
from app.shared.exceptions import register_exception_handlers
from app.shared.middleware.logging import LoggingMiddleware
from app.shared.middleware.request_id import RequestIDMiddleware
from app.shared.middleware.security_headers import SecurityHeadersMiddleware
from app.shared.schemas import HealthResponse

# ── Bootstrap logging before anything else ───────────────────────
setup_logging()
logger = get_logger(__name__)


# ── Lifespan (startup / shutdown hooks) ──────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    logger.info(
        "Starting %s v%s [%s]",
        settings.APP_NAME,
        settings.APP_VERSION,
        settings.ENVIRONMENT,
    )
    await init_db()
    yield
    logger.info("Shutting down %s", settings.APP_NAME)
    await close_db()


# ── Application factory ─────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# ── Middleware (order matters: outer -> inner) ────────────────────
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(LoggingMiddleware)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Exception handlers ──────────────────────────────────────────
register_exception_handlers(app)

# ── Mount API v1 Routers ─────────────────────────────────────────
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(programs_router, prefix="/api/v1")
app.include_router(clinics_router, prefix="/api/v1")
app.include_router(therapists_router, prefix="/api/v1")
app.include_router(appointments_router, prefix="/api/v1")
app.include_router(assessments_router, prefix="/api/v1")
app.include_router(exercises_router, prefix="/api/v1")
app.include_router(treatment_plans_router, prefix="/api/v1")
app.include_router(progress_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")
app.include_router(payments_router, prefix="/api/v1")
app.include_router(subscriptions_router, prefix="/api/v1")
app.include_router(notifications_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(ai_router, prefix="/api/v1")




# ── Health check ─────────────────────────────────────────────────
@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["System"],
    summary="Health check",
)
async def health_check() -> HealthResponse:
    """Return current application health status including database connectivity."""
    db_status = "disconnected"
    if async_engine is not None:
        try:
            async with async_engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            db_status = "connected"
        except Exception as exc:
            logger.warning("Database health check failed: %s", exc)
            db_status = f"unhealthy: {exc}"

    return HealthResponse(
        status="healthy" if db_status == "connected" else "degraded",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc),
        database=db_status,
    )

