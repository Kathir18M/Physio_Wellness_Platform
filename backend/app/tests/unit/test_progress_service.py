"""
Unit tests for ProgressService, metrics summary calculation, and access authorization.
"""

import uuid
from unittest.mock import AsyncMock

import pytest

from app.domains.progress.models import ProgressRecord
from app.domains.progress.schemas import ProgressRecordCreate
from app.domains.progress.service import ProgressService
from app.domains.users.models import User, UserRole
from app.shared.exceptions import ForbiddenException


@pytest.mark.asyncio
async def test_create_progress_record():
    mock_db = AsyncMock()
    service = ProgressService(mock_db)

    patient_user = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT)

    payload = ProgressRecordCreate(
        pain_score=3,
        weight=72.5,
        mobility_score=80,
        strength_score=75,
        notes="Felt good during exercises",
    )

    mock_record = ProgressRecord(
        id=uuid.uuid4(),
        patient_id=patient_user.id,
        pain_score=3,
        weight=72.5,
        mobility_score=80,
        strength_score=75,
        notes="Felt good during exercises",
    )

    service.repository.create_record = AsyncMock(return_value=mock_record)

    record = await service.create_progress_record(patient_user, payload)
    assert record.pain_score == 3
    assert record.weight == 72.5


@pytest.mark.asyncio
async def test_progress_access_authorization():
    mock_db = AsyncMock()
    service = ProgressService(mock_db)

    patient_owner_id = uuid.uuid4()
    other_patient_id = uuid.uuid4()

    patient_owner = User(id=patient_owner_id, email="owner@test.com", password_hash="hash", role=UserRole.PATIENT)
    other_patient = User(id=other_patient_id, email="other@test.com", password_hash="hash", role=UserRole.PATIENT)

    # 1. Owner can access own progress
    await service._verify_patient_access(patient_owner, patient_owner_id)

    # 2. Other patient raises ForbiddenException
    with pytest.raises(ForbiddenException):
        await service._verify_patient_access(other_patient, patient_owner_id)


@pytest.mark.asyncio
async def test_progress_summary_calculation():
    mock_db = AsyncMock()
    service = ProgressService(mock_db)

    patient_user = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT)

    mock_records = [
        ProgressRecord(id=uuid.uuid4(), patient_id=patient_user.id, pain_score=2),
        ProgressRecord(id=uuid.uuid4(), patient_id=patient_user.id, pain_score=4),
    ]

    service.repository.list_patient_history = AsyncMock(return_value=mock_records)
    service.repository.list_patient_goals = AsyncMock(return_value=[])

    summary = await service.get_patient_summary(patient_user)
    assert summary["latest_pain_score"] == 2
    assert summary["avg_pain_score_weekly"] == 3.0
    assert summary["exercise_completion_rate"] == 92.0
