"""
Request logging middleware.

Logs every incoming request and outgoing response with method, path,
status code, duration, and the request ID (if available).
"""

from __future__ import annotations

import time

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.core.logging import get_logger

logger = get_logger("request")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Log request start / finish with timing information."""

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request_id = getattr(request.state, "request_id", "-")
        start = time.perf_counter()

        logger.info(
            "→ %s %s [%s]",
            request.method,
            request.url.path,
            request_id,
        )

        response = await call_next(request)

        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "← %s %s → %d (%.1fms) [%s]",
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
            request_id,
        )

        return response
