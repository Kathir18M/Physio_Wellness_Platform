"""
AI Client abstraction with timeout handling, exponential retries, logging, and fallback execution.
"""

import asyncio
from abc import ABC, abstractmethod
from typing import Optional

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class BaseAIClient(ABC):
    """Abstract base client for AI integration."""

    @abstractmethod
    async def generate_text(self, prompt: str) -> str:
        """Send prompt to AI model and return response string."""
        pass


class MockAIClient(BaseAIClient):
    """Mock AI Client for development, testing, and error fallback."""

    async def generate_text(self, prompt: str) -> str:
        logger.info("[Mock AI Client] Processing prompt request...")
        await asyncio.sleep(0.05)  # Simulate network latency

        if "landmarks" in prompt.lower() or "posture" in prompt.lower():
            return (
                "Posture Analysis Summary:\n"
                "- Head Alignment: Slight forward tilt (approx 8°).\n"
                "- Shoulder Symmetry: Even shoulder level balance (0.5° delta).\n"
                "- Pelvic Tilt: Neutral pelvic spine alignment.\n"
                "Form Recommendations: Maintain chest lift during squats and engage core stability."
            )
        elif "question" in prompt.lower() or "exercise" in prompt.lower():
            return (
                "For your assigned pelvic tilt exercises, remember to exhale as you flatten your lower back against the mat. "
                "Keep movements slow and controlled. If you experience sharp pain, stop immediately and contact your physical therapist."
            )
        elif "weekly" in prompt.lower() or "progress" in prompt.lower():
            return (
                "Weekly Progress Summary:\n"
                "- Exercise Completion Rate: 85% compliance.\n"
                "- Pain Score Trend: Reduced from 6/10 to 3/10 over the past 7 days.\n"
                "- Mobility Gains: Improved lumbar flexion and core endurance."
            )
        else:
            return "AI Assistant support response ready."


class ResilientAIClient(BaseAIClient):
    """Wraps an AI client implementation with timeout handling, retries, and fallback."""

    def __init__(
        self,
        wrapped_client: BaseAIClient,
        fallback_client: BaseAIClient,
        timeout_seconds: int = 15,
        max_retries: int = 3,
    ):
        self.wrapped = wrapped_client
        self.fallback = fallback_client
        self.timeout_seconds = timeout_seconds
        self.max_retries = max_retries

    async def generate_text(self, prompt: str) -> str:
        for attempt in range(1, self.max_retries + 1):
            try:
                logger.info("Dispatching AI prompt (attempt %d/%d)", attempt, self.max_retries)
                response = await asyncio.wait_for(
                    self.wrapped.generate_text(prompt),
                    timeout=self.timeout_seconds,
                )
                return response
            except asyncio.TimeoutError:
                logger.warning("AI provider call timed out after %ds (attempt %d)", self.timeout_seconds, attempt)
            except Exception as exc:
                logger.error("AI provider error on attempt %d: %s", attempt, exc)

            if attempt < self.max_retries:
                await asyncio.sleep(2 ** (attempt - 1))  # Exponential backoff: 1s, 2s...

        logger.warning("All AI retries failed or timed out. Switching to fallback client execution.")
        return await self.fallback.generate_text(prompt)


def get_ai_client() -> BaseAIClient:
    """Factory function for returning resilient AI client instance."""
    mock = MockAIClient()
    return ResilientAIClient(
        wrapped_client=mock,
        fallback_client=mock,
        timeout_seconds=settings.AI_TIMEOUT_SECONDS,
        max_retries=settings.AI_MAX_RETRIES,
    )
