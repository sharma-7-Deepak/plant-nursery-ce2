@echo off
echo ========================================
echo   PLANT NURSERY - DEVELOPMENT SERVER
echo ========================================
echo.

REM Change to the backend directory
cd /d "C:\Users\HP\Desktop\BEE-II\plant-nursery-website\backend"

echo Current directory: %CD%
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting development server...
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

REM Start the server
npm run dev

pause