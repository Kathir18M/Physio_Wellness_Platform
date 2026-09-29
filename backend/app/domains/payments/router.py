"""
Payments API router handling checkout creation, server-side verification, webhooks, and history.
"""

from __future__ import annotations

from typing import Sequence

from fastapi import APIRouter, Header, Request, status

from app.domains.payments.schemas import (
    PaymentCheckoutResponse,
    PaymentCreatePayload,
    PaymentRead,
    PaymentVerifyPayload,
)
from app.domains.payments.service import PaymentService
from app.shared.dependencies.auth import CurrentUser
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post(
    "/create",
    response_model=PaymentCheckoutResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create checkout session for an order",
)
async def create_checkout_session(
    data: PaymentCreatePayload,
    db: DbSession,
    current_user: CurrentUser,
) -> PaymentCheckoutResponse:
    """Initiate checkout session with idempotency check."""
    service = PaymentService(db)
    session_info = await service.create_checkout_session(current_user, data)
    return PaymentCheckoutResponse.model_validate(session_info)


@router.post(
    "/verify",
    response_model=PaymentRead,
    status_code=status.HTTP_200_OK,
    summary="Verify payment server-side with gateway (Never trust frontend success)",
)
async def verify_payment(
    data: PaymentVerifyPayload,
    db: DbSession,
    current_user: CurrentUser,
) -> PaymentRead:
    """Server-side payment verification and order fulfillment."""
    service = PaymentService(db)
    payment = await service.verify_payment_server_side(data.provider_payment_id, current_user)
    return PaymentRead.model_validate(payment)


@router.post(
    "/webhook",
    status_code=status.HTTP_200_OK,
    summary="Receive and verify payment gateway webhook events",
)
async def payment_webhook(
    request: Request,
    db: DbSession,
    x_signature: str | None = Header(None, alias="X-Signature"),
) -> dict:
    """Verify webhook signature and process payment events idempotently."""
    body = await request.body()
    service = PaymentService(db)
    return await service.process_webhook(body, signature=x_signature or "mock_sig")


@router.get(
    "/history",
    response_model=list[PaymentRead],
    status_code=status.HTTP_200_OK,
    summary="List patient payment transaction history",
)
async def get_payment_history(
    db: DbSession,
    current_user: CurrentUser,
) -> Sequence[PaymentRead]:
    """Fetch patient payment transaction history."""
    service = PaymentService(db)
    payments = await service.list_my_payments(current_user)
    return [PaymentRead.model_validate(p) for p in payments]
