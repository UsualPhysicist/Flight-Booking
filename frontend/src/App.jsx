import { useState, useEffect } from 'react'

function App() {
  const [flights, setFlights] = useState([])
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [cardNumber, setCardNumber] = useState("")
  const [paymentStatus, setPaymentStatus] = useState(null) 

  useEffect(() => {
    // 1. Fetch the menu of flights from Python
    fetch(`${import.meta.env.VITE_API_URL}/flights`)
      .then(response => response.json())
      .then(data => setFlights(data))
      .catch(error => console.error("Error fetching flights:", error));
  }, [])

  // 2. The Secure Payment Gateway Connection
  const handlePayment = async (e) => {
    e.preventDefault()
    setPaymentStatus("Processing...") 

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pay`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flight_id: selectedFlight.id,
          card_number: cardNumber,
          amount: selectedFlight.price
        })
      })

      const data = await response.json()

      if (response.ok) {
        setPaymentStatus(`✅ ${data.message}`)
        
        // Wait 3 seconds, then drop them back to the main menu
        setTimeout(() => {
          setSelectedFlight(null)
          setCardNumber("")
          setPaymentStatus(null)
        }, 3000)
      } else {
        // The Luhn math failed on the Python side
        setPaymentStatus(`❌ Transaction Failed: ${data.detail}`)
      }
    } catch (error) {
      console.error(error)
      setPaymentStatus("❌ Server error. Is the backend running?")
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Visa Project: Secure Booking</h1>
      
      {/* CONDITIONAL RENDERING: Show Flights OR Show Checkout Form */}
      {!selectedFlight ? (
        <div>
          {flights.length === 0 ? <p>Loading flights...</p> : (
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {flights.map((flight) => (
                <div key={flight.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', minWidth: '200px' }}>
                  <h2>{flight.destination}</h2>
                  <p><strong>Flight:</strong> {flight.flight_number}</p>
                  <p><strong>Price:</strong> ${flight.price}</p>
                  <p><strong>Seats Left:</strong> {flight.available_seats}</p>
                  
                  <button 
                    onClick={() => setSelectedFlight(flight)}
                    disabled={flight.available_seats === 0}
                    style={{
                      backgroundColor: flight.available_seats === 0 ? 'gray' : '#1a1a1a',
                      color: 'white', padding: '10px', border: 'none', borderRadius: '5px', 
                      cursor: flight.available_seats === 0 ? 'not-allowed' : 'pointer', width: '100%'
                  }}>
                    {flight.available_seats === 0 ? "Sold Out" : "Book Now"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ border: '1px solid #4CAF50', padding: '20px', borderRadius: '8px' }}>
          <h2>Checkout: {selectedFlight.destination}</h2>
          <p>Total Amount Due: <strong>${selectedFlight.price}</strong></p>
          
          <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            <label>
              16-Digit Card Number:
              <input 
                type="text" 
                maxLength="19"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                placeholder="Enter test card number"
              />
            </label>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: 1 }}>
                Pay Securely
              </button>
              <button type="button" onClick={() => {setSelectedFlight(null); setPaymentStatus(null)}} style={{ backgroundColor: 'red', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
            
            {paymentStatus && (
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', fontWeight: 'bold', color: 'black' }}>
                {paymentStatus}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  )
}

export default App