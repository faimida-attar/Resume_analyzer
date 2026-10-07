@echo off
echo =========================================
echo Starting Resume Analyzer (Local Launcher)
echo =========================================

echo Starting Backend API...
start "Backend" cmd /k "cd backend && pip install -r requirements.txt && python app.py"

echo Starting Frontend UI...
start "Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Waiting a few seconds for servers to initialize...
timeout /t 10 /nobreak >nul

echo.
echo Opening the app in your default web browser...
start http://localhost:5173

echo.
echo Both servers are now running in separate windows.
echo To stop them, simply close the black terminal windows.
pause
