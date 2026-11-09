"""AAROH persistent repository and legacy seed records."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _uuid() -> str:
    return str(uuid.uuid4())


# ─────────────────────────────────────────────────────────────
# Seed data — departments
# ─────────────────────────────────────────────────────────────
DEPARTMENTS: list[dict[str, Any]] = [
    {
        "id": "dept-001",
        "name": "Executive Office",
        "slug": "executive",
        "description": "Founder & JARVIS Core coordination hub",
        "color": "#6366f1",
        "icon": "building",
        "location": {"x": 0, "y": 0, "z": 0},
        "headcount": 1,
        "status": "active",
    },
    {
        "id": "dept-002",
        "name": "Research",
        "slug": "research",
        "description": "Web research, data analysis and insight reports",
        "color": "#0ea5e9",
        "icon": "search",
        "location": {"x": -3, "y": 0, "z": -3},
        "headcount": 1,
        "status": "active",
    },
    {
        "id": "dept-003",
        "name": "Product & Design",
        "slug": "design",
        "description": "UI/UX design, prototyping and brand identity",
        "color": "#ec4899",
        "icon": "palette",
        "location": {"x": 3, "y": 0, "z": -3},
        "headcount": 1,
        "status": "active",
    },
    {
        "id": "dept-004",
        "name": "Engineering",
        "slug": "engineering",
        "description": "Frontend, backend and AI application development",
        "color": "#10b981",
        "icon": "code",
        "location": {"x": -3, "y": 0, "z": 3},
        "headcount": 1,
        "status": "active",
    },
    {
        "id": "dept-005",
        "name": "QA & Testing",
        "slug": "qa",
        "description": "Test automation, bug hunting and quality assurance",
        "color": "#f59e0b",
        "icon": "shield-check",
        "location": {"x": 3, "y": 0, "z": 3},
        "headcount": 1,
        "status": "active",
    },
    {
        "id": "dept-006",
        "name": "Meeting Room",
        "slug": "meeting",
        "description": "Cross-department coordination and planning",
        "color": "#8b5cf6",
        "icon": "users",
        "location": {"x": 0, "y": 0, "z": -5},
        "headcount": 0,
        "status": "active",
    },
    {
        "id": "dept-007",
        "name": "Documentation",
        "slug": "documentation",
        "description": "Technical writing, knowledge base and API docs",
        "color": "#64748b",
        "icon": "book-open",
        "location": {"x": -6, "y": 0, "z": 0},
        "headcount": 0,
        "status": "active",
    },
    {
        "id": "dept-008",
        "name": "DevOps & Server Room",
        "slug": "devops",
        "description": "Infrastructure, CI/CD pipelines and deployment",
        "color": "#ef4444",
        "icon": "server",
        "location": {"x": 6, "y": 0, "z": 0},
        "headcount": 0,
        "status": "active",
    },
    {
        "id": "dept-009",
        "name": "Reception",
        "slug": "reception",
        "description": "Visitor welcome, onboarding and general support",
        "color": "#f97316",
        "icon": "door-open",
        "location": {"x": 0, "y": 0, "z": 6},
        "headcount": 0,
        "status": "active",
    },
]

# ─────────────────────────────────────────────────────────────
# Seed data — agents
# ─────────────────────────────────────────────────────────────
AGENTS: list[dict[str, Any]] = [
    {
        "id": "agent-001",
        "name": "JARVIS Core",
        "role": "Central Coordinator",
        "department_id": "dept-001",
        "department": "Executive Office",
        "avatar_color": "#6366f1",
        "avatar_shape": "diamond",
        "status": "working",
        "current_activity": "Coordinating Phase 1 implementation tasks",
        "capabilities": ["orchestration", "planning", "routing", "memory"],
        "workstation": {"x": 0, "y": 0, "z": 0},
        "is_simulated": True,
        "simulation_note": "Simulated agent — not connected to a live AI model",
        "tasks_completed": 12,
        "tasks_in_progress": 3,
        "created_at": _now(),
    },
    {
        "id": "agent-002",
        "name": "Alex",
        "role": "Project Manager",
        "department_id": "dept-001",
        "department": "Executive Office",
        "avatar_color": "#0ea5e9",
        "avatar_shape": "circle",
        "status": "working",
        "current_activity": "Updating Phase 1 task tracker and assigning priorities",
        "capabilities": ["project-management", "planning", "reporting", "communication"],
        "workstation": {"x": -1.5, "y": 0, "z": 0},
        "is_simulated": True,
        "simulation_note": "Simulated agent — not connected to a live AI model",
        "tasks_completed": 8,
        "tasks_in_progress": 2,
        "created_at": _now(),
    },
    {
        "id": "agent-003",
        "name": "Emma",
        "role": "Research Agent",
        "department_id": "dept-002",
        "department": "Research",
        "avatar_color": "#0ea5e9",
        "avatar_shape": "circle",
        "status": "working",
        "current_activity": "Analysing competitor AI assistant architectures",
        "capabilities": ["web-research", "data-analysis", "report-writing", "summarisation"],
        "workstation": {"x": -3, "y": 0, "z": -3},
        "is_simulated": True,
        "simulation_note": "Simulated agent — not connected to a live AI model",
        "tasks_completed": 15,
        "tasks_in_progress": 1,
        "created_at": _now(),
    },
    {
        "id": "agent-004",
        "name": "Sophia",
        "role": "Product & Design Agent",
        "department_id": "dept-003",
        "department": "Product & Design",
        "avatar_color": "#ec4899",
        "avatar_shape": "circle",
        "status": "idle",
        "current_activity": "Preparing UI component library for the AAROH dashboard",
        "capabilities": ["ui-design", "ux-research", "prototyping", "figma", "brand"],
        "workstation": {"x": 3, "y": 0, "z": -3},
        "is_simulated": True,
        "simulation_note": "Simulated agent — not connected to a live AI model",
        "tasks_completed": 6,
        "tasks_in_progress": 1,
        "created_at": _now(),
    },
    {
        "id": "agent-005",
        "name": "Ben",
        "role": "Engineering Agent",
        "department_id": "dept-004",
        "department": "Engineering",
        "avatar_color": "#10b981",
        "avatar_shape": "circle",
        "status": "working",
        "current_activity": "Building FastAPI backend endpoints for agent management",
        "capabilities": ["python", "typescript", "react", "fastapi", "databases", "ai"],
        "workstation": {"x": -3, "y": 0, "z": 3},
        "is_simulated": True,
        "simulation_note": "Simulated agent — not connected to a live AI model",
        "tasks_completed": 20,
        "tasks_in_progress": 4,
        "created_at": _now(),
    },
    {
        "id": "agent-006",
        "name": "Liam",
        "role": "QA Agent",
        "department_id": "dept-005",
        "department": "QA & Testing",
        "avatar_color": "#f59e0b",
        "avatar_shape": "circle",
        "status": "idle",
        "current_activity": "Writing test suite for Phase 1 backend endpoints",
        "capabilities": ["test-automation", "bug-hunting", "pytest", "playwright", "security"],
        "workstation": {"x": 3, "y": 0, "z": 3},
        "is_simulated": True,
        "simulation_note": "Simulated agent — not connected to a live AI model",
        "tasks_completed": 10,
        "tasks_in_progress": 2,
        "created_at": _now(),
    },
]

# ─────────────────────────────────────────────────────────────
# Seed data — projects
# ─────────────────────────────────────────────────────────────
PROJECTS: list[dict[str, Any]] = [
    {
        "id": "proj-001",
        "name": "AAROH AI Platform",
        "description": "The main AAROH AI virtual company platform",
        "status": "active",
        "phase": "Phase 1 — Foundation",
        "tech_stack": ["Python", "FastAPI", "React", "TypeScript", "Three.js"],
        "assigned_agents": ["agent-001", "agent-002", "agent-005"],
        "created_at": _now(),
        "updated_at": _now(),
    },
    {
        "id": "proj-002",
        "name": "AAROH 3D Office",
        "description": "Interactive isometric 3D virtual office environment",
        "status": "active",
        "phase": "Phase 1 — Foundation",
        "tech_stack": ["React", "Three.js", "React Three Fiber", "Zustand"],
        "assigned_agents": ["agent-004", "agent-005"],
        "created_at": _now(),
        "updated_at": _now(),
    },
]

# ─────────────────────────────────────────────────────────────
# Seed data — tasks
# ─────────────────────────────────────────────────────────────
TASKS: list[dict[str, Any]] = [
    {
        "id": "task-001",
        "project_id": "proj-001",
        "title": "Scaffold FastAPI backend",
        "description": "Create the FastAPI application skeleton with health check",
        "status": "completed",
        "priority": "high",
        "assigned_agent_id": "agent-005",
        "created_at": _now(),
        "updated_at": _now(),
    },
    {
        "id": "task-002",
        "project_id": "proj-001",
        "title": "Design agent data model",
        "description": "Define agent schema: id, name, role, department, status",
        "status": "completed",
        "priority": "high",
        "assigned_agent_id": "agent-002",
        "created_at": _now(),
        "updated_at": _now(),
    },
    {
        "id": "task-003",
        "project_id": "proj-002",
        "title": "Build 3D isometric office",
        "description": "Create Three.js virtual office with 9 departments",
        "status": "in_progress",
        "priority": "high",
        "assigned_agent_id": "agent-004",
        "created_at": _now(),
        "updated_at": _now(),
    },
    {
        "id": "task-004",
        "project_id": "proj-001",
        "title": "Write Phase 1 test suite",
        "description": "Pytest tests for all API endpoints (≥80% coverage)",
        "status": "in_progress",
        "priority": "medium",
        "assigned_agent_id": "agent-006",
        "created_at": _now(),
        "updated_at": _now(),
    },
]

# ─────────────────────────────────────────────────────────────
# In-memory store with thread safety
# ─────────────────────────────────────────────────────────────
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_session_factory
from app.models import Agent, Command, Department, Project, Task


class DataConflict(Exception):
    """A requested write would violate a data relationship or invariant."""


_MODEL_BY_COLLECTION = {
    "agents": Agent,
    "departments": Department,
    "projects": Project,
    "tasks": Task,
    "command_log": Command,
}


def _serialize(session: Session, collection: str, row: Any) -> dict[str, Any]:
    if collection == "agents":
        completed, active = session.execute(
            select(
                func.sum(Task.status == "completed"),
                func.sum(Task.status == "in_progress"),
            ).where(Task.assigned_agent_id == row.id)
        ).one()
        return {
            "id": row.id, "name": row.name, "role": row.role,
            "department_id": row.department_id,
            "department": row.department_record.name,
            "avatar_color": row.avatar_color, "avatar_shape": row.avatar_shape,
            "status": row.status, "current_activity": row.current_activity,
            "capabilities": row.capabilities, "workstation": row.workstation,
            "is_simulated": row.is_simulated, "simulation_note": row.simulation_note,
            "tasks_completed": int(completed or 0), "tasks_in_progress": int(active or 0),
            "created_at": row.created_at, "updated_at": row.updated_at,
        }
    if collection == "departments":
        return {
            "id": row.id, "name": row.name, "slug": row.slug,
            "description": row.description, "color": row.color, "icon": row.icon,
            "location": row.location, "headcount": len(row.agents), "status": row.status,
        }
    if collection == "projects":
        return {
            "id": row.id, "name": row.name, "description": row.description,
            "status": row.status, "phase": row.phase, "tech_stack": row.tech_stack,
            "assigned_agents": [agent.id for agent in row.agents],
            "created_at": row.created_at, "updated_at": row.updated_at,
        }
    model = _MODEL_BY_COLLECTION[collection]
    return {column.name: getattr(row, column.name) for column in model.__table__.columns}


def get_all(collection: str) -> list[dict[str, Any]]:
    model = _MODEL_BY_COLLECTION[collection]
    with get_session_factory()() as session:
        return [_serialize(session, collection, row) for row in session.scalars(select(model)).all()]


def get_by_id(collection: str, item_id: str) -> dict[str, Any] | None:
    model = _MODEL_BY_COLLECTION[collection]
    with get_session_factory()() as session:
        row = session.get(model, item_id)
        return _serialize(session, collection, row) if row else None


def _active_task_count(session: Session, agent_id: str) -> int:
    return int(session.scalar(
        select(func.count()).select_from(Task).where(
            Task.assigned_agent_id == agent_id, Task.status == "in_progress"
        )
    ) or 0)


def _sync_agent_status(session: Session, agent_id: str, completed_event: bool = False) -> None:
    agent = session.get(Agent, agent_id)
    if not agent or agent.status in {"meeting", "offline"}:
        return
    active = _active_task_count(session, agent_id)
    if active:
        agent.status = "working"
    elif completed_event and agent.status == "working":
        agent.status = "completed"
    elif agent.status == "working":
        agent.status = "idle"


def _validate_agent_status(session: Session, agent: Agent) -> None:
    active = _active_task_count(session, agent.id)
    if agent.status == "working" and not active:
        raise DataConflict("An agent must have an in-progress task before it can be marked working")
    if agent.status in {"idle", "completed"} and active:
        raise DataConflict("An agent with in-progress tasks cannot be marked idle or completed")
    if agent.status == "offline" and active:
        raise DataConflict("An agent with in-progress tasks cannot be marked offline")


def _validate_task_assignment(session: Session, task: Task) -> None:
    if task.status != "in_progress":
        return
    if not task.assigned_agent_id:
        raise DataConflict("An in-progress task must be assigned to an agent")
    assigned_agent = session.get(Agent, task.assigned_agent_id)
    if assigned_agent and assigned_agent.status == "offline":
        raise DataConflict("An offline agent cannot be assigned an in-progress task")


def _resolve_agents(session: Session, agent_ids: list[str]) -> list[Agent]:
    if len(set(agent_ids)) != len(agent_ids):
        raise DataConflict("A project cannot assign the same agent more than once")
    agents = [session.get(Agent, agent_id) for agent_id in agent_ids]
    if any(agent is None for agent in agents):
        raise DataConflict("Every assigned project agent must exist")
    return [agent for agent in agents if agent is not None]


def insert(collection: str, item: dict[str, Any]) -> dict[str, Any]:
    model = _MODEL_BY_COLLECTION[collection]
    data = dict(item)
    data.setdefault("id", _uuid())
    now = _now()
    if collection == "command_log":
        data.setdefault("timestamp", now)
    elif collection != "departments":
        data.setdefault("created_at", now)
        data.setdefault("updated_at", now)
    with get_session_factory()() as session:
        try:
            if collection == "agents":
                data.pop("department", None)
                data.pop("tasks_completed", None)
                data.pop("tasks_in_progress", None)
                row = Agent(**data)
                session.add(row)
                session.flush()
                if row.status == "working":
                    row.status = "idle"
            elif collection == "projects":
                assigned_ids = data.pop("assigned_agents", [])
                row = Project(**data)
                session.add(row)
                session.flush()
                row.agents = _resolve_agents(session, assigned_ids)
            elif collection == "departments":
                data.pop("headcount", None)
                row = Department(**data)
                session.add(row)
            else:
                row = model(**data)
                session.add(row)
            session.flush()
            if collection == "tasks":
                _validate_task_assignment(session, row)
                if row.assigned_agent_id:
                    _sync_agent_status(session, row.assigned_agent_id)
            result = _serialize(session, collection, row)
            session.commit()
            return result
        except IntegrityError as exc:
            session.rollback()
            raise DataConflict("A referenced record is missing or a unique value is already in use") from exc


def update(collection: str, item_id: str, patch: dict[str, Any]) -> dict[str, Any] | None:
    model = _MODEL_BY_COLLECTION[collection]
    with get_session_factory()() as session:
        row = session.get(model, item_id)
        if not row:
            return None
        previous_task_status = row.status if collection == "tasks" else None
        previous_agent_id = row.assigned_agent_id if collection == "tasks" else None
        try:
            values = dict(patch)
            if collection == "agents":
                for key, value in values.items():
                    setattr(row, key, value)
                row.updated_at = _now()
                session.flush()
                _validate_agent_status(session, row)
                _sync_agent_status(session, row.id)
            elif collection == "projects" and "assigned_agents" in values:
                row.agents = _resolve_agents(session, values.pop("assigned_agents") or [])
                for key, value in values.items():
                    setattr(row, key, value)
                row.updated_at = _now()
            elif collection == "tasks":
                for key, value in values.items():
                    setattr(row, key, value)
                row.updated_at = _now()
                session.flush()
                _validate_task_assignment(session, row)
                affected = {a for a in (previous_agent_id, row.assigned_agent_id) if a}
                completed = previous_task_status != "completed" and row.status == "completed"
                for agent_id in affected:
                    _sync_agent_status(session, agent_id, completed_event=completed and agent_id == row.assigned_agent_id)
            else:
                for key, value in values.items():
                    setattr(row, key, value)
                if hasattr(row, "updated_at"):
                    row.updated_at = _now()
            session.flush()
            result = _serialize(session, collection, row)
            session.commit()
            return result
        except IntegrityError as exc:
            session.rollback()
            raise DataConflict("A referenced record is missing or the update conflicts with existing data") from exc


def delete(collection: str, item_id: str) -> bool:
    model = _MODEL_BY_COLLECTION[collection]
    with get_session_factory()() as session:
        row = session.get(model, item_id)
        if not row:
            return False
        affected_agent_id = row.assigned_agent_id if collection == "tasks" else None
        try:
            session.delete(row)
            session.flush()
            if affected_agent_id:
                _sync_agent_status(session, affected_agent_id)
            session.commit()
            return True
        except IntegrityError as exc:
            session.rollback()
            raise DataConflict("This record has dependent records and cannot be deleted") from exc


def seed_database(session: Session) -> None:
    """Import the original seed records once, preserving IDs and old aggregates."""
    try:
        for item in DEPARTMENTS:
            if session.get(Department, item["id"]) is None:
                data = dict(item)
                data.pop("headcount", None)
                session.add(Department(**data))
        session.flush()

        for item in AGENTS:
            if session.get(Agent, item["id"]) is None:
                data = dict(item)
                data["legacy_task_stats"] = {
                    "tasks_completed": data.pop("tasks_completed", 0),
                    "tasks_in_progress": data.pop("tasks_in_progress", 0),
                }
                data.pop("department", None)
                session.add(Agent(**data))
        session.flush()

        for item in PROJECTS:
            if session.get(Project, item["id"]) is None:
                data = dict(item)
                assigned_ids = data.pop("assigned_agents", [])
                project = Project(**data)
                project.agents = _resolve_agents(session, assigned_ids)
                session.add(project)
        session.flush()

        for item in TASKS:
            if session.get(Task, item["id"]) is None:
                session.add(Task(**item))
        session.flush()

        for agent in session.scalars(select(Agent)).all():
            active = _active_task_count(session, agent.id)
            if agent.status not in {"meeting", "offline"}:
                if active:
                    agent.status = "working"
                elif agent.status == "working":
                    agent.status = "idle"
        session.commit()
    except Exception:
        session.rollback()
        raise

