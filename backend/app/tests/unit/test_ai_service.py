"""
Unit tests for AI Integration Service, Safeguards, and Resilient Client.
"""

from unittest.mock import AsyncMock

import pytest

from app.integrations.ai.client import MockAIClient, ResilientAIClient
from app.integrations.ai.prompts import CLINICAL_DISCLAIMER, sanitize_pii
from app.integrations.ai.service import AIService


def test_pii_sanitization():
    raw_text = "My email is patient.john@example.com and phone is +1-555-0199."
    sanitized = sanitize_pii(raw_text)
    assert "[REDACTED_EMAIL]" in sanitized
    assert "[REDACTED_PHONE]" in sanitized
    assert "patient.john@example.com" not in sanitized
    assert "+1-555-0199" not in sanitized


@pytest.mark.asyncio
async def test_posture_analysis_pipeline():
    ai_service = AIService()
    landmarks = {"shoulder_left": {"x": 0.5, "y": 0.2}, "shoulder_right": {"x": 0.52, "y": 0.21}}
    metrics = {"shoulder_asymmetry_deg": 1.5, "head_tilt_angle_deg": 4.0}

    result = await ai_service.analyze_posture(landmarks=landmarks, movement_metrics=metrics)

    assert result.alignment_score > 0
    assert result.shoulder_asymmetry_deg == 1.5
    assert result.disclaimer == CLINICAL_DISCLAIMER
    assert "DOES NOT constitute a medical diagnosis" in result.disclaimer


@pytest.mark.asyncio
async def test_exercise_assistant_safeguard():
    ai_service = AIService()
    question = "Can I double my squat reps to speed up knee recovery? My contact is user@test.com"

    result = await ai_service.ask_exercise_assistant(patient_question=question)

    assert result.response_text is not None
    assert "stop the exercise" in result.safety_guidance.lower()
    assert result.disclaimer == CLINICAL_DISCLAIMER


@pytest.mark.asyncio
async def test_progress_summary_generation():
    ai_service = AIService()
    metrics = {"exercise_completion_rate": 90.0, "pain_trend": "IMPROVING"}
    records = [{"day": "Mon", "pain_score": 4}]

    result = await ai_service.generate_progress_summary(metrics=metrics, weekly_records=records)

    assert result.compliance_score == 90.0
    assert len(result.key_milestones) > 0
    assert result.disclaimer == CLINICAL_DISCLAIMER


@pytest.mark.asyncio
async def test_resilient_ai_client_fallback():
    failing_client = AsyncMock()
    failing_client.generate_text.side_effect = Exception("API Unavailable")

    fallback_client = MockAIClient()

    resilient_client = ResilientAIClient(
        wrapped_client=failing_client,
        fallback_client=fallback_client,
        timeout_seconds=1,
        max_retries=2,
    )

    response = await resilient_client.generate_text("Test posture prompt")
    assert response is not None
    assert "Posture Analysis Summary" in response
