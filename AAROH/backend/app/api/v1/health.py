"""
AAROH AI — Health & System Endpoints
"""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.config import settings
from app.core.logging import get_logger
from app.schemas.schemas import HealthResponse

logger = get_logger(__name__)
router = APIRouter(tags=["system"])


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Returns the current health status of the AAROH AI backend.
    Use this endpoint to verify the server is running correctly.
    """
    logger.info("Health check requested")
    return HealthResponse(
        status="ok",
        version=settings.app_version,
        environment=settings.app_env,
        ai_provider=settings.primary_ai_provider,
        is_simulated=settings.primary_ai_provider == "mock",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/", include_in_schema=False)
async def root() -> dict:
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/health",
    }

