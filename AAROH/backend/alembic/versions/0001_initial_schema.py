"""Create the initial persistent AAROH schema.

Revision ID: 0001_initial_schema
Revises:
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "departments",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("slug", sa.String(100), nullable=False, unique=True),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("color", sa.String(32), nullable=False),
        sa.Column("icon", sa.String(100), nullable=False),
        sa.Column("location", sa.JSON(), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
    )
    op.create_table(
        "agents",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("role", sa.String(200), nullable=False),
        sa.Column("department_id", sa.String(), sa.ForeignKey("departments.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("avatar_color", sa.String(32), nullable=False),
        sa.Column("avatar_shape", sa.String(32), nullable=False),
        sa.Column("status", sa.String(16), nullable=False),
        sa.Column("current_activity", sa.String(), nullable=False),
        sa.Column("capabilities", sa.JSON(), nullable=False),
        sa.Column("workstation", sa.JSON(), nullable=False),
        sa.Column("is_simulated", sa.Boolean(), nullable=False),
        sa.Column("simulation_note", sa.String(), nullable=False),
        sa.Column("legacy_task_stats", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.String(), nullable=False),
        sa.Column("updated_at", sa.String(), nullable=True),
    )
    op.create_index("ix_agents_department_id", "agents", ["department_id"])
    op.create_index("ix_agents_status", "agents", ["status"])
    op.create_table(
        "projects",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("phase", sa.String(), nullable=False),
        sa.Column("tech_stack", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.String(), nullable=False),
        sa.Column("updated_at", sa.String(), nullable=False),
    )
    op.create_table(
        "project_agents",
        sa.Column("project_id", sa.String(), sa.ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("agent_id", sa.String(), sa.ForeignKey("agents.id", ondelete="RESTRICT"), primary_key=True),
    )
    op.create_table(
        "tasks",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("project_id", sa.String(), sa.ForeignKey("projects.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("priority", sa.String(32), nullable=False),
        sa.Column("assigned_agent_id", sa.String(), sa.ForeignKey("agents.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("created_at", sa.String(), nullable=False),
        sa.Column("updated_at", sa.String(), nullable=False),
    )
    op.create_index("ix_tasks_project_id", "tasks", ["project_id"])
    op.create_index("ix_tasks_status", "tasks", ["status"])
    op.create_index("ix_tasks_assigned_agent_id", "tasks", ["assigned_agent_id"])
    op.create_table(
        "commands",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("command", sa.String(2000), nullable=False),
        sa.Column("response", sa.String(), nullable=False),
        sa.Column("provider", sa.String(100), nullable=False),
        sa.Column("is_simulated", sa.Boolean(), nullable=False),
        sa.Column("target_agent_id", sa.String(), sa.ForeignKey("agents.id", ondelete="SET NULL"), nullable=True),
        sa.Column("target_department_id", sa.String(), sa.ForeignKey("departments.id", ondelete="SET NULL"), nullable=True),
        sa.Column("timestamp", sa.String(), nullable=False),
    )
    op.create_index("ix_commands_timestamp", "commands", ["timestamp"])


def downgrade() -> None:
    # Downgrades are explicit operator actions; application startup only upgrades.
    op.drop_index("ix_commands_timestamp", table_name="commands")
    op.drop_table("commands")
    op.drop_index("ix_tasks_assigned_agent_id", table_name="tasks")
    op.drop_index("ix_tasks_status", table_name="tasks")
    op.drop_index("ix_tasks_project_id", table_name="tasks")
    op.drop_table("tasks")
    op.drop_table("project_agents")
    op.drop_table("projects")
    op.drop_index("ix_agents_status", table_name="agents")
    op.drop_index("ix_agents_department_id", table_name="agents")
    op.drop_table("agents")
    op.drop_table("departments")
