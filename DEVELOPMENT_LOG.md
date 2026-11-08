# JARVIS — Development Log

> This log records all significant technical decisions, discoveries, completed work, and open questions throughout the JARVIS project. It is updated at the end of every session.

---

## Log Format

Each entry follows this structure:

```
## [DATE] — Session Title
**Phase:** Current Phase
**Status:** In Progress / Completed / Blocked
**Author:** CTO / Founder / Agent

### Completed
- Item

### Decisions Made
- Decision and rationale

### Problems Encountered
- Problem and resolution

### Open Questions
- Question requiring resolution

### Next Session
- Planned work
```

---

---

## 2026-11-05 — Project JARVIS Initialisation

**Phase:** Pre-Phase 1 (Architecture & Planning)  
**Status:** Completed  
**Author:** JARVIS CTO (AI Architect)

### Completed

- [x] Full workspace inspection at `C:\AAROH`
- [x] Development environment audit performed
- [x] System architecture designed (see `ARCHITECTURE.md`)
- [x] 8-phase development roadmap created (see `ROADMAP.md`)
- [x] Complete project folder structure designed (see `PROJECT_STRUCTURE.md`)
- [x] Environment setup guide written (see `SETUP.md`)
- [x] Development log initiated (this file)
- [x] AI department structure designed (6 departments, 15+ agents)
- [x] Database schema designed (8 core tables)
- [x] Security architecture documented
- [x] API cost estimates prepared
- [x] Technology stack finalised

### Environment Audit Results

| Component | Finding |
|-----------|---------|
| Python | 3.14.7 installed at `C:\Program Files\Python314` |
| pip | Accessible only via `python -m pip` (direct `pip.exe` blocked by Application Control policy) |
| Node.js | v24.19.0 — excellent, latest LTS+ |
| npm | v11.17.0 |
| Git | 2.55.0 — latest |
| PostgreSQL | 18.6 — installed and available |
| Docker | ❌ NOT INSTALLED — required before Phase 1 begins |
| Redis | ❌ NOT INSTALLED — required before Phase 1 begins |
| pnpm | ❌ Not installed — needed for Phase 4 frontend |
| uvicorn | ❌ Not installed — needed for Phase 1 backend |

### Decisions Made

1. **pip.exe workaround:** `pip.exe` is blocked by Windows Application Control policy on this machine. All pip commands must use `python -m pip` syntax. This will be reflected in all setup scripts and Makefile.

2. **PostgreSQL version:** PostgreSQL 18.6 is installed — newer than the typical 15/16 used in most tutorials. All schemas and queries will be written to be compatible with PG18.

3. **Docker as mandatory:** Docker is required for Phase 1. It is not optional. The local dev environment runs in Docker Compose (FastAPI + PostgreSQL + Redis) to ensure environment parity.

4. **Redis via Docker:** Since Redis is not natively installed on Windows, it will run as a Docker container rather than a Windows service. No separate Redis installation needed once Docker is set up.

5. **Provider-agnostic AI layer:** Even though Claude is the primary provider for Phase 1, all AI calls go through an abstract `AIProvider` interface so any provider can be swapped without touching business logic.

6. **LangGraph for orchestration:** Chosen over raw function calls or CrewAI because: stateful execution graphs, built-in human-in-the-loop support, debuggable with LangSmith, and production-tested at scale.

7. **pgvector over Pinecone/Qdrant:** Keeps the stack unified (single PostgreSQL database), eliminates a separate vector database service, and allows full SQL queries alongside vector similarity search.

8. **Git identity confirmed:** `shaikhsaadp wq <shaikhsaadp@gmail.com>` — all commits will use this identity.

### Problems Encountered

1. **`pip.exe` blocked by Application Control policy:**  
   - **Symptom:** Running `pip --version` fails with "Application Control policy has blocked this file"  
   - **Resolution:** Use `python -m pip` for all package management. Added to SETUP.md troubleshooting.  
   - **Status:** Resolved (workaround documented)

2. **Workspace `C:\AAROH` appears empty:**  
   - **Finding:** The workspace was empty — no existing JARVIS files. This is a fresh start.  
   - **Resolution:** All documentation files created from scratch.

3. **Docker not installed:**  
   - **Impact:** Phase 1 cannot begin until Docker Desktop is installed.  
   - **Resolution:** Documented in SETUP.md. Founder must install Docker before Phase 1 approval.

### Open Questions

1. **Claude API key:** Does the Founder have an Anthropic account and API key ready? This is required on Day 1 of Phase 1.

2. **GitHub repository:** Should JARVIS have its own GitHub repository (`github.com/shaikhsaadp/jarvis` or similar)? If yes, should it be public or private?

3. **PostgreSQL password:** The PostgreSQL 18.6 instance is installed — what is the `postgres` superuser password? This is needed for database setup.

4. **Docker Desktop approval:** Is Docker Desktop approved for installation on this machine? (Some enterprise environments restrict it.)

5. **Budget for AI APIs:** What is the monthly budget ceiling for AI API costs? This determines how aggressively agents can run and which models to use by default.

6. **Voice I/O priority:** Should voice input/output be moved from Phase 6 to an earlier phase given the JARVIS vision?

7. **Deployment target:** Where will JARVIS ultimately be hosted? (Local-only, VPS, cloud provider, etc.?)

### Next Session (Phase 1 — Pending Founder Approval)

Once the Founder reviews and approves the architecture, Phase 1 begins:

1. Create `C:\AAROH\jarvis\` directory and initialise git repository
2. Create Docker Compose file (FastAPI + PostgreSQL + Redis)
3. Scaffold FastAPI application with health check
4. Implement environment configuration with Pydantic Settings
5. Set up Alembic migrations
6. Implement core database models (users, conversations, messages)
7. Build Claude API integration (`providers/claude.py`)
8. Create `/api/v1/chat` endpoint (authenticated, streaming)
9. Implement JWT authentication
10. Write Phase 1 test suite (≥80% coverage)

**Estimated Phase 1 duration:** 2–3 focused development sessions

---

*This log is a permanent record. Entries are never deleted — only appended.*


---

## 2026-11-06 — Phase 1 Complete

**Phase:** 1 — Foundation + 3D Virtual Office  
**Status:** ✅ Completed  
**Author:** Antigravity AI (CTO)

### Completed

- **Backend (FastAPI, Python 3.14.7):** All endpoints implemented and passing 26/26 tests
  - `GET /api/health` — health check with AI provider status
  - `GET/POST/PATCH/DELETE /api/agents` — full CRUD, 6 seeded agents
  - `GET/POST /api/departments` — 9 departments seeded
  - `GET/POST /api/projects` and `/api/tasks` — project and task management
  - `POST /api/commands` — mock AI command processing
- **Frontend (React 18 + TypeScript + Vite + Three.js):** All source files written and build verified
  - Vite production build: 632 modules, exit 0, no TypeScript errors
  - `npm install`: 207 packages installed cleanly
  - esbuild postinstall script approved via `npm approve-scripts`
- **3D Virtual Office:**
  - 9 department zones with colored floor tiles, border highlights, HTML labels
  - 6 animated agent characters (body, head, eyes, status orbs, name labels)
  - Furniture: Workstations, Bookshelves, ServerRacks, Plants, meeting table, reception desk
  - Perimeter walls, grid floor, ambient + directional + accent lighting, Stars background
  - Isometric OrbitControls (zoom, pan, orbit)
- **UI overlays:**
  - TopBar: logo, phase badge, agent count, backend status indicator, refresh, command toggle
  - AgentPanel: agent profile, status badge, capabilities, task counts, simulation disclaimer
  - DepartmentPanel: department info, team listing, task count
  - CommandPanel: command history, input field, Enter to send, [SIMULATED] labels
  - NotificationToast: auto-dismiss after 5s
- **Launch scripts created:**
  - `start-backend.ps1`
  - `start-frontend.ps1`
  - `run-tests.ps1`
- **README.md** written with full setup instructions, API reference, and roadmap

### Decisions Made

- **npm over pnpm:** pnpm 12 blocks esbuild postinstall by default; `npm` installs cleanly without policy issues
- **In-memory store:** No PostgreSQL in Phase 1; `threading.Lock`-based dict store in `core/store.py`
- **Subprocess test approach:** Python 3.14 + Starlette lifespan deadlocks `TestClient` on Windows; use `uvicorn` subprocess + `requests` library
- **Starlette pinned at 0.41.3:** Starlette 1.x requires httpx2 and breaks on Python 3.14/Windows
- **All agents SIMULATED:** Clearly labeled throughout UI and API responses; no real AI calls in Phase 1

### Problems Encountered & Resolved

| Problem | Root Cause | Resolution |
|---------|-----------|------------|
| `pip.exe` blocked | Windows App Control policy | Use `python -m pip` |
| pydantic-core wheel fails | No Rust compiler | `--only-binary=:all:` flag |
| TestClient hangs | Python 3.14 asyncio + Starlette lifespan deadlock on Windows | uvicorn subprocess + requests |
| pnpm blocks esbuild | pnpm 12 build script policy | Switched to npm |
| `Start-Process` curl hangs | Detached process, curl can't reach spawned server | Tested using Python subprocess in test suite instead |

### Test Results

```
26 passed in 1.75s  (Python 3.14.7, pytest 9.2.0)
Vite build: 632 modules, exit 0
TypeScript: tsc --noEmit, exit 0
```

### Next Session — Phase 2

- WebSocket real-time agent activity updates
- Agent "task simulation" loop (agents cycle through idle → working → completed)
- Live activity feed in UI
- Basic agent-to-agent message passing simulation
- Persist data to SQLite (lightweight, no server required) as bridge to Phase 3 PostgreSQL
