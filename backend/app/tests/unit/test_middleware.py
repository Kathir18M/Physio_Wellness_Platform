"""
Unit tests for RequestIDMiddleware and LoggingMiddleware.
"""

from fastapi.testclient import TestClient

from app.core.constants import REQUEST_ID_HEADER


def test_request_id_middleware_generates_id(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert REQUEST_ID_HEADER in response.headers
    # Re-sending header reuses it
    req_id = "test-req-id-12345"
    response2 = client.get("/health", headers={REQUEST_ID_HEADER: req_id})
    assert response2.headers[REQUEST_ID_HEADER] == req_id
