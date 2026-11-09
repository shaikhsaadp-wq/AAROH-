#!/usr/bin/env pwsh
# AAROH AI — Start Frontend
# Run this in a SECOND terminal window (backend must be running first)

Write-Host ""
Write-Host "  AAROH AI — Frontend (Phase 1)" -ForegroundColor Magenta
Write-Host "  React + TypeScript + Three.js + Vite" -ForegroundColor DarkGray
Write-Host ""

$frontendPath = Join-Path $PSScriptRoot "frontend"
Set-Location $frontendPath

Write-Host "  Starting Vite dev server on http://localhost:5173 ..." -ForegroundColor Green
Write-Host "  Proxying /api -> http://127.0.0.1:8000" -ForegroundColor DarkGray
Write-Host "  Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

npm run dev

