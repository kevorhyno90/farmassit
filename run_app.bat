@echo off
echo ========================================
echo Farm Management System Launcher
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

REM Check if required packages are installed
echo Checking dependencies...
python -c "import tkinter" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: tkinter is not available
    echo Please reinstall Python and ensure all components are installed
    pause
    exit /b 1
)

python -c "import docx" 2>nul
if %errorlevel% neq 0 (
    echo Installing required packages...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting Farm Management System...
echo.
python main.py

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Application failed to start
    echo Please check the error message above
    pause
)
