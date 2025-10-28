@echo off
echo ================================================
echo    Local Service Business IDE - Development
echo ================================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from: https://nodejs.org/
    echo Choose the LTS version and restart this script
    pause
    exit /b 1
)

echo Node.js is installed!
echo.

echo Checking if Ollama is available...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Ollama is not installed or not in PATH
    echo Please install Ollama from: https://ollama.ai/
    echo The app will work with fallback HTML generation
    echo.
)

echo Installing backend dependencies...
cd backend
if not exist node_modules (
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
)

echo Installing frontend dependencies...
cd ../frontend
if not exist node_modules (
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

echo.
echo ================================================
echo    Starting Local Service Business IDE
echo ================================================
echo.
echo The application will start in multiple windows:
echo   - Backend server on http://localhost:5000
echo   - Frontend application on http://localhost:3000
echo.
echo Close any window to stop the application.
echo.

cd ../

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting frontend application...
start "Frontend App" cmd /k "cd frontend && npm start"

echo.
echo ================================================
echo Both servers are starting...
echo Frontend will open automatically in your browser
echo If not, visit: http://localhost:3000
echo ================================================
echo.
echo Press any key to exit this launcher...
pause >nul