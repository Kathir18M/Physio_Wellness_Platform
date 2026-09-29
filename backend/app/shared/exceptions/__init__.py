"""
Application-wide exception definitions and FastAPI exception handlers.

All domain-specific exceptions should subclass ``AppException``.
Handlers are registered in ``main.py`` via ``register_exception_handlers()``.
"""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.constants import REQUEST_ID_HEADER
from app.core.logging import get_logger

logger = get_logger(__name__)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Base exception hierarchy
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


class AppException(Exception):
    """Base class for all application exceptions."""

    def __init__(
        self,
        message: str = "An unexpected error occurred.",
        status_code: int = 500,
        error_code: str = "INTERNAL_ERROR",
    ) -> None:
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        super().__init__(self.message)


class NotFoundException(AppException):
    """Resource not found (404)."""

    def __init__(self, message: str = "Resource not found.") -> None:
        super().__init__(message=message, status_code=404, error_code="NOT_FOUND")


class BadRequestException(AppException):
    """Client sent an invalid request (400)."""

    def __init__(self, message: str = "Bad request.") -> None:
        super().__init__(message=message, status_code=400, error_code="BAD_REQUEST")


class ForbiddenException(AppException):
    """Authenticated but insufficient permissions (403)."""

    def __init__(self, message: str = "Forbidden.") -> None:
        super().__init__(message=message, status_code=403, error_code="FORBIDDEN")


class ConflictException(AppException):
    """Resource state conflict (409)."""

    def __init__(self, message: str = "Conflict.") -> None:
        super().__init__(message=message, status_code=409, error_code="CONFLICT")


class DatabaseException(AppException):
    """Database operation failed (500)."""

    def __init__(self, message: str = "Database error.") -> None:
        super().__init__(message=message, status_code=500, error_code="DATABASE_ERROR")


class ServiceUnavailableException(AppException):
    """External dependency unavailable (503)."""

    def __init__(self, message: str = "Service temporarily unavailable.") -> None:
        super().__init__(
            message=message, status_code=503, error_code="SERVICE_UNAVAILABLE"
        )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Exception handler registration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


def register_exception_handlers(app: FastAPI) -> None:
    """Attach global exception handlers to the FastAPI application."""

    @app.exception_handler(AppException)
    async def app_exception_handler(
        request: Request, exc: AppException
    ) -> JSONResponse:
        request_id = getattr(request.state, "request_id", None)
        logger.warning(
            "AppException | %s | %s | %s | request_id=%s",
            exc.error_code,
            exc.status_code,
            exc.message,
            request_id,
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": exc.error_code,
                    "message": exc.message,
                },
            },
            headers={REQUEST_ID_HEADER: request_id} if request_id else {},
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        request_id = getattr(request.state, "request_id", None)
        logger.exception(
            "Unhandled exception on %s %s | request_id=%s",
            request.method,
            request.url,
            request_id,
        )
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred. Please try again later.",
                },
            },
            headers={REQUEST_ID_HEADER: request_id} if request_id else {},
        )
