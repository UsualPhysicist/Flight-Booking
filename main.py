from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Allows your React app to connect
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)


def get_db_connection():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="flight_db",
            user="postgres",
            password=os.getenv("db_password"), 
            port="5432"
        )
        return conn
    except Exception as e:
        print("Database connection failed:", e)
        return None


@app.get("/flights")
def get_all_flights():
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    
    cur.execute("SELECT * FROM Flights;")
    flights = cur.fetchall()
    
    
    cur.close()
    conn.close()
    
    return flights