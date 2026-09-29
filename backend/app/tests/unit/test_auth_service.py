"""
Unit tests for core security hashing and JWT utilities.
"""

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


def test_password_hashing() -> None:
    raw_pwd = "SecretPassword123!"
    hashed = hash_password(raw_pwd)
    assert hashed != raw_pwd
    assert verify_password(raw_pwd, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_access_token_cycle() -> None:
    user_id = "11111111-2222-3333-4444-555555555555"
    token = create_access_token(subject=user_id, role="PATIENT")
    payload = decode_token(token)
    assert payload["sub"] == user_id
    assert payload["role"] == "PATIENT"
    assert payload["type"] == "access"


def test_jwt_refresh_token_cycle() -> None:
    user_id = "11111111-2222-3333-4444-555555555555"
    token, expires = create_refresh_token(subject=user_id)
    payload = decode_token(token)
    assert payload["sub"] == user_id
    assert payload["type"] == "refresh"
    assert "jti" in payload
