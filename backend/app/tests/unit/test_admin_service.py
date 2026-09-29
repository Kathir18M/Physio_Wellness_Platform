"""
Unit tests for Admin Service and RBAC authorization.
"""

import uuid
from unittest.mock import AsyncMock

import pytest

from app.domains.admin.service import AdminService
from app.domains.users.models import User, UserRole
from app.shared.exceptions import ForbiddenException, NotFoundException


@pytest.mark.asyncio
async def test_admin_metrics_aggregation():
    mock_db = AsyncMock()
    service = AdminService(mock_db)

    metrics_mock = {
        "total_users": 150,
        "active_patients": 120,
        "active_therapists": 15,
        "total_appointments": 450,
        "completed_appointments": 410,
        "program_enrollments": 85,
        "revenue": 21500.0,
        "active_subscriptions": 70,
    }

    service.repository.get_dashboard_metrics = AsyncMock(return_value=metrics_mock)

    result = await service.get_metrics()
    assert result["total_users"] == 150
    assert result["revenue"] == 21500.0
    assert result["active_subscriptions"] == 70


@pytest.mark.asyncio
async def test_update_user_role_super_admin_only():
    mock_db = AsyncMock()
    service = AdminService(mock_db)

    admin_user = User(id=uuid.uuid4(), email="admin@test.com", password_hash="hash", role=UserRole.ADMIN)
    super_admin_user = User(id=uuid.uuid4(), email="super@test.com", password_hash="hash", role=UserRole.SUPER_ADMIN)
    target_user = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT)

    service.user_repo.get_by_id = AsyncMock(return_value=target_user)
    service.log_action = AsyncMock()

    # Regular ADMIN fails to upgrade role
    with pytest.raises(ForbiddenException):
        await service.update_user_role(admin_user, target_user.id, UserRole.THERAPIST)

    # SUPER_ADMIN succeeds
    updated = await service.update_user_role(super_admin_user, target_user.id, UserRole.THERAPIST)
    assert updated.role == UserRole.THERAPIST
    assert service.log_action.called


@pytest.mark.asyncio
async def test_delete_user_super_admin_only():
    mock_db = AsyncMock()
    service = AdminService(mock_db)

    admin_user = User(id=uuid.uuid4(), email="admin@test.com", password_hash="hash", role=UserRole.ADMIN)
    super_admin_user = User(id=uuid.uuid4(), email="super@test.com", password_hash="hash", role=UserRole.SUPER_ADMIN)
    target_user = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT)

    service.user_repo.get_by_id = AsyncMock(return_value=target_user)
    service.log_action = AsyncMock()

    # Regular ADMIN fails
    with pytest.raises(ForbiddenException):
        await service.delete_user(admin_user, target_user.id)

    # SUPER_ADMIN succeeds
    res = await service.delete_user(super_admin_user, target_user.id)
    assert res is True
    assert service.log_action.called
