@echo off
REM Drive Clone - Quick Start Script for Windows

echo.
echo 🚀 Drive Clone - Quick Start
echo.

REM Check for Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)
echo ✓ Docker found

REM Check for Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed.
    pause
    exit /b 1
)
echo ✓ Docker Compose found

echo.
echo 📝 Setting up environment files...

if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo ✓ Created backend\.env
)

if not exist frontend\.env (
    copy frontend\.env.example frontend\.env
    echo ✓ Created frontend\.env
)

echo.
echo 🐳 Starting services with Docker Compose...
echo.

docker-compose up -d

echo.
echo ✓ Services started!
echo.
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak

echo.
echo 📌 Application URLs:
echo    Frontend:   http://localhost:5173
echo    Backend:    http://localhost:3000
echo    LocalStack: http://localhost:4566
echo.
echo 📝 Useful commands:
echo    View logs:  docker-compose logs -f
echo    Stop:       docker-compose down
echo    Restart:    docker-compose restart
echo.
pause
