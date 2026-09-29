"""
Unit tests for Orders, Payments, Server-side verification, Webhooks, and Subscriptions.
"""

import uuid
from unittest.mock import AsyncMock

import pytest

from app.domains.orders.models import Order
from app.domains.orders.schemas import OrderCreate
from app.domains.orders.service import OrderService
from app.domains.payments.models import Payment
from app.domains.payments.schemas import PaymentCreatePayload, PaymentVerifyPayload
from app.domains.payments.service import PaymentService
from app.domains.subscriptions.models import Subscription
from app.domains.subscriptions.service import SubscriptionService
from app.domains.users.models import User, UserRole
from app.shared.exceptions import BadRequestException, NotFoundException


@pytest.mark.asyncio
async def test_order_creation():
    mock_db = AsyncMock()
    service = OrderService(mock_db)

    patient_user = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT)

    payload = OrderCreate(amount=249.00, currency="USD")
    mock_order = Order(
        id=uuid.uuid4(),
        patient_id=patient_user.id,
        total_amount=249.00,
        currency="USD",
        status="PENDING",
    )
    service.repository.create_order = AsyncMock(return_value=mock_order)

    order = await service.create_order(patient_user, payload)
    assert order.total_amount == 249.00
    assert order.status == "PENDING"


@pytest.mark.asyncio
async def test_payment_checkout_and_server_side_verification():
    mock_db = AsyncMock()
    service = PaymentService(mock_db)

    patient_user = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT)
    order_id = uuid.uuid4()
    payment_id = uuid.uuid4()
    provider_payment_id = "pay_mock_12345"

    mock_order = Order(id=order_id, patient_id=patient_user.id, total_amount=249.00, currency="USD", status="PENDING")
    service.order_repo.get_by_id = AsyncMock(return_value=mock_order)
    service.repository.get_by_idempotency_key = AsyncMock(return_value=None)
    service.repository.create_payment = AsyncMock(side_effect=lambda p: p)

    # 1. Create checkout session
    checkout_res = await service.create_checkout_session(patient_user, PaymentCreatePayload(order_id=order_id))
    assert checkout_res["status"] == "REQUIRES_PAYMENT"
    assert "checkout_url" in checkout_res

    # 2. Verify payment server side (Never trust frontend)
    mock_payment = Payment(
        id=payment_id,
        order_id=order_id,
        patient_id=patient_user.id,
        provider="MOCK",
        provider_payment_id=provider_payment_id,
        amount=249.00,
        currency="USD",
        status="PENDING",
    )
    service.repository.get_by_provider_id = AsyncMock(return_value=mock_payment)
    service.repository.update_status = AsyncMock(side_effect=lambda p, s: setattr(p, "status", s))
    service.order_repo.update_status = AsyncMock()
    service.subscription_service.activate_subscription_for_order = AsyncMock()
    service.repository.create_event = AsyncMock()

    verified_payment = await service.verify_payment_server_side(provider_payment_id, patient_user)
    assert verified_payment.status == "SUCCESSFUL"


@pytest.mark.asyncio
async def test_webhook_signature_verification():
    mock_db = AsyncMock()
    service = PaymentService(mock_db)
    service.repository.create_event = AsyncMock()

    # Valid webhook signature
    res = await service.process_webhook(b'{"event": "payment_intent.succeeded"}', signature="valid_mock_sig")
    assert res["status"] == "processed"

    # Invalid webhook signature -> BadRequestException
    with pytest.raises(BadRequestException):
        await service.process_webhook(b'{"event": "payment_intent.succeeded"}', signature="invalid_sig")


@pytest.mark.asyncio
async def test_subscription_cancellation():
    mock_db = AsyncMock()
    service = SubscriptionService(mock_db)

    patient_user = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT)
    sub_id = uuid.uuid4()

    mock_sub = Subscription(
        id=sub_id,
        patient_id=patient_user.id,
        order_id=uuid.uuid4(),
        status="ACTIVE",
    )
    service.repository.list_by_patient = AsyncMock(return_value=[mock_sub])
    def _cancel_sub(s):
        s.status = "CANCELLED"
        return s
    service.repository.cancel_subscription = AsyncMock(side_effect=_cancel_sub)

    cancelled = await service.cancel_subscription(patient_user, sub_id)
    assert cancelled.status == "CANCELLED"
