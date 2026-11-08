"""
AAROH AI — Agent Endpoints
Full CRUD for simulated AI agents.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.core import store
from app.core.logging import get_logger
from app.schemas.schemas import (
    AgentCreate,
    AgentResponse,
    AgentUpdate,
    MessageResponse,
)

logger = get_logger(__name__)
router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("", response_model=list[AgentResponse])
async def list_agents(
    department_id: str | None = None,
    agent_status: str | None = None,
) -> list[AgentResponse]:
    """List all agents, optionally filtered by department or status."""
    agents = store.get_all("agents")
    if department_id:
        agents = [a for a in agents if a.get("department_id") == department_id]
    if agent_status:
        agents = [a for a in agents if a.get("status") == agent_status]
    return agents


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str) -> AgentResponse:
    """Get a single agent by ID."""
    agent = store.get_by_id("agents", agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Agent '{agent_id}' not found")
    return agent


@router.post("", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent(payload: AgentCreate) -> AgentResponse:
    """Create a new simulated agent."""
    logger.info("Creating agent: %s", payload.name)
    data = payload.model_dump()
    data["tasks_completed"] = 0
    data["tasks_in_progress"] = 0
    data["updated_at"] = None
    agent = store.insert("agents", data)
    return agent


@router.patch("/{agent_id}", response_model=AgentResponse)
async def update_agent(agent_id: str, payload: AgentUpdate) -> AgentResponse:
    """Partially update an agent (status, activity, etc.)."""
    patch = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not patch:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
    updated = store.update("agents", agent_id, patch)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Agent '{agent_id}' not found")
    logger.info("Updated agent %s: %s", agent_id, list(patch.keys()))
    return updated


@router.delete("/{agent_id}", response_model=MessageResponse)
async def delete_agent(agent_id: str) -> MessageResponse:
    """Remove an agent from the system."""
    if not store.delete("agents", agent_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Agent '{agent_id}' not found")
    logger.info("Deleted agent %s", agent_id)
    return MessageResponse(message=f"Agent '{agent_id}' deleted successfully")

