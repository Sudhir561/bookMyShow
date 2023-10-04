// Import the 'mongodb' library
const mongodb = require('mongodb');

// Define the MongoDB connection URI
const mongoURI = process.env.MONGOOSE_URI

// Import the 'mongoose' library for MongoDB interactions
let mongoose = require('mongoose');

// Import the 'bookMovieSchema' from the 'schema' module
const { bookMovieSchema } = require('./schema')

// Connect to the MongoDB server using the provided URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Log a message when the connection is successfully established
        console.log("Connection established with MongoDB server online");
    })
    .catch(err => {
        // Log an error message if there's an issue with the connection
        console.log("Error while connecting to MongoDB", err)
    });

// Create a MongoDB model named 'collection_connection' based on the 'bookMovieSchema'
let collection_connection = mongoose.model('bookmovietickets', bookMovieSchema)

// Export the 'collection_connection' for use in other modules
exports.connection = collection_connection;
