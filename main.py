from fastapi import FastAPI, HTTPException
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI()

# --- DATABASE CONNECTION FUNCTION ---
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="flight_db",
            user="postgres",
            password="YOUR PASSWORD", # <-- CHANGE THIS
            port="5432"
        )
        return conn
    except Exception as e:
        print("Database connection failed:", e)
        return None

# --- YOUR FIRST ENDPOINT ---
# This tells FastAPI: "When someone visits the /flights URL, run this code."
@app.get("/flights")
def get_all_flights():
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    # Open a "cursor" to run SQL commands. RealDictCursor makes the output look like nice JSON.
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Execute a simple SQL command
    cur.execute("SELECT * FROM Flights;")
    flights = cur.fetchall()
    
    # Close the connection so we don't crash the database
    cur.close()
    conn.close()
    
    return flights