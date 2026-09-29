"""
Progress API router for patient progress logging, historical tracking, and summary analytics.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from fastapi import APIRouter, status

from app.domains.progress.schemas import (
    ProgressRecordCreate,
    ProgressRecordRead,
    ProgressSummaryRead,
)
from app.domains.progress.service import ProgressService
from app.shared.dependencies.auth import CurrentUser
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.post(
    "",
    response_model=ProgressRecordRead,
    status_code=status.HTTP_201_CREATED,
    summary="Log daily patient progress record",
)
async def create_progress_record(
    data: ProgressRecordCreate,
    db: DbSession,
    current_user: CurrentUser,
) -> ProgressRecordRead:
    """Log pain score, weight, mobility, strength, and custom measurements."""
    service = ProgressService(db)
    record = await service.create_progress_record(current_user, data)
    return ProgressRecordRead.model_validate(record)


@router.get(
    "/me",
    response_model=ProgressSummaryRead,
    status_code=status.HTTP_200_OK,
    summary="Get current patient's latest progress summary & goals",
)
async def get_my_progress(
    db: DbSession,
    current_user: CurrentUser,
) -> ProgressSummaryRead:
    """Retrieve current summary metrics and goal progress."""
    service = ProgressService(db)
    summary = await service.get_patient_summary(current_user)
    return ProgressSummaryRead.model_validate(summary)


@router.get(
    "/me/history",
    response_model=list[ProgressRecordRead],
    status_code=status.HTTP_200_OK,
    summary="Get historical progress records for current patient",
)
async def get_my_progress_history(
    db: DbSession,
    current_user: CurrentUser,
) -> Sequence[ProgressRecordRead]:
    """Retrieve historical progress records ordered by timestamp descending."""
    service = ProgressService(db)
    history = await service.get_patient_history(current_user)
    return [ProgressRecordRead.model_validate(r) for r in history]


@router.get(
    "/me/summary",
    response_model=ProgressSummaryRead,
    status_code=status.HTTP_200_OK,
    summary="Get weekly summary metrics overview",
)
async def get_my_progress_summary(
    db: DbSession,
    current_user: CurrentUser,
) -> ProgressSummaryRead:
    """Retrieve weekly summary metrics including compliance rates and streak days."""
    service = ProgressService(db)
    summary = await service.get_patient_summary(current_user)
    return ProgressSummaryRead.model_validate(summary)
