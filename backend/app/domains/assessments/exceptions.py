"""
Assessment domain exceptions.
"""

from app.shared.exceptions import ForbiddenException, NotFoundException


class AssessmentNotFoundException(NotFoundException):
    """Raised when an assessment record cannot be located."""

    def __init__(self, assessment_id: str) -> None:
        super().__init__(f"Assessment record '{assessment_id}' not found.")


class AssessmentAuthorizationException(ForbiddenException):
    """Raised when a user attempts to access or modify an unauthorized assessment."""

    def __init__(self, message: str = "Forbidden. Unauthorized access to assessment record.") -> None:
        super().__init__(message)
