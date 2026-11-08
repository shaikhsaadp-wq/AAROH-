#!/usr/bin/env pwsh
# AAROH AI — Run Backend Tests

Write-Host ""
Write-Host "  AAROH AI — Backend Test Suite" -ForegroundColor Yellow
Write-Host "  26 integration tests via uvicorn subprocess + requests" -ForegroundColor DarkGray
Write-Host ""

$env:PYTHONPATH = "C:\AAROH\jarvis\backend"
Set-Location "C:\AAROH\jarvis\backend"

python -m pytest tests/ -v --tb=short

