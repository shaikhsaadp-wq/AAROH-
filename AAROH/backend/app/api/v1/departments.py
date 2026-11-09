"""
AAROH AI — Department Endpoints
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.core import store
from app.core.store import DataConflict
from app.core.logging import get_logger
from app.schemas.schemas import DepartmentCreate, DepartmentResponse, MessageResponse

logger = get_logger(__name__)
router = APIRouter(prefix="/departments", tags=["departments"])


@router.get("", response_model=list[DepartmentResponse])
async def list_departments() -> list[DepartmentResponse]:
    """List all nine virtual office departments."""
    return store.get_all("departments")


@router.get("/{department_id}", response_model=DepartmentResponse)
async def get_department(department_id: str) -> DepartmentResponse:
    """Get a single department by ID."""
    dept = store.get_by_id("departments", department_id)
    if not dept:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Department '{department_id}' not found")
    return dept


@router.post("", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
async def create_department(payload: DepartmentCreate) -> DepartmentResponse:
    """Create a new department."""
    try:
        dept = store.insert("departments", payload.model_dump())
    except DataConflict as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    logger.info("Created department: %s", payload.name)
    return dept


@router.delete("/{department_id}", response_model=MessageResponse)
async def delete_department(department_id: str) -> MessageResponse:
    """Delete a department."""
    try:
        if not store.delete("departments", department_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Department '{department_id}' not found")
    except DataConflict as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return MessageResponse(message=f"Department '{department_id}' deleted")

