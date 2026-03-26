import sqlite3
import os

def create_tables():
    """Create all database tables using SQLite"""
    
    # SQLite database file
    db_path = 'jobseeking_app.db'
    
    print("🔧 Creating SQLite database...")
    
    try:
        # Connect to SQLite (creates file if it doesn't exist)
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("📝 Creating tables...")
        
        # Create users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                user_type TEXT NOT NULL,
                is_verified INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        print("  ✅ users table created")
        
        # Create jobseekers table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS jobseekers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                full_name TEXT,
                phone TEXT,
                availability TEXT,
                job_category TEXT,
                salary_expectation INTEGER,
                profile_verified INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        print("  ✅ jobseekers table created")
        
        # Create employers table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS employers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                company_name TEXT,
                company_phone TEXT,
                is_paid INTEGER DEFAULT 0,
                verified_to_view INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        print("  ✅ employers table created")
        
        # Create files table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                file_url TEXT,
                file_type TEXT,
                is_approved INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        print("  ✅ files table created")
        
        # Create payments table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employer_id INTEGER,
                amount INTEGER,
                transaction_id TEXT,
                status TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (employer_id) REFERENCES employers (id)
            )
        ''')
        print("  ✅ payments table created")
        
        conn.commit()
        conn.close()
        
        print(f"\n🎉 ALL TABLES CREATED SUCCESSFULLY!")
        print(f"   Database saved to: {db_path}")
        print("   Tables created:")
        print("   - users")
        print("   - jobseekers")
        print("   - employers")
        print("   - files")
        print("   - payments")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    create_tables()
