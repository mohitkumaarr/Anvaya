# Anvaya - Development Startup Script
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "Anvaya — National Land Governance Research & Policy Platform" -ForegroundColor Yellow
Write-Host "Starting Full-Stack Platform in Demo Environment Mode..." -ForegroundColor Green
Write-Host "==========================================================================" -ForegroundColor Cyan

# 1. Check or Run Database Seed
Write-Host "[1/3] Checking Database and Demo Seeds..." -ForegroundColor Yellow
python backend/seed.py

# 2. Launch Backend in background process or new window
Write-Host "[2/3] Launching FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python scripts/start_backend.py"

# 3. Launch Frontend
Write-Host "[3/3] Launching Vite React Frontend on http://localhost:5173..." -ForegroundColor Green
Set-Location frontend
npm run dev
