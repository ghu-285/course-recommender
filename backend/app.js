// import required modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // load environment variables

// initialize express app
const app = express();

// middleware to parse JSON requests
app.use(express.json());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the application if the connection fails
    });

// example route
app.get('/', (req, res) => {
    res.send('Server is running and connected to MongoDB!');
});

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});