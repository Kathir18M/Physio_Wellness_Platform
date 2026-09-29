"""
Service layer for Notifications domain.
"""

from typing import Any, Dict, List, Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.domains.notifications.exceptions import (
    DuplicateNotificationError,
    NotificationNotFoundError,
)
from app.domains.notifications.models import (
    Notification,
    NotificationChannel,
    NotificationEventType,
    NotificationStatus,
)
from app.domains.notifications.repository import NotificationRepository
from app.domains.notifications.schemas import NotificationSendEventRequest
from app.integrations.notifications.factory import get_notification_provider

logger = get_logger(__name__)


class NotificationService:
    """Orchestrates notification sending, status tracking, retry handling, and deduplication."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = NotificationRepository(db)

    async def send_event(self, req: NotificationSendEventRequest) -> List[Notification]:
        """
        Processes a high-level notification event for specified channels.
        Handles deduplication and provider dispatch.
        """
        results: List[Notification] = []

        for channel in req.channels:
            dedup_key = (
                f"{req.deduplication_key}_{channel.value}"
                if req.deduplication_key
                else None
            )

            # Deduplication Check
            if dedup_key:
                existing = await self.repository.get_by_deduplication_key(dedup_key)
                if existing:
                    logger.info("Notification with deduplication key %s already processed.", dedup_key)
                    results.append(existing)
                    continue

            # Create Notification entity in PENDING state
            notification = Notification(
                user_id=req.user_id,
                event_type=req.event_type,
                channel=channel,
                title=req.title,
                body=req.body,
                status=NotificationStatus.PENDING,
                deduplication_key=dedup_key,
                metadata_json=req.metadata_json,
            )
            saved_notification = await self.repository.create(notification)

            # Determine recipient address
            recipient = str(req.user_id)
            if channel == NotificationChannel.EMAIL and req.recipient_email:
                recipient = req.recipient_email
            elif channel == NotificationChannel.WHATSAPP and req.recipient_phone:
                recipient = req.recipient_phone

            # Dispatch via provider
            await self._dispatch_to_provider(saved_notification, recipient)
            results.append(saved_notification)

        return results

    async def _dispatch_to_provider(
        self, notification: Notification, recipient: str
    ) -> bool:
        """Dispatches notification to the external or in-app channel provider."""
        try:
            provider = get_notification_provider(notification.channel.value)
            success = await provider.send(
                recipient=recipient,
                subject=notification.title,
                message=notification.body,
                metadata=notification.metadata_json,
            )

            if success:
                new_status = (
                    NotificationStatus.SENT
                    if notification.channel != NotificationChannel.IN_APP
                    else NotificationStatus.PENDING
                )
                await self.repository.update_status(notification, new_status)
                return True
            else:
                await self.repository.update_status(
                    notification,
                    NotificationStatus.FAILED,
                    error_message="Provider returned false on delivery attempt.",
                )
                return False
        except Exception as exc:
            logger.error(
                "Error sending notification %s via %s: %s",
                notification.id,
                notification.channel,
                exc,
            )
            await self.repository.update_status(
                notification,
                NotificationStatus.FAILED,
                error_message=str(exc),
            )
            return False

    async def list_user_notifications(
        self,
        user_id: UUID,
        unread_only: bool = False,
        limit: int = 50,
        offset: int = 0,
    ) -> List[Notification]:
        return await self.repository.list_by_user(
            user_id=user_id,
            unread_only=unread_only,
            limit=limit,
            offset=offset,
        )

    async def get_unread_count(self, user_id: UUID) -> int:
        return await self.repository.count_unread_by_user(user_id)

    async def mark_read(self, notification_id: UUID, user_id: UUID) -> Notification:
        notification = await self.repository.mark_as_read(notification_id, user_id)
        if not notification:
            raise NotificationNotFoundError(str(notification_id))
        return notification

    async def mark_all_read(self, user_id: UUID) -> int:
        return await self.repository.mark_all_as_read(user_id)

    async def retry_failed_notifications(self, limit: int = 50) -> List[Notification]:
        """Fetches failed notifications below max_retries limit and attempts redelivery."""
        failed_list = await self.repository.list_failed_for_retry(limit)
        retried: List[Notification] = []

        for notification in failed_list:
            logger.info("Retrying failed notification %s (attempt %d)", notification.id, notification.retry_count + 1)
            recipient = str(notification.user_id)
            if notification.metadata_json:
                recipient = (
                    notification.metadata_json.get("recipient_email")
                    or notification.metadata_json.get("recipient_phone")
                    or recipient
                )

            success = await self._dispatch_to_provider(notification, recipient)
            if success:
                retried.append(notification)

        return retried
