"""
Integration tests for Appointments domain and slot conflict prevention.
"""

import uuid
from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, patch

from app.core.security import create_access_token
from app.domains.appointments.models import Appointment, AppointmentStatus, AppointmentType
from app.domains.therapists.models import TherapistProfile
from app.domains.users.models import User, UserRole


def test_appointment_booking_and_conflict_prevention(client):
    patient = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT, is_active=True)
    therapist_id = uuid.uuid4()
    token = create_access_token(patient.id, role=patient.role.value)

    mock_therapist = TherapistProfile(id=therapist_id, user_id=uuid.uuid4(), is_accepting_patients=True)
    start_time = datetime.now(timezone.utc) + timedelta(days=2)
    end_time = start_time + timedelta(minutes=45)

    existing_conflict = Appointment(
        id=uuid.uuid4(),
        patient_id=uuid.uuid4(),
        therapist_id=therapist_id,
        appointment_type=AppointmentType.ONLINE,
        start_time=start_time,
        end_time=end_time,
        status=AppointmentStatus.CONFIRMED,
    )

    with patch("app.shared.dependencies.auth.UserRepository") as mock_auth_user_repo_cls, \
         patch("app.domains.appointments.service.AppointmentRepository") as mock_apt_repo_cls, \
         patch("app.domains.appointments.service.TherapistRepository") as mock_th_repo_cls:

        mock_auth_user_repo_cls.return_value.get_by_id = AsyncMock(return_value=patient)
        mock_th_repo_cls.return_value.get_profile_by_id = AsyncMock(return_value=mock_therapist)

        mock_apt_repo = mock_apt_repo_cls.return_value
        mock_apt_repo.get_conflicting_appointments = AsyncMock(return_value=[existing_conflict])

        payload = {
            "therapist_id": str(therapist_id),
            "appointment_type": "ONLINE",
            "start_time": start_time.isoformat(),
            "notes": "Test conflict check",
        }

        res = client.post(
            "/api/v1/appointments",
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
        )

        assert res.status_code == 409
        assert "CONFLICT" in str(res.json()) or "booked" in str(res.json()).lower()
