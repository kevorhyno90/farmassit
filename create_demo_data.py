"""
Demo script to populate the farm management system with example data
This helps new users understand the system and see it in action
"""

from database import DatabaseManager
from report_generator import ReportGenerator
from datetime import datetime, timedelta
import os

def create_demo_data():
    """Create sample farm data for demonstration"""
    
    print("="*60)
    print("FARM MANAGEMENT SYSTEM - DEMO DATA CREATOR")
    print("="*60)
    print("\nThis will create example data to help you learn the system.")
    print("You can delete this data later and add your own.\n")
    
    response = input("Continue? (yes/no): ").lower()
    if response != 'yes':
        print("Demo cancelled.")
        return
    
    # Initialize database
    db = DatabaseManager()
    
    print("\n1. Creating sample animals...")
    
    # Add cattle
    animals = [
        {
            'tag_number': 'C001',
            'name': 'Bessie',
            'species': 'Cattle',
            'breed': 'Holstein',
            'gender': 'Female',
            'date_of_birth': '2020-01-15',
            'weight': 550.0,
            'color': 'Black and White',
            'acquisition_date': '2020-02-01',
            'acquisition_type': 'Purchase',
            'source': 'Green Valley Farm',
            'cost': 1500.00,
            'notes': 'Excellent milk producer, calm temperament'
        },
        {
            'tag_number': 'C002',
            'name': 'Daisy',
            'species': 'Cattle',
            'breed': 'Jersey',
            'gender': 'Female',
            'date_of_birth': '2019-03-20',
            'weight': 420.0,
            'color': 'Light Brown',
            'acquisition_date': '2019-04-15',
            'acquisition_type': 'Purchase',
            'source': 'Meadow Farm',
            'cost': 1200.00,
            'notes': 'High butterfat content in milk'
        },
        {
            'tag_number': 'C003',
            'name': 'Max',
            'species': 'Cattle',
            'breed': 'Angus',
            'gender': 'Male',
            'date_of_birth': '2021-05-10',
            'weight': 650.0,
            'color': 'Black',
            'acquisition_date': '2021-06-01',
            'acquisition_type': 'Purchase',
            'source': 'Prime Beef Farm',
            'cost': 2000.00,
            'notes': 'Prime breeding bull, excellent genetics'
        },
        {
            'tag_number': 'S001',
            'name': 'Fluffy',
            'species': 'Sheep',
            'breed': 'Merino',
            'gender': 'Female',
            'date_of_birth': '2021-09-12',
            'weight': 65.0,
            'color': 'White',
            'acquisition_date': '2021-10-01',
            'acquisition_type': 'Purchase',
            'source': 'Wool Masters',
            'cost': 250.00,
            'notes': 'High-quality wool producer'
        },
        {
            'tag_number': 'P001',
            'name': 'Hamlet',
            'species': 'Pig',
            'breed': 'Yorkshire',
            'gender': 'Male',
            'date_of_birth': '2023-01-15',
            'weight': 180.0,
            'color': 'Pink',
            'acquisition_date': '2023-02-01',
            'acquisition_type': 'Birth',
            'source': 'On Farm',
            'cost': 0.00,
            'notes': 'Born on farm, good growth rate'
        }
    ]
    
    animal_ids = {}
    for animal in animals:
        animal_id = db.add_animal(animal)
        animal_ids[animal['tag_number']] = animal_id
        print(f"   ✓ Added {animal['name']} ({animal['tag_number']})")
    
    print(f"\n   Total animals added: {len(animals)}")
    
    # Add health records
    print("\n2. Creating sample health records...")
    
    health_records = [
        {
            'animal_id': animal_ids['C001'],
            'record_date': '2024-01-15',
            'record_type': 'Vaccination',
            'diagnosis': 'Routine vaccination',
            'treatment': 'Administered FMD vaccine',
            'medications': 'FMD Vaccine',
            'dosage': '2ml subcutaneous',
            'veterinarian': 'Dr. Sarah Johnson',
            'cost': 25.00,
            'notes': 'No adverse reactions'
        },
        {
            'animal_id': animal_ids['C001'],
            'record_date': '2024-02-20',
            'record_type': 'Checkup',
            'diagnosis': 'Healthy, pregnancy confirmed',
            'treatment': 'Prenatal vitamins prescribed',
            'medications': 'Prenatal vitamins',
            'dosage': '1 tablet daily',
            'veterinarian': 'Dr. Sarah Johnson',
            'cost': 50.00,
            'notes': 'Expected delivery in 6 months'
        },
        {
            'animal_id': animal_ids['C002'],
            'record_date': '2024-01-10',
            'record_type': 'Treatment',
            'diagnosis': 'Mild mastitis in rear left quarter',
            'symptoms': 'Swelling, reduced milk yield, slight fever',
            'treatment': 'Antibiotic treatment for 5 days',
            'medications': 'Penicillin',
            'dosage': '10ml intramuscular once daily',
            'veterinarian': 'Dr. Michael Chen',
            'cost': 75.00,
            'notes': 'Milk withdrawal period: 7 days'
        },
        {
            'animal_id': animal_ids['S001'],
            'record_date': '2024-03-01',
            'record_type': 'Vaccination',
            'diagnosis': 'Routine vaccination',
            'treatment': 'Administered clostridial vaccine',
            'medications': 'CDT Vaccine',
            'dosage': '2ml subcutaneous',
            'veterinarian': 'Dr. Sarah Johnson',
            'cost': 15.00,
            'notes': 'Booster due in 1 year'
        }
    ]
    
    for record in health_records:
        db.add_health_record(record)
    
    print(f"   ✓ Added {len(health_records)} health records")
    
    # Add vaccinations
    print("\n3. Creating vaccination records...")
    
    vaccinations = [
        {
            'animal_id': animal_ids['C001'],
            'vaccine_name': 'FMD (Foot and Mouth Disease)',
            'vaccination_date': '2024-01-15',
            'batch_number': 'FMD-2024-A123',
            'next_due_date': '2025-01-15',
            'veterinarian': 'Dr. Sarah Johnson',
            'cost': 25.00
        },
        {
            'animal_id': animal_ids['C002'],
            'vaccine_name': 'FMD (Foot and Mouth Disease)',
            'vaccination_date': '2024-01-15',
            'batch_number': 'FMD-2024-A123',
            'next_due_date': '2025-01-15',
            'veterinarian': 'Dr. Sarah Johnson',
            'cost': 25.00
        },
        {
            'animal_id': animal_ids['C003'],
            'vaccine_name': 'FMD (Foot and Mouth Disease)',
            'vaccination_date': '2024-01-15',
            'batch_number': 'FMD-2024-A123',
            'next_due_date': '2025-01-15',
            'veterinarian': 'Dr. Sarah Johnson',
            'cost': 25.00
        }
    ]
    
    for vac in vaccinations:
        db.add_vaccination(vac)
    
    print(f"   ✓ Added {len(vaccinations)} vaccination records")
    
    # Add breeding records
    print("\n4. Creating breeding records...")
    
    breeding_records = [
        {
            'dam_id': animal_ids['C001'],
            'sire_id': animal_ids['C003'],
            'breeding_date': '2024-02-14',
            'breeding_method': 'Natural',
            'expected_delivery': '2024-11-20',
            'success': True,
            'notes': 'First breeding, observed natural mating'
        },
        {
            'dam_id': animal_ids['C002'],
            'sire_id': animal_ids['C003'],
            'breeding_date': '2024-03-01',
            'breeding_method': 'Artificial Insemination',
            'expected_delivery': '2024-12-05',
            'notes': 'Used high-quality semen, pregnancy to be confirmed'
        }
    ]
    
    for record in breeding_records:
        db.add_breeding_record(record)
    
    print(f"   ✓ Added {len(breeding_records)} breeding records")
    
    # Add feed records
    print("\n5. Creating feed records...")
    
    base_date = datetime.now()
    feed_records = []
    
    # Add feed records for the last 7 days
    for i in range(7):
        date = (base_date - timedelta(days=i)).strftime('%Y-%m-%d')
        feed_records.extend([
            {
                'record_date': date,
                'animal_id': animal_ids['C001'],
                'feed_type': 'Hay',
                'quantity': 15.0,
                'unit': 'kg',
                'cost': 7.50,
                'supplier': 'Green Valley Feed'
            },
            {
                'record_date': date,
                'animal_id': animal_ids['C002'],
                'feed_type': 'Silage',
                'quantity': 20.0,
                'unit': 'kg',
                'cost': 10.00,
                'supplier': 'Local Co-op'
            },
            {
                'record_date': date,
                'feed_type': 'Grain',
                'quantity': 50.0,
                'unit': 'kg',
                'cost': 35.00,
                'supplier': 'Farm Supply Store',
                'notes': 'Bulk purchase for all animals'
            }
        ])
    
    for record in feed_records:
        db.add_feed_record(record)
    
    print(f"   ✓ Added {len(feed_records)} feed records (last 7 days)")
    
    # Add weight records
    print("\n6. Creating weight tracking records...")
    
    weight_records = [
        # C001 - Bessie (showing growth over time)
        {
            'animal_id': animal_ids['C001'],
            'weight_date': '2024-01-01',
            'weight': 530.0,
            'body_condition_score': 3.0,
            'notes': 'Good condition'
        },
        {
            'animal_id': animal_ids['C001'],
            'weight_date': '2024-02-01',
            'weight': 540.0,
            'body_condition_score': 3.5,
            'notes': 'Gaining well'
        },
        {
            'animal_id': animal_ids['C001'],
            'weight_date': '2024-03-01',
            'weight': 550.0,
            'body_condition_score': 3.5,
            'notes': 'Pregnant, good weight gain'
        },
        # C002 - Daisy
        {
            'animal_id': animal_ids['C002'],
            'weight_date': '2024-01-01',
            'weight': 410.0,
            'body_condition_score': 3.0
        },
        {
            'animal_id': animal_ids['C002'],
            'weight_date': '2024-03-01',
            'weight': 420.0,
            'body_condition_score': 3.0
        }
    ]
    
    for record in weight_records:
        db.add_weight_record(record)
    
    print(f"   ✓ Added {len(weight_records)} weight records")
    
    # Add financial records
    print("\n7. Creating financial records...")
    
    financial_records = [
        {
            'transaction_date': '2024-01-15',
            'transaction_type': 'Expense',
            'category': 'Veterinary',
            'amount': 190.00,
            'description': 'Vaccination for all cattle',
            'payment_method': 'Bank Transfer',
            'notes': 'Annual vaccinations'
        },
        {
            'transaction_date': '2024-02-01',
            'transaction_type': 'Expense',
            'category': 'Feed',
            'amount': 500.00,
            'description': 'Monthly feed purchase from Feed Supplier Co.',
            'payment_method': 'Cash'
        },
        {
            'transaction_date': '2024-02-15',
            'transaction_type': 'Income',
            'category': 'Sales',
            'amount': 850.00,
            'description': 'Milk sales - February',
            'payment_method': 'Bank Transfer',
            'notes': 'Sold to local dairy processor'
        },
        {
            'transaction_date': '2024-03-01',
            'transaction_type': 'Expense',
            'category': 'Feed',
            'amount': 480.00,
            'description': 'Monthly feed purchase',
            'payment_method': 'Cash'
        },
        {
            'transaction_date': '2024-03-10',
            'transaction_type': 'Income',
            'category': 'Sales',
            'amount': 200.00,
            'description': 'Wool sales from sheep shearing',
            'payment_method': 'Check'
        }
    ]
    
    for record in financial_records:
        db.add_financial_record(record)
    
    print(f"   ✓ Added {len(financial_records)} financial records")
    
    # Add milk production records
    print("\n8. Creating milk production records...")
    
    milk_records = []
    for i in range(30):  # Last 30 days
        date = (base_date - timedelta(days=i)).strftime('%Y-%m-%d')
        milk_records.extend([
            {
                'animal_id': animal_ids['C001'],
                'production_date': date,
                'morning_yield': 12.5,
                'evening_yield': 11.0,
                'total_yield': 23.5,
                'quality_grade': 'A'
            },
            {
                'animal_id': animal_ids['C002'],
                'production_date': date,
                'morning_yield': 10.0,
                'evening_yield': 9.5,
                'total_yield': 19.5,
                'quality_grade': 'A'
            }
        ])
    
    for record in milk_records:
        db.add_milk_production(record)
    
    print(f"   ✓ Added {len(milk_records)} milk production records (last 30 days)")
    
    # Generate sample reports
    print("\n9. Generating sample reports...")
    
    report_gen = ReportGenerator()
    
    # Animal profile for Bessie
    animal = db.get_animal_by_id(animal_ids['C001'])
    health = db.get_health_records_by_animal(animal_ids['C001'])
    vacs = db.get_vaccinations_by_animal(animal_ids['C001'])
    weights = db.get_weight_records_by_animal(animal_ids['C001'])
    
    profile_path = report_gen.generate_animal_profile(animal, health, vacs, weights)
    print(f"   ✓ Generated animal profile: {os.path.basename(profile_path)}")
    
    # Herd report
    all_animals = db.get_all_animals()
    herd_path = report_gen.generate_herd_report(all_animals)
    print(f"   ✓ Generated herd report: {os.path.basename(herd_path)}")
    
    # Financial report
    financials = db.get_financial_records()
    financial_path = report_gen.generate_financial_report(financials)
    print(f"   ✓ Generated financial report: {os.path.basename(financial_path)}")
    
    print("\n" + "="*60)
    print("DEMO DATA CREATION COMPLETE!")
    print("="*60)
    print(f"\nSummary:")
    print(f"  • {len(animals)} animals added")
    print(f"  • {len(health_records)} health records")
    print(f"  • {len(vaccinations)} vaccinations")
    print(f"  • {len(breeding_records)} breeding records")
    print(f"  • {len(feed_records)} feed records")
    print(f"  • {len(weight_records)} weight tracking records")
    print(f"  • {len(financial_records)} financial transactions")
    print(f"  • {len(milk_records)} milk production records")
    print(f"  • 3 sample reports generated")
    print(f"\nReports location: {os.path.abspath('reports')}")
    print(f"\nYou can now run 'python main.py' to explore the application!")
    print("\nNote: You can delete the database file 'farm_management.db'")
    print("      and run this demo again, or start fresh with your own data.")
    
    db.close()

if __name__ == "__main__":
    create_demo_data()
