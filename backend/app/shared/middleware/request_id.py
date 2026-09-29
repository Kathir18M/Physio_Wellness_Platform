"""
Request-ID middleware.

Ensures every request carries a unique identifier.  If the client sends
an ``X-Request-ID`` header, that value is reused; otherwise a new UUID4
is generated.  The ID is stored in ``request.state`` and echoed back in
the response headers so it can be correlated end-to-end.
"""

from __future__ import annotations

import uuid

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.core.constants import REQUEST_ID_HEADER


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Attach a unique request ID to every request/response cycle."""

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        # Reuse client-supplied ID or generate one
        request_id = request.headers.get(REQUEST_ID_HEADER) or str(uuid.uuid4())
        request.state.request_id = request_id

        response = await call_next(request)
        response.headers[REQUEST_ID_HEADER] = request_id
        return response
