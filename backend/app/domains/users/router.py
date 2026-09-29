"""
Users API endpoints router.
"""

from __future__ import annotations

from fastapi import APIRouter, status

from app.domains.users.schemas import UserRead, UserUpdate
from app.domains.users.service import UserService
from app.shared.dependencies.auth import CurrentUser
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    response_model=UserRead,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
)
async def get_current_user_profile(
    current_user: CurrentUser,
) -> UserRead:
    """Return the profile of the currently authenticated user."""
    return UserRead.model_validate(current_user)


@router.patch(
    "/me",
    response_model=UserRead,
    status_code=status.HTTP_200_OK,
    summary="Update current user profile",
)
async def update_current_user_profile(
    update_data: UserUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> UserRead:
    """Update profile attributes for the authenticated user."""
    service = UserService(db)
    updated_user = await service.update_user_profile(current_user.id, update_data)
    return UserRead.model_validate(updated_user)
