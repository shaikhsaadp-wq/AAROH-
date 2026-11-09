"""SQLite engine, session management and non-destructive migrations."""
from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import Engine, create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings


def default_database_url() -> str:
    """Keep the local database outside the repository by default."""
    configured_dir = os.environ.get("AAROH_DATA_DIR")
    if configured_dir:
        data_dir = Path(configured_dir).expanduser()
    elif os.environ.get("LOCALAPPDATA"):
        data_dir = Path(os.environ["LOCALAPPDATA"]) / "AAROH"
    elif os.environ.get("XDG_DATA_HOME"):
        data_dir = Path(os.environ["XDG_DATA_HOME"]).expanduser() / "aaroh"
    else:
        data_dir = Path.home() / ".local" / "share" / "aaroh"
    data_dir.mkdir(parents=True, exist_ok=True)
    return f"sqlite:///{(data_dir / 'aaroh.sqlite3').as_posix()}"


def configured_database_url() -> str:
    return (settings.database_url or "").strip() or default_database_url()


def create_db_engine(database_url: str | None = None) -> Engine:
    url = database_url or configured_database_url()
    connect_args = {"check_same_thread": False, "timeout": 30} if url.startswith("sqlite") else {}
    engine = create_engine(url, connect_args=connect_args, future=True)
    if url.startswith("sqlite"):
        @event.listens_for(engine, "connect")
        def _enable_sqlite_foreign_keys(dbapi_connection: object, _record: object) -> None:
            cursor = dbapi_connection.cursor()  # type: ignore[attr-defined]
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()
    return engine


@lru_cache(maxsize=1)
def get_engine() -> Engine:
    return create_db_engine()


def dispose_engine() -> None:
    """Close idle pooled SQLite handles during application shutdown."""
    get_engine().dispose()


def get_session_factory(engine: Engine | None = None) -> sessionmaker[Session]:
    return sessionmaker(bind=engine or get_engine(), autoflush=False, expire_on_commit=False)


def get_db_session():
    """Yield a short-lived session for FastAPI dependency injection."""
    session = get_session_factory()()
    try:
        yield session
    finally:
        session.close()


def run_migrations(database_url: str | None = None) -> None:
    url = database_url or configured_database_url()
    config_path = Path(__file__).resolve().parents[2] / "alembic.ini"
    alembic_config = Config(str(config_path))
    # ConfigParser treats '%' as interpolation syntax; double it before storing.
    alembic_config.set_main_option("sqlalchemy.url", url.replace("%", "%%"))
    command.upgrade(alembic_config, "head")


def initialize_database(database_url: str | None = None) -> None:
    """Apply additive migrations and insert any missing legacy seed records."""
    url = database_url or configured_database_url()
    run_migrations(url)
    from app.core.store import seed_database

    seed_engine = create_db_engine(url)
    try:
        with get_session_factory(seed_engine)() as session:
            seed_database(session)
    finally:
        seed_engine.dispose()

