"""
Unit tests for database models, mixins, and configuration.
"""

from sqlalchemy import inspect
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class DummyModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "dummy_test_table"

    name: Mapped[str] = mapped_column()


def test_uuid_primary_key_mixin() -> None:
    mapper = inspect(DummyModel)
    pk_column = mapper.primary_key[0]
    assert pk_column.name == "id"
    assert pk_column.primary_key is True


def test_timestamp_mixin_columns() -> None:
    mapper = inspect(DummyModel)
    column_names = [col.name for col in mapper.columns]
    assert "created_at" in column_names
    assert "updated_at" in column_names
    assert mapper.columns["created_at"].nullable is False
    assert mapper.columns["updated_at"].nullable is False
