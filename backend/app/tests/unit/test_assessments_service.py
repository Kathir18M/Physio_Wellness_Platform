"""
Unit tests for AssessmentService, questionnaire validation, and practitioner evaluation updates.
"""

import uuid
from unittest.mock import AsyncMock

import pytest

from app.domains.assessments.exceptions import (
    AssessmentAuthorizationException,
    AssessmentNotFoundException,
)
from app.domains.assessments.models import Assessment
from app.domains.assessments.schemas import AssessmentCreate, AssessmentTherapistUpdate
from app.domains.assessments.service import AssessmentService
from app.domains.users.models import User, UserRole


@pytest.mark.asyncio
async def test_create_assessment() -> None:
    mock_db = AsyncMock()
    service = AssessmentService(mock_db)

    patient = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT)

    payload = AssessmentCreate(
        pain_area="Lower Back (L4-L5)",
        pain_level=6,
        pain_duration="3-6 weeks",
        previous_injuries="None",
        medical_history="Mild hypertension",
        occupation="Software Engineer",
        activity_level="Sedentary",
        sleep_quality="Fair",
        lifestyle="Desk job",
        goals="Reduce pain during sitting",
    )

    created_assessment = Assessment(
        id=uuid.uuid4(),
        patient_id=patient.id,
        pain_area=payload.pain_area,
        pain_level=payload.pain_level,
        pain_duration=payload.pain_duration,
        status="PENDING_REVIEW",
    )

    service.repository.create_assessment = AsyncMock(return_value=created_assessment)

    res = await service.create_assessment(patient, payload)
    assert res.pain_area == "Lower Back (L4-L5)"
    assert res.pain_level == 6
    assert res.status == "PENDING_REVIEW"


@pytest.mark.asyncio
async def test_assessment_ownership_authorization() -> None:
    mock_db = AsyncMock()
    service = AssessmentService(mock_db)

    patient_owner_id = uuid.uuid4()
    other_patient_id = uuid.uuid4()

    patient_owner = User(id=patient_owner_id, email="owner@test.com", password_hash="hash", role=UserRole.PATIENT)
    other_patient = User(id=other_patient_id, email="other@test.com", password_hash="hash", role=UserRole.PATIENT)
    admin_user = User(id=uuid.uuid4(), email="admin@test.com", password_hash="hash", role=UserRole.ADMIN)

    assessment = Assessment(
        id=uuid.uuid4(),
        patient_id=patient_owner_id,
        pain_area="Knee",
        pain_level=5,
        pain_duration="1 week",
        status="PENDING_REVIEW",
    )

    # 1. Owner patient can access
    service._verify_access(assessment, patient_owner)

    # 2. Admin can access
    service._verify_access(assessment, admin_user)

    # 3. Other patient raises Forbidden
    with pytest.raises(AssessmentAuthorizationException):
        service._verify_access(assessment, other_patient)


@pytest.mark.asyncio
async def test_therapist_clinical_update_permission() -> None:
    mock_db = AsyncMock()
    service = AssessmentService(mock_db)

    patient_user = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT)
    therapist_user = User(id=uuid.uuid4(), email="therapist@test.com", password_hash="hash", role=UserRole.THERAPIST)

    update_payload = AssessmentTherapistUpdate(
        mobility_score=80,
        strength_score=75,
        flexibility_score=70,
        posture_score=85,
        movement_notes="Good extension, slight rotation restriction",
        clinical_notes="Prescribed core stability exercises",
        recommendations="Perform 3x daily",
        status="COMPLETED",
    )

    # Non-therapist patient attempting update -> Forbidden
    with pytest.raises(AssessmentAuthorizationException):
        await service.update_clinical_evaluation(uuid.uuid4(), update_payload, patient_user)
