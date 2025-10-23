# FarmAssist - Comprehensive Farm Management System

A professional farm management system designed from an **Animal Scientist and Veterinary Officer** perspective. This application provides comprehensive tracking and reporting for all aspects of farm management.

## 🌟 Features

### Core Management Modules

1. **Animal Management**
   - Complete animal profiles with tag numbers, breeds, and genealogy
   - Track acquisition details, costs, and sources
   - Monitor animal status (Active, Sold, Deceased, etc.)
   - Weight tracking and growth monitoring
   - Generate individual animal profile reports

2. **Health & Veterinary Records**
   - Comprehensive health record keeping
   - Track diagnoses, symptoms, and treatments
   - Medication and dosage tracking
   - Vaccination schedules with due date reminders
   - Veterinarian visit records
   - Health cost tracking

3. **Breeding Management**
   - Dam and sire tracking
   - Breeding method recording (Natural, AI, Embryo Transfer)
   - Expected and actual delivery dates
   - Offspring tracking
   - Breeding success rate analysis
   - Genetic lineage documentation

4. **Feed Management**
   - Daily feed consumption recording
   - Feed type categorization (Hay, Silage, Grain, etc.)
   - Supplier and cost tracking
   - Feed inventory management
   - Individual or group feeding records

5. **Financial Management**
   - Income and expense tracking
   - Category-based financial organization
   - Payment method recording
   - Automated financial reports
   - Profit/loss analysis
   - Cost per animal calculations

6. **Production Tracking**
   - Milk production monitoring (for dairy operations)
   - Egg production tracking (for poultry)
   - Quality grading
   - Production trend analysis

## 📊 Comprehensive Reporting (DOCX Format)

All reports are generated in Microsoft Word format for easy editing and sharing:

- **Animal Profile Reports**: Complete individual animal history
- **Herd Management Reports**: Overview of entire herd with statistics
- **Health Reports**: Veterinary care summaries
- **Financial Reports**: Income, expenses, and profitability
- **Breeding Reports**: Reproductive performance analysis

## 🚀 Getting Started (For Beginners)

### Prerequisites

You need Python 3.7 or higher installed on your computer.

**Check if Python is installed:**
```bash
python --version
```

If not installed, download from [python.org](https://www.python.org/downloads/)

### Installation Steps

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/kevorhyno90/farmassit.git
   cd farmassit
   ```

2. **Install Required Libraries**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Application**
   ```bash
   python main.py
   ```

### First Time Setup

When you first run the application:

1. The database will be created automatically (`farm_management.db`)
2. A `reports` folder will be created for your generated reports
3. Start by adding your first animal in the "Animals" tab

## 📖 How to Use

### Adding Your First Animal

1. Go to the **Animals** tab
2. Click **"Add Animal"** button
3. Fill in the required fields:
   - Tag Number (required) - Use a unique identifier
   - Species (required) - Select from dropdown
   - Fill in other details as available
4. Click **"Save"**

### Recording Health Events

1. Go to the **Health Records** tab
2. Enter the Animal ID (from the Animals tab)
3. Select the record type (Checkup, Treatment, etc.)
4. Fill in diagnosis, treatment, and medications
5. Add veterinarian name and costs
6. Click **"Add Health Record"**

### Tracking Breeding

1. Go to the **Breeding** tab
2. Enter Dam ID (mother) and Sire ID (father)
3. Select breeding method
4. Set expected delivery date
5. Add any notes
6. Click **"Add Breeding Record"**

### Generating Reports

1. **For Individual Animal:**
   - Select the animal in the Animals tab
   - Click **"Generate Profile"**
   - Report opens automatically in Word

2. **For Herd/Financial Reports:**
   - Go to **Reports** menu
   - Select report type
   - Report is generated and saved in `reports` folder

## 💾 Data Management

### Backing Up Your Data

**Important:** Regularly backup your database!

1. Go to **File** menu → **Export Database**
2. Choose location and filename
3. Save the `.db` file to a safe location (USB drive, cloud storage, etc.)

### Data Location

- **Database**: `farm_management.db` (in application folder)
- **Reports**: `reports/` folder
- All data is stored locally on your computer

## 🔧 Troubleshooting

### Application Won't Start

**Error: "No module named..."**
```bash
pip install -r requirements.txt
```

**Error: "tkinter not found"**
- On Ubuntu/Debian: `sudo apt-get install python3-tk`
- On macOS: tkinter comes with Python
- On Windows: Reinstall Python with "tcl/tk" option checked

### Can't Generate Reports

**Error: "No module named 'docx'"**
```bash
pip install python-docx
```

### Database Issues

**Reset Database** (⚠️ Warning: This deletes all data!)
```bash
# Delete the database file
rm farm_management.db
# Or on Windows
del farm_management.db
```

## 📋 Best Practices

1. **Consistent Tag Numbering**: Use a system like "C001" for cattle, "S001" for sheep
2. **Regular Data Entry**: Record events as they happen, not later
3. **Weekly Backups**: Export your database every week
4. **Monthly Reports**: Generate financial reports monthly
5. **Vaccination Tracking**: Always record next due dates
6. **Document Everything**: Use the notes fields liberally

## 🎯 Designed for Animal Scientists & Veterinarians

This system includes features specifically important for professional animal management:

- **Body Condition Scoring**: Track animal health beyond just weight
- **Genetic Tracking**: Complete dam/sire lineage
- **Veterinary Standards**: Proper medication and dosage recording
- **Quality Metrics**: Production quality grading
- **Professional Reports**: Publication-ready documentation

## 🆘 Support & Help

### Built-in Help
- Click **Help** → **User Guide** in the application
- Detailed tooltips throughout the interface

### Common Questions

**Q: Can I use this for multiple farms?**
A: Each database is for one farm. You can run multiple instances with different database files.

**Q: Is my data secure?**
A: All data is stored locally on your computer. Regular backups recommended.

**Q: Can I edit the reports?**
A: Yes! All reports are in .docx format and fully editable in Microsoft Word.

**Q: What animals are supported?**
A: All farm animals - Cattle, Sheep, Goats, Pigs, Poultry, Horses, and more.

## 📝 License

This is a personal application for individual farm management.

## 🤝 Contributing

As this is a personal farm management tool, contributions are welcome for:
- Bug fixes
- Feature enhancements
- Documentation improvements

## 📧 Contact

For issues or questions, please open an issue on GitHub.

---

**Happy Farming! 🐄🐑🐔**

*Professional farm management made simple.*
