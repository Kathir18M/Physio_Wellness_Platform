"""
Shared FastAPI authentication and Role-Based Access Control (RBAC) dependencies.
"""

from __future__ import annotations

import uuid
from typing import Annotated, Callable

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.domains.users.models import User, UserRole
from app.domains.users.repository import UserRepository
from app.shared.dependencies.database import DbSession
from app.shared.exceptions import ForbiddenException

security_scheme = HTTPBearer(auto_error=True)


async def get_current_user(
    db: DbSession,
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security_scheme)],
) -> User:
    """Extract and validate JWT access token from Bearer header and load current user entity."""
    token = credentials.credentials
    payload = decode_token(token)

    if payload.get("type") != "access":
        raise ForbiddenException("Invalid token type. Expected access token.")

    sub = payload.get("sub")
    if not sub:
        raise ForbiddenException("Malformed token payload.")

    try:
        user_id = uuid.UUID(sub)
    except ValueError as exc:
        raise ForbiddenException("Invalid user ID format in token.") from exc

    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id)
    if user is None:
        raise ForbiddenException("User account associated with token no longer exists.")

    if not user.is_active:
        raise ForbiddenException("User account is disabled.")

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_roles(*allowed_roles: UserRole) -> Callable[[User], User]:
    """Dependency factory enforcing that the authenticated user possesses one of the allowed roles."""

    async def role_checker(current_user: CurrentUser) -> User:
        if current_user.role not in allowed_roles:
            raise ForbiddenException(
                f"Forbidden. Role '{current_user.role.value}' is not authorized to access this resource."
            )
        return current_user

    return role_checker
