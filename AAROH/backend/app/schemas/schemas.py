"""
AAROH AI — Pydantic Schemas

Request/response models for the API.  Input validation is enforced
by Pydantic on every endpoint.
"""
from __future__ import annotations

from typing import Any, Literal
from pydantic import BaseModel, Field


# ─── Health ──────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    ai_provider: str
    is_simulated: bool
    timestamp: str


# ─── Agents ──────────────────────────────────────────────────────────────────

AgentStatus = Literal["idle", "working", "meeting", "completed", "offline"]


class AgentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    role: str = Field(..., min_length=1, max_length=200)
    department_id: str
    department: str
    avatar_color: str = "#6366f1"
    avatar_shape: str = "circle"
    status: AgentStatus = "idle"
    current_activity: str = ""
    capabilities: list[str] = []
    workstation: dict[str, float] = Field(default_factory=dict)
    is_simulated: bool = True
    simulation_note: str = "Simulated agent — not connected to a live AI model"


class AgentCreate(AgentBase):
    pass


class AgentUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    status: AgentStatus | None = None
    current_activity: str | None = None
    capabilities: list[str] | None = None


class AgentResponse(AgentBase):
    id: str
    tasks_completed: int = 0
    tasks_in_progress: int = 0
    created_at: str
    updated_at: str | None = None


# ─── Departments ─────────────────────────────────────────────────────────────

class DepartmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str
    description: str = ""
    color: str = "#6366f1"
    icon: str = "building"
    location: dict[str, float] = Field(default_factory=dict)
    headcount: int = 0
    status: str = "active"


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentResponse(DepartmentBase):
    id: str


# ─── Projects ────────────────────────────────────────────────────────────────

ProjectStatus = Literal["planning", "active", "paused", "completed", "cancelled"]


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: str = ""
    status: ProjectStatus = "planning"
    phase: str = ""
    tech_stack: list[str] = []
    assigned_agents: list[str] = []


class ProjectCreate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: str
    created_at: str
    updated_at: str


# ─── Tasks ───────────────────────────────────────────────────────────────────

TaskStatus = Literal["pending", "in_progress", "completed", "blocked", "cancelled"]
TaskPriority = Literal["low", "medium", "high", "critical"]


class TaskBase(BaseModel):
    project_id: str
    title: str = Field(..., min_length=1, max_length=300)
    description: str = ""
    status: TaskStatus = "pending"
    priority: TaskPriority = "medium"
    assigned_agent_id: str | None = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    assigned_agent_id: str | None = None


class TaskResponse(TaskBase):
    id: str
    created_at: str
    updated_at: str


# ─── Commands ────────────────────────────────────────────────────────────────

class CommandRequest(BaseModel):
    command: str = Field(..., min_length=1, max_length=2000)
    target_agent_id: str | None = None
    target_department_id: str | None = None


class CommandResponse(BaseModel):
    id: str
    command: str
    response: str
    provider: str
    is_simulated: bool
    target_agent_id: str | None
    target_department_id: str | None
    timestamp: str


# ─── Generic ─────────────────────────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    error: str
    detail: Any = None

