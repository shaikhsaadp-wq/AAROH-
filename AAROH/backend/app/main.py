"""
AAROH AI — FastAPI Application Entry Point
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    logger.info("AAROH AI backend starting — provider: %s", settings.primary_ai_provider)
    yield
    logger.info("AAROH AI backend shutting down")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "AAROH AI — Phase 1 Backend API\n\n"
        "**Note:** AI responses in Phase 1 use the Mock provider and are clearly "
        "labelled as SIMULATED. No paid API calls are made."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Global error handler ────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error("Unhandled exception on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )

# ─── Routes ──────────────────────────────────────────────────────────────────
app.include_router(api_router)

# Root redirect
from fastapi.responses import RedirectResponse

@app.get("/", include_in_schema=False)
async def root() -> RedirectResponse:
    return RedirectResponse(url="/docs")

