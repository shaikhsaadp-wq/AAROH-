"""
AAROH AI — In-Memory Data Store (Phase 1)

A simple thread-safe in-memory store that powers the API without any
external database.  Replaced by PostgreSQL in Phase 2.
"""
from __future__ import annotations

import threading
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
_lock = threading.Lock()

_store: dict[str, list[dict[str, Any]]] = {
    "departments": list(DEPARTMENTS),
    "agents": list(AGENTS),
    "projects": list(PROJECTS),
    "tasks": list(TASKS),
    "command_log": [],
}


def get_all(collection: str) -> list[dict[str, Any]]:
    with _lock:
        return list(_store.get(collection, []))


def get_by_id(collection: str, item_id: str) -> dict[str, Any] | None:
    with _lock:
        return next(
            (item for item in _store.get(collection, []) if item["id"] == item_id),
            None,
        )


def insert(collection: str, item: dict[str, Any]) -> dict[str, Any]:
    item.setdefault("id", _uuid())
    item.setdefault("created_at", _now())
    item.setdefault("updated_at", _now())
    with _lock:
        _store.setdefault(collection, []).append(item)
    return item


def update(collection: str, item_id: str, patch: dict[str, Any]) -> dict[str, Any] | None:
    with _lock:
        for item in _store.get(collection, []):
            if item["id"] == item_id:
                item.update(patch)
                item["updated_at"] = _now()
                return dict(item)
    return None


def delete(collection: str, item_id: str) -> bool:
    with _lock:
        original = _store.get(collection, [])
        filtered = [i for i in original if i["id"] != item_id]
        if len(filtered) == len(original):
            return False
        _store[collection] = filtered
    return True

