"""
Domain exceptions for Notifications.
"""

from app.shared.exceptions import ConflictException, NotFoundException


class NotificationNotFoundError(NotFoundException):
    """Raised when a requested notification is not found."""

    def __init__(self, notification_id: str):
        super().__init__(message=f"Notification '{notification_id}' was not found.")


class DuplicateNotificationError(ConflictException):
    """Raised when a notification with the same deduplication key exists."""

    def __init__(self, key: str):
        super().__init__(message=f"Notification with deduplication key '{key}' already processed.")
