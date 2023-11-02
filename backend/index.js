// Import required libraries and modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT||8080;
const dotEnv=require('dotenv').config()
const path = require("path");


// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { connection } = require("./connector");
const cors = require("cors");
app.use(cors());


// Start the server and listen on the specified port
app.listen(port, () => console.log(`App listening on port ${port}!`));

// Define API endpoint for booking
app.post("/api/booking", (req, res) => {
  // Handle POST request for booking here
  const { movie, seats, slot } = req.body;

  // Validate the input data
  if (!movie || movie.trim() === '') {
    return res.status(400).json({ error: 'Movie name is required' });
  }

  if (!seats || typeof seats !== 'object' || Object.keys(seats).length === 0) {
    return res.status(400).json({ error: 'Seats data is required' });
  }

  if (!slot || slot.trim() === '') {
    return res.status(400).json({ error: 'Slot is required' });
  }

  // Define the query to check if the data already exists, considering both movie, slot, and seats
  const query = { movie, slot, seats };

  // Check if the data already exists in the database
  connection.findOne(query, (err, existingBooking) => {
    if (err) {
      // Handle errors while checking for existing data
      res.status(500).send("Error checking for existing data");
    } else if (existingBooking) {
      // Data already exists, return a 409 Conflict response
      res.status(409).json({
        error: `Movie '${movie}' with slot '${slot}' and seat(s) '${JSON.stringify(seats)}' already has a booking.`,
      });
    } else {
      // Data doesn't exist, proceed to save it
      const newBooking = new connection({ movie, seats, slot });
      newBooking.save((err, savedBooking) => {
        if (err) {
          // Handle errors while saving the new booking
          res.status(500).send("Error saving booking");
        } else {
          // Construct the desired response format
          const response = {
            movie: [savedBooking.movie],
            seats: Object.fromEntries(
              Object.entries(savedBooking.seats).map(([key, value]) => [
                key,
                [value],
              ])
            ),
            slot: [savedBooking.slot],
          };

          //console.log(response);
          res.status(200).json(response);
        }
      });
    }
  });
});

// Define the GET endpoint to retrieve the last booking
app.get("/api/booking", async (req, res) => {
  try {
    // Find the last booking in the database
    const lastBooking = await connection.findOne().sort({ _id: -1 });

    if (!lastBooking) {
      // If no previous booking found, return a 404 Not Found response
      return res.status(404).json({ message: "No previous booking found" });
    }

    // Construct the desired response format for GET
    const response = {
      movie: [lastBooking.movie],
      seats: Object.fromEntries(
        Object.entries(lastBooking.seats).map(([key, value]) => [key, [value]])
      ),
      slot: [lastBooking.slot],
    };

    res.status(200).json(response);
  } catch (error) {
    // Handle errors while retrieving the last booking
    res.status(500).send(error);
  }
});

// Export the Express app
module.exports = app;
