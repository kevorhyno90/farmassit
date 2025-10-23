"""
Database module for Farm Management System
Handles all database operations using SQLite
"""

import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

class DatabaseManager:
    """Manages all database operations for the farm management system"""
    
    def __init__(self, db_path: str = "farm_management.db"):
        """Initialize database connection and create tables if needed"""
        self.db_path = db_path
        self.connection = None
        self.cursor = None
        self.connect()
        self.create_tables()
    
    def connect(self):
        """Establish database connection"""
        self.connection = sqlite3.connect(self.db_path)
        self.connection.row_factory = sqlite3.Row
        self.cursor = self.connection.cursor()
    
    def close(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
    
    def create_tables(self):
        """Create all necessary tables for the farm management system"""
        
        # Animals table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS animals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tag_number TEXT UNIQUE NOT NULL,
                name TEXT,
                species TEXT NOT NULL,
                breed TEXT,
                gender TEXT,
                date_of_birth DATE,
                weight REAL,
                color TEXT,
                status TEXT DEFAULT 'Active',
                acquisition_date DATE,
                acquisition_type TEXT,
                source TEXT,
                cost REAL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Health records table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS health_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                animal_id INTEGER NOT NULL,
                record_date DATE NOT NULL,
                record_type TEXT NOT NULL,
                diagnosis TEXT,
                symptoms TEXT,
                treatment TEXT,
                medications TEXT,
                dosage TEXT,
                veterinarian TEXT,
                next_checkup DATE,
                cost REAL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (animal_id) REFERENCES animals(id)
            )
        ''')
        
        # Vaccinations table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS vaccinations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                animal_id INTEGER NOT NULL,
                vaccine_name TEXT NOT NULL,
                vaccination_date DATE NOT NULL,
                batch_number TEXT,
                next_due_date DATE,
                veterinarian TEXT,
                cost REAL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (animal_id) REFERENCES animals(id)
            )
        ''')
        
        # Breeding records table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS breeding_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                dam_id INTEGER NOT NULL,
                sire_id INTEGER,
                breeding_date DATE NOT NULL,
                breeding_method TEXT,
                expected_delivery DATE,
                actual_delivery DATE,
                number_of_offspring INTEGER,
                complications TEXT,
                success BOOLEAN,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (dam_id) REFERENCES animals(id),
                FOREIGN KEY (sire_id) REFERENCES animals(id)
            )
        ''')
        
        # Offspring table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS offspring (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                breeding_record_id INTEGER NOT NULL,
                animal_id INTEGER,
                birth_weight REAL,
                birth_status TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (breeding_record_id) REFERENCES breeding_records(id),
                FOREIGN KEY (animal_id) REFERENCES animals(id)
            )
        ''')
        
        # Feed records table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS feed_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                record_date DATE NOT NULL,
                animal_id INTEGER,
                feed_type TEXT NOT NULL,
                quantity REAL NOT NULL,
                unit TEXT,
                cost REAL,
                supplier TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (animal_id) REFERENCES animals(id)
            )
        ''')
        
        # Weight records table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS weight_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                animal_id INTEGER NOT NULL,
                weight_date DATE NOT NULL,
                weight REAL NOT NULL,
                body_condition_score REAL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (animal_id) REFERENCES animals(id)
            )
        ''')
        
        # Financial records table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS financial_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_date DATE NOT NULL,
                transaction_type TEXT NOT NULL,
                category TEXT,
                amount REAL NOT NULL,
                description TEXT,
                animal_id INTEGER,
                payment_method TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (animal_id) REFERENCES animals(id)
            )
        ''')
        
        # Milk production table (for dairy animals)
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS milk_production (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                animal_id INTEGER NOT NULL,
                production_date DATE NOT NULL,
                morning_yield REAL,
                evening_yield REAL,
                total_yield REAL,
                fat_content REAL,
                quality_grade TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (animal_id) REFERENCES animals(id)
            )
        ''')
        
        # Egg production table (for poultry)
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS egg_production (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                production_date DATE NOT NULL,
                flock_id INTEGER,
                eggs_collected INTEGER,
                eggs_broken INTEGER,
                eggs_sold INTEGER,
                price_per_egg REAL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (flock_id) REFERENCES animals(id)
            )
        ''')
        
        self.connection.commit()
    
    # CRUD operations for Animals
    def add_animal(self, data: Dict[str, Any]) -> int:
        """Add a new animal to the database"""
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['?' for _ in data])
        query = f"INSERT INTO animals ({columns}) VALUES ({placeholders})"
        self.cursor.execute(query, list(data.values()))
        self.connection.commit()
        return self.cursor.lastrowid
    
    def get_all_animals(self) -> List[Dict[str, Any]]:
        """Retrieve all animals"""
        self.cursor.execute("SELECT * FROM animals ORDER BY tag_number")
        return [dict(row) for row in self.cursor.fetchall()]
    
    def get_animal_by_id(self, animal_id: int) -> Optional[Dict[str, Any]]:
        """Retrieve a specific animal by ID"""
        self.cursor.execute("SELECT * FROM animals WHERE id = ?", (animal_id,))
        row = self.cursor.fetchone()
        return dict(row) if row else None
    
    def update_animal(self, animal_id: int, data: Dict[str, Any]):
        """Update animal information"""
        data['updated_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        set_clause = ', '.join([f"{key} = ?" for key in data.keys()])
        query = f"UPDATE animals SET {set_clause} WHERE id = ?"
        values = list(data.values()) + [animal_id]
        self.cursor.execute(query, values)
        self.connection.commit()
    
    def delete_animal(self, animal_id: int):
        """Delete an animal (soft delete by changing status)"""
        self.cursor.execute("UPDATE animals SET status = 'Deleted' WHERE id = ?", (animal_id,))
        self.connection.commit()
    
    # CRUD operations for Health Records
    def add_health_record(self, data: Dict[str, Any]) -> int:
        """Add a new health record"""
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['?' for _ in data])
        query = f"INSERT INTO health_records ({columns}) VALUES ({placeholders})"
        self.cursor.execute(query, list(data.values()))
        self.connection.commit()
        return self.cursor.lastrowid
    
    def get_health_records_by_animal(self, animal_id: int) -> List[Dict[str, Any]]:
        """Get all health records for a specific animal"""
        self.cursor.execute(
            "SELECT * FROM health_records WHERE animal_id = ? ORDER BY record_date DESC",
            (animal_id,)
        )
        return [dict(row) for row in self.cursor.fetchall()]
    
    def update_health_record(self, record_id: int, data: Dict[str, Any]):
        """Update a health record"""
        set_clause = ', '.join([f"{key} = ?" for key in data.keys()])
        query = f"UPDATE health_records SET {set_clause} WHERE id = ?"
        values = list(data.values()) + [record_id]
        self.cursor.execute(query, values)
        self.connection.commit()
    
    # CRUD operations for Vaccinations
    def add_vaccination(self, data: Dict[str, Any]) -> int:
        """Add a new vaccination record"""
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['?' for _ in data])
        query = f"INSERT INTO vaccinations ({columns}) VALUES ({placeholders})"
        self.cursor.execute(query, list(data.values()))
        self.connection.commit()
        return self.cursor.lastrowid
    
    def get_vaccinations_by_animal(self, animal_id: int) -> List[Dict[str, Any]]:
        """Get all vaccinations for a specific animal"""
        self.cursor.execute(
            "SELECT * FROM vaccinations WHERE animal_id = ? ORDER BY vaccination_date DESC",
            (animal_id,)
        )
        return [dict(row) for row in self.cursor.fetchall()]
    
    # CRUD operations for Breeding Records
    def add_breeding_record(self, data: Dict[str, Any]) -> int:
        """Add a new breeding record"""
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['?' for _ in data])
        query = f"INSERT INTO breeding_records ({columns}) VALUES ({placeholders})"
        self.cursor.execute(query, list(data.values()))
        self.connection.commit()
        return self.cursor.lastrowid
    
    def get_breeding_records_by_animal(self, animal_id: int) -> List[Dict[str, Any]]:
        """Get all breeding records for a specific animal"""
        self.cursor.execute(
            "SELECT * FROM breeding_records WHERE dam_id = ? OR sire_id = ? ORDER BY breeding_date DESC",
            (animal_id, animal_id)
        )
        return [dict(row) for row in self.cursor.fetchall()]
    
    # CRUD operations for Feed Records
    def add_feed_record(self, data: Dict[str, Any]) -> int:
        """Add a new feed record"""
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['?' for _ in data])
        query = f"INSERT INTO feed_records ({columns}) VALUES ({placeholders})"
        self.cursor.execute(query, list(data.values()))
        self.connection.commit()
        return self.cursor.lastrowid
    
    def get_feed_records(self, animal_id: Optional[int] = None, start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get feed records with optional filters"""
        query = "SELECT * FROM feed_records WHERE 1=1"
        params = []
        
        if animal_id:
            query += " AND animal_id = ?"
            params.append(animal_id)
        if start_date:
            query += " AND record_date >= ?"
            params.append(start_date)
        if end_date:
            query += " AND record_date <= ?"
            params.append(end_date)
        
        query += " ORDER BY record_date DESC"
        self.cursor.execute(query, params)
        return [dict(row) for row in self.cursor.fetchall()]
    
    # CRUD operations for Weight Records
    def add_weight_record(self, data: Dict[str, Any]) -> int:
        """Add a new weight record"""
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['?' for _ in data])
        query = f"INSERT INTO weight_records ({columns}) VALUES ({placeholders})"
        self.cursor.execute(query, list(data.values()))
        self.connection.commit()
        return self.cursor.lastrowid
    
    def get_weight_records_by_animal(self, animal_id: int) -> List[Dict[str, Any]]:
        """Get all weight records for a specific animal"""
        self.cursor.execute(
            "SELECT * FROM weight_records WHERE animal_id = ? ORDER BY weight_date",
            (animal_id,)
        )
        return [dict(row) for row in self.cursor.fetchall()]
    
    # CRUD operations for Financial Records
    def add_financial_record(self, data: Dict[str, Any]) -> int:
        """Add a new financial record"""
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['?' for _ in data])
        query = f"INSERT INTO financial_records ({columns}) VALUES ({placeholders})"
        self.cursor.execute(query, list(data.values()))
        self.connection.commit()
        return self.cursor.lastrowid
    
    def get_financial_records(self, start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get financial records with optional date filters"""
        query = "SELECT * FROM financial_records WHERE 1=1"
        params = []
        
        if start_date:
            query += " AND transaction_date >= ?"
            params.append(start_date)
        if end_date:
            query += " AND transaction_date <= ?"
            params.append(end_date)
        
        query += " ORDER BY transaction_date DESC"
        self.cursor.execute(query, params)
        return [dict(row) for row in self.cursor.fetchall()]
    
    # CRUD operations for Milk Production
    def add_milk_production(self, data: Dict[str, Any]) -> int:
        """Add a new milk production record"""
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['?' for _ in data])
        query = f"INSERT INTO milk_production ({columns}) VALUES ({placeholders})"
        self.cursor.execute(query, list(data.values()))
        self.connection.commit()
        return self.cursor.lastrowid
    
    def get_milk_production_by_animal(self, animal_id: int) -> List[Dict[str, Any]]:
        """Get all milk production records for a specific animal"""
        self.cursor.execute(
            "SELECT * FROM milk_production WHERE animal_id = ? ORDER BY production_date DESC",
            (animal_id,)
        )
        return [dict(row) for row in self.cursor.fetchall()]
