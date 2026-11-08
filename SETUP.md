# JARVIS — Environment Setup Guide

> **Document Version:** 1.0  
> **Created:** 2026-11-05  
> **Platform:** Windows 11 (Primary Development)

---

## Environment Inspection Summary

The following was discovered during initial workspace inspection on 2026-11-05.

### Installed & Available

| Tool | Version | Status |
|------|---------|--------|
| Python | 3.14.7 | ✅ Installed (`C:\Program Files\Python314`) |
| pip | 26.2.1 (via `python -m pip`) | ✅ Available |
| Node.js | 24.19.0 | ✅ Installed |
| npm | 11.17.0 | ✅ Installed |
| npx | Available | ✅ Installed |
| Git | 2.55.0 | ✅ Installed |
| PostgreSQL | 18.6 | ✅ Installed |
| Git Identity | shaikhsaadp wq `<shaikhsaadp@gmail.com>` | ✅ Configured |

### Missing / Requires Installation

| Tool | Priority | Required For |
|------|----------|-------------|
| Docker Desktop | 🔴 Critical | Phase 1 — containerised dev environment |
| Redis | 🔴 Critical | Phase 1 — caching and task queue |
| pnpm | 🟡 High | Phase 4 — faster frontend package management |
| uvicorn | 🟡 High | Phase 1 — FastAPI server |
| pgvector | 🟡 High | Phase 2 — vector embeddings in PostgreSQL |

### Python Packages Currently Installed (Pre-JARVIS)
`matplotlib`, `numpy`, `pillow`, `fpdf2`, `defusedxml` — these are for existing projects and will not be disturbed.

---

## Prerequisites

### Step 1 — Install Docker Desktop

1. Download from: https://www.docker.com/products/docker-desktop/
2. Install and restart Windows
3. Enable WSL2 backend (recommended)
4. Verify: `docker --version` and `docker compose version`

> **Why Docker?**  
> JARVIS runs PostgreSQL + Redis + the application itself in containers during development to ensure reproducible environments. This is mandatory from Phase 1.

---

### Step 2 — Install Redis (via Docker — Recommended)

Once Docker is installed, Redis will run as a container. No separate Windows installation needed.

```bash
# This will be handled automatically by docker-compose.yml in Phase 1
docker run -d -p 6379:6379 redis:7-alpine
```

---

### Step 3 — Verify PostgreSQL

PostgreSQL 18.6 is already installed. Verify it is running:

```powershell
# Check service status
Get-Service -Name postgresql*

# Start if not running
Start-Service -Name postgresql-x64-18

# Verify connection
psql -U postgres -c "SELECT version();"
```

---

### Step 4 — Install pgvector Extension

```powershell
# Connect to PostgreSQL as superuser
psql -U postgres

# Enable extension (run once per database)
CREATE EXTENSION IF NOT EXISTS vector;
```

> **Note:** pgvector may need to be downloaded separately for PostgreSQL 18. Check: https://github.com/pgvector/pgvector

---

### Step 5 — Install pnpm (Frontend)

```powershell
# Install pnpm globally via npm
npm install -g pnpm

# Verify
pnpm --version
```

---

## JARVIS Project Setup (Phase 1)

### Step 1 — Create Project Directory

```powershell
cd C:\AAROH
mkdir jarvis
cd jarvis
git init
```

### Step 2 — Create Virtual Environment

```powershell
# Create isolated Python environment
python -m venv .venv

# Activate it
.venv\Scripts\Activate.ps1

# Upgrade pip inside venv
python -m pip install --upgrade pip
```

### Step 3 — Install Python Dependencies

```powershell
pip install fastapi "uvicorn[standard]" sqlalchemy alembic asyncpg psycopg2-binary
pip install "pydantic>=2" pydantic-settings "python-jose[cryptography]" "passlib[bcrypt]"
pip install anthropic python-dotenv redis celery
pip install pytest pytest-asyncio httpx
```

### Step 4 — Configure Environment Variables

Create a `.env` file in the project root (this file is **git-ignored** and **never committed**):

```env
# =============================================================
# JARVIS ENVIRONMENT CONFIGURATION
# NEVER commit this file. Add .env to .gitignore immediately.
# =============================================================

# Application
APP_NAME=JARVIS
APP_ENV=development
APP_SECRET_KEY=<generate-a-long-random-string>
DEBUG=true

# Database
DATABASE_URL=postgresql+asyncpg://postgres:<password>@localhost:5432/jarvis_db
POSTGRES_DB=jarvis_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<your-postgres-password>

# Redis
REDIS_URL=redis://localhost:6379/0

# AI Providers (obtain from respective developer portals)
ANTHROPIC_API_KEY=<your-claude-api-key>
OPENAI_API_KEY=<your-openai-api-key-optional>
GOOGLE_API_KEY=<your-gemini-api-key-optional>

# Active AI Provider
PRIMARY_AI_PROVIDER=claude
PRIMARY_AI_MODEL=claude-sonnet-4-5

# GitHub Integration (Phase 5)
GITHUB_TOKEN=<your-github-pat-optional>
GITHUB_USERNAME=<your-github-username>

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json
```

### Step 5 — Initialise Database

```powershell
# Create the JARVIS database
psql -U postgres -c "CREATE DATABASE jarvis_db;"

# Enable pgvector extension
psql -U postgres -d jarvis_db -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Run Alembic migrations (once backend is scaffolded in Phase 1)
alembic upgrade head
```

### Step 6 — Start Development Server

```powershell
# From project root with venv activated
uvicorn jarvis.main:app --reload --host 0.0.0.0 --port 8000
```

---

## API Keys — Where to Obtain

| Provider | Portal | Required |
|----------|--------|----------|
| Anthropic (Claude) | https://console.anthropic.com | 🔴 Phase 1 |
| OpenAI | https://platform.openai.com | 🟡 Phase 5 |
| Google AI (Gemini) | https://ai.google.dev | 🟡 Phase 5 |
| GitHub | https://github.com/settings/tokens | 🟡 Phase 5 |
| Tavily Search | https://tavily.com | 🟡 Phase 3 |
| ElevenLabs | https://elevenlabs.io | 🟢 Phase 6 |

---

## Git Setup for JARVIS Project

```powershell
# .gitignore — MUST be created before first commit
# Already configured: shaikhsaadp wq <shaikhsaadp@gmail.com>

git config --global core.autocrlf true   # Windows line endings

# Template .gitignore content — apply to jarvis/.gitignore
# .env
# .venv/
# __pycache__/
# *.pyc
# .pytest_cache/
# node_modules/
# dist/
# build/
# *.log
# .DS_Store
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `pip.exe` blocked by Application Control | Use `python -m pip` instead of `pip` directly |
| PowerShell script execution blocked | Run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| PostgreSQL connection refused | Check service is running: `Get-Service postgresql*` |
| `pgvector` not found | Download pre-built binaries from pgvector GitHub releases |
| Docker requires WSL2 | Enable WSL2 via `wsl --install` in admin PowerShell |

---

*Setup guide will be updated at the start of each phase with new installation steps.*
