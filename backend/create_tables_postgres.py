import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def create_tables():
    """Create all database tables using PostgreSQL"""
    
    db_url = os.getenv('DATABASE_URL')
    
    if not db_url:
        print("❌ DATABASE_URL not found in .env file!")
        return
    
    print("🔧 Connecting to PostgreSQL...")
    print(f"   Using: {db_url}")
    
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        print("📝 Creating tables...")
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(200) NOT NULL,
                user_type VARCHAR(20) NOT NULL,
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        print("  ✅ users table")
        
        # Jobseekers table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS jobseekers (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                full_name VARCHAR(100),
                phone VARCHAR(20),
                availability VARCHAR(50),
                job_category VARCHAR(100),
                salary_expectation INTEGER,
                profile_verified BOOLEAN DEFAULT FALSE
            )
        ''')
        print("  ✅ jobseekers table")
        
        # Employers table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS employers (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                company_name VARCHAR(100),
                company_phone VARCHAR(20),
                is_paid BOOLEAN DEFAULT FALSE,
                verified_to_view BOOLEAN DEFAULT FALSE
            )
        ''')
        print("  ✅ employers table")
        
        # Files table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS files (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                file_url VARCHAR(500),
                file_type VARCHAR(50),
                is_approved BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        print("  ✅ files table")
        
        # Payments table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                employer_id INTEGER REFERENCES employers(id),
                amount INTEGER,
                transaction_id VARCHAR(100),
                status VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        print("  ✅ payments table")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("\n🎉 ALL TABLES CREATED SUCCESSFULLY!")
        print("   Tables created in PostgreSQL:")
        print("   - users")
        print("   - jobseekers")
        print("   - employers")
        print("   - files")
        print("   - payments")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print("\n💡 Troubleshooting:")
        print("   1. Check PostgreSQL is running: sudo service postgresql status")
        print("   2. Check database exists: sudo -u postgres psql -l")
        print("   3. Check .env file has correct DATABASE_URL")
        print("   4. Try: sudo -u postgres psql -c 'CREATE DATABASE jobseeking_app'")

if __name__ == "__main__":
    create_tables()
