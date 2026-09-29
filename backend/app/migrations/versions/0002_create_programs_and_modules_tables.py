"""create programs and program_modules tables

Revision ID: 0002_create_programs
Revises: 0001_create_auth_and_user
Create Date: 2026-09-28 22:17:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0002_create_programs'
down_revision: Union[str, None] = '0001_create_auth_and_user'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create programs table
    op.create_table(
        'programs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('duration', sa.String(length=50), nullable=False),
        sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False, server_default='0.0'),
        sa.Column('thumbnail_url', sa.String(length=500), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_programs'))
    )
    op.create_index(op.f('ix_programs_category'), 'programs', ['category'], unique=False)
    op.create_index(op.f('ix_programs_is_active'), 'programs', ['is_active'], unique=False)
    op.create_index(op.f('ix_programs_name'), 'programs', ['name'], unique=False)
    op.create_index(op.f('ix_programs_slug'), 'programs', ['slug'], unique=True)

    # Create program_modules table
    op.create_table(
        'program_modules',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('program_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['program_id'], ['programs.id'], name=op.f('fk_program_modules_program_id_programs'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_program_modules'))
    )
    op.create_index(op.f('ix_program_modules_program_id'), 'program_modules', ['program_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_program_modules_program_id'), table_name='program_modules')
    op.drop_table('program_modules')

    op.drop_index(op.f('ix_programs_slug'), table_name='programs')
    op.drop_index(op.f('ix_programs_name'), table_name='programs')
    op.drop_index(op.f('ix_programs_is_active'), table_name='programs')
    op.drop_index(op.f('ix_programs_category'), table_name='programs')
    op.drop_table('programs')
