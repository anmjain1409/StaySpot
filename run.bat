@echo off
REM Quick Start Script for StaySpot Application

echo.
echo ========================================
echo    StaySpot - Full Stack Application
echo ========================================
echo.

REM Check if both services should be started
if "%1"=="both" (
    echo Starting both Backend and Frontend...
    echo.
    
    REM Start Backend in one window
    echo Starting Backend on http://localhost:8080
    start cmd /k "cd backend && mvn spring-boot:run"
    
    timeout /t 3 /nobreak
    
    REM Start Frontend in another window
    echo Starting Frontend on http://localhost:5173
    start cmd /k "cd frontend && npm run dev"
    
    echo.
    echo Both services are starting...
    echo Backend: http://localhost:8080
    echo Frontend: http://localhost:5173
) else if "%1"=="backend" (
    echo Starting Backend only...
    cd backend
    mvn spring-boot:run
) else if "%1"=="frontend" (
    echo Starting Frontend only...
    cd frontend
    npm run dev
) else (
    echo.
    echo Usage: run.bat [option]
    echo.
    echo Options:
    echo   both       - Start both backend and frontend
    echo   backend    - Start backend only
    echo   frontend   - Start frontend only
    echo   (no args)  - Show this help message
    echo.
    echo Examples:
    echo   run.bat both
    echo   run.bat backend
    echo   run.bat frontend
    echo.
)
