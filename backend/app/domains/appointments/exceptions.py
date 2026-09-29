"""
Domain exceptions for Appointments.
"""

from app.shared.exceptions import AppException, ForbiddenException, NotFoundException


class AppointmentNotFoundException(NotFoundException):
    """Raised when requested appointment is not found."""

    def __init__(self, appointment_id: str = "Appointment") -> None:
        super().__init__(message=f"Appointment '{appointment_id}' not found.")


class SlotConflictException(AppException):
    """Raised when an appointment slot is already booked."""

    def __init__(self, message: str = "The selected time slot is no longer available.") -> None:
        super().__init__(
            message=message,
            status_code=409,
            error_code="SLOT_BOOKED",
        )


class InvalidSlotTimeException(AppException):
    """Raised when requested slot is in the past or outside working hours."""

    def __init__(self, message: str = "The requested appointment time is invalid.") -> None:
        super().__init__(
            message=message,
            status_code=400,
            error_code="INVALID_SLOT_TIME",
        )


class AppointmentAuthorizationException(ForbiddenException):
    """Raised when a user attempts to view or modify an unauthorized appointment."""

    def __init__(self, message: str = "You are not authorized to manage this appointment.") -> None:
        super().__init__(message=message)
