"""
AAROH AI — Main API Router
Assembles all versioned sub-routers.
"""
from __future__ import annotations

from fastapi import APIRouter

from app.api.v1 import agents, departments, health, projects, commands

api_router = APIRouter(prefix="/api")

# System
api_router.include_router(health.router)

# Resources
api_router.include_router(agents.router)
api_router.include_router(departments.router)
api_router.include_router(projects.project_router)
api_router.include_router(projects.task_router)
api_router.include_router(commands.router)

