"""
Farm Management System - Main Application
A comprehensive farm management system from an animal scientist and veterinary officer perspective
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from datetime import datetime
from database import DatabaseManager
from report_generator import ReportGenerator
import os

class FarmManagementApp:
    """Main application class for Farm Management System"""
    
    def __init__(self, root):
        self.root = root
        self.root.title("Farm Management System - Professional Edition")
        self.root.geometry("1200x700")
        
        # Initialize database and report generator
        self.db = DatabaseManager()
        self.report_gen = ReportGenerator()
        
        # Configure styles
        self.style = ttk.Style()
        self.style.theme_use('clam')
        
        # Create main UI
        self.create_menu()
        self.create_main_layout()
        
        # Load initial data
        self.refresh_animal_list()
    
    def create_menu(self):
        """Create menu bar"""
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        # File menu
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="File", menu=file_menu)
        file_menu.add_command(label="Export Database", command=self.export_database)
        file_menu.add_separator()
        file_menu.add_command(label="Exit", command=self.root.quit)
        
        # Reports menu
        reports_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Reports", menu=reports_menu)
        reports_menu.add_command(label="Generate Herd Report", command=self.generate_herd_report)
        reports_menu.add_command(label="Generate Financial Report", command=self.generate_financial_report)
        reports_menu.add_command(label="Generate Health Report", command=self.generate_health_report)
        reports_menu.add_command(label="Generate Breeding Report", command=self.generate_breeding_report)
        
        # Help menu
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Help", menu=help_menu)
        help_menu.add_command(label="User Guide", command=self.show_user_guide)
        help_menu.add_command(label="About", command=self.show_about)
    
    def create_main_layout(self):
        """Create main application layout"""
        # Create notebook (tabbed interface)
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Create tabs
        self.create_animals_tab()
        self.create_health_tab()
        self.create_breeding_tab()
        self.create_feed_tab()
        self.create_financial_tab()
        self.create_production_tab()
    
    def create_animals_tab(self):
        """Create animals management tab"""
        animals_frame = ttk.Frame(self.notebook)
        self.notebook.add(animals_frame, text="Animals")
        
        # Split frame into list and details
        list_frame = ttk.LabelFrame(animals_frame, text="Animal List", padding=10)
        list_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        details_frame = ttk.LabelFrame(animals_frame, text="Animal Details", padding=10)
        details_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Animal list with scrollbar
        list_scroll = ttk.Scrollbar(list_frame)
        list_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.animal_tree = ttk.Treeview(list_frame, columns=('Tag', 'Name', 'Species', 'Breed', 'Gender', 'Status'),
                                       show='headings', yscrollcommand=list_scroll.set)
        list_scroll.config(command=self.animal_tree.yview)
        
        # Configure columns
        self.animal_tree.heading('Tag', text='Tag Number')
        self.animal_tree.heading('Name', text='Name')
        self.animal_tree.heading('Species', text='Species')
        self.animal_tree.heading('Breed', text='Breed')
        self.animal_tree.heading('Gender', text='Gender')
        self.animal_tree.heading('Status', text='Status')
        
        self.animal_tree.column('Tag', width=100)
        self.animal_tree.column('Name', width=100)
        self.animal_tree.column('Species', width=100)
        self.animal_tree.column('Breed', width=100)
        self.animal_tree.column('Gender', width=80)
        self.animal_tree.column('Status', width=80)
        
        self.animal_tree.pack(fill=tk.BOTH, expand=True)
        self.animal_tree.bind('<<TreeviewSelect>>', self.on_animal_select)
        
        # Buttons
        button_frame = ttk.Frame(list_frame)
        button_frame.pack(fill=tk.X, pady=5)
        
        ttk.Button(button_frame, text="Add Animal", command=self.add_animal).pack(side=tk.LEFT, padx=2)
        ttk.Button(button_frame, text="Edit Animal", command=self.edit_animal).pack(side=tk.LEFT, padx=2)
        ttk.Button(button_frame, text="Delete Animal", command=self.delete_animal).pack(side=tk.LEFT, padx=2)
        ttk.Button(button_frame, text="Generate Profile", command=self.generate_animal_profile).pack(side=tk.LEFT, padx=2)
        
        # Details display
        self.animal_details_text = tk.Text(details_frame, wrap=tk.WORD, width=40)
        details_scroll = ttk.Scrollbar(details_frame, command=self.animal_details_text.yview)
        self.animal_details_text.config(yscrollcommand=details_scroll.set)
        
        self.animal_details_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        details_scroll.pack(side=tk.RIGHT, fill=tk.Y)
    
    def create_health_tab(self):
        """Create health management tab"""
        health_frame = ttk.Frame(self.notebook)
        self.notebook.add(health_frame, text="Health Records")
        
        # Split frame
        list_frame = ttk.LabelFrame(health_frame, text="Health Records", padding=10)
        list_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        form_frame = ttk.LabelFrame(health_frame, text="Add/Edit Health Record", padding=10)
        form_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Health records list
        list_scroll = ttk.Scrollbar(list_frame)
        list_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.health_tree = ttk.Treeview(list_frame, columns=('Date', 'Animal', 'Type', 'Diagnosis', 'Vet'),
                                       show='headings', yscrollcommand=list_scroll.set)
        list_scroll.config(command=self.health_tree.yview)
        
        self.health_tree.heading('Date', text='Date')
        self.health_tree.heading('Animal', text='Animal ID')
        self.health_tree.heading('Type', text='Record Type')
        self.health_tree.heading('Diagnosis', text='Diagnosis')
        self.health_tree.heading('Vet', text='Veterinarian')
        
        self.health_tree.pack(fill=tk.BOTH, expand=True)
        
        # Form for adding health records
        row = 0
        ttk.Label(form_frame, text="Animal ID:").grid(row=row, column=0, sticky=tk.W, pady=2)
        self.health_animal_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.health_animal_var).grid(row=row, column=1, sticky=tk.EW, pady=2)
        
        row += 1
        ttk.Label(form_frame, text="Date:").grid(row=row, column=0, sticky=tk.W, pady=2)
        self.health_date_var = tk.StringVar(value=datetime.now().strftime('%Y-%m-%d'))
        ttk.Entry(form_frame, textvariable=self.health_date_var).grid(row=row, column=1, sticky=tk.EW, pady=2)
        
        row += 1
        ttk.Label(form_frame, text="Record Type:").grid(row=row, column=0, sticky=tk.W, pady=2)
        self.health_type_var = tk.StringVar()
        ttk.Combobox(form_frame, textvariable=self.health_type_var, 
                    values=['Checkup', 'Treatment', 'Surgery', 'Emergency', 'Vaccination', 'Other']).grid(row=row, column=1, sticky=tk.EW, pady=2)
        
        row += 1
        ttk.Label(form_frame, text="Diagnosis:").grid(row=row, column=0, sticky=tk.W, pady=2)
        self.health_diagnosis_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.health_diagnosis_var).grid(row=row, column=1, sticky=tk.EW, pady=2)
        
        row += 1
        ttk.Label(form_frame, text="Symptoms:").grid(row=row, column=0, sticky=tk.W, pady=2)
        self.health_symptoms_text = tk.Text(form_frame, height=3, width=30)
        self.health_symptoms_text.grid(row=row, column=1, sticky=tk.EW, pady=2)
        
        row += 1
        ttk.Label(form_frame, text="Treatment:").grid(row=row, column=0, sticky=tk.W, pady=2)
        self.health_treatment_text = tk.Text(form_frame, height=3, width=30)
        self.health_treatment_text.grid(row=row, column=1, sticky=tk.EW, pady=2)
        
        row += 1
        ttk.Label(form_frame, text="Medications:").grid(row=row, column=0, sticky=tk.W, pady=2)
        self.health_medications_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.health_medications_var).grid(row=row, column=1, sticky=tk.EW, pady=2)
        
        row += 1
        ttk.Label(form_frame, text="Dosage:").grid(row=row, column=0, sticky=tk.W, pady=2)
        self.health_dosage_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.health_dosage_var).grid(row=row, column=1, sticky=tk.EW, pady=2)
        
        row += 1
        ttk.Label(form_frame, text="Veterinarian:").grid(row=row, column=0, sticky=tk.W, pady=2)
        self.health_vet_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.health_vet_var).grid(row=row, column=1, sticky=tk.EW, pady=2)
        
        row += 1
        ttk.Label(form_frame, text="Cost:").grid(row=row, column=0, sticky=tk.W, pady=2)
        self.health_cost_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.health_cost_var).grid(row=row, column=1, sticky=tk.EW, pady=2)
        
        row += 1
        ttk.Button(form_frame, text="Add Health Record", command=self.add_health_record).grid(row=row, column=0, columnspan=2, pady=10)
        
        form_frame.columnconfigure(1, weight=1)
        
        # Load button
        ttk.Button(list_frame, text="Load All Records", command=self.load_health_records).pack(pady=5)
    
    def create_breeding_tab(self):
        """Create breeding management tab"""
        breeding_frame = ttk.Frame(self.notebook)
        self.notebook.add(breeding_frame, text="Breeding")
        
        form_frame = ttk.LabelFrame(breeding_frame, text="Add Breeding Record", padding=10)
        form_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        row = 0
        ttk.Label(form_frame, text="Dam ID (Mother):").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.breed_dam_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.breed_dam_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Sire ID (Father):").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.breed_sire_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.breed_sire_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Breeding Date:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.breed_date_var = tk.StringVar(value=datetime.now().strftime('%Y-%m-%d'))
        ttk.Entry(form_frame, textvariable=self.breed_date_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Breeding Method:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.breed_method_var = tk.StringVar()
        ttk.Combobox(form_frame, textvariable=self.breed_method_var, 
                    values=['Natural', 'Artificial Insemination', 'Embryo Transfer']).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Expected Delivery:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.breed_expected_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.breed_expected_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Notes:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.breed_notes_text = tk.Text(form_frame, height=4, width=30)
        self.breed_notes_text.grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Button(form_frame, text="Add Breeding Record", command=self.add_breeding_record).grid(row=row, column=0, columnspan=2, pady=10)
        
        form_frame.columnconfigure(1, weight=1)
    
    def create_feed_tab(self):
        """Create feed management tab"""
        feed_frame = ttk.Frame(self.notebook)
        self.notebook.add(feed_frame, text="Feed Management")
        
        form_frame = ttk.LabelFrame(feed_frame, text="Add Feed Record", padding=10)
        form_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        row = 0
        ttk.Label(form_frame, text="Date:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.feed_date_var = tk.StringVar(value=datetime.now().strftime('%Y-%m-%d'))
        ttk.Entry(form_frame, textvariable=self.feed_date_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Animal ID (optional):").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.feed_animal_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.feed_animal_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Feed Type:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.feed_type_var = tk.StringVar()
        ttk.Combobox(form_frame, textvariable=self.feed_type_var, 
                    values=['Hay', 'Silage', 'Grain', 'Pellets', 'Concentrate', 'Supplements', 'Other']).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Quantity:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.feed_quantity_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.feed_quantity_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Unit:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.feed_unit_var = tk.StringVar()
        ttk.Combobox(form_frame, textvariable=self.feed_unit_var, 
                    values=['kg', 'lbs', 'tons', 'bags', 'bales']).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Cost:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.feed_cost_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.feed_cost_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Supplier:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.feed_supplier_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.feed_supplier_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Button(form_frame, text="Add Feed Record", command=self.add_feed_record).grid(row=row, column=0, columnspan=2, pady=10)
        
        form_frame.columnconfigure(1, weight=1)
    
    def create_financial_tab(self):
        """Create financial management tab"""
        financial_frame = ttk.Frame(self.notebook)
        self.notebook.add(financial_frame, text="Financial Records")
        
        form_frame = ttk.LabelFrame(financial_frame, text="Add Financial Transaction", padding=10)
        form_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        row = 0
        ttk.Label(form_frame, text="Date:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.fin_date_var = tk.StringVar(value=datetime.now().strftime('%Y-%m-%d'))
        ttk.Entry(form_frame, textvariable=self.fin_date_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Transaction Type:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.fin_type_var = tk.StringVar()
        ttk.Combobox(form_frame, textvariable=self.fin_type_var, 
                    values=['Income', 'Expense']).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Category:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.fin_category_var = tk.StringVar()
        ttk.Combobox(form_frame, textvariable=self.fin_category_var, 
                    values=['Feed', 'Veterinary', 'Equipment', 'Labor', 'Sales', 'Breeding', 'Transportation', 'Other']).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Amount:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.fin_amount_var = tk.StringVar()
        ttk.Entry(form_frame, textvariable=self.fin_amount_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Description:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.fin_desc_text = tk.Text(form_frame, height=3, width=30)
        self.fin_desc_text.grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(form_frame, text="Payment Method:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.fin_payment_var = tk.StringVar()
        ttk.Combobox(form_frame, textvariable=self.fin_payment_var, 
                    values=['Cash', 'Bank Transfer', 'Check', 'Credit Card', 'Other']).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Button(form_frame, text="Add Transaction", command=self.add_financial_record).grid(row=row, column=0, columnspan=2, pady=10)
        
        form_frame.columnconfigure(1, weight=1)
    
    def create_production_tab(self):
        """Create production tracking tab"""
        production_frame = ttk.Frame(self.notebook)
        self.notebook.add(production_frame, text="Production")
        
        # Milk production section
        milk_frame = ttk.LabelFrame(production_frame, text="Milk Production", padding=10)
        milk_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        row = 0
        ttk.Label(milk_frame, text="Animal ID:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.milk_animal_var = tk.StringVar()
        ttk.Entry(milk_frame, textvariable=self.milk_animal_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(milk_frame, text="Date:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.milk_date_var = tk.StringVar(value=datetime.now().strftime('%Y-%m-%d'))
        ttk.Entry(milk_frame, textvariable=self.milk_date_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(milk_frame, text="Morning Yield (L):").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.milk_morning_var = tk.StringVar()
        ttk.Entry(milk_frame, textvariable=self.milk_morning_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(milk_frame, text="Evening Yield (L):").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.milk_evening_var = tk.StringVar()
        ttk.Entry(milk_frame, textvariable=self.milk_evening_var).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Label(milk_frame, text="Quality Grade:").grid(row=row, column=0, sticky=tk.W, pady=5)
        self.milk_quality_var = tk.StringVar()
        ttk.Combobox(milk_frame, textvariable=self.milk_quality_var, 
                    values=['A', 'B', 'C']).grid(row=row, column=1, sticky=tk.EW, pady=5)
        
        row += 1
        ttk.Button(milk_frame, text="Add Milk Production", command=self.add_milk_production).grid(row=row, column=0, columnspan=2, pady=10)
        
        milk_frame.columnconfigure(1, weight=1)
    
    # Event handlers and data operations
    def refresh_animal_list(self):
        """Refresh the animal list"""
        # Clear existing items
        for item in self.animal_tree.get_children():
            self.animal_tree.delete(item)
        
        # Load animals from database
        animals = self.db.get_all_animals()
        for animal in animals:
            if animal.get('status') != 'Deleted':
                self.animal_tree.insert('', tk.END, values=(
                    animal.get('tag_number', ''),
                    animal.get('name', ''),
                    animal.get('species', ''),
                    animal.get('breed', ''),
                    animal.get('gender', ''),
                    animal.get('status', '')
                ), tags=(animal.get('id'),))
    
    def on_animal_select(self, event):
        """Handle animal selection"""
        selection = self.animal_tree.selection()
        if not selection:
            return
        
        item = self.animal_tree.item(selection[0])
        animal_id = item['tags'][0]
        
        # Load animal details
        animal = self.db.get_animal_by_id(animal_id)
        if animal:
            self.display_animal_details(animal)
    
    def display_animal_details(self, animal):
        """Display animal details in the text widget"""
        self.animal_details_text.delete(1.0, tk.END)
        
        details = f"""
BASIC INFORMATION
=================
Tag Number: {animal.get('tag_number', 'N/A')}
Name: {animal.get('name', 'N/A')}
Species: {animal.get('species', 'N/A')}
Breed: {animal.get('breed', 'N/A')}
Gender: {animal.get('gender', 'N/A')}
Date of Birth: {animal.get('date_of_birth', 'N/A')}
Current Weight: {animal.get('weight', 'N/A')} kg
Color: {animal.get('color', 'N/A')}
Status: {animal.get('status', 'N/A')}

ACQUISITION
===========
Date: {animal.get('acquisition_date', 'N/A')}
Type: {animal.get('acquisition_type', 'N/A')}
Source: {animal.get('source', 'N/A')}
Cost: ${animal.get('cost', 'N/A')}

NOTES
=====
{animal.get('notes', 'No notes available.')}
        """
        
        self.animal_details_text.insert(1.0, details)
    
    def add_animal(self):
        """Open dialog to add new animal"""
        dialog = tk.Toplevel(self.root)
        dialog.title("Add New Animal")
        dialog.geometry("400x600")
        
        # Create form
        row = 0
        ttk.Label(dialog, text="Tag Number*:").grid(row=row, column=0, sticky=tk.W, padx=5, pady=5)
        tag_var = tk.StringVar()
        ttk.Entry(dialog, textvariable=tag_var).grid(row=row, column=1, sticky=tk.EW, padx=5, pady=5)
        
        row += 1
        ttk.Label(dialog, text="Name:").grid(row=row, column=0, sticky=tk.W, padx=5, pady=5)
        name_var = tk.StringVar()
        ttk.Entry(dialog, textvariable=name_var).grid(row=row, column=1, sticky=tk.EW, padx=5, pady=5)
        
        row += 1
        ttk.Label(dialog, text="Species*:").grid(row=row, column=0, sticky=tk.W, padx=5, pady=5)
        species_var = tk.StringVar()
        ttk.Combobox(dialog, textvariable=species_var, 
                    values=['Cattle', 'Sheep', 'Goat', 'Pig', 'Chicken', 'Horse', 'Other']).grid(row=row, column=1, sticky=tk.EW, padx=5, pady=5)
        
        row += 1
        ttk.Label(dialog, text="Breed:").grid(row=row, column=0, sticky=tk.W, padx=5, pady=5)
        breed_var = tk.StringVar()
        ttk.Entry(dialog, textvariable=breed_var).grid(row=row, column=1, sticky=tk.EW, padx=5, pady=5)
        
        row += 1
        ttk.Label(dialog, text="Gender:").grid(row=row, column=0, sticky=tk.W, padx=5, pady=5)
        gender_var = tk.StringVar()
        ttk.Combobox(dialog, textvariable=gender_var, 
                    values=['Male', 'Female', 'Unknown']).grid(row=row, column=1, sticky=tk.EW, padx=5, pady=5)
        
        row += 1
        ttk.Label(dialog, text="Date of Birth (YYYY-MM-DD):").grid(row=row, column=0, sticky=tk.W, padx=5, pady=5)
        dob_var = tk.StringVar()
        ttk.Entry(dialog, textvariable=dob_var).grid(row=row, column=1, sticky=tk.EW, padx=5, pady=5)
        
        row += 1
        ttk.Label(dialog, text="Weight (kg):").grid(row=row, column=0, sticky=tk.W, padx=5, pady=5)
        weight_var = tk.StringVar()
        ttk.Entry(dialog, textvariable=weight_var).grid(row=row, column=1, sticky=tk.EW, padx=5, pady=5)
        
        row += 1
        ttk.Label(dialog, text="Color:").grid(row=row, column=0, sticky=tk.W, padx=5, pady=5)
        color_var = tk.StringVar()
        ttk.Entry(dialog, textvariable=color_var).grid(row=row, column=1, sticky=tk.EW, padx=5, pady=5)
        
        row += 1
        ttk.Label(dialog, text="Acquisition Date:").grid(row=row, column=0, sticky=tk.W, padx=5, pady=5)
        acq_date_var = tk.StringVar(value=datetime.now().strftime('%Y-%m-%d'))
        ttk.Entry(dialog, textvariable=acq_date_var).grid(row=row, column=1, sticky=tk.EW, padx=5, pady=5)
        
        row += 1
        ttk.Label(dialog, text="Acquisition Type:").grid(row=row, column=0, sticky=tk.W, padx=5, pady=5)
        acq_type_var = tk.StringVar()
        ttk.Combobox(dialog, textvariable=acq_type_var, 
                    values=['Purchase', 'Birth', 'Gift', 'Other']).grid(row=row, column=1, sticky=tk.EW, padx=5, pady=5)
        
        row += 1
        ttk.Label(dialog, text="Source:").grid(row=row, column=0, sticky=tk.W, padx=5, pady=5)
        source_var = tk.StringVar()
        ttk.Entry(dialog, textvariable=source_var).grid(row=row, column=1, sticky=tk.EW, padx=5, pady=5)
        
        row += 1
        ttk.Label(dialog, text="Cost:").grid(row=row, column=0, sticky=tk.W, padx=5, pady=5)
        cost_var = tk.StringVar()
        ttk.Entry(dialog, textvariable=cost_var).grid(row=row, column=1, sticky=tk.EW, padx=5, pady=5)
        
        row += 1
        ttk.Label(dialog, text="Notes:").grid(row=row, column=0, sticky=tk.W, padx=5, pady=5)
        notes_text = tk.Text(dialog, height=4, width=30)
        notes_text.grid(row=row, column=1, sticky=tk.EW, padx=5, pady=5)
        
        def save_animal():
            if not tag_var.get() or not species_var.get():
                messagebox.showerror("Error", "Tag Number and Species are required!")
                return
            
            data = {
                'tag_number': tag_var.get(),
                'name': name_var.get(),
                'species': species_var.get(),
                'breed': breed_var.get(),
                'gender': gender_var.get(),
                'date_of_birth': dob_var.get() if dob_var.get() else None,
                'weight': float(weight_var.get()) if weight_var.get() else None,
                'color': color_var.get(),
                'acquisition_date': acq_date_var.get() if acq_date_var.get() else None,
                'acquisition_type': acq_type_var.get(),
                'source': source_var.get(),
                'cost': float(cost_var.get()) if cost_var.get() else None,
                'notes': notes_text.get(1.0, tk.END).strip()
            }
            
            try:
                self.db.add_animal(data)
                messagebox.showinfo("Success", "Animal added successfully!")
                dialog.destroy()
                self.refresh_animal_list()
            except Exception as e:
                messagebox.showerror("Error", f"Failed to add animal: {str(e)}")
        
        row += 1
        ttk.Button(dialog, text="Save", command=save_animal).grid(row=row, column=0, columnspan=2, pady=10)
        
        dialog.columnconfigure(1, weight=1)
    
    def edit_animal(self):
        """Edit selected animal"""
        messagebox.showinfo("Info", "Select an animal and modify details in a similar dialog to Add Animal")
    
    def delete_animal(self):
        """Delete selected animal"""
        selection = self.animal_tree.selection()
        if not selection:
            messagebox.showwarning("Warning", "Please select an animal to delete")
            return
        
        if messagebox.askyesno("Confirm", "Are you sure you want to delete this animal?"):
            item = self.animal_tree.item(selection[0])
            animal_id = item['tags'][0]
            self.db.delete_animal(animal_id)
            messagebox.showinfo("Success", "Animal deleted successfully!")
            self.refresh_animal_list()
    
    def add_health_record(self):
        """Add health record"""
        try:
            animal_id = int(self.health_animal_var.get())
        except ValueError:
            messagebox.showerror("Error", "Invalid Animal ID")
            return
        
        data = {
            'animal_id': animal_id,
            'record_date': self.health_date_var.get(),
            'record_type': self.health_type_var.get(),
            'diagnosis': self.health_diagnosis_var.get(),
            'symptoms': self.health_symptoms_text.get(1.0, tk.END).strip(),
            'treatment': self.health_treatment_text.get(1.0, tk.END).strip(),
            'medications': self.health_medications_var.get(),
            'dosage': self.health_dosage_var.get(),
            'veterinarian': self.health_vet_var.get(),
            'cost': float(self.health_cost_var.get()) if self.health_cost_var.get() else None
        }
        
        try:
            self.db.add_health_record(data)
            messagebox.showinfo("Success", "Health record added successfully!")
            # Clear form
            self.health_diagnosis_var.set('')
            self.health_symptoms_text.delete(1.0, tk.END)
            self.health_treatment_text.delete(1.0, tk.END)
            self.health_medications_var.set('')
            self.health_dosage_var.set('')
        except Exception as e:
            messagebox.showerror("Error", f"Failed to add health record: {str(e)}")
    
    def load_health_records(self):
        """Load all health records"""
        for item in self.health_tree.get_children():
            self.health_tree.delete(item)
        
        # This would need a method to get all health records
        messagebox.showinfo("Info", "Health records loaded")
    
    def add_breeding_record(self):
        """Add breeding record"""
        try:
            dam_id = int(self.breed_dam_var.get())
            sire_id = int(self.breed_sire_var.get()) if self.breed_sire_var.get() else None
        except ValueError:
            messagebox.showerror("Error", "Invalid Animal IDs")
            return
        
        data = {
            'dam_id': dam_id,
            'sire_id': sire_id,
            'breeding_date': self.breed_date_var.get(),
            'breeding_method': self.breed_method_var.get(),
            'expected_delivery': self.breed_expected_var.get() if self.breed_expected_var.get() else None,
            'notes': self.breed_notes_text.get(1.0, tk.END).strip()
        }
        
        try:
            self.db.add_breeding_record(data)
            messagebox.showinfo("Success", "Breeding record added successfully!")
            # Clear form
            self.breed_dam_var.set('')
            self.breed_sire_var.set('')
            self.breed_expected_var.set('')
            self.breed_notes_text.delete(1.0, tk.END)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to add breeding record: {str(e)}")
    
    def add_feed_record(self):
        """Add feed record"""
        try:
            animal_id = int(self.feed_animal_var.get()) if self.feed_animal_var.get() else None
            quantity = float(self.feed_quantity_var.get())
        except ValueError:
            messagebox.showerror("Error", "Invalid input values")
            return
        
        data = {
            'record_date': self.feed_date_var.get(),
            'animal_id': animal_id,
            'feed_type': self.feed_type_var.get(),
            'quantity': quantity,
            'unit': self.feed_unit_var.get(),
            'cost': float(self.feed_cost_var.get()) if self.feed_cost_var.get() else None,
            'supplier': self.feed_supplier_var.get()
        }
        
        try:
            self.db.add_feed_record(data)
            messagebox.showinfo("Success", "Feed record added successfully!")
            # Clear form
            self.feed_quantity_var.set('')
            self.feed_cost_var.set('')
            self.feed_supplier_var.set('')
        except Exception as e:
            messagebox.showerror("Error", f"Failed to add feed record: {str(e)}")
    
    def add_financial_record(self):
        """Add financial record"""
        try:
            amount = float(self.fin_amount_var.get())
        except ValueError:
            messagebox.showerror("Error", "Invalid amount")
            return
        
        data = {
            'transaction_date': self.fin_date_var.get(),
            'transaction_type': self.fin_type_var.get(),
            'category': self.fin_category_var.get(),
            'amount': amount,
            'description': self.fin_desc_text.get(1.0, tk.END).strip(),
            'payment_method': self.fin_payment_var.get()
        }
        
        try:
            self.db.add_financial_record(data)
            messagebox.showinfo("Success", "Financial record added successfully!")
            # Clear form
            self.fin_amount_var.set('')
            self.fin_desc_text.delete(1.0, tk.END)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to add financial record: {str(e)}")
    
    def add_milk_production(self):
        """Add milk production record"""
        try:
            animal_id = int(self.milk_animal_var.get())
            morning = float(self.milk_morning_var.get()) if self.milk_morning_var.get() else 0
            evening = float(self.milk_evening_var.get()) if self.milk_evening_var.get() else 0
        except ValueError:
            messagebox.showerror("Error", "Invalid input values")
            return
        
        data = {
            'animal_id': animal_id,
            'production_date': self.milk_date_var.get(),
            'morning_yield': morning,
            'evening_yield': evening,
            'total_yield': morning + evening,
            'quality_grade': self.milk_quality_var.get()
        }
        
        try:
            self.db.add_milk_production(data)
            messagebox.showinfo("Success", "Milk production record added successfully!")
            # Clear form
            self.milk_morning_var.set('')
            self.milk_evening_var.set('')
        except Exception as e:
            messagebox.showerror("Error", f"Failed to add production record: {str(e)}")
    
    def generate_animal_profile(self):
        """Generate animal profile report"""
        selection = self.animal_tree.selection()
        if not selection:
            messagebox.showwarning("Warning", "Please select an animal")
            return
        
        item = self.animal_tree.item(selection[0])
        animal_id = item['tags'][0]
        
        animal = self.db.get_animal_by_id(animal_id)
        health_records = self.db.get_health_records_by_animal(animal_id)
        vaccinations = self.db.get_vaccinations_by_animal(animal_id)
        weight_records = self.db.get_weight_records_by_animal(animal_id)
        
        try:
            filepath = self.report_gen.generate_animal_profile(animal, health_records, vaccinations, weight_records)
            messagebox.showinfo("Success", f"Report generated: {filepath}")
            os.startfile(filepath)  # Open the file (Windows)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to generate report: {str(e)}")
    
    def generate_herd_report(self):
        """Generate herd report"""
        animals = self.db.get_all_animals()
        try:
            filepath = self.report_gen.generate_herd_report(animals)
            messagebox.showinfo("Success", f"Report generated: {filepath}")
            os.startfile(filepath)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to generate report: {str(e)}")
    
    def generate_financial_report(self):
        """Generate financial report"""
        records = self.db.get_financial_records()
        try:
            filepath = self.report_gen.generate_financial_report(records)
            messagebox.showinfo("Success", f"Report generated: {filepath}")
            os.startfile(filepath)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to generate report: {str(e)}")
    
    def generate_health_report(self):
        """Generate health report"""
        # This would need a method to get all health records
        messagebox.showinfo("Info", "Health report generation not yet implemented")
    
    def generate_breeding_report(self):
        """Generate breeding report"""
        # This would need a method to get all breeding records
        messagebox.showinfo("Info", "Breeding report generation not yet implemented")
    
    def export_database(self):
        """Export database to backup location"""
        filepath = filedialog.asksaveasfilename(
            defaultextension=".db",
            filetypes=[("Database files", "*.db"), ("All files", "*.*")]
        )
        if filepath:
            import shutil
            shutil.copy(self.db.db_path, filepath)
            messagebox.showinfo("Success", f"Database exported to {filepath}")
    
    def show_user_guide(self):
        """Show user guide"""
        guide = tk.Toplevel(self.root)
        guide.title("User Guide")
        guide.geometry("600x400")
        
        text = tk.Text(guide, wrap=tk.WORD, padx=10, pady=10)
        text.pack(fill=tk.BOTH, expand=True)
        
        guide_text = """
FARM MANAGEMENT SYSTEM - USER GUIDE
====================================

WELCOME!
This comprehensive farm management system is designed from an animal scientist 
and veterinary officer perspective to help you manage all aspects of your farm.

MAIN FEATURES:

1. ANIMAL MANAGEMENT
   - Add, edit, and track all your animals
   - Record tag numbers, breeds, dates of birth, and more
   - Track animal status and acquisition details

2. HEALTH RECORDS
   - Comprehensive veterinary record keeping
   - Track diagnoses, treatments, and medications
   - Record vaccinations with due dates
   - Monitor health trends over time

3. BREEDING MANAGEMENT
   - Track breeding dates and methods
   - Record dam and sire information
   - Monitor expected and actual delivery dates
   - Track breeding success rates

4. FEED MANAGEMENT
   - Record daily feed consumption
   - Track feed costs and suppliers
   - Monitor feeding patterns

5. FINANCIAL TRACKING
   - Track all income and expenses
   - Categorize transactions
   - Generate financial reports

6. PRODUCTION TRACKING
   - Record milk production for dairy animals
   - Track egg production for poultry
   - Monitor production trends

GENERATING REPORTS:
-------------------
All reports are generated in Microsoft Word (.docx) format for easy editing.

1. Animal Profile: Select an animal and click "Generate Profile"
2. Herd Report: Go to Reports menu > Generate Herd Report
3. Financial Report: Go to Reports menu > Generate Financial Report

Reports are saved in the "reports" folder in your application directory.

TIPS FOR BEGINNERS:
------------------
1. Start by adding your animals in the Animals tab
2. Use consistent tag numbering for easy tracking
3. Record health events as they happen
4. Generate reports regularly to monitor your farm's progress
5. Back up your database regularly using File > Export Database

SUPPORT:
--------
This is a personal application designed for individual farm management.
All data is stored locally in the farm_management.db file.

Happy Farming!
        """
        
        text.insert(1.0, guide_text)
        text.config(state=tk.DISABLED)
    
    def show_about(self):
        """Show about dialog"""
        messagebox.showinfo("About", 
            "Farm Management System\n"
            "Professional Edition\n\n"
            "A comprehensive farm management application\n"
            "designed by an animal scientist and veterinary officer\n\n"
            "Version 1.0\n"
            "2024")

def main():
    """Main entry point"""
    root = tk.Tk()
    app = FarmManagementApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
