@echo off
title Smart Soil Detection and Crop Recommendation
echo ========================================================
echo  Starting Smart Soil Detection and Crop Recommendation
echo ========================================================
echo.

echo Starting Backend server on http://127.0.0.1:8000 ...
start "Smart Soil - Backend" cmd /k "cd /d %~dp0backend && .venv\Scripts\activate && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo Starting Frontend server on http://localhost:5173 ...
start "Smart Soil - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Opening app in your browser...
start http://localhost:5173

echo.
echo All services launched!
echo - Frontend: http://localhost:5173
echo - Backend:  http://127.0.0.1:8000
echo - Swagger:  http://127.0.0.1:8000/docs
echo.
pause
