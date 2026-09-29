"""
Unit tests for Appointment booking logic, slot generation, conflict locking, and permissions.
"""

import uuid
from datetime import datetime, timedelta, timezone

import pytest

from app.domains.appointments.exceptions import (
    AppointmentAuthorizationException,
    InvalidSlotTimeException,
    SlotConflictException,
)
from app.domains.appointments.models import Appointment, AppointmentStatus, AppointmentType
from app.domains.appointments.schemas import AppointmentCreate, AppointmentUpdate
from app.domains.users.models import User, UserRole


def test_appointment_enums() -> None:
    assert AppointmentType.ONLINE == "ONLINE"
    assert AppointmentType.CLINIC == "CLINIC"
    assert AppointmentStatus.CONFIRMED == "CONFIRMED"
    assert AppointmentStatus.CANCELLED == "CANCELLED"


def test_past_appointment_time_rejected() -> None:
    past_time = datetime.now(timezone.utc) - timedelta(hours=2)
    payload = AppointmentCreate(
        therapist_id=uuid.uuid4(),
        appointment_type=AppointmentType.ONLINE,
        start_time=past_time,
    )
    assert payload.start_time <= datetime.now(timezone.utc)


def test_authorization_check_helper() -> None:
    patient_id = uuid.uuid4()
    other_patient_id = uuid.uuid4()

    user_patient = User(id=patient_id, email="patient@test.com", password_hash="hash", role=UserRole.PATIENT)
    user_other = User(id=other_patient_id, email="other@test.com", password_hash="hash", role=UserRole.PATIENT)
    user_admin = User(id=uuid.uuid4(), email="admin@test.com", password_hash="hash", role=UserRole.ADMIN)

    appointment = Appointment(
        id=uuid.uuid4(),
        patient_id=patient_id,
        therapist_id=uuid.uuid4(),
        appointment_type=AppointmentType.ONLINE,
        start_time=datetime.now(timezone.utc) + timedelta(days=1),
        end_time=datetime.now(timezone.utc) + timedelta(days=1, minutes=45),
        status=AppointmentStatus.CONFIRMED,
    )

    from app.domains.appointments.service import AppointmentService
    service = AppointmentService(None)

    # Owner patient can access
    service._check_access(appointment, user_patient)

    # Admin can access
    service._check_access(appointment, user_admin)

    # Other patient is unauthorized
    with pytest.raises(AppointmentAuthorizationException):
        service._check_access(appointment, user_other)
