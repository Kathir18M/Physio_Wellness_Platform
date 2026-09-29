"""
Assessment service layer implementing business logic and access control rules.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.assessments.exceptions import (
    AssessmentAuthorizationException,
    AssessmentNotFoundException,
)
from app.domains.assessments.models import Assessment
from app.domains.assessments.repository import AssessmentRepository
from app.domains.assessments.schemas import AssessmentCreate, AssessmentTherapistUpdate
from app.domains.therapists.repository import TherapistRepository
from app.domains.users.models import User, UserRole


class AssessmentService:
    """Service handling assessment workflow, clinical scoring, and access controls."""

    def __init__(self, db: AsyncSession) -> None:
        self.repository = AssessmentRepository(db)
        self.therapist_repo = TherapistRepository(db)

    async def create_assessment(
        self,
        current_user: User,
        data: AssessmentCreate,
    ) -> Assessment:
        """Create a new health assessment record for the authenticated patient."""
        assessment = Assessment(
            patient_id=current_user.id,
            therapist_id=data.therapist_id,
            pain_area=data.pain_area,
            pain_level=data.pain_level,
            pain_duration=data.pain_duration,
            previous_injuries=data.previous_injuries,
            medical_history=data.medical_history,
            occupation=data.occupation,
            activity_level=data.activity_level,
            sleep_quality=data.sleep_quality,
            lifestyle=data.lifestyle,
            goals=data.goals,
            additional_notes=data.additional_notes,
            status="PENDING_REVIEW",
        )
        return await self.repository.create_assessment(assessment)

    async def get_my_assessments(self, current_user: User) -> Sequence[Assessment]:
        """Fetch all assessments created by the current patient."""
        return await self.repository.list_by_patient(current_user.id)

    async def get_assessment_by_id(
        self,
        assessment_id: uuid.UUID,
        current_user: User,
    ) -> Assessment:
        """Fetch assessment by ID enforcing strict patient ownership or therapist assignment."""
        assessment = await self.repository.get_by_id(assessment_id)
        if assessment is None:
            raise AssessmentNotFoundException(str(assessment_id))

        self._verify_access(assessment, current_user)
        return assessment

    async def update_clinical_evaluation(
        self,
        assessment_id: uuid.UUID,
        data: AssessmentTherapistUpdate,
        current_user: User,
    ) -> Assessment:
        """Update clinical practitioner scores and notes (Therapist or Admin only)."""
        if current_user.role not in (UserRole.THERAPIST, UserRole.ADMIN, UserRole.SUPER_ADMIN):
            raise AssessmentAuthorizationException("Only therapists or admins can update clinical evaluation scores.")

        assessment = await self.repository.get_by_id(assessment_id)
        if assessment is None:
            raise AssessmentNotFoundException(str(assessment_id))

        # Check practitioner assignment if THERAPIST
        if current_user.role == UserRole.THERAPIST:
            profile = await self.therapist_repo.get_profile_by_user_id(current_user.id)
            if profile and assessment.therapist_id and assessment.therapist_id != profile.id:
                raise AssessmentAuthorizationException("Therapist is not assigned to this patient assessment.")

        update_dict = data.model_dump(exclude_unset=True)
        return await self.repository.update(assessment, update_dict)

    def _verify_access(self, assessment: Assessment, user: User) -> None:
        """Verify whether user is patient owner, assigned therapist, or admin."""
        if user.role in (UserRole.ADMIN, UserRole.SUPER_ADMIN):
            return

        if user.id == assessment.patient_id:
            return

        if user.role == UserRole.THERAPIST and assessment.therapist:
            if assessment.therapist.user_id == user.id:
                return

        raise AssessmentAuthorizationException("You are not authorized to view this assessment record.")
