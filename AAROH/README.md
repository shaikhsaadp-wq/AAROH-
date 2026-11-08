# AAROH AI — Phase 1: Interactive 3D Virtual Office

> **Virtual AI Company Platform** | Phase 1 — Foundation

AAROH AI is a personal AI assistant and virtual software company platform. Phase 1 delivers a fully interactive isometric 3D virtual office with a live FastAPI backend, six simulated AI agents, and nine department zones.

---

## 🏗 Project Structure

```
jarvis/
├── backend/          ← Python 3.14 + FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── api/v1/   ← agents, departments, projects, tasks, commands
│   │   ├── core/     ← config, logging, in-memory store
│   │   ├── providers/mock.py  ← Mock AI (zero cost)
│   │   └── schemas/schemas.py
│   └── tests/test_api.py  ← 26 integration tests
└── frontend/         ← React + TypeScript + Three.js
    └── src/
        ├── components/office/  ← 3D scene, agents, furniture
        ├── components/ui/      ← panels, command bar, topbar
        ├── store/useStore.ts   ← Zustand global state
        ├── api/client.ts       ← FastAPI client
        └── types/index.ts      ← shared TypeScript types
```

---

## ⚡ Quick Start (Windows)

### 1 — Start the Backend

Open **Terminal 1**:

```powershell
$env:PYTHONPATH = "C:\AAROH\jarvis\backend"
cd C:\AAROH\jarvis\backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend is live at: `http://127.0.0.1:8000`  
Interactive API docs: `http://127.0.0.1:8000/docs`

### 2 — Start the Frontend

Open **Terminal 2**:

```powershell
cd C:\AAROH\jarvis\frontend
npm run dev
```

Frontend is live at: `http://localhost:5173`

> Open `http://localhost:5173` in your browser. The 3D office will load automatically and connect to the backend.

---

## 🧪 Run Backend Tests

```powershell
$env:PYTHONPATH = "C:\AAROH\jarvis\backend"
cd C:\AAROH\jarvis\backend
python -m pytest tests/ -v --tb=short
```

**Result: 26/26 tests pass.**

---

## 🏢 Virtual Office — Departments

| Zone | Department | Color |
|------|-----------|-------|
| CEO Office | JARVIS Core + Alex (PM) | Indigo |
| Research | Emma — Research Agent | Sky Blue |
| Product & Design | Sophia — Design Agent | Pink |
| Engineering | Ben — Engineering Agent | Emerald |
| QA & Testing | Liam — QA Agent | Amber |
| Meeting Room | All agents | Violet |
| Documentation | — | Slate |
| DevOps / Server Room | — | Red |
| Reception | — | Orange |

---

## 🤖 Simulated AI Agents

> ⚠ **All agents are SIMULATED.** They are not connected to any real AI model. All responses are mock data clearly labeled `[SIMULATED]`.

| Agent | Role | Status |
|-------|------|--------|
| JARVIS Core | Central Coordinator | Working |
| Alex | Project Manager | Working |
| Emma | Research Agent | Working |
| Sophia | Product & Design | Idle |
| Ben | Engineering Agent | Working |
| Liam | QA Agent | Meeting |

---

## 🎮 Controls

| Action | How |
|--------|-----|
| Orbit / Rotate | Click + Drag |
| Zoom | Scroll wheel |
| Pan | Right-click + Drag |
| Select Agent | Click on character |
| Select Department | Click on floor zone |
| Open Command Panel | `⌾ Command` button (top-right) |
| Deselect | Click empty space or ✕ on panel |

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.14.7, FastAPI 0.115.5, Uvicorn 0.54.0 |
| Backend validation | Pydantic 2.14.2, Pydantic-Settings 2.16.2 |
| Backend tests | pytest 9.2.0, requests 2.34.2 |
| Frontend | React 18.3.1, TypeScript 5.6, Vite 5.4 |
| 3D rendering | Three.js 0.170, React Three Fiber 8.18, Drei 9.x |
| State management | Zustand 5.0 |
| Styling | Tailwind CSS 3.4 |
| Package manager | npm |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/agents` | List all agents |
| GET | `/api/agents/{id}` | Get agent by ID |
| POST | `/api/agents` | Create agent |
| PATCH | `/api/agents/{id}` | Update agent |
| DELETE | `/api/agents/{id}` | Delete agent |
| GET | `/api/departments` | List departments |
| GET | `/api/departments/{id}` | Get department |
| POST | `/api/departments` | Create department |
| GET | `/api/projects` | List projects |
| GET | `/api/tasks` | List tasks |
| POST | `/api/commands` | Send command (mock AI) |

---

## ⚙ Environment Configuration

Copy `.env.example` to `.env` in `backend/`:

```powershell
copy C:\AAROH\jarvis\backend\.env.example C:\AAROH\jarvis\backend\.env
```

No secrets required for Phase 1 — all AI is mocked.

---

## 🚧 Known Limitations (Phase 1)

- **In-memory data store** — data resets when the backend restarts
- **Mock AI only** — no Claude / GPT / Gemini integration yet
- **No authentication** — no login system yet
- **No persistent memory** — PostgreSQL added in Phase 3
- **Agents are simulated** — no real task execution

---

## 🗺 Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Foundation + 3D Virtual Office | ✅ Complete |
| 2 | Real-time WebSockets + Agent Activity | 🔜 Next |
| 3 | PostgreSQL + pgvector Memory | Planned |
| 4 | Claude AI Integration | Planned |
| 5 | LangGraph Multi-Agent Orchestration | Planned |
| 6 | Voice Interface | Planned |
| 7 | GitHub & External Integrations | Planned |
| 8 | Production Deployment | Planned |

---

## 📋 Development Notes

- Use `python -m pip` (not `pip` directly) on Windows — blocked by App Control policy
- All network operations in tests use `uvicorn` subprocess + `requests` (not `TestClient`) due to Python 3.14 / Starlette asyncio compatibility on Windows
- Frontend proxy (`/api → http://127.0.0.1:8000/api`) is configured in `vite.config.ts`

