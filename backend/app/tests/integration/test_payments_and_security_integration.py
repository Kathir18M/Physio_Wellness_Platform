"""
Integration tests for Payments, Server-side Verification, Idempotency, and Webhooks.
"""

import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch

from app.core.security import create_access_token
from app.domains.orders.models import Order
from app.domains.payments.models import Payment
from app.domains.users.models import User, UserRole


def test_payment_server_side_verification(client):
    patient = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT, is_active=True)
    token = create_access_token(patient.id, role=patient.role.value)

    order_id = uuid.uuid4()
    payment_id = uuid.uuid4()
    provider_payment_id = "tx_mock_12345"
    now = datetime.now(timezone.utc)

    mock_order = Order(id=order_id, patient_id=patient.id, total_amount=249.0, status="PENDING")
    mock_payment = Payment(
        id=payment_id,
        order_id=order_id,
        patient_id=patient.id,
        amount=249.0,
        currency="USD",
        provider="mock",
        provider_payment_id=provider_payment_id,
        status="PENDING",
        created_at=now,
        updated_at=now,
    )

    with patch("app.shared.dependencies.auth.UserRepository") as mock_user_repo_cls, \
         patch("app.domains.payments.service.PaymentRepository") as mock_pay_repo_cls, \
         patch("app.domains.payments.service.OrderRepository") as mock_ord_repo_cls, \
         patch("app.domains.payments.service.SubscriptionService") as mock_sub_service_cls:

        mock_user_repo_cls.return_value.get_by_id = AsyncMock(return_value=patient)

        mock_pay_repo = mock_pay_repo_cls.return_value
        mock_pay_repo.get_by_provider_id = AsyncMock(return_value=mock_payment)
        mock_pay_repo.update_status = AsyncMock()
        mock_pay_repo.create_event = AsyncMock()

        mock_ord_repo = mock_ord_repo_cls.return_value
        mock_ord_repo.get_by_id = AsyncMock(return_value=mock_order)
        mock_ord_repo.update_status = AsyncMock()

        mock_sub_service = mock_sub_service_cls.return_value
        mock_sub_service.activate_subscription_for_order = AsyncMock()

        verify_payload = {
            "provider_payment_id": provider_payment_id,
        }

        res = client.post(
            "/api/v1/payments/verify",
            json=verify_payload,
            headers={"Authorization": f"Bearer {token}"},
        )

        assert res.status_code == 200
        assert mock_pay_repo.get_by_provider_id.called
