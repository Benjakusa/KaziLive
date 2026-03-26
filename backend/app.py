from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv('DATABASE_URL')

def get_db():
    return psycopg2.connect(DATABASE_URL)

@app.route('/')
def home():
    return jsonify({
        'message': 'Job Seeking App API',
        'status': 'running',
        'version': '1.0.0',
        'developer': 'Timothy',
        'database': 'PostgreSQL',
        'daraja_shortcode': '174379'
    })

@app.route('/health')
def health():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        conn.close()
        db_status = 'connected'
    except Exception as e:
        db_status = f'error: {str(e)}'
    
    return jsonify({
        'status': 'healthy',
        'database': db_status
    })

if __name__ == '__main__':
    print("🚀 Starting Job Seeking App Backend...")
    print("📍 Visit: http://localhost:5000")
    print("💳 Daraja Shortcode: 174379")
    print("🗄️  Database: PostgreSQL")
    print("👨‍💻 Developer: Timothy")
    app.run(debug=True, port=5000)
