#!/usr/bin/env pwsh
# AAROH AI — Start Backend
# Run this in its own terminal window

Write-Host ""
Write-Host "  ██████  ██████   ██████  ██   ██" -ForegroundColor Cyan
Write-Host " ██    ██ ██   ██ ██    ██ ██   ██" -ForegroundColor Cyan
Write-Host " ███████  ██████  ██    ██ ███████" -ForegroundColor Cyan
Write-Host " ██    ██ ██   ██ ██    ██ ██   ██" -ForegroundColor Cyan
Write-Host " ██    ██ ██   ██  ██████  ██   ██" -ForegroundColor Cyan
Write-Host ""
Write-Host "  AAROH AI — Backend (Phase 1)" -ForegroundColor White
Write-Host "  FastAPI + Mock AI Provider" -ForegroundColor DarkGray
Write-Host ""

$env:PYTHONPATH = "C:\AAROH\jarvis\backend"
Set-Location "C:\AAROH\jarvis\backend"

Write-Host "  Starting FastAPI on http://127.0.0.1:8000 ..." -ForegroundColor Green
Write-Host "  API Docs: http://127.0.0.1:8000/docs" -ForegroundColor DarkGray
Write-Host "  Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

