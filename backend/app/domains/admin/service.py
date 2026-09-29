"""
Service layer for Admin & Audit Logging.
"""

from typing import Any, Dict, List, Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.admin.models import AuditLog
from app.domains.admin.repository import AdminRepository
from app.domains.users.models import User, UserRole
from app.domains.users.repository import UserRepository
from app.shared.exceptions import ForbiddenException, NotFoundException


class AdminService:
    """Business logic for administrative management, metrics aggregation, and audit logging."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = AdminRepository(db)
        self.user_repo = UserRepository(db)

    async def get_metrics(self) -> dict:
        return await self.repository.get_dashboard_metrics()

    async def log_action(
        self,
        admin_id: UUID,
        action: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
    ) -> AuditLog:
        audit_entry = AuditLog(
            admin_id=admin_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address,
        )
        return await self.repository.create_audit_log(audit_entry)

    async def list_users(
        self,
        search: Optional[str] = None,
        role: Optional[UserRole] = None,
        is_active: Optional[bool] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[User]:
        return await self.repository.list_users(
            search=search,
            role=role,
            is_active=is_active,
            limit=limit,
            offset=offset,
        )

    async def update_user_role(
        self,
        admin_user: User,
        target_user_id: UUID,
        new_role: UserRole,
        ip_address: Optional[str] = None,
    ) -> User:
        if admin_user.role != UserRole.SUPER_ADMIN:
            raise ForbiddenException("Only SUPER_ADMIN users can modify user role permissions.")

        target_user = await self.user_repo.get_by_id(target_user_id)
        if not target_user:
            raise NotFoundException(f"User '{target_user_id}' not found.")

        old_role = target_user.role
        target_user.role = new_role
        await self.db.commit()
        await self.db.refresh(target_user)

        await self.log_action(
            admin_id=admin_user.id,
            action="UPDATE_USER_ROLE",
            resource_type="USER",
            resource_id=str(target_user.id),
            details={"old_role": old_role.value, "new_role": new_role.value},
            ip_address=ip_address,
        )

        return target_user

    async def update_user_status(
        self,
        admin_user: User,
        target_user_id: UUID,
        is_active: bool,
        ip_address: Optional[str] = None,
    ) -> User:
        target_user = await self.user_repo.get_by_id(target_user_id)
        if not target_user:
            raise NotFoundException(f"User '{target_user_id}' not found.")

        old_status = target_user.is_active
        target_user.is_active = is_active
        await self.db.commit()
        await self.db.refresh(target_user)

        await self.log_action(
            admin_id=admin_user.id,
            action="TOGGLE_USER_STATUS",
            resource_type="USER",
            resource_id=str(target_user.id),
            details={"old_status": old_status, "new_status": is_active},
            ip_address=ip_address,
        )

        return target_user

    async def delete_user(
        self,
        admin_user: User,
        target_user_id: UUID,
        ip_address: Optional[str] = None,
    ) -> bool:
        if admin_user.role != UserRole.SUPER_ADMIN:
            raise ForbiddenException("Only SUPER_ADMIN users can delete accounts.")

        target_user = await self.user_repo.get_by_id(target_user_id)
        if not target_user:
            raise NotFoundException(f"User '{target_user_id}' not found.")

        user_email = target_user.email
        await self.db.delete(target_user)
        await self.db.commit()

        await self.log_action(
            admin_id=admin_user.id,
            action="DELETE_USER",
            resource_type="USER",
            resource_id=str(target_user_id),
            details={"deleted_user_email": user_email},
            ip_address=ip_address,
        )

        return True

    async def list_audit_logs(self, limit: int = 50, offset: int = 0) -> List[AuditLog]:
        return await self.repository.list_audit_logs(limit=limit, offset=offset)
