from fastapi import FastAPI, HTTPException
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI()


def get_db_connection():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="flight_db",
            user="postgres",
            password="YOUR PASSWORD", 
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