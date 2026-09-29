"""
Datetime utility helpers.

Provides timezone-aware helpers so the application never accidentally
works with naïve datetimes.
"""

from __future__ import annotations

from datetime import date, datetime, timezone

from app.core.constants import DATE_FORMAT, ISO_FORMAT


def utc_now() -> datetime:
    """Return the current UTC time as a timezone-aware datetime."""
    return datetime.now(timezone.utc)


now_utc = utc_now


def to_iso(dt: datetime) -> str:
    """Format a datetime to ISO 8601 string (``YYYY-MM-DDTHH:MM:SSZ``)."""
    return dt.strftime(ISO_FORMAT)


format_iso = to_iso


def from_iso(iso_string: str) -> datetime:
    """Parse an ISO 8601 string back to a timezone-aware datetime."""
    dt = datetime.fromisoformat(iso_string.replace("Z", "+00:00"))
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


parse_iso = from_iso


def format_date(d: date) -> str:
    """Format a date to ``YYYY-MM-DD`` string."""
    return d.strftime(DATE_FORMAT)


def start_of_day(dt_or_date: datetime | date) -> datetime:
    """Return midnight (00:00:00) of the given date in UTC."""
    return datetime(
        dt_or_date.year, dt_or_date.month, dt_or_date.day, tzinfo=timezone.utc
    )


def end_of_day(dt_or_date: datetime | date) -> datetime:
    """Return 23:59:59.999999 of the given date in UTC."""
    return datetime(
        dt_or_date.year,
        dt_or_date.month,
        dt_or_date.day,
        23,
        59,
        59,
        999999,
        tzinfo=timezone.utc,
    )


def get_day_bounds(dt_or_date: datetime | date) -> tuple[datetime, datetime]:
    """Return a (start_of_day, end_of_day) tuple for the given date."""
    return start_of_day(dt_or_date), end_of_day(dt_or_date)
