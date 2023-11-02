
// Import the 'mongoose' library
const mongoose = require('mongoose');

// Define a schema using 'mongoose.Schema'
const Schema = mongoose.Schema;

// Define the 'bookMovieSchema' schema
const bookMovieSchema = new Schema({
  movie: String, // Define a 'movie' field as a string
  slot: String,  // Define a 'slot' field as a string
  seats: { // Define a 'seats' field as an object
    A1: Number,
    A2: Number,
    A3: Number,
    A4: Number,
    D1: Number,
    D2: Number,
  }, // 'seats' is structured as an object of numbers
});

// Export the 'bookMovieSchema' for use in other modules
exports.bookMovieSchema = bookMovieSchema;


