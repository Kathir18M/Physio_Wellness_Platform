"""
Shared pytest fixtures for the backend test suite.
"""

from __future__ import annotations

from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.shared.dependencies.database import _get_session


@pytest.fixture()
def mock_db_session():
    """Fixture providing a mock async database session."""
    session = AsyncMock()
    return session


@pytest.fixture()
def client(mock_db_session) -> TestClient:
    """Return a synchronous test client bound to the FastAPI app with mocked DB session."""
    async def _override_get_session():
        yield mock_db_session

    app.dependency_overrides[_get_session] = _override_get_session
    client_obj = TestClient(app)
    yield client_obj
    app.dependency_overrides.clear()
