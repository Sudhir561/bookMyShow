import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/App.css";
import "../styles/bootstrap.min.css";
import { movies, slots, seats } from "./data";

const initialSeats={
  A1: "0",
  A2: "0",
  A3: "0",
  A4: "0",
  D1: "0",
  D2: "0",
}
function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(initialSeats);
  const [previousBooking, setPreviousBooking] = useState(null);
  const [showBookingMessage, setShowBookingMessage] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    movie: "",
    slot: "",
    seats: "",
  });

  useEffect(() => {
    const storedMovie = localStorage.getItem("movie");
    const storedSlot =  localStorage.getItem("slot");
    const storedSeats = JSON.parse(localStorage.getItem("seats"));

    if (storedMovie && storedSlot && storedSeats) {
      setSelectedMovie(storedMovie);
      setSelectedSlot(storedSlot);
      setSelectedSeats(storedSeats);
    }

    async function fetchPreviousBooking() {
      try {
        const response = await axios.get("http://localhost:8080/api/booking");
    
        if (response.status === 200) {
          // If a booking is found, set it in the state
          setPreviousBooking(response.data);
        } else if (response.status === 404) {
          // If no booking is found, handle it as a different error
          console.log("No previous booking found");
          // Handle it in a way specific to your application, e.g., setting an error state
          // setError("No previous booking found");
        } else {
          // Handle other errors
          console.log("Error fetching previous booking:", response.status);
          // You can set an error message or state here as well
          // setError("Error fetching previous booking");
        }
      } catch (error) {
        console.log("Error fetching previous booking:");
        // Handle any other network or request errors
        // setError("Error fetching previous booking");
      }
    }
    
    fetchPreviousBooking();
    

    
  }, [selectedMovie]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    localStorage.setItem("movie", movie);
    
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    localStorage.setItem("slot", slot);
  };

  const handleSeatChange = (seat, value) => {
    const updatedSeats = { ...selectedSeats };
    updatedSeats[seat] = value;
    setSelectedSeats(updatedSeats);
    localStorage.setItem("seats", JSON.stringify(updatedSeats));
  };

  const handleSeatClick = (seat) => {
    // Handle seat click
    // setSelectedSeats({ ...selectedSeats, [seat]: "0" });
  };
  

  const handleSubmit = async () => {
    const errors = {
      movie: !selectedMovie ? "*Please select a movie." : "",
      slot: !selectedSlot ? "*Please select a slot." : "",
      seats: Object.keys(selectedSeats).length === 0 ? "*Please select at least one seat." : "",
    };

    setValidationErrors(errors);

    if (Object.values(errors).every((error) => !error)) {
      // Valid form submission
      try {
        const response = await axios.post("http://localhost:8080/api/booking", {
          movie: selectedMovie,
          slot: selectedSlot,
          seats: selectedSeats,
        });
        // Handle success
        setShowBookingMessage(true);

        // Clear selections and local storage
        setSelectedMovie(null);
        setSelectedSlot(null);
        //console.log(initialSeats)
        setSelectedSeats(initialSeats);
        
        localStorage.removeItem("movie");
        localStorage.removeItem("slot");
        localStorage.removeItem("seats");

       
      // Remove selected classes for movies
     const movieElements = document.querySelectorAll(".movie-column-selected");
     movieElements.forEach((element) => {
       element.classList.remove("movie-column-selected");
       element.classList.add('movie-column')
     });

// Remove selected classes for slots
      const slotElements = document.querySelectorAll(".slot-column-selected");
      slotElements.forEach((element) => {
      element.classList.remove("slot-column-selected");
      element.classList.add('slot-column')
      });

// Remove selected classes for seats
        const seatElements = document.querySelectorAll(".seat-column-selected");
        seatElements.forEach((element) => {
       element.classList.remove("seat-column-selected");
       element.classList.add('seat-column')
      });

        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowBookingMessage(false);
        }, 5000);
      } catch (error) {
        console.error("Error making booking:", error);
      }
    }
  };

  return (
     <>
     <div>{ showBookingMessage && <p className="msg">Booking Successful!</p>}</div>
    <div className="container">
      <div className="booking-form">
        <h2>Book That Show!!</h2>

        <div className="movie-row">
          <h3>Select a Movie</h3>
          {movies.map((movie) => (
            <div
              key={movie}
              className={selectedMovie === movie ? "movie-column-selected" : "movie-column"}
              onClick={() => handleMovieClick(movie)}
            >
              {movie}
            </div>
          ))}
          {validationErrors.movie && <p className="validation-error">{validationErrors.movie}</p>}
        </div>

        <div className="slot-row">
          <h3>Select a Time Slot</h3>
          {slots.map((slot) => (
            <div
              key={slot}
              className={selectedSlot === slot ? "slot-column-selected" : "slot-column"}
              onClick={() => handleSlotClick(slot)}
            >
              {slot}
            </div>
          ))}
          {validationErrors.slot && <p className="validation-error">{validationErrors.slot}</p>}
        </div>

        <div className="seat-row">
          <h3>Select the Seats</h3>
          {seats.map((seat) => (
            <div
              key={seat}
              className={`seat-column ${selectedSeats[seat] !== initialSeats[seat]? "seat-column-selected" : ""}`}
              onClick={() => handleSeatClick(seat)}
            >
              <p className="seat-type">{`Type ${seat}`}</p>
              <input
                type="number"
                value={String(selectedSeats[seat])}
                onChange={(e) => handleSeatChange(seat, e.target.value)}
              />
            </div>
          ))}
          {validationErrors.seats && <p className="validation-error">{validationErrors.seats}</p>}
        </div>

        <div className="book-button">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>

     <div className="last-order">
        <h2>Last Booking Details</h2>
      {previousBooking ? (
        <div >
          <h3>Seats:</h3>
          {previousBooking.seats ? (
            <ul>
              {Object.keys(previousBooking.seats).map((seat) => (
                <li key={seat} className="list" >
                  <h5>{seat}:<span> {previousBooking.seats[seat][0]}</span></h5> 
                </li>
              ))}
            </ul>
          ) : (
            <p>No seat details available</p>
          )}
          <h3>Movie: <span>{previousBooking.movie[0]}</span></h3>
          <h3>Slot: <span>{previousBooking.slot[0]}</span></h3>
        </div>
      ) : (
        <p>No previous record found</p>
      )}
      
      </div>
    </div>
    </>
  );
}

export default App;
