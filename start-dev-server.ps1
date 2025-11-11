# Plant Nursery Development Server Startup Script
# This script ensures we're in the correct directory and starts the server

Write-Host "========================================" -ForegroundColor Green
Write-Host "   PLANT NURSERY - DEVELOPMENT SERVER" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Get the script directory and navigate to backend
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $scriptPath "backend"

Write-Host "Script location: $scriptPath" -ForegroundColor Yellow
Write-Host "Backend path: $backendPath" -ForegroundColor Yellow

# Change to backend directory
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "Changed to directory: $(Get-Location)" -ForegroundColor Green
} else {
    Write-Host "Error: Backend directory not found at $backendPath" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found in current directory" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Red
    exit 1
}

Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
try {
    npm run dev
} catch {
    Write-Host "Error starting server: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to continue..."
}