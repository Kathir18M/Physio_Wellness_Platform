"""
Unit tests for TherapistService logic and permissions.
"""

import uuid
from unittest.mock import AsyncMock

import pytest

from app.domains.therapists.models import TherapistProfile
from app.domains.therapists.service import TherapistService
from app.domains.users.models import User, UserRole
from app.shared.exceptions import ForbiddenException, NotFoundException


@pytest.mark.asyncio
async def test_therapist_profile_creation_role_check():
    mock_db = AsyncMock()
    service = TherapistService(mock_db)

    # Mock repository methods
    service.repository.get_profile_by_user_id = AsyncMock(return_value=None)
    service.repository.create_profile = AsyncMock(
        return_value=TherapistProfile(
            id=uuid.uuid4(),
            user_id=uuid.uuid4(),
            is_accepting_patients=True,
        )
    )

    # 1. Non-therapist patient trying to create practitioner profile -> Forbidden
    patient_user = User(
        id=uuid.uuid4(),
        email="patient@test.com",
        password_hash="hash",
        role=UserRole.PATIENT,
        is_active=True,
    )

    with pytest.raises(ForbiddenException):
        await service.get_or_create_therapist_profile(patient_user)

    # 2. Therapist user -> Allowed and creates profile
    therapist_user = User(
        id=uuid.uuid4(),
        email="therapist@test.com",
        password_hash="hash",
        role=UserRole.THERAPIST,
        is_active=True,
    )

    profile = await service.get_or_create_therapist_profile(therapist_user)
    assert profile is not None


@pytest.mark.asyncio
async def test_unassigned_patient_access_restriction():
    mock_db = AsyncMock()
    service = TherapistService(mock_db)

    therapist_user = User(
        id=uuid.uuid4(),
        email="therapist2@test.com",
        password_hash="hash",
        role=UserRole.THERAPIST,
        is_active=True,
    )

    mock_profile = TherapistProfile(id=uuid.uuid4(), user_id=therapist_user.id)
    service.get_or_create_therapist_profile = AsyncMock(return_value=mock_profile)

    # Unassigned patient returns None from repo -> NotFoundException
    service.repository.get_assigned_patient_detail = AsyncMock(return_value=None)

    with pytest.raises(NotFoundException):
        await service.get_assigned_patient_detail(
            current_user=therapist_user,
            patient_id=uuid.uuid4(),
        )
