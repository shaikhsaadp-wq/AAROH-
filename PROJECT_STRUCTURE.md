# JARVIS — Project Folder Structure

> **Document Version:** 1.0  
> **Created:** 2026-11-05  
> **Status:** Draft — Awaiting Founder Approval

---

## Overview

The JARVIS project lives at `C:\AAROH\jarvis\`. This structure is designed to be **modular**, **scalable**, and **production-ready** from day one — even though it is built incrementally across 8 phases.

---

## Full Target Structure

```
C:\AAROH\jarvis\
│
├── .env                          # Environment variables (NEVER committed)
├── .env.example                  # Template with placeholder values (committed)
├── .gitignore                    # Git ignore rules
├── README.md                     # Project overview and quick start
├── docker-compose.yml            # Local development stack
├── docker-compose.prod.yml       # Production stack
├── Makefile                      # Developer shortcuts (make dev, make test, etc.)
│
├── docs/                         # Additional documentation
│   ├── api/                      # Auto-generated API docs (OpenAPI)
│   ├── adr/                      # Architecture Decision Records
│   └── diagrams/                 # Architecture and flow diagrams
│
├── backend/                      # Python FastAPI application
│   ├── pyproject.toml            # Python project metadata and dependencies
│   ├── requirements.txt          # Pinned production dependencies
│   ├── requirements-dev.txt      # Development dependencies
│   ├── alembic.ini               # Database migration config
│   │
│   ├── alembic/                  # Database migrations
│   │   ├── env.py
│   │   └── versions/             # Migration files
│   │
│   └── jarvis/                   # Main application package
│       ├── __init__.py
│       ├── main.py               # FastAPI app entry point
│       ├── config.py             # Pydantic Settings (loads from .env)
│       ├── database.py           # SQLAlchemy async engine and session
│       │
│       ├── api/                  # API layer — routes and request/response handling
│       │   ├── __init__.py
│       │   ├── deps.py           # Shared dependencies (auth, db session)
│       │   ├── router.py         # Main API router (mounts sub-routers)
│       │   └── v1/               # Versioned API
│       │       ├── __init__.py
│       │       ├── chat.py       # Chat endpoints
│       │       ├── auth.py       # Authentication endpoints
│       │       ├── memory.py     # Memory endpoints
│       │       ├── projects.py   # Project management endpoints
│       │       ├── agents.py     # Agent status and control endpoints
│       │       └── admin.py      # Admin endpoints
│       │
│       ├── core/                 # Core brain logic
│       │   ├── __init__.py
│       │   ├── brain.py          # JARVIS Core Brain orchestrator
│       │   ├── intent_parser.py  # Classifies incoming requests
│       │   ├── task_planner.py   # Breaks goals into sub-tasks
│       │   ├── context_manager.py# Assembles context for prompts
│       │   └── response_synth.py # Synthesises final responses
│       │
│       ├── agents/               # AI agent definitions and logic
│       │   ├── __init__.py
│       │   ├── base.py           # BaseAgent abstract class
│       │   ├── orchestrator.py   # LangGraph state machine
│       │   ├── protocols.py      # Agent message schema and protocols
│       │   │
│       │   ├── research/         # Research Department
│       │   │   ├── __init__.py
│       │   │   ├── web_researcher.py
│       │   │   └── report_writer.py
│       │   │
│       │   ├── engineering/      # Engineering Department
│       │   │   ├── __init__.py
│       │   │   ├── architect.py
│       │   │   ├── code_writer.py
│       │   │   └── code_reviewer.py
│       │   │
│       │   ├── design/           # Design Department
│       │   │   ├── __init__.py
│       │   │   ├── ui_designer.py
│       │   │   └── ux_analyst.py
│       │   │
│       │   ├── qa/               # QA & Testing Department
│       │   │   ├── __init__.py
│       │   │   ├── test_writer.py
│       │   │   └── bug_analyst.py
│       │   │
│       │   ├── devops/           # DevOps Department
│       │   │   ├── __init__.py
│       │   │   ├── cicd_manager.py
│       │   │   └── monitor.py
│       │   │
│       │   └── product/          # Product Management Department
│       │       ├── __init__.py
│       │       ├── project_manager.py
│       │       └── doc_writer.py
│       │
│       ├── memory/               # Memory system
│       │   ├── __init__.py
│       │   ├── manager.py        # Memory router and coordinator
│       │   ├── working.py        # In-process working memory
│       │   ├── short_term.py     # Redis-backed short-term memory
│       │   ├── long_term.py      # pgvector-backed long-term memory
│       │   ├── archival.py       # File system archival storage
│       │   └── embeddings.py     # Text-to-vector embedding pipeline
│       │
│       ├── providers/            # AI provider abstraction layer
│       │   ├── __init__.py
│       │   ├── base.py           # AIProvider Protocol definition
│       │   ├── claude.py         # Anthropic Claude implementation
│       │   ├── gemini.py         # Google Gemini implementation
│       │   ├── openai.py         # OpenAI implementation
│       │   └── local.py          # Local Ollama fallback
│       │
│       ├── tools/                # Agent tools (callable by agents)
│       │   ├── __init__.py
│       │   ├── registry.py       # Tool registry and dispatcher
│       │   ├── github.py         # GitHub API tools
│       │   ├── browser.py        # Playwright browser tools
│       │   ├── filesystem.py     # Sandboxed file system tools
│       │   ├── figma.py          # Figma API tools
│       │   └── search.py         # Web search tools
│       │
│       ├── models/               # SQLAlchemy ORM models
│       │   ├── __init__.py
│       │   ├── conversation.py   # Conversation and Message models
│       │   ├── memory.py         # Memory embedding models
│       │   ├── project.py        # Project and Task models
│       │   ├── agent.py          # Agent and agent log models
│       │   └── user.py           # User and preference models
│       │
│       ├── schemas/              # Pydantic request/response schemas
│       │   ├── __init__.py
│       │   ├── chat.py
│       │   ├── memory.py
│       │   ├── project.py
│       │   ├── agent.py
│       │   └── auth.py
│       │
│       ├── services/             # Business logic layer
│       │   ├── __init__.py
│       │   ├── chat_service.py   # Chat session management
│       │   ├── auth_service.py   # Authentication business logic
│       │   ├── project_service.py
│       │   └── agent_service.py
│       │
│       ├── tasks/                # Celery background tasks
│       │   ├── __init__.py
│       │   ├── worker.py         # Celery app configuration
│       │   ├── embedding.py      # Async embedding tasks
│       │   └── agent_tasks.py    # Long-running agent tasks
│       │
│       └── tests/                # Test suite
│           ├── __init__.py
│           ├── conftest.py       # Pytest fixtures
│           ├── test_api/
│           ├── test_core/
│           ├── test_agents/
│           ├── test_memory/
│           └── test_providers/
│
├── frontend/                     # React + TypeScript + Tailwind
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── index.html
│   │
│   └── src/
│       ├── main.tsx              # React entry point
│       ├── App.tsx               # Root component and routing
│       │
│       ├── components/           # Reusable UI components
│       │   ├── ui/               # Base design system components
│       │   ├── chat/             # Chat interface components
│       │   ├── memory/           # Memory explorer components
│       │   ├── projects/         # Project board components
│       │   └── agents/           # Agent activity components
│       │
│       ├── pages/                # Route-level page components
│       │   ├── ChatPage.tsx
│       │   ├── DashboardPage.tsx
│       │   ├── MemoryPage.tsx
│       │   ├── ProjectsPage.tsx
│       │   ├── AgentsPage.tsx
│       │   └── SettingsPage.tsx
│       │
│       ├── hooks/                # Custom React hooks
│       ├── store/                # State management (Zustand or Redux Toolkit)
│       ├── api/                  # API client and typed fetchers
│       ├── types/                # TypeScript type definitions
│       └── utils/                # Utility functions
│
├── scripts/                      # Utility scripts
│   ├── setup_db.py               # Database initialisation script
│   ├── create_admin.py           # Create admin user
│   ├── seed_data.py              # Development seed data
│   └── backup_db.sh              # Database backup
│
└── workspace/                    # JARVIS agent working directory (sandboxed)
    ├── projects/                 # Per-project agent workspaces
    ├── research/                 # Research output files
    ├── generated/                # AI-generated code and assets
    └── exports/                  # Exported reports and documents
```

---

## Phase Build Order

The structure is built incrementally. Here is what gets created in each phase:

| Phase | Directories Created |
|-------|-------------------|
| Phase 1 | `backend/`, `jarvis/main.py`, `api/v1/chat.py`, `api/v1/auth.py`, `models/`, `schemas/`, `config.py`, `database.py` |
| Phase 2 | `memory/`, `tasks/embedding.py`, `providers/` |
| Phase 3 | `agents/`, `core/`, `tasks/agent_tasks.py` |
| Phase 4 | `frontend/` (complete) |
| Phase 5 | `tools/` |
| Phase 6 | `voice/` (new module), advanced memory modules |
| Phase 7 | `scripts/`, `docs/`, monitoring stack |
| Phase 8 | Full agent roster, `workspace/` structure |

---

## Key Architecture Conventions

### File Naming
- Python: `snake_case.py`
- TypeScript: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- Database migrations: `YYYYMMDD_HHMM_description.py`

### Import Organisation
```python
# 1. Standard library
import asyncio
from typing import Optional

# 2. Third-party
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession

# 3. Internal
from jarvis.config import settings
from jarvis.models.conversation import Conversation
```

### Environment Separation
- `.env` → Local development (never committed)
- `.env.example` → Committed template with no real values
- Docker environment injection → Staging and Production

---

*Structure will be updated at each phase transition to reflect newly created modules.*
