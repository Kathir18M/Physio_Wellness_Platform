"""
Admin API router with strict RBAC authorization.
"""

from __future__ import annotations

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request, status

from app.domains.admin.schemas import (
    AdminDashboardMetricsResponse,
    AdminReportSummaryResponse,
    AdminUserUpdateRolePayload,
    AdminUserUpdateStatusPayload,
    AuditLogResponse,
)
from app.domains.admin.service import AdminService
from app.domains.users.models import User, UserRole
from app.domains.users.schemas import UserRead
from app.shared.dependencies.auth import CurrentUser, require_roles
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/admin", tags=["Admin"])

# Admin & Super Admin RBAC Check Dependency
admin_guard = Depends(require_roles(UserRole.ADMIN, UserRole.SUPER_ADMIN))
super_admin_guard = Depends(require_roles(UserRole.SUPER_ADMIN))


@router.get(
    "/dashboard/metrics",
    response_model=AdminDashboardMetricsResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[admin_guard],
    summary="Get admin dashboard metrics",
)
async def get_admin_dashboard_metrics(
    db: DbSession,
) -> AdminDashboardMetricsResponse:
    service = AdminService(db)
    metrics_data = await service.get_metrics()
    return AdminDashboardMetricsResponse(**metrics_data)


@router.get(
    "/users",
    response_model=List[UserRead],
    status_code=status.HTTP_200_OK,
    dependencies=[admin_guard],
    summary="List users for administration",
)
async def list_users(
    db: DbSession,
    search: Optional[str] = Query(None, description="Search by email, first or last name"),
    role: Optional[UserRole] = Query(None, description="Filter by user role"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> List[UserRead]:
    service = AdminService(db)
    return await service.list_users(
        search=search,
        role=role,
        is_active=is_active,
        limit=limit,
        offset=offset,
    )


@router.patch(
    "/users/{id}/role",
    response_model=UserRead,
    status_code=status.HTTP_200_OK,
    dependencies=[super_admin_guard],
    summary="Change user role (SUPER_ADMIN only)",
)
async def update_user_role(
    id: UUID,
    payload: AdminUserUpdateRolePayload,
    current_user: CurrentUser,
    db: DbSession,
    request: Request,
) -> UserRead:
    service = AdminService(db)
    return await service.update_user_role(
        admin_user=current_user,
        target_user_id=id,
        new_role=payload.role,
        ip_address=request.client.host if request.client else None,
    )


@router.patch(
    "/users/{id}/status",
    response_model=UserRead,
    status_code=status.HTTP_200_OK,
    dependencies=[admin_guard],
    summary="Toggle user active status",
)
async def update_user_status(
    id: UUID,
    payload: AdminUserUpdateStatusPayload,
    current_user: CurrentUser,
    db: DbSession,
    request: Request,
) -> UserRead:
    service = AdminService(db)
    return await service.update_user_status(
        admin_user=current_user,
        target_user_id=id,
        is_active=payload.is_active,
        ip_address=request.client.host if request.client else None,
    )


@router.delete(
    "/users/{id}",
    status_code=status.HTTP_200_OK,
    dependencies=[super_admin_guard],
    summary="Delete user account (SUPER_ADMIN only)",
)
async def delete_user(
    id: UUID,
    current_user: CurrentUser,
    db: DbSession,
    request: Request,
) -> dict:
    service = AdminService(db)
    await service.delete_user(
        admin_user=current_user,
        target_user_id=id,
        ip_address=request.client.host if request.client else None,
    )
    return {"message": f"User '{id}' was deleted successfully."}


@router.get(
    "/audit-logs",
    response_model=List[AuditLogResponse],
    status_code=status.HTTP_200_OK,
    dependencies=[admin_guard],
    summary="List administrative audit logs",
)
async def list_audit_logs(
    db: DbSession,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> List[AuditLogResponse]:
    service = AdminService(db)
    return await service.list_audit_logs(limit=limit, offset=offset)


@router.get(
    "/reports",
    response_model=AdminReportSummaryResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[admin_guard],
    summary="Get system executive summary report",
)
async def get_reports_summary(
    db: DbSession,
) -> AdminReportSummaryResponse:
    service = AdminService(db)
    metrics_data = await service.get_metrics()
    logs = await service.list_audit_logs(limit=10, offset=0)
    return AdminReportSummaryResponse(
        metrics=AdminDashboardMetricsResponse(**metrics_data),
        recent_audit_logs=logs,
        system_health="HEALTHY",
    )
