from __future__ import annotations

from sqlalchemy import func, select

from app.core.database import create_db_engine, get_session_factory, initialize_database
from app.models import Agent, Department, Project, Task


def _url(path) -> str:
    return f"sqlite:///{path.as_posix()}"


def test_seed_is_idempotent_and_database_survives_reinitialization(tmp_path):
    database_url = _url(tmp_path / "persistent.sqlite3")

    initialize_database(database_url)
    engine = create_db_engine(database_url)
    factory = get_session_factory(engine)
    with factory() as session:
        first_counts = (
            session.scalar(select(func.count()).select_from(Agent)),
            session.scalar(select(func.count()).select_from(Department)),
            session.scalar(select(func.count()).select_from(Project)),
            session.scalar(select(func.count()).select_from(Task)),
        )
        agent = session.get(Agent, "agent-001")
        agent.current_activity = "Persisted test activity"
        session.commit()
    engine.dispose()

    # Re-running startup migrations and seed import must preserve user edits
    # and must not duplicate the fixed legacy seed IDs.
    initialize_database(database_url)
    engine = create_db_engine(database_url)
    with get_session_factory(engine)() as session:
        second_counts = (
            session.scalar(select(func.count()).select_from(Agent)),
            session.scalar(select(func.count()).select_from(Department)),
            session.scalar(select(func.count()).select_from(Project)),
            session.scalar(select(func.count()).select_from(Task)),
        )
        persisted = session.get(Agent, "agent-001")
        assert persisted.current_activity == "Persisted test activity"
        assert persisted.legacy_task_stats["tasks_completed"] == 12
    assert second_counts == first_counts == (6, 9, 2, 4)
    engine.dispose()


def test_sqlite_enforces_agent_department_task_project_and_agent_foreign_keys(tmp_path):
    database_url = _url(tmp_path / "relationships.sqlite3")
    initialize_database(database_url)
    engine = create_db_engine(database_url)
    factory = get_session_factory(engine)
    with factory() as session:
        assert session.get(Agent, "agent-001").department_id == "dept-001"
        assert session.get(Task, "task-001").project_id == "proj-001"
        assert session.get(Task, "task-001").assigned_agent_id == "agent-005"
    engine.dispose()
