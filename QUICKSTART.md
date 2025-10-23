# QUICK START GUIDE

## For Complete Beginners - Step by Step

### What You Need
1. A computer (Windows, Mac, or Linux)
2. Internet connection (for initial setup only)
3. About 10 minutes for setup

### Installation Guide

#### Step 1: Install Python

**Windows:**
1. Go to https://www.python.org/downloads/
2. Download Python 3.11 or newer
3. Run the installer
4. ⚠️ **IMPORTANT**: Check the box "Add Python to PATH"
5. Click "Install Now"

**Mac:**
1. Open Terminal
2. Type: `brew install python3` (if you have Homebrew)
   OR download from https://www.python.org/downloads/

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-tk
```

#### Step 2: Download FarmAssist

**Option A: With Git**
```bash
git clone https://github.com/kevorhyno90/farmassit.git
cd farmassit
```

**Option B: Without Git**
1. Go to https://github.com/kevorhyno90/farmassit
2. Click green "Code" button
3. Click "Download ZIP"
4. Extract the ZIP file to a folder (e.g., C:\FarmAssist or ~/FarmAssist)
5. Open Terminal/Command Prompt in that folder

#### Step 3: Install Required Libraries

Open Terminal/Command Prompt in the farmassit folder and run:

```bash
pip install -r requirements.txt
```

Wait for installation to complete (about 1-2 minutes).

#### Step 4: Run the Application

```bash
python main.py
```

The Farm Management System window should open!

### First Time Using the App

#### 1. Add Your First Animal
- Click on the "Animals" tab (should be open by default)
- Click "Add Animal" button
- Fill in the form:
  - **Tag Number**: e.g., "C001" (Required - use your own numbering system)
  - **Name**: e.g., "Bessie" (Optional but recommended)
  - **Species**: Choose from dropdown (Required)
  - **Breed**: e.g., "Holstein"
  - **Gender**: Male/Female
  - **Date of Birth**: Format: YYYY-MM-DD (e.g., 2020-01-15)
  - **Weight**: In kilograms (e.g., 450.5)
  - Fill in other fields as you have the information
- Click "Save"
- Your animal appears in the list!

#### 2. Record a Health Event
- Go to "Health Records" tab
- Fill in the form:
  - **Animal ID**: The ID number shown when you hover over the animal
  - **Date**: Today's date (pre-filled)
  - **Record Type**: Choose from dropdown
  - **Diagnosis**: What was found
  - **Treatment**: What was done
  - **Medications**: What was given
  - **Veterinarian**: Name of vet
  - **Cost**: How much it cost
- Click "Add Health Record"

#### 3. Generate Your First Report
- Go back to "Animals" tab
- Click on an animal to select it
- Click "Generate Profile" button
- A Word document will open with complete animal profile!
- Find reports in the "reports" folder

### Common Tasks

#### Adding Multiple Animals
Repeat the "Add Animal" process for each animal. Use consistent tag numbering:
- C001, C002, C003 for Cattle
- S001, S002, S003 for Sheep
- etc.

#### Recording Daily Activities
1. **Feeding**: Go to "Feed Management" tab
2. **Production**: Go to "Production" tab for milk/egg records
3. **Expenses**: Go to "Financial Records" tab

#### Viewing Your Data
- Click on any animal in the list to see details
- Details appear in the right panel

#### Backup Your Data
1. Click "File" menu → "Export Database"
2. Choose where to save (USB drive recommended)
3. Name it with the date: e.g., "farm_backup_2024_01_15.db"

### Troubleshooting

#### "Python is not recognized"
- Reinstall Python and CHECK the "Add to PATH" box
- Restart your computer
- Try again

#### "No module named tkinter"
- **Windows**: Reinstall Python with all optional features
- **Linux**: `sudo apt install python3-tk`
- **Mac**: tkinter should come with Python

#### "pip is not recognized"
- Try using `python -m pip install -r requirements.txt` instead

#### Application won't start
1. Make sure you're in the correct folder (where main.py is)
2. Try: `python main.py`
3. If error occurs, read the error message carefully

#### Can't generate reports
- Make sure python-docx is installed: `pip install python-docx`

### Getting Help

1. **Built-in Help**: Click "Help" → "User Guide" in the application
2. **Check README.md**: Comprehensive documentation
3. **GitHub Issues**: Report bugs or ask questions

### Tips for Success

1. **Enter data regularly** - Don't wait, record things as they happen
2. **Use consistent formatting** - Especially for dates (YYYY-MM-DD)
3. **Backup weekly** - Your data is valuable!
4. **Generate monthly reports** - Track your farm's progress
5. **Fill in as much detail as possible** - Future you will thank you

### Need to Start Over?

If you make a mistake and want to reset:
1. Close the application
2. Delete the file "farm_management.db"
3. Start the application again
4. A fresh database will be created

### Data Location

Everything is stored on your computer in the farmassit folder:
- **Database**: `farm_management.db` - Your data
- **Reports**: `reports/` folder - Generated reports
- **Application files**: Python files (.py) - Don't modify these

---

## Quick Reference Card

### Running the App
```bash
cd path/to/farmassit
python main.py
```

### Backup Command
File → Export Database → Choose location

### Date Format
Always use: YYYY-MM-DD (e.g., 2024-01-15)

### Tag Number Examples
- Cattle: C001, C002, C003
- Sheep: S001, S002, S003
- Goats: G001, G002, G003
- Pigs: P001, P002, P003

### Report Generation
1. Select animal
2. Click "Generate Profile"
3. Find in reports/ folder

---

**You're ready to start managing your farm professionally!**

Need more help? Read the full README.md file.
