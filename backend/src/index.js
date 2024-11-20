const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routes for attendees and authentication
const attendeeRoutes = require('./routes/attendee');
const authRoutes = require('./routes/auth');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://3.88.119.171', // Add your public IP
    'http://localhost:5174', // Add localhost for local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Include necessary headers
  credentials: true, // Allow cookies and authorization headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendees', attendeeRoutes);

// Start HTTP Server (no SSL)
const http = require('http');
const port = process.env.PORT || 5001; // Use port 5001 for HTTP
http.createServer(app).listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
