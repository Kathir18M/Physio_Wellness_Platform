"""
Unit tests for Exercise library, TreatmentPlan creation, and daily completion tracking.
"""

import uuid
from unittest.mock import AsyncMock

import pytest

from app.domains.exercises.models import Exercise
from app.domains.exercises.schemas import ExerciseCompletionCreate, ExerciseCreate
from app.domains.exercises.service import ExerciseService
from app.domains.treatment_plans.models import TreatmentPlan
from app.domains.treatment_plans.schemas import TreatmentPlanCreate
from app.domains.treatment_plans.service import TreatmentPlanService
from app.domains.users.models import User, UserRole
from app.shared.exceptions import ForbiddenException


@pytest.mark.asyncio
async def test_exercise_creation_permission():
    mock_db = AsyncMock()
    service = ExerciseService(mock_db)

    patient_user = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT)
    therapist_user = User(id=uuid.uuid4(), email="therapist@test.com", password_hash="hash", role=UserRole.THERAPIST)

    payload = ExerciseCreate(
        name="Cat-Cow Stretch",
        body_part="Lower Back",
        difficulty="BEGINNER",
        duration="5 mins",
        sets=3,
        repetitions="10 reps",
    )

    # 1. Non-therapist patient -> Forbidden
    with pytest.raises(ForbiddenException):
        await service.create_exercise(patient_user, payload)

    # 2. Therapist -> Creates exercise
    mock_exercise = Exercise(id=uuid.uuid4(), name=payload.name, body_part=payload.body_part, sets=3, repetitions="10 reps")
    service.repository.create_exercise = AsyncMock(return_value=mock_exercise)

    res = await service.create_exercise(therapist_user, payload)
    assert res.name == "Cat-Cow Stretch"


@pytest.mark.asyncio
async def test_log_exercise_completion():
    mock_db = AsyncMock()
    service = ExerciseService(mock_db)

    patient_user = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT)
    exercise_id = uuid.uuid4()

    mock_exercise = Exercise(id=exercise_id, name="Prone Cobra", body_part="Lower Back")
    service.repository.get_by_id = AsyncMock(return_value=mock_exercise)
    service.repository.log_completion = AsyncMock(side_effect=lambda log: log)

    payload = ExerciseCompletionCreate(notes="Completed 3 sets without pain")
    log = await service.log_completion(exercise_id, patient_user, payload)

    assert log.exercise_id == exercise_id
    assert log.patient_id == patient_user.id
    assert log.notes == "Completed 3 sets without pain"


@pytest.mark.asyncio
async def test_treatment_plan_creation():
    mock_db = AsyncMock()
    service = TreatmentPlanService(mock_db)

    patient_id = uuid.uuid4()
    therapist_user = User(id=uuid.uuid4(), email="therapist@test.com", password_hash="hash", role=UserRole.THERAPIST)

    payload = TreatmentPlanCreate(
        patient_id=patient_id,
        title="Lumbar Spine Rehabilitation",
        goal="Improve lumbar flexion",
        duration="8 weeks",
        frequency="Daily",
        exercises=[],
    )

    mock_plan = TreatmentPlan(
        id=uuid.uuid4(),
        patient_id=patient_id,
        therapist_id=uuid.uuid4(),
        title=payload.title,
        duration="8 weeks",
        frequency="Daily",
        status="ACTIVE",
    )

    service.therapist_repo.get_profile_by_user_id = AsyncMock(return_value=AsyncMock(id=uuid.uuid4()))
    service.repository.create_plan = AsyncMock(return_value=mock_plan)

    plan = await service.create_treatment_plan(therapist_user, payload)
    assert plan.title == "Lumbar Spine Rehabilitation"
    assert plan.status == "ACTIVE"
