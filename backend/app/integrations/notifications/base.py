"""
Base notification provider interface.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional


class BaseNotificationProvider(ABC):
    """Abstract Base Class for Notification Channel Providers."""

    @abstractmethod
    async def send(
        self,
        recipient: str,
        subject: str,
        message: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """
        Send a notification to a recipient via this channel.

        Returns True if successful, False if delivery failed.
        """
        pass
