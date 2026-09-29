"""
Notifications API router.
"""

from __future__ import annotations

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Query, status

from app.domains.notifications.schemas import (
    NotificationResponse,
    NotificationSendEventRequest,
    UnreadCountResponse,
)
from app.domains.notifications.service import NotificationService
from app.shared.dependencies.auth import CurrentUser
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get(
    "/me",
    response_model=List[NotificationResponse],
    status_code=status.HTTP_200_OK,
    summary="Get patient's notifications",
)
async def get_my_notifications(
    current_user: CurrentUser,
    db: DbSession,
    unread_only: bool = Query(False, description="Filter only unread notifications"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> List[NotificationResponse]:
    """Retrieve notifications for the authenticated user."""
    service = NotificationService(db)
    return await service.list_user_notifications(
        user_id=current_user.id,
        unread_only=unread_only,
        limit=limit,
        offset=offset,
    )


@router.get(
    "/unread-count",
    response_model=UnreadCountResponse,
    status_code=status.HTTP_200_OK,
    summary="Get unread notification count",
)
async def get_unread_count(
    current_user: CurrentUser,
    db: DbSession,
) -> UnreadCountResponse:
    """Get total count of unread notifications for current user."""
    service = NotificationService(db)
    count = await service.get_unread_count(current_user.id)
    return UnreadCountResponse(unread_count=count)


@router.patch(
    "/{id}/read",
    response_model=NotificationResponse,
    status_code=status.HTTP_200_OK,
    summary="Mark notification as read",
)
async def mark_notification_as_read(
    id: UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> NotificationResponse:
    """Mark a specific notification as read."""
    service = NotificationService(db)
    return await service.mark_read(notification_id=id, user_id=current_user.id)


@router.post(
    "/mark-all-read",
    status_code=status.HTTP_200_OK,
    summary="Mark all notifications as read",
)
async def mark_all_notifications_read(
    current_user: CurrentUser,
    db: DbSession,
) -> dict:
    """Mark all unread notifications as read for current user."""
    service = NotificationService(db)
    updated_count = await service.mark_all_read(user_id=current_user.id)
    return {"updated_count": updated_count, "message": "All notifications marked as read"}


@router.post(
    "/send",
    response_model=List[NotificationResponse],
    status_code=status.HTTP_202_ACCEPTED,
    summary="Send a notification event (System / Background processing)",
)
async def send_notification_event(
    payload: NotificationSendEventRequest,
    current_user: CurrentUser,
    db: DbSession,
    background_tasks: BackgroundTasks,
) -> List[NotificationResponse]:
    """Trigger a notification event across specified channels with background processing."""
    service = NotificationService(db)
    # Background execution supported via background_tasks if required, or direct async execution
    return await service.send_event(payload)


@router.post(
    "/retry-failed",
    response_model=List[NotificationResponse],
    status_code=status.HTTP_200_OK,
    summary="Retry failed notifications",
)
async def retry_failed_notifications(
    current_user: CurrentUser,
    db: DbSession,
    limit: int = Query(50, ge=1, le=100),
) -> List[NotificationResponse]:
    """Retry sending notifications that failed previously."""
    service = NotificationService(db)
    return await service.retry_failed_notifications(limit=limit)
