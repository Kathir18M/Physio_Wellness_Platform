"""
Integration tests for Authentication, JWT tokens, and RBAC authorization.
"""

import uuid
from unittest.mock import AsyncMock, patch

from app.core.security import create_access_token
from app.domains.users.models import User, UserRole


def test_auth_login_invalid_credentials(client):
    with patch("app.domains.auth.service.UserRepository") as mock_repo_cls:
        mock_repo = mock_repo_cls.return_value
        mock_repo.get_by_email = AsyncMock(return_value=None)

        res = client.post("/api/v1/auth/login", json={"email": "nonexistent@test.com", "password": "WrongPassword123!"})
        assert res.status_code in [401, 403]
        assert "error" in res.json()


def test_unauthorized_access_without_token(client):
    res = client.get("/api/v1/users/me")
    assert res.status_code in [401, 403]


def test_unauthorized_access_invalid_token_format(client):
    res = client.get("/api/v1/users/me", headers={"Authorization": "Bearer invalid.jwt.token"})
    assert res.status_code in [401, 403]


def test_rbac_patient_forbidden_from_admin_metrics(client):
    patient_user = User(id=uuid.uuid4(), email="patient@test.com", password_hash="hash", role=UserRole.PATIENT, is_active=True)
    token = create_access_token(patient_user.id, role=patient_user.role.value)

    with patch("app.shared.dependencies.auth.UserRepository") as mock_repo_cls:
        mock_repo = mock_repo_cls.return_value
        mock_repo.get_by_id = AsyncMock(return_value=patient_user)

        res = client.get("/api/v1/admin/dashboard/metrics", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 403
