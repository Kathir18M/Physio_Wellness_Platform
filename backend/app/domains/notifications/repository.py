"""
Repository layer for Notifications domain.
"""

from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.notifications.models import Notification, NotificationStatus


class NotificationRepository:
    """Encapsulates all database operations for Notifications."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, notification: Notification) -> Notification:
        self.db.add(notification)
        await self.db.flush()
        await self.db.refresh(notification)
        return notification

    async def get_by_id(self, notification_id: UUID) -> Optional[Notification]:
        result = await self.db.execute(
            select(Notification).where(Notification.id == notification_id)
        )
        return result.scalar_one_or_none()

    async def get_by_deduplication_key(self, key: str) -> Optional[Notification]:
        if not key:
            return None
        result = await self.db.execute(
            select(Notification).where(Notification.deduplication_key == key)
        )
        return result.scalar_one_or_none()

    async def list_by_user(
        self,
        user_id: UUID,
        unread_only: bool = False,
        limit: int = 50,
        offset: int = 0,
    ) -> List[Notification]:
        query = select(Notification).where(Notification.user_id == user_id)
        if unread_only:
            query = query.where(Notification.status != NotificationStatus.READ)
        query = query.order_by(Notification.created_at.desc()).offset(offset).limit(limit)

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def count_unread_by_user(self, user_id: UUID) -> int:
        query = (
            select(func.count(Notification.id))
            .where(Notification.user_id == user_id)
            .where(Notification.status != NotificationStatus.READ)
        )
        result = await self.db.execute(query)
        return result.scalar_one() or 0

    async def mark_as_read(self, notification_id: UUID, user_id: UUID) -> Optional[Notification]:
        notification = await self.get_by_id(notification_id)
        if not notification or notification.user_id != user_id:
            return None

        notification.status = NotificationStatus.READ
        notification.read_at = datetime.now(timezone.utc)
        await self.db.flush()
        await self.db.refresh(notification)
        return notification

    async def mark_all_as_read(self, user_id: UUID) -> int:
        now = datetime.now(timezone.utc)
        stmt = (
            update(Notification)
            .where(Notification.user_id == user_id)
            .where(Notification.status != NotificationStatus.READ)
            .values(status=NotificationStatus.READ, read_at=now, updated_at=now)
        )
        result = await self.db.execute(stmt)
        await self.db.flush()
        return result.rowcount

    async def list_failed_for_retry(self, limit: int = 50) -> List[Notification]:
        query = (
            select(Notification)
            .where(Notification.status == NotificationStatus.FAILED)
            .where(Notification.retry_count < Notification.max_retries)
            .order_by(Notification.updated_at.asc())
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def update_status(
        self,
        notification: Notification,
        status: NotificationStatus,
        error_message: Optional[str] = None,
    ) -> Notification:
        notification.status = status
        notification.updated_at = datetime.now(timezone.utc)
        if status == NotificationStatus.SENT:
            notification.sent_at = datetime.now(timezone.utc)
        elif status == NotificationStatus.FAILED:
            notification.retry_count += 1
            notification.error_message = error_message
        await self.db.flush()
        await self.db.refresh(notification)
        return notification
