#!/usr/bin/env pwsh
# AAROH AI — Run Backend Tests

Write-Host ""
Write-Host "  AAROH AI — Backend Test Suite" -ForegroundColor Yellow
Write-Host "  26 integration tests via uvicorn subprocess + requests" -ForegroundColor DarkGray
Write-Host ""

$backendPath = Join-Path $PSScriptRoot "backend"
$env:PYTHONPATH = $backendPath
$env:DEBUG = "true"
$env:PYTHONDONTWRITEBYTECODE = "1"
Set-Location $backendPath
$pythonPath = Join-Path $backendPath ".venv\Scripts\python.exe"
if (-not (Test-Path $pythonPath)) { $pythonPath = "python" }

& $pythonPath -m pytest -p no:cacheprovider tests/ -v --tb=short

