"""create notifications, subscriptions, orders, payments, exercises, treatment_plans, assessments, progress, and audit_logs tables

Revision ID: 0004_create_remaining_tables
Revises: 0003_create_appointments
Create Date: 2026-10-01 14:35:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0004_create_remaining_tables'
down_revision: Union[str, None] = '0003_create_appointments'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Notifications table
    op.create_table(
        'notifications',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('channel', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='PENDING'),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('deduplication_key', sa.String(length=255), nullable=True),
        sa.Column('retry_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('max_retries', sa.Integer(), nullable=False, server_default='3'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('sent_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('read_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_notifications_user_id_users'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_notifications'))
    )
    op.create_index(op.f('ix_notifications_user_id'), 'notifications', ['user_id'], unique=False)
    op.create_index(op.f('ix_notifications_deduplication_key'), 'notifications', ['deduplication_key'], unique=True)

    # 2. Exercises table
    op.create_table(
        'exercises',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('difficulty', sa.String(length=50), nullable=False),
        sa.Column('video_url', sa.String(length=500), nullable=True),
        sa.Column('thumbnail_url', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_exercises'))
    )

    # 3. Orders table
    op.create_table(
        'orders',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('program_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('total_amount', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(length=10), nullable=False, server_default='USD'),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='PENDING'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['patient_id'], ['users.id'], name=op.f('fk_orders_patient_id_users'), ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['program_id'], ['programs.id'], name=op.f('fk_orders_program_id_programs'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_orders'))
    )
    op.create_index(op.f('ix_orders_patient_id'), 'orders', ['patient_id'], unique=False)

    # 4. Payments table
    op.create_table(
        'payments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('order_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('provider', sa.String(length=50), nullable=False),
        sa.Column('provider_payment_id', sa.String(length=255), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(length=10), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('idempotency_key', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], name=op.f('fk_payments_order_id_orders'), ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['patient_id'], ['users.id'], name=op.f('fk_payments_patient_id_users'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_payments'))
    )
    op.create_index(op.f('ix_payments_order_id'), 'payments', ['order_id'], unique=False)
    op.create_index(op.f('ix_payments_patient_id'), 'payments', ['patient_id'], unique=False)

    # 5. Payment Events table
    op.create_table(
        'payment_events',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('payment_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('provider', sa.String(length=50), nullable=False),
        sa.Column('payload', sa.Text(), nullable=False),
        sa.Column('processed_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['payment_id'], ['payments.id'], name=op.f('fk_payment_events_payment_id_payments'), ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_payment_events'))
    )

    # 6. Subscriptions table
    op.create_table(
        'subscriptions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('program_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='ACTIVE'),
        sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('cancelled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['patient_id'], ['users.id'], name=op.f('fk_subscriptions_patient_id_users'), ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['program_id'], ['programs.id'], name=op.f('fk_subscriptions_program_id_programs'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_subscriptions'))
    )
    op.create_index(op.f('ix_subscriptions_patient_id'), 'subscriptions', ['patient_id'], unique=False)

    # 7. Treatment Plans table
    op.create_table(
        'treatment_plans',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('therapist_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='ACTIVE'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['patient_id'], ['users.id'], name=op.f('fk_treatment_plans_patient_id_users'), ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['therapist_id'], ['therapist_profiles.id'], name=op.f('fk_treatment_plans_therapist_id_therapist_profiles'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_treatment_plans'))
    )

    # 8. Treatment Plan Exercises table
    op.create_table(
        'treatment_plan_exercises',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('treatment_plan_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('exercise_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('reps', sa.Integer(), nullable=False, server_default='10'),
        sa.Column('sets', sa.Integer(), nullable=False, server_default='3'),
        sa.Column('frequency_per_week', sa.Integer(), nullable=False, server_default='7'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['exercise_id'], ['exercises.id'], name=op.f('fk_treatment_plan_exercises_exercise_id_exercises'), ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['treatment_plan_id'], ['treatment_plans.id'], name=op.f('fk_treatment_plan_exercises_treatment_plan_id_treatment_plans'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_treatment_plan_exercises'))
    )

    # 9. Exercise Completion Logs table
    op.create_table(
        'exercise_completion_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('treatment_plan_exercise_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('pain_score', sa.Integer(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['patient_id'], ['users.id'], name=op.f('fk_exercise_completion_logs_patient_id_users'), ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['treatment_plan_exercise_id'], ['treatment_plan_exercises.id'], name=op.f('fk_exercise_completion_logs_tpe_id'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_exercise_completion_logs'))
    )

    # 10. Assessments table
    op.create_table(
        'assessments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('therapist_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('assessment_type', sa.String(length=100), nullable=False),
        sa.Column('score', sa.Float(), nullable=True),
        sa.Column('data', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['patient_id'], ['users.id'], name=op.f('fk_assessments_patient_id_users'), ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['therapist_id'], ['therapist_profiles.id'], name=op.f('fk_assessments_therapist_id_therapist_profiles'), ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_assessments'))
    )

    # 11. Progress Records table
    op.create_table(
        'progress_records',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('pain_level', sa.Integer(), nullable=False),
        sa.Column('mobility_score', sa.Float(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('recorded_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['patient_id'], ['users.id'], name=op.f('fk_progress_records_patient_id_users'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_progress_records'))
    )

    # 12. Goal Progress table
    op.create_table(
        'goal_progress',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('target_value', sa.Float(), nullable=False),
        sa.Column('current_value', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('is_achieved', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['patient_id'], ['users.id'], name=op.f('fk_goal_progress_patient_id_users'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_goal_progress'))
    )

    # 13. Audit Logs table
    op.create_table(
        'audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('action', sa.String(length=255), nullable=False),
        sa.Column('entity_type', sa.String(length=100), nullable=False),
        sa.Column('entity_id', sa.String(length=255), nullable=True),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_audit_logs_user_id_users'), ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_audit_logs'))
    )


def downgrade() -> None:
    op.drop_table('audit_logs')
    op.drop_table('goal_progress')
    op.drop_table('progress_records')
    op.drop_table('assessments')
    op.drop_table('exercise_completion_logs')
    op.drop_table('treatment_plan_exercises')
    op.drop_table('treatment_plans')
    op.drop_table('subscriptions')
    op.drop_table('payment_events')
    op.drop_table('payments')
    op.drop_table('orders')
    op.drop_table('exercises')
    op.drop_table('notifications')
