import { useState, useEffect } from 'react'

function App() {
  // This state holds the flights we get from the backend
  const [flights, setFlights] = useState([])

  // useEffect runs automatically when the page loads
  useEffect(() => {
    // The Customer asks the Waiter for the menu
    fetch('http://localhost:8000/flights')
      .then(response => response.json())
      .then(data => {
        console.log("Data from backend:", data);
        setFlights(data); // Save the data into our state
      })
      .catch(error => console.error("Error fetching flights:", error));
  }, []) // The empty array means "only run this once when the page loads"

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Visa Project: Available Flights</h1>
      
      {/* If there are no flights yet, show a loading message */}
      {flights.length === 0 ? (
        <p>Loading flights from backend...</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          
          {/* Loop through the flights array and create a card for each one */}
          {flights.map((flight) => (
            <div key={flight.id} style={{
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '8px',
              minWidth: '200px'
            }}>
              <h2>{flight.destination}</h2>
              <p><strong>Flight:</strong> {flight.flight_number}</p>
              <p><strong>Price:</strong> ${flight.price}</p>
              <p><strong>Seats Left:</strong> {flight.available_seats}</p>
              
              <button style={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%'
              }}>
                Book Now
              </button>
            </div>
          ))}

        </div>
      )}
    </div>
  )
}

export default App