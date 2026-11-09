"""
AAROH AI — Project & Task Endpoints
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.core import store
from app.core.store import DataConflict
from app.core.logging import get_logger
from app.schemas.schemas import (
    ProjectCreate,
    ProjectResponse,
    TaskCreate,
    TaskResponse,
    TaskUpdate,
    MessageResponse,
)

logger = get_logger(__name__)
router = APIRouter(tags=["projects"])

# ─── Projects ────────────────────────────────────────────────────────────────

project_router = APIRouter(prefix="/projects", tags=["projects"])


@project_router.get("", response_model=list[ProjectResponse])
async def list_projects() -> list[ProjectResponse]:
    return store.get_all("projects")


@project_router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str) -> ProjectResponse:
    proj = store.get_by_id("projects", project_id)
    if not proj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Project '{project_id}' not found")
    return proj


@project_router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(payload: ProjectCreate) -> ProjectResponse:
    try:
        proj = store.insert("projects", payload.model_dump())
    except DataConflict as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    logger.info("Created project: %s", payload.name)
    return proj


@project_router.delete("/{project_id}", response_model=MessageResponse)
async def delete_project(project_id: str) -> MessageResponse:
    try:
        if not store.delete("projects", project_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Project '{project_id}' not found")
    except DataConflict as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return MessageResponse(message=f"Project '{project_id}' deleted")


# ─── Tasks ───────────────────────────────────────────────────────────────────

task_router = APIRouter(prefix="/tasks", tags=["tasks"])


@task_router.get("", response_model=list[TaskResponse])
async def list_tasks(project_id: str | None = None) -> list[TaskResponse]:
    tasks = store.get_all("tasks")
    if project_id:
        tasks = [t for t in tasks if t.get("project_id") == project_id]
    return tasks


@task_router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str) -> TaskResponse:
    task = store.get_by_id("tasks", task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task '{task_id}' not found")
    return task


@task_router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(payload: TaskCreate) -> TaskResponse:
    try:
        task = store.insert("tasks", payload.model_dump())
    except DataConflict as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    logger.info("Created task: %s", payload.title)
    return task


@task_router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, payload: TaskUpdate) -> TaskResponse:
    patch = payload.model_dump(exclude_unset=True)
    if not patch:
        raise HTTPException(status_code=400, detail="No fields to update")
    try:
        updated = store.update("tasks", task_id, patch)
    except DataConflict as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    if not updated:
        raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found")
    return updated


@task_router.delete("/{task_id}", response_model=MessageResponse)
async def delete_task(task_id: str) -> MessageResponse:
    try:
        if not store.delete("tasks", task_id):
            raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found")
    except DataConflict as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    return MessageResponse(message=f"Task '{task_id}' deleted")

