"""
Repository layer for Admin & Audit Logging.
"""

from typing import List, Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.admin.models import AuditLog
from app.domains.appointments.models import Appointment, AppointmentStatus
from app.domains.orders.models import Order
from app.domains.subscriptions.models import Subscription
from app.domains.therapists.models import TherapistProfile
from app.domains.users.models import User, UserRole


class AdminRepository:
    """Encapsulates aggregate metrics, user administration, and audit logs."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_metrics(self) -> dict:
        # Total users count
        u_res = await self.db.execute(select(func.count(User.id)))
        total_users = u_res.scalar_one() or 0

        # Active patients count
        p_res = await self.db.execute(
            select(func.count(User.id))
            .where(User.role == UserRole.PATIENT)
            .where(User.is_active.is_(True))
        )
        active_patients = p_res.scalar_one() or 0

        # Active therapists count
        t_res = await self.db.execute(
            select(func.count(TherapistProfile.id))
            .where(TherapistProfile.is_active.is_(True))
        )
        active_therapists = t_res.scalar_one() or 0

        # Total & Completed appointments count
        apt_tot = await self.db.execute(select(func.count(Appointment.id)))
        total_appointments = apt_tot.scalar_one() or 0

        apt_comp = await self.db.execute(
            select(func.count(Appointment.id)).where(
                Appointment.status == AppointmentStatus.COMPLETED
            )
        )
        completed_appointments = apt_comp.scalar_one() or 0

        # Program enrollments / Paid orders count
        ord_res = await self.db.execute(
            select(func.count(Order.id)).where(Order.status == "PAID")
        )
        program_enrollments = ord_res.scalar_one() or 0

        # Total revenue calculation from paid orders
        rev_res = await self.db.execute(
            select(func.sum(Order.total_amount)).where(Order.status == "PAID")
        )
        revenue = float(rev_res.scalar_one() or 0.0)

        # Active subscriptions count
        sub_res = await self.db.execute(
            select(func.count(Subscription.id)).where(
                Subscription.status == "ACTIVE"
            )
        )
        active_subscriptions = sub_res.scalar_one() or 0

        return {
            "total_users": total_users,
            "active_patients": active_patients,
            "active_therapists": active_therapists,
            "total_appointments": total_appointments,
            "completed_appointments": completed_appointments,
            "program_enrollments": program_enrollments,
            "revenue": revenue,
            "active_subscriptions": active_subscriptions,
        }

    async def create_audit_log(self, audit_log: AuditLog) -> AuditLog:
        self.db.add(audit_log)
        await self.db.commit()
        await self.db.refresh(audit_log)
        return audit_log

    async def list_audit_logs(self, limit: int = 50, offset: int = 0) -> List[AuditLog]:
        query = (
            select(AuditLog)
            .order_by(AuditLog.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def list_users(
        self,
        search: Optional[str] = None,
        role: Optional[UserRole] = None,
        is_active: Optional[bool] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[User]:
        query = select(User)

        if search:
            search_pattern = f"%{search}%"
            query = query.where(
                (User.email.ilike(search_pattern))
                | (User.first_name.ilike(search_pattern))
                | (User.last_name.ilike(search_pattern))
            )

        if role:
            query = query.where(User.role == role)

        if is_active is not None:
            query = query.where(User.is_active == is_active)

        query = query.order_by(User.created_at.desc()).offset(offset).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())
