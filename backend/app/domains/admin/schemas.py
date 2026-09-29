"""
Pydantic schemas for Admin & Audit Logging domain.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.domains.users.models import UserRole


class AdminDashboardMetricsResponse(BaseModel):
    total_users: int
    active_patients: int
    active_therapists: int
    total_appointments: int
    completed_appointments: int
    program_enrollments: int
    revenue: float
    active_subscriptions: int


class AuditLogResponse(BaseModel):
    id: UUID
    admin_id: Optional[UUID] = None
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminUserUpdateRolePayload(BaseModel):
    role: UserRole


class AdminUserUpdateStatusPayload(BaseModel):
    is_active: bool


class AdminReportSummaryResponse(BaseModel):
    metrics: AdminDashboardMetricsResponse
    recent_audit_logs: List[AuditLogResponse]
    system_health: str = "HEALTHY"
