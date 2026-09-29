"""
Email provider base class interface.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional


class BaseEmailProvider(ABC):
    """Abstract interface for Email service providers."""

    @abstractmethod
    async def send_email(
        self,
        to_email: str,
        subject: str,
        body_text: str,
        body_html: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """Send an email to specified recipient."""
        pass
