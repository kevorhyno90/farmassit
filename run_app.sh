#!/bin/bash

echo "========================================"
echo "Farm Management System Launcher"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3 from your package manager"
    echo "  Ubuntu/Debian: sudo apt install python3 python3-pip python3-tk"
    echo "  macOS: brew install python3"
    exit 1
fi

# Check if required packages are installed
echo "Checking dependencies..."

if ! python3 -c "import tkinter" 2>/dev/null; then
    echo "ERROR: tkinter is not available"
    echo "Install with: sudo apt install python3-tk"
    exit 1
fi

if ! python3 -c "import docx" 2>/dev/null; then
    echo "Installing required packages..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
fi

echo ""
echo "Starting Farm Management System..."
echo ""

python3 main.py

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Application failed to start"
    echo "Please check the error message above"
    read -p "Press Enter to continue..."
fi
