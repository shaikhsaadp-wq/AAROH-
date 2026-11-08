"""
AAROH AI — Backend Test Suite (Phase 1)

Starts uvicorn in a subprocess, waits for it to become ready,
runs all tests with requests, then shuts it down.

This avoids the Python 3.14 / Starlette / anyio TestClient hang
on Windows that affects all in-process ASGI transports.

Run:
    cd C:\\AAROH\\jarvis\\backend
    set PYTHONPATH=C:\\AAROH\\jarvis\\backend
    python -m pytest tests/ -v
"""
from __future__ import annotations

import os
import subprocess
import sys
import time

import pytest
import requests

BASE_URL = "http://127.0.0.1:18765"
_server_proc: subprocess.Popen | None = None


# ─── Server lifecycle ─────────────────────────────────────────────────────────

def _start_server() -> subprocess.Popen:
    env = dict(os.environ)
    env["PYTHONPATH"] = str(os.path.dirname(os.path.dirname(__file__)))
    proc = subprocess.Popen(
        [
            sys.executable, "-m", "uvicorn",
            "app.main:app",
            "--host", "127.0.0.1",
            "--port", "18765",
            "--log-level", "warning",
        ],
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    # Wait for server to be ready (up to 15 seconds)
    deadline = time.time() + 15
    while time.time() < deadline:
        try:
            r = requests.get(f"{BASE_URL}/api/health", timeout=1)
            if r.status_code == 200:
                return proc
        except Exception:
            pass
        time.sleep(0.3)
    proc.terminate()
    out, err = proc.communicate(timeout=5)
    raise RuntimeError(
        f"Server failed to start.\nSTDOUT: {out.decode()}\nSTDERR: {err.decode()}"
    )


@pytest.fixture(scope="session", autouse=True)
def live_server():
    """Start uvicorn once for the whole test session."""
    global _server_proc
    _server_proc = _start_server()
    yield BASE_URL
    _server_proc.terminate()
    try:
        _server_proc.wait(timeout=5)
    except subprocess.TimeoutExpired:
        _server_proc.kill()


def get(path: str, **kwargs) -> requests.Response:
    return requests.get(f"{BASE_URL}{path}", **kwargs)


def post(path: str, json: dict, **kwargs) -> requests.Response:
    return requests.post(f"{BASE_URL}{path}", json=json, **kwargs)


def patch(path: str, json: dict, **kwargs) -> requests.Response:
    return requests.patch(f"{BASE_URL}{path}", json=json, **kwargs)


def delete(path: str, **kwargs) -> requests.Response:
    return requests.delete(f"{BASE_URL}{path}", **kwargs)


# ─── Health ───────────────────────────────────────────────────────────────────

def test_health_check():
    r = get("/api/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert data["ai_provider"] == "mock"
    assert data["is_simulated"] is True
    assert "version" in data
    assert "timestamp" in data


# ─── Agents ───────────────────────────────────────────────────────────────────

def test_list_agents():
    r = get("/api/agents")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 6


def test_get_agent_exists():
    r = get("/api/agents/agent-001")
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == "agent-001"
    assert data["name"] == "JARVIS Core"
    assert data["is_simulated"] is True


def test_get_agent_not_found():
    r = get("/api/agents/nonexistent-999")
    assert r.status_code == 404


def test_create_agent():
    payload = {
        "name": "Test Agent", "role": "Test Role",
        "department_id": "dept-001", "department": "Executive Office",
        "avatar_color": "#ff0000", "avatar_shape": "circle",
        "status": "idle", "current_activity": "Testing",
        "capabilities": ["testing"],
        "workstation": {"x": 0.0, "y": 0.0, "z": 0.0},
        "is_simulated": True, "simulation_note": "Test agent",
    }
    r = post("/api/agents", payload)
    assert r.status_code == 201
    data = r.json()
    assert data["name"] == "Test Agent"
    assert "id" in data


def test_update_agent_status():
    r = patch("/api/agents/agent-002", {"status": "meeting"})
    assert r.status_code == 200
    assert r.json()["status"] == "meeting"


def test_filter_agents_by_status():
    patch("/api/agents/agent-005", {"status": "working"})
    r = get("/api/agents", params={"agent_status": "working"})
    assert r.status_code == 200
    assert all(a["status"] == "working" for a in r.json())


def test_filter_agents_by_department():
    r = get("/api/agents", params={"department_id": "dept-002"})
    assert r.status_code == 200
    assert all(a["department_id"] == "dept-002" for a in r.json())


def test_delete_agent():
    payload = {
        "name": "Temp Agent", "role": "Temp", "department_id": "dept-001",
        "department": "Executive Office", "avatar_color": "#aaa",
        "avatar_shape": "circle", "status": "idle", "current_activity": "",
        "capabilities": [], "workstation": {"x": 0.0, "y": 0.0, "z": 0.0},
        "is_simulated": True, "simulation_note": "temp",
    }
    created = post("/api/agents", payload)
    agent_id = created.json()["id"]
    r = delete(f"/api/agents/{agent_id}")
    assert r.status_code == 200
    r2 = get(f"/api/agents/{agent_id}")
    assert r2.status_code == 404


# ─── Departments ─────────────────────────────────────────────────────────────

def test_list_departments():
    r = get("/api/departments")
    assert r.status_code == 200
    assert len(r.json()) == 9


def test_get_department_exists():
    r = get("/api/departments/dept-001")
    assert r.status_code == 200
    assert r.json()["slug"] == "executive"


def test_get_department_not_found():
    r = get("/api/departments/dept-999")
    assert r.status_code == 404


def test_create_department():
    payload = {
        "name": "Test Dept", "slug": "test-dept",
        "description": "A test department", "color": "#123456",
        "icon": "building", "location": {"x": 0.0, "y": 0.0, "z": 0.0},
        "headcount": 0, "status": "active",
    }
    r = post("/api/departments", payload)
    assert r.status_code == 201
    assert r.json()["name"] == "Test Dept"


# ─── Projects ─────────────────────────────────────────────────────────────────

def test_list_projects():
    r = get("/api/projects")
    assert r.status_code == 200
    assert len(r.json()) >= 2


def test_get_project_exists():
    r = get("/api/projects/proj-001")
    assert r.status_code == 200
    assert r.json()["name"] == "AAROH AI Platform"


def test_get_project_not_found():
    r = get("/api/projects/proj-999")
    assert r.status_code == 404


def test_create_project():
    payload = {
        "name": "Test Project", "description": "A test project",
        "status": "planning", "phase": "Phase 1",
        "tech_stack": ["Python"], "assigned_agents": [],
    }
    r = post("/api/projects", payload)
    assert r.status_code == 201
    assert r.json()["name"] == "Test Project"


# ─── Tasks ────────────────────────────────────────────────────────────────────

def test_list_tasks():
    r = get("/api/tasks")
    assert r.status_code == 200
    assert len(r.json()) >= 4


def test_list_tasks_by_project():
    r = get("/api/tasks", params={"project_id": "proj-001"})
    assert r.status_code == 200
    assert all(t["project_id"] == "proj-001" for t in r.json())


def test_create_task():
    payload = {
        "project_id": "proj-001", "title": "Test Task",
        "description": "A test task", "status": "pending",
        "priority": "low", "assigned_agent_id": "agent-005",
    }
    r = post("/api/tasks", payload)
    assert r.status_code == 201
    assert r.json()["title"] == "Test Task"


def test_update_task_status():
    payload = {
        "project_id": "proj-001", "title": "Task to Update",
        "description": "", "status": "pending", "priority": "medium",
    }
    created = post("/api/tasks", payload)
    task_id = created.json()["id"]
    r = patch(f"/api/tasks/{task_id}", {"status": "in_progress"})
    assert r.status_code == 200
    assert r.json()["status"] == "in_progress"


def test_delete_task():
    payload = {
        "project_id": "proj-001", "title": "Temp Task",
        "description": "", "status": "pending", "priority": "low",
    }
    created = post("/api/tasks", payload)
    task_id = created.json()["id"]
    r = delete(f"/api/tasks/{task_id}")
    assert r.status_code == 200


# ─── Commands ────────────────────────────────────────────────────────────────

def test_send_command():
    r = post("/api/commands", {"command": "What is the status of AAROH AI Phase 1?"})
    assert r.status_code == 200
    data = r.json()
    assert "response" in data
    assert data["is_simulated"] is True
    assert data["provider"] == "mock"
    assert "SIMULATED" in data["response"]


def test_send_command_with_target():
    payload = {
        "command": "Start engineering task",
        "target_agent_id": "agent-005",
        "target_department_id": "dept-004",
    }
    r = post("/api/commands", payload)
    assert r.status_code == 200
    assert r.json()["target_agent_id"] == "agent-005"


def test_command_history():
    post("/api/commands", {"command": "History test"})
    r = get("/api/commands")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_empty_command_rejected():
    r = post("/api/commands", {"command": ""})
    assert r.status_code == 422
