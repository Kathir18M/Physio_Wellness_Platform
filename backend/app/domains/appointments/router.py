"""
Appointments API router.
"""

from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Sequence

from fastapi import APIRouter, Depends, Query, status

from app.domains.appointments.schemas import (
    AppointmentCreate,
    AppointmentRead,
    AppointmentUpdate,
    TimeSlot,
)
from app.domains.appointments.service import AppointmentService
from app.shared.dependencies.auth import CurrentUser
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.get(
    "/slots",
    response_model=list[TimeSlot],
    status_code=status.HTTP_200_OK,
    summary="Get available appointment slots for a therapist and date",
)
async def get_available_slots(
    db: DbSession,
    therapist_id: uuid.UUID = Query(...),
    date_val: date = Query(..., alias="date", description="Target date YYYY-MM-DD"),
) -> Sequence[TimeSlot]:

    """Public query endpoint to list non-conflicting time slots for a therapist."""
    service = AppointmentService(db)
    return await service.generate_available_slots(therapist_id, date_val)


@router.post(
    "",
    response_model=AppointmentRead,
    status_code=status.HTTP_201_CREATED,
    summary="Book a new appointment",
)
async def book_appointment(
    data: AppointmentCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> AppointmentRead:
    """Book an appointment with atomic row locking and double-booking prevention."""
    service = AppointmentService(db)
    appointment = await service.book_appointment(current_user, data)
    return AppointmentRead.model_validate(appointment)


@router.get(
    "/me",
    response_model=list[AppointmentRead],
    status_code=status.HTTP_200_OK,
    summary="List appointments for current user",
)
async def list_my_appointments(
    current_user: CurrentUser,
    db: DbSession,
) -> Sequence[AppointmentRead]:
    """List caller's appointments (Patient or Therapist view)."""
    service = AppointmentService(db)
    appointments = await service.list_user_appointments(current_user)
    return [AppointmentRead.model_validate(a) for a in appointments]


@router.get(
    "/{id}",
    response_model=AppointmentRead,
    status_code=status.HTTP_200_OK,
    summary="Get appointment details",
)
async def get_appointment(
    id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> AppointmentRead:
    """Fetch specific appointment details if authorized."""
    service = AppointmentService(db)
    appointment = await service.get_appointment_by_id(id, current_user)
    return AppointmentRead.model_validate(appointment)


@router.patch(
    "/{id}",
    response_model=AppointmentRead,
    status_code=status.HTTP_200_OK,
    summary="Reschedule appointment",
)
async def reschedule_appointment(
    id: uuid.UUID,
    data: AppointmentUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> AppointmentRead:
    """Reschedule an existing appointment."""
    service = AppointmentService(db)
    appointment = await service.reschedule_appointment(id, current_user, data)
    return AppointmentRead.model_validate(appointment)


@router.post(
    "/{id}/cancel",
    response_model=AppointmentRead,
    status_code=status.HTTP_200_OK,
    summary="Cancel appointment",
)
async def cancel_appointment(
    id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> AppointmentRead:
    """Cancel an appointment."""
    service = AppointmentService(db)
    appointment = await service.cancel_appointment(id, current_user)
    return AppointmentRead.model_validate(appointment)
