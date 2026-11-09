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

$backendPath = Join-Path $PSScriptRoot "backend"
$env:PYTHONPATH = $backendPath
$env:DEBUG = "true"
Set-Location $backendPath
$pythonPath = Join-Path $backendPath ".venv\Scripts\python.exe"
if (-not (Test-Path $pythonPath)) { $pythonPath = "python" }

Write-Host "  Starting FastAPI on http://127.0.0.1:8000 ..." -ForegroundColor Green
Write-Host "  API Docs: http://127.0.0.1:8000/docs" -ForegroundColor DarkGray
Write-Host "  Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

& $pythonPath -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

