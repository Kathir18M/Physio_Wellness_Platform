"""
Unit tests for pagination and datetime utility helpers.
"""

from datetime import date, datetime, timezone

from app.shared.utils.datetime import (
    format_iso,
    get_day_bounds,
    now_utc,
    parse_iso,
)
from app.shared.utils.pagination import PaginatedResponse, PaginationParams


def test_datetime_now_utc() -> None:
    now = now_utc()
    assert now.tzinfo == timezone.utc


def test_iso_format_and_parse() -> None:
    dt = datetime(2026, 9, 28, 12, 0, 0, tzinfo=timezone.utc)
    iso_str = format_iso(dt)
    parsed = parse_iso(iso_str)
    assert parsed == dt


def test_get_day_bounds() -> None:
    d = date(2026, 9, 28)
    start, end = get_day_bounds(d)
    assert start == datetime(2026, 9, 28, 0, 0, 0, tzinfo=timezone.utc)
    assert end == datetime(2026, 9, 28, 23, 59, 59, 999999, tzinfo=timezone.utc)


def test_pagination_params_offset() -> None:
    params = PaginationParams(page=3, page_size=20)
    assert params.offset == 40


def test_paginated_response() -> None:
    resp = PaginatedResponse.create(
        items=["item1", "item2"],
        total=5,
        params=PaginationParams(page=1, page_size=2),
    )
    assert resp.total == 5
    assert resp.total_pages == 3
    assert resp.has_next is True
    assert resp.has_prev is False
