"""
Subscriptions API router.
"""

from __future__ import annotations

from typing import Sequence

from fastapi import APIRouter, status

from app.domains.subscriptions.schemas import (
    SubscriptionCancelPayload,
    SubscriptionRead,
)
from app.domains.subscriptions.service import SubscriptionService
from app.shared.dependencies.auth import CurrentUser
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


@router.get(
    "/me",
    response_model=list[SubscriptionRead],
    status_code=status.HTTP_200_OK,
    summary="List patient active subscriptions",
)
async def get_my_subscriptions(
    db: DbSession,
    current_user: CurrentUser,
) -> Sequence[SubscriptionRead]:
    """Retrieve patient active program subscriptions."""
    service = SubscriptionService(db)
    subscriptions = await service.get_my_subscriptions(current_user)
    return [SubscriptionRead.model_validate(s) for s in subscriptions]


@router.post(
    "/cancel",
    response_model=SubscriptionRead,
    status_code=status.HTTP_200_OK,
    summary="Cancel active patient subscription",
)
async def cancel_subscription(
    data: SubscriptionCancelPayload,
    db: DbSession,
    current_user: CurrentUser,
) -> SubscriptionRead:
    """Cancel patient subscription."""
    service = SubscriptionService(db)
    cancelled = await service.cancel_subscription(current_user, data.subscription_id)
    return SubscriptionRead.model_validate(cancelled)
