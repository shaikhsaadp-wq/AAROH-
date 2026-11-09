"""
AAROH AI — Command/Chat Endpoint
Routes commands to the active AI provider (Mock in Phase 1).
"""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter

from app.core import store
from app.core.store import DataConflict
from app.core.logging import get_logger
from app.providers.mock import mock_provider
from app.schemas.schemas import CommandRequest, CommandResponse

logger = get_logger(__name__)
router = APIRouter(prefix="/commands", tags=["commands"])


@router.post("", response_model=CommandResponse)
async def send_command(payload: CommandRequest) -> CommandResponse:
    """
    Send a command to AAROH AI.

    NOTE (Phase 1): This endpoint uses the Mock AI Provider.
    Real AI integration (Claude / Gemini / OpenAI) begins in Phase 2.
    Responses are clearly marked as SIMULATED.
    """
    logger.info("Command received: %.80s…", payload.command)

    # Build a minimal message list for the provider
    messages = [
        {"role": "system", "content": "You are AAROH AI, an advanced AI virtual company assistant."},
        {"role": "user", "content": payload.command},
    ]

    result = await mock_provider.complete(messages)

    record = {
        "command": payload.command,
        "response": result["content"],
        "provider": result["provider"],
        "is_simulated": result["is_simulated"],
        "target_agent_id": payload.target_agent_id,
        "target_department_id": payload.target_department_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    try:
        saved = store.insert("command_log", record)
    except DataConflict as exc:
        from fastapi import HTTPException

        raise HTTPException(status_code=409, detail=str(exc)) from exc

    return CommandResponse(
        id=saved["id"],
        command=saved["command"],
        response=saved["response"],
        provider=saved["provider"],
        is_simulated=saved["is_simulated"],
        target_agent_id=saved["target_agent_id"],
        target_department_id=saved["target_department_id"],
        timestamp=saved["timestamp"],
    )


@router.get("", response_model=list[CommandResponse])
async def list_commands() -> list[CommandResponse]:
    """Return the command history (in-memory, cleared on restart in Phase 1)."""
    return store.get_all("command_log")

