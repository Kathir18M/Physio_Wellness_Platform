"""create clinics, therapist_profiles, therapist_availabilities, and appointments tables

Revision ID: 0003_create_appointments
Revises: 0002_create_programs
Create Date: 2026-09-28 22:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0003_create_appointments'
down_revision: Union[str, None] = '0002_create_programs'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create Enums
    appointment_type_enum = postgresql.ENUM('ONLINE', 'CLINIC', name='appointment_type', create_type=False)
    appointment_type_enum.create(op.get_bind(), checkfirst=True)

    appointment_status_enum = postgresql.ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', name='appointment_status', create_type=False)
    appointment_status_enum.create(op.get_bind(), checkfirst=True)

    # Create clinics table
    op.create_table(
        'clinics',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('address', sa.String(length=255), nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_clinics'))
    )
    op.create_index(op.f('ix_clinics_city'), 'clinics', ['city'], unique=False)
    op.create_index(op.f('ix_clinics_is_active'), 'clinics', ['is_active'], unique=False)
    op.create_index(op.f('ix_clinics_name'), 'clinics', ['name'], unique=False)

    # Create therapist_profiles table
    op.create_table(
        'therapist_profiles',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('clinic_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('specialties', sa.String(length=500), nullable=True),
        sa.Column('is_accepting_patients', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['clinic_id'], ['clinics.id'], name=op.f('fk_therapist_profiles_clinic_id_clinics'), ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_therapist_profiles_user_id_users'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_therapist_profiles')),
        sa.UniqueConstraint('user_id', name=op.f('uq_therapist_profiles_user_id'))
    )
    op.create_index(op.f('ix_therapist_profiles_clinic_id'), 'therapist_profiles', ['clinic_id'], unique=False)
    op.create_index(op.f('ix_therapist_profiles_is_accepting_patients'), 'therapist_profiles', ['is_accepting_patients'], unique=False)
    op.create_index(op.f('ix_therapist_profiles_user_id'), 'therapist_profiles', ['user_id'], unique=True)

    # Create therapist_availabilities table
    op.create_table(
        'therapist_availabilities',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('therapist_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('day_of_week', sa.Integer(), nullable=False),
        sa.Column('start_time', sa.String(length=10), nullable=False),
        sa.Column('end_time', sa.String(length=10), nullable=False),
        sa.Column('slot_duration_minutes', sa.Integer(), nullable=False, server_default='45'),
        sa.Column('is_available', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['therapist_id'], ['therapist_profiles.id'], name=op.f('fk_therapist_availabilities_therapist_id_therapist_profiles'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_therapist_availabilities'))
    )
    op.create_index(op.f('ix_therapist_availabilities_day_of_week'), 'therapist_availabilities', ['day_of_week'], unique=False)
    op.create_index(op.f('ix_therapist_availabilities_therapist_id'), 'therapist_availabilities', ['therapist_id'], unique=False)

    # Create appointments table
    op.create_table(
        'appointments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('therapist_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('clinic_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('appointment_type', sa.Enum('ONLINE', 'CLINIC', name='appointment_type'), nullable=False),
        sa.Column('start_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('end_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', name='appointment_status'), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['clinic_id'], ['clinics.id'], name=op.f('fk_appointments_clinic_id_clinics'), ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['patient_id'], ['users.id'], name=op.f('fk_appointments_patient_id_users'), ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['therapist_id'], ['therapist_profiles.id'], name=op.f('fk_appointments_therapist_id_therapist_profiles'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_appointments'))
    )
    op.create_index(op.f('ix_appointments_clinic_id'), 'appointments', ['clinic_id'], unique=False)
    op.create_index(op.f('ix_appointments_end_time'), 'appointments', ['end_time'], unique=False)
    op.create_index(op.f('ix_appointments_patient_id'), 'appointments', ['patient_id'], unique=False)
    op.create_index(op.f('ix_appointments_start_time'), 'appointments', ['start_time'], unique=False)
    op.create_index(op.f('ix_appointments_status'), 'appointments', ['status'], unique=False)
    op.create_index(op.f('ix_appointments_therapist_id'), 'appointments', ['therapist_id'], unique=False)


def downgrade() -> None:
    op.drop_table('appointments')
    op.drop_table('therapist_availabilities')
    op.drop_table('therapist_profiles')
    op.drop_table('clinics')

    op.execute('DROP TYPE IF EXISTS appointment_status')
    op.execute('DROP TYPE IF EXISTS appointment_type')
