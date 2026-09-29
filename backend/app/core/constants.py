"""
Application-wide constants.

Centralises magic numbers and string literals so they can be tuned
from a single location.
"""

# ── Pagination ──────────────────────────────────────────────────
DEFAULT_PAGE: int = 1
DEFAULT_PAGE_SIZE: int = 20
MAX_PAGE_SIZE: int = 100

# ── Date / Time formats ─────────────────────────────────────────
ISO_FORMAT: str = "%Y-%m-%dT%H:%M:%SZ"
DATE_FORMAT: str = "%Y-%m-%d"
TIME_FORMAT: str = "%H:%M:%S"

# ── Request ID ──────────────────────────────────────────────────
REQUEST_ID_HEADER: str = "X-Request-ID"

# ── Health status strings ───────────────────────────────────────
HEALTH_OK: str = "healthy"
HEALTH_DEGRADED: str = "degraded"
HEALTH_UNHEALTHY: str = "unhealthy"
