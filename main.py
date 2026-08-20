from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PaymentRequest(BaseModel):
    flight_id: int
    card_number: str
    amount: float

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

def validate_luhn(card_number: str) -> bool:
    card_number = card_number.replace(" ", "").replace("-", "")
    
    if not card_number.isdigit():
        return False
        
    total = 0
    reverse_digits = card_number[::-1]
    
    for i, digit in enumerate(reverse_digits):
        n = int(digit)
        if i % 2 == 1:
            n *= 2
            if n > 9:
                n -= 9
        total += n
        
    return total % 10 == 0

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

@app.post("/pay")
def process_payment(payment: PaymentRequest):
    is_valid = validate_luhn(payment.card_number)
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid Credit Card Number")
        
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute("""
            INSERT INTO Bookings (user_id, flight_id, status) 
            VALUES (1, %s, 'Confirmed') RETURNING id;
        """, (payment.flight_id,))
        
        booking_id = cur.fetchone()['id']
        
                # 1. Strip spaces/hyphens to ensure we accurately grab the last 4 digits
        clean_card = payment.card_number.replace(" ", "").replace("-", "")

        # 2. Mask it to EXACTLY 16 characters (12 stars + 4 digits)
        masked_card = f"************{clean_card[-4:]}"
        
        cur.execute("""
            INSERT INTO Transactions (booking_id, card_number, amount, risk_score, status)
            VALUES (%s, %s, %s, 15, 'Success');
        """, (booking_id, masked_card, payment.amount))
        
        conn.commit() 
        
    except Exception as e:
        conn.rollback() 
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
        
    return {"status": "Success", "message": "Payment processed and flight booked!"}