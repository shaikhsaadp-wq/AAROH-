"""
AAROH AI — Mock AI Provider (Phase 1)

This provider returns simulated responses with zero external API calls and
zero cost.  It is the default for local development.

IMPORTANT: These are simulated responses.  This provider does NOT connect
to any real AI model.  Replace with claude.py / gemini.py / openai.py
in Phase 2 when real AI integration begins.
"""
from __future__ import annotations

import asyncio
import random
from datetime import datetime, timezone
from typing import AsyncIterator

from app.core.logging import get_logger

logger = get_logger(__name__)

_SIMULATED_RESPONSES = [
    "I've received your request and I'm processing it now. [SIMULATED — Mock AI Provider]",
    "Understood. I'll coordinate with the relevant department. [SIMULATED — Mock AI Provider]",
    "Task acknowledged and added to the queue. [SIMULATED — Mock AI Provider]",
    "Analysis complete. The team is ready to execute. [SIMULATED — Mock AI Provider]",
    "Great question. Let me delegate this to the appropriate agent. [SIMULATED — Mock AI Provider]",
]


class MockAIProvider:
    """Zero-cost simulated AI provider for Phase 1 development."""

    name = "mock"
    model = "mock-v1"
    is_simulated = True

    async def complete(self, messages: list[dict], **kwargs: object) -> dict:
        await asyncio.sleep(0.3)  # Simulate latency
        response = random.choice(_SIMULATED_RESPONSES)
        logger.info("MockAIProvider.complete called — returning simulated response")
        return {
            "content": response,
            "model": self.model,
            "provider": self.name,
            "is_simulated": True,
            "tokens_used": len(response.split()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    async def stream(self, messages: list[dict], **kwargs: object) -> AsyncIterator[str]:
        response = random.choice(_SIMULATED_RESPONSES)
        words = response.split()
        for word in words:
            await asyncio.sleep(0.05)
            yield word + " "

    def health(self) -> dict:
        return {"status": "ok", "provider": self.name, "is_simulated": True}


# Singleton
mock_provider = MockAIProvider()

