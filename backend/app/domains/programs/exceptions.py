"""
Domain-specific exceptions for Programs module.
"""

from app.shared.exceptions import AppException, NotFoundException


class ProgramNotFoundException(NotFoundException):
    """Raised when a requested program slug or ID is not found."""

    def __init__(self, identifier: str = "Program") -> None:
        super().__init__(message=f"Program '{identifier}' not found.")


class ProgramSlugConflictException(AppException):
    """Raised when attempting to create or update a program with a duplicate slug."""

    def __init__(self, slug: str) -> None:
        super().__init__(
            message=f"A program with slug '{slug}' already exists.",
            status_code=409,
            error_code="SLUG_EXISTS",
        )
