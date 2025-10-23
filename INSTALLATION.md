# Installation Guide - Farm Management System

## Complete Installation Instructions for All Platforms

### System Requirements

- **Operating System**: Windows 10/11, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **RAM**: Minimum 2GB (4GB recommended)
- **Disk Space**: 100MB for application + space for your data
- **Python**: Version 3.7 or higher

---

## Installation Steps by Platform

### Windows Installation

#### Step 1: Install Python

1. **Download Python**:
   - Visit: https://www.python.org/downloads/
   - Download the latest Python 3.x version (e.g., Python 3.11)

2. **Run the Installer**:
   - Double-click the downloaded file
   - ⚠️ **CRITICAL**: Check the box "Add Python to PATH"
   - Click "Install Now"
   - Wait for installation to complete

3. **Verify Installation**:
   - Open Command Prompt (Windows key + R, type `cmd`, press Enter)
   - Type: `python --version`
   - You should see: `Python 3.x.x`

#### Step 2: Download Farm Management System

**Option A: Using Git** (if you have Git installed)
```cmd
git clone https://github.com/kevorhyno90/farmassit.git
cd farmassit
```

**Option B: Download ZIP** (recommended for beginners)
1. Go to: https://github.com/kevorhyno90/farmassit
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to a location like `C:\FarmAssist`
5. Open Command Prompt in that folder:
   - Navigate to the folder in File Explorer
   - Click in the address bar, type `cmd`, press Enter

#### Step 3: Install Required Packages

In Command Prompt (in the farmassit folder):
```cmd
pip install -r requirements.txt
```

Wait 1-2 minutes for installation to complete.

#### Step 4: Run the Application

**Easy Way** (double-click):
- Double-click `run_app.bat` file

**Command Line Way**:
```cmd
python main.py
```

#### Step 5: (Optional) Create Demo Data

To see the system with sample data:
```cmd
python create_demo_data.py
```
Type `yes` when prompted.

---

### macOS Installation

#### Step 1: Install Python

**Option A: Using Homebrew** (recommended)
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python3
```

**Option B: Official Installer**
1. Visit: https://www.python.org/downloads/
2. Download Python for macOS
3. Run the installer package

#### Step 2: Download Farm Management System

Open Terminal (Cmd + Space, type "Terminal"):

**Option A: Using Git**
```bash
git clone https://github.com/kevorhyno90/farmassit.git
cd farmassit
```

**Option B: Download ZIP**
1. Download from: https://github.com/kevorhyno90/farmassit
2. Extract to a folder like `~/FarmAssist`
3. In Terminal: `cd ~/FarmAssist`

#### Step 3: Install Required Packages

```bash
pip3 install -r requirements.txt
```

#### Step 4: Run the Application

**Easy Way**:
```bash
./run_app.sh
```

**Manual Way**:
```bash
python3 main.py
```

#### Step 5: (Optional) Create Demo Data

```bash
python3 create_demo_data.py
```

---

### Linux Installation (Ubuntu/Debian)

#### Step 1: Install Python and Dependencies

```bash
# Update package list
sudo apt update

# Install Python and required packages
sudo apt install python3 python3-pip python3-tk

# Verify installation
python3 --version
```

#### Step 2: Download Farm Management System

```bash
# Navigate to your home directory
cd ~

# Clone the repository
git clone https://github.com/kevorhyno90/farmassit.git

# Or download and extract ZIP, then:
cd farmassit
```

#### Step 3: Install Required Python Packages

```bash
pip3 install -r requirements.txt
```

#### Step 4: Run the Application

```bash
# Make script executable (first time only)
chmod +x run_app.sh

# Run the application
./run_app.sh
```

Or manually:
```bash
python3 main.py
```

#### Step 5: (Optional) Create Demo Data

```bash
python3 create_demo_data.py
```

---

## Post-Installation Setup

### First Launch

When you first run the application:

1. **Database Creation**: 
   - A file `farm_management.db` will be created automatically
   - This stores all your farm data

2. **Reports Folder**:
   - A `reports` folder will be created
   - All generated reports are saved here

### Creating Demo Data (Recommended for First-Time Users)

Demo data helps you understand the system:

```bash
# Windows
python create_demo_data.py

# macOS/Linux
python3 create_demo_data.py
```

This creates:
- 5 sample animals (cattle, sheep, pig)
- Health records and vaccinations
- Breeding records
- Feed tracking data
- Financial records
- Milk production data
- 3 sample reports

### Starting Fresh

To delete demo data and start with your own:

1. Close the application
2. Delete `farm_management.db`
3. Restart the application
4. Begin adding your animals

---

## Troubleshooting

### Common Issues and Solutions

#### "Python is not recognized" (Windows)

**Problem**: Python not in system PATH

**Solution**:
1. Uninstall Python
2. Reinstall Python
3. ⚠️ **Make sure to check "Add Python to PATH"**
4. Restart computer
5. Try again

#### "No module named tkinter"

**Windows**:
1. Uninstall Python
2. Reinstall with all optional features checked
3. Specifically ensure "tcl/tk and IDLE" is selected

**Ubuntu/Debian**:
```bash
sudo apt install python3-tk
```

**macOS**:
- tkinter should come with Python
- If not, reinstall Python from python.org

#### "No module named 'docx'"

```bash
# Windows
pip install python-docx

# macOS/Linux
pip3 install python-docx
```

#### Application Won't Start

1. Check you're in the correct directory (where main.py is)
2. Verify Python version: `python --version` (should be 3.7+)
3. Reinstall requirements: `pip install -r requirements.txt`
4. Check for error messages in terminal

#### Can't Generate Reports

**Problem**: Missing python-docx

**Solution**:
```bash
pip install python-docx
```

#### Permission Denied (Linux/macOS)

```bash
chmod +x run_app.sh
chmod 644 farm_management.db
```

---

## Updating the Application

To get the latest version:

```bash
# If using Git
cd farmassit
git pull

# If downloaded ZIP
# Download new ZIP and replace files
# ⚠️ BACKUP farm_management.db first!
```

---

## Uninstallation

To completely remove the application:

1. **Backup Your Data First!**
   - Copy `farm_management.db` to a safe location
   - Copy `reports` folder if you want to keep reports

2. **Delete the Application Folder**
   - Windows: Delete the farmassit folder
   - macOS/Linux: `rm -rf ~/farmassit`

3. **(Optional) Uninstall Python Packages**
   ```bash
   pip uninstall python-docx pillow matplotlib reportlab
   ```

---

## Getting Help

### Resources

1. **Built-in Help**: 
   - Open application → Help menu → User Guide

2. **Documentation**:
   - `README.md` - Complete feature documentation
   - `QUICKSTART.md` - Beginner's guide
   - This file (`INSTALLATION.md`) - Installation help

3. **GitHub Issues**:
   - Report bugs: https://github.com/kevorhyno90/farmassit/issues

### Before Asking for Help

Please provide:
1. Operating system and version
2. Python version (`python --version`)
3. Exact error message
4. What you were trying to do
5. Steps to reproduce the problem

---

## Advanced Setup

### Running on Startup (Optional)

#### Windows
1. Create a shortcut to `run_app.bat`
2. Press Windows + R
3. Type: `shell:startup`
4. Copy the shortcut to the Startup folder

#### macOS
1. System Preferences → Users & Groups
2. Login Items → Click "+"
3. Add the application or `run_app.sh`

#### Linux (Ubuntu)
1. Search for "Startup Applications"
2. Add a new entry with command: `/path/to/farmassit/run_app.sh`

### Using a Virtual Environment (Advanced Users)

```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install packages
pip install -r requirements.txt

# Run application
python main.py
```

---

## Security and Privacy

- All data is stored **locally** on your computer
- No internet connection required after installation
- No data is sent to any servers
- Regular backups recommended (File → Export Database)

---

**Installation complete? Proceed to QUICKSTART.md for your first steps!**
