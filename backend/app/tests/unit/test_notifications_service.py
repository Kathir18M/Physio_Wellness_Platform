"""
Unit tests for Notification Service.
"""

import uuid
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.domains.notifications.models import (
    Notification,
    NotificationChannel,
    NotificationEventType,
    NotificationStatus,
)
from app.domains.notifications.schemas import NotificationSendEventRequest
from app.domains.notifications.service import NotificationService
from app.domains.users.models import User, UserRole


@pytest.mark.asyncio
async def test_send_notification_event_multi_channel():
    mock_db = AsyncMock()
    service = NotificationService(mock_db)

    user_id = uuid.uuid4()
    req = NotificationSendEventRequest(
        user_id=user_id,
        event_type=NotificationEventType.APPOINTMENT_BOOKED,
        title="Appointment Confirmed",
        body="Your appointment has been scheduled.",
        channels=[NotificationChannel.IN_APP, NotificationChannel.EMAIL, NotificationChannel.WHATSAPP],
        deduplication_key="dedup-12345",
        recipient_email="patient@example.com",
    )

    # Mock repository responses
    service.repository.get_by_deduplication_key = AsyncMock(return_value=None)
    
    def _create(n):
        n.id = uuid.uuid4()
        return n
    
    service.repository.create = AsyncMock(side_effect=_create)
    service.repository.update_status = AsyncMock(side_effect=lambda n, s, **kw: setattr(n, "status", s) or n)

    with patch("app.domains.notifications.service.get_notification_provider") as mock_factory:
        mock_provider = AsyncMock()
        mock_provider.send = AsyncMock(return_value=True)
        mock_factory.return_value = mock_provider

        result = await service.send_event(req)

        assert len(result) == 3
        assert result[0].channel == NotificationChannel.IN_APP
        assert result[1].channel == NotificationChannel.EMAIL
        assert result[2].channel == NotificationChannel.WHATSAPP


@pytest.mark.asyncio
async def test_notification_deduplication():
    mock_db = AsyncMock()
    service = NotificationService(mock_db)

    user_id = uuid.uuid4()
    req = NotificationSendEventRequest(
        user_id=user_id,
        event_type=NotificationEventType.PAYMENT_SUCCESSFUL,
        title="Payment Received",
        body="Thank you for your payment.",
        channels=[NotificationChannel.IN_APP],
        deduplication_key="payment-tx-999",
    )

    existing_notification = Notification(
        id=uuid.uuid4(),
        user_id=user_id,
        event_type=NotificationEventType.PAYMENT_SUCCESSFUL,
        channel=NotificationChannel.IN_APP,
        title="Payment Received",
        body="Thank you for your payment.",
        status=NotificationStatus.SENT,
        deduplication_key="payment-tx-999_IN_APP",
    )

    service.repository.get_by_deduplication_key = AsyncMock(return_value=existing_notification)

    result = await service.send_event(req)
    assert len(result) == 1
    assert result[0].id == existing_notification.id


@pytest.mark.asyncio
async def test_retry_failed_notifications():
    mock_db = AsyncMock()
    service = NotificationService(mock_db)

    failed_notification = Notification(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        event_type=NotificationEventType.EXERCISE_REMINDER,
        channel=NotificationChannel.EMAIL,
        title="Time for exercises!",
        body="Complete your daily rehabilitation routine.",
        status=NotificationStatus.FAILED,
        retry_count=1,
        max_retries=3,
        metadata_json={"recipient_email": "patient@example.com"},
    )

    service.repository.list_failed_for_retry = AsyncMock(return_value=[failed_notification])
    service.repository.update_status = AsyncMock(side_effect=lambda n, s, **kw: setattr(n, "status", s) or n)

    with patch("app.domains.notifications.service.get_notification_provider") as mock_factory:
        mock_provider = AsyncMock()
        mock_provider.send = AsyncMock(return_value=True)
        mock_factory.return_value = mock_provider

        retried = await service.retry_failed_notifications()

        assert len(retried) == 1
        assert retried[0].status == NotificationStatus.SENT
