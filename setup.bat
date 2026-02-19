@echo off
echo ========================================
echo NPI Strategy Analyst - Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    echo         Download from: https://nodejs.org/
    exit /b 1
)

node --version
echo [OK] Node.js detected
echo.

REM Check if .env exists
if not exist .env (
    echo [INFO] Creating .env file from .env.example...
    copy .env.example .env
    echo [OK] .env file created
    echo.
    echo [WARNING] IMPORTANT: Edit the .env file and add your OpenAI API key!
    echo           Open .env and set: OPENAI_API_KEY=sk-your-actual-key-here
    echo.
    pause
) else (
    echo [OK] .env file already exists
)

echo.
echo [INFO] Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

echo.
echo [INFO] Setting up database...
call npx prisma generate
call npx prisma db push

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to set up database
    exit /b 1
)

echo.
echo [OK] Setup complete!
echo.
echo Next steps:
echo    1. Start the development server:
echo       npm run dev
echo.
echo    2. Open your browser to:
echo       http://localhost:3000
echo.
echo    3. Login with access code:
echo       NPI2030Vision
echo.
echo    4. Go to Knowledge page and click 'Ingest Knowledge'
echo       to process the sample documents
echo.
echo Ready to strategize!
pause
