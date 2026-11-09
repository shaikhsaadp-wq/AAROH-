"""SQLAlchemy models for AAROH's local persistent data store."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
import uuid

from sqlalchemy import ForeignKey, JSON, String, Table, Column
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def _id() -> str:
    return str(uuid.uuid4())


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class Base(DeclarativeBase):
    pass


project_agents = Table(
    "project_agents",
    Base.metadata,
    Column("project_id", String, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
    Column("agent_id", String, ForeignKey("agents.id", ondelete="RESTRICT"), primary_key=True),
)


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_id)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(String, nullable=False, default="")
    color: Mapped[str] = mapped_column(String(32), nullable=False, default="#6366f1")
    icon: Mapped[str] = mapped_column(String(100), nullable=False, default="building")
    location: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="active")

    agents: Mapped[list[Agent]] = relationship(back_populates="department_record", passive_deletes=True)


class Agent(Base):
    __tablename__ = "agents"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_id)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[str] = mapped_column(String(200), nullable=False)
    department_id: Mapped[str] = mapped_column(
        String, ForeignKey("departments.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    avatar_color: Mapped[str] = mapped_column(String(32), nullable=False, default="#6366f1")
    avatar_shape: Mapped[str] = mapped_column(String(32), nullable=False, default="circle")
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="idle", index=True)
    current_activity: Mapped[str] = mapped_column(String, nullable=False, default="")
    capabilities: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    workstation: Mapped[dict[str, float]] = mapped_column(JSON, nullable=False, default=dict)
    is_simulated: Mapped[bool] = mapped_column(nullable=False, default=True)
    simulation_note: Mapped[str] = mapped_column(String, nullable=False, default="")
    # The old in-memory seed contained aggregate counts with no matching task
    # records. Preserve those imported values for audit; API counts are derived.
    legacy_task_stats: Mapped[dict[str, int]] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[str] = mapped_column(String, nullable=False, default=_now)
    updated_at: Mapped[str | None] = mapped_column(String, nullable=True, default=None)

    department_record: Mapped[Department] = relationship(back_populates="agents")
    projects: Mapped[list[Project]] = relationship(secondary=project_agents, back_populates="agents")
    assigned_tasks: Mapped[list[Task]] = relationship(
        back_populates="assigned_agent", passive_deletes=True, foreign_keys="Task.assigned_agent_id"
    )


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_id)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False, default="")
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="planning")
    phase: Mapped[str] = mapped_column(String, nullable=False, default="")
    tech_stack: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[str] = mapped_column(String, nullable=False, default=_now)
    updated_at: Mapped[str] = mapped_column(String, nullable=False, default=_now)

    agents: Mapped[list[Agent]] = relationship(secondary=project_agents, back_populates="projects")
    tasks: Mapped[list[Task]] = relationship(back_populates="project", passive_deletes=True)


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_id)
    project_id: Mapped[str] = mapped_column(
        String, ForeignKey("projects.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False, default="")
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="pending", index=True)
    priority: Mapped[str] = mapped_column(String(32), nullable=False, default="medium")
    assigned_agent_id: Mapped[str | None] = mapped_column(
        String, ForeignKey("agents.id", ondelete="RESTRICT"), nullable=True, index=True
    )
    created_at: Mapped[str] = mapped_column(String, nullable=False, default=_now)
    updated_at: Mapped[str] = mapped_column(String, nullable=False, default=_now)

    project: Mapped[Project] = relationship(back_populates="tasks")
    assigned_agent: Mapped[Agent | None] = relationship(
        back_populates="assigned_tasks", foreign_keys=[assigned_agent_id]
    )


class Command(Base):
    __tablename__ = "commands"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_id)
    command: Mapped[str] = mapped_column(String(2000), nullable=False)
    response: Mapped[str] = mapped_column(String, nullable=False)
    provider: Mapped[str] = mapped_column(String(100), nullable=False)
    is_simulated: Mapped[bool] = mapped_column(nullable=False, default=True)
    target_agent_id: Mapped[str | None] = mapped_column(
        String, ForeignKey("agents.id", ondelete="SET NULL"), nullable=True
    )
    target_department_id: Mapped[str | None] = mapped_column(
        String, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True
    )
    timestamp: Mapped[str] = mapped_column(String, nullable=False, default=_now, index=True)
