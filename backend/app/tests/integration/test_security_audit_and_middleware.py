"""
Integration tests for Security headers, Request ID middleware, and Input Validation.
"""

def test_request_id_middleware_header(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert "x-request-id" in res.headers
    assert res.json()["status"] in ["healthy", "degraded"]


def test_input_validation_failure_payload(client):
    # Invalid registration payload (missing required fields)
    invalid_payload = {"email": "not-an-email"}
    res = client.post("/api/v1/auth/register", json=invalid_payload)
    assert res.status_code == 422  # Pydantic validation failure
