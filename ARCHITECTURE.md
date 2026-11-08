# JARVIS — System Architecture

> **Document Version:** 1.0  
> **Created:** 2026-11-05  
> **Status:** Draft — Awaiting Founder Approval  
> **Author:** JARVIS CTO / Lead Architect

---

## 1. Vision & Core Principles

JARVIS is not a chatbot. It is a **living AI virtual company** — an orchestrated system of specialised AI agents backed by persistent memory, production-grade infrastructure, and a human-in-the-loop governance model.

### Design Principles

| Principle | Description |
|-----------|-------------|
| **Modularity** | Every department, agent, and service is independently deployable and replaceable |
| **Persistence** | All memory, decisions, and artefacts are stored and version-controlled |
| **Auditability** | Every AI action is logged with reasoning, inputs, and outputs |
| **Security-first** | Credentials never touch code; least-privilege access everywhere |
| **Human oversight** | Founder approval gates every high-impact action |
| **Provider agnosticism** | AI provider can be swapped without changing business logic |

---

## 2. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        JARVIS PLATFORM                              │
│                                                                     │
│  ┌──────────┐    ┌──────────────────────────────────────────────┐  │
│  │ FOUNDER  │◄──►│            JARVIS CORE BRAIN                 │  │
│  │ (You)    │    │  - Intent Parser    - Memory Router           │  │
│  └──────────┘    │  - Task Planner     - Context Manager        │  │
│                  │  - Agent Orchestrator (LangGraph)             │  │
│                  └──────────────┬───────────────────────────────┘  │
│                                 │                                   │
│          ┌──────────────────────┼──────────────────────┐           │
│          ▼                      ▼                      ▼           │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐ │
│  │  RESEARCH    │    │   ENGINEERING    │    │   DESIGN         │ │
│  │  DEPARTMENT  │    │   DEPARTMENT     │    │   DEPARTMENT     │ │
│  └──────────────┘    └──────────────────┘    └──────────────────┘ │
│          │                      │                      │           │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐ │
│  │   QA &       │    │   DEVOPS &       │    │   PRODUCT        │ │
│  │   TESTING    │    │   INFRA          │    │   MANAGEMENT     │ │
│  └──────────────┘    └──────────────────┘    └──────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   SHARED INFRASTRUCTURE                     │   │
│  │  PostgreSQL+pgvector │ Redis │ FastAPI Gateway │ File Store  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Architecture

### 3.1 JARVIS Core Brain

The central orchestration layer. All requests — text, voice, or programmatic — enter here.

```
JARVIS Core Brain
├── Intent Parser          → Classifies and routes incoming requests
├── Context Manager        → Assembles relevant memory and project context
├── Task Planner           → Breaks goals into executable sub-tasks
├── Agent Orchestrator     → LangGraph state machine managing agent execution
├── Memory Router          → Decides what gets stored, retrieved, and forgotten
└── Response Synthesizer   → Aggregates agent outputs into coherent responses
```

**Technology:** Python 3.14, LangGraph, FastAPI

### 3.2 API Gateway (FastAPI)

```
                      HTTP / WebSocket
                           │
                    ┌──────▼──────┐
                    │  FastAPI    │
                    │  Gateway   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    /api/chat       /api/agents      /api/memory
    /api/projects   /api/tools       /api/admin
    /api/voice      /api/files       /api/status
```

### 3.3 Memory Architecture (Four-Tier)

```
Tier 1 — Working Memory (In-process)
  └── Current conversation context, active task state, agent scratchpad

Tier 2 — Short-Term Memory (Redis, TTL-based)
  └── Recent conversations (7 days), active project context, session data

Tier 3 — Long-Term Memory (PostgreSQL + pgvector)
  └── All conversations (embedded), project history, decisions, preferences
  └── Semantic search via cosine similarity on 1536-dim embeddings

Tier 4 — Archival Storage (File System + Git)
  └── Generated files, code artefacts, documentation, exported reports
```

### 3.4 AI Provider Layer (Provider-Agnostic)

```python
# Abstract interface — any provider implements this
class AIProvider(Protocol):
    async def complete(self, messages, model, tools) -> Response: ...
    async def embed(self, text) -> list[float]: ...
    async def stream(self, messages, model) -> AsyncIterator[str]: ...

# Concrete implementations
providers/
├── claude.py      # Anthropic Claude (primary)
├── gemini.py      # Google Gemini (secondary)
├── openai.py      # OpenAI GPT (tertiary)
└── local.py       # Local Ollama (offline fallback)
```

---

## 4. AI Department Architecture

### Department Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                     JARVIS AI DEPARTMENTS                          │
├──────────────────┬─────────────────────────────────────────────────┤
│ Department       │ Agents                                          │
├──────────────────┼─────────────────────────────────────────────────┤
│ Research         │ Web Researcher, Data Analyst, Report Writer     │
│ Engineering      │ Architect, Frontend Dev, Backend Dev, DB Admin  │
│ Design           │ UI Designer, UX Analyst, Asset Generator        │
│ QA & Testing     │ Test Writer, Bug Analyst, Security Auditor      │
│ DevOps & Infra   │ CI/CD Manager, Docker Orchestrator, Monitor     │
│ Product Mgmt     │ Project Manager, Roadmap Planner, Doc Writer    │
└──────────────────┴─────────────────────────────────────────────────┘
```

### Agent Communication Protocol

```
Agent Message Schema
{
  "agent_id": "string",
  "task_id": "uuid",
  "department": "string",
  "action": "execute | review | request_help | complete | fail",
  "payload": { ... },
  "requires_human_approval": boolean,
  "priority": "critical | high | medium | low",
  "parent_task_id": "uuid | null",
  "created_at": "iso8601"
}
```

### Department Communication Flow

```
Founder Request
     │
     ▼
Core Brain (Task Planner)
     │
     ├──► Research Dept → Findings Report → Core Brain
     │
     ├──► Design Dept → Wireframes / Specs → Engineering Dept
     │
     ├──► Engineering Dept → Code + Tests → QA Dept
     │          │
     │          └──► QA Dept → Bug Report → Engineering Dept (loop)
     │
     ├──► DevOps Dept → Deployment → Monitor
     │
     └──► Product Dept → Documentation → Founder Approval Gate
```

---

## 5. Database Architecture

### 5.1 PostgreSQL Schema (Core Tables)

```sql
-- Conversations & Memory
conversations       (id, session_id, started_at, ended_at, summary, metadata)
messages            (id, conversation_id, role, content, tokens, created_at)
memory_embeddings   (id, content, embedding vector(1536), source, created_at)

-- Projects & Tasks
projects            (id, name, description, status, tech_stack, created_at)
tasks               (id, project_id, title, description, status, assigned_agent, priority)
task_executions     (id, task_id, agent_id, input, output, duration_ms, status)

-- Agents & Departments
agents              (id, name, department, model, system_prompt, capabilities)
agent_logs          (id, agent_id, task_id, action, payload, created_at)

-- Configuration & Preferences
user_preferences    (id, key, value, updated_at)
api_configurations  (id, provider, model, endpoint, is_active)  -- NO keys stored here
```

### 5.2 Redis Key Schema

```
jarvis:session:{session_id}          → Active session data (TTL 24h)
jarvis:context:{project_id}         → Project context cache (TTL 1h)
jarvis:task:queue                   → Celery/background task queue
jarvis:rate_limit:{provider}        → API rate limiting counters
jarvis:agent:status:{agent_id}      → Live agent status
```

---

## 6. Security Architecture

### 6.1 Credential Management

```
NEVER stored in code or repository:
├── API keys (Claude, Gemini, OpenAI, etc.)
├── Database passwords
├── Redis authentication
└── GitHub tokens

Storage hierarchy:
├── Development  → .env file (git-ignored, local only)
├── Production   → Environment variables injected at runtime
└── Secrets mgmt → HashiCorp Vault (Phase 5+)
```

### 6.2 Security Layers

```
Layer 1 — Input Validation
  └── Pydantic models on every API endpoint, prompt injection detection

Layer 2 — Authentication & Authorisation
  └── JWT tokens, role-based access (Founder > Admin > Agent > Read-only)

Layer 3 — Agent Sandboxing
  └── File system isolation, network allowlists, command whitelisting

Layer 4 — Audit Logging
  └── Every agent action logged with timestamp, inputs, outputs, decision reasoning

Layer 5 — Approval Gates
  └── High-impact actions (deploy, delete, external API calls >$1) require Founder approval
```

### 6.3 Threat Model

| Threat | Mitigation |
|--------|-----------|
| Prompt injection | Input sanitisation, system prompt hardening, output validation |
| API key leakage | .env + git-ignore, no keys in logs or responses |
| Agent runaway | Token budgets, action limits, mandatory human checkpoints |
| Data exfiltration | Network egress controls, data classification, audit logs |
| Dependency attack | Pinned dependencies, automated vulnerability scanning |

---

## 7. Integration Architecture

### External Service Integrations (Planned)

```
AI Providers          → Claude API, Gemini API, OpenAI API
Version Control       → GitHub API (create repos, PRs, issues)
Design Tools          → Figma API, Canva API
Browser Automation    → Playwright (headless Chrome)
Containerisation      → Docker Engine API
Communication         → Slack / Discord webhooks (optional)
Voice I/O             → Whisper (STT), ElevenLabs / TTS (TBD)
Search                → Tavily / Brave Search API
```

---

## 8. Technology Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend framework | FastAPI | Async-native, automatic OpenAPI docs, Python ecosystem |
| Orchestration | LangGraph | Stateful agent graphs, human-in-the-loop built-in, debuggable |
| Primary AI | Claude API | Superior reasoning for code and architecture tasks |
| Vector DB | pgvector | No separate service needed, full SQL query power |
| Cache / Queue | Redis | Industry standard, Celery integration, pub/sub |
| Frontend | React + TypeScript + Tailwind | Type safety, component reuse, rapid UI |
| Container | Docker | Reproducible environments, easy deployment |
| Auth | JWT + bcrypt | Stateless, simple, well-understood |

---

*Architecture is a living document. All changes must be proposed and approved before implementation.*
