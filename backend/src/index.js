require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const attendeeRoutes = require('./routes/attendee');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());



const port = process.env.PORT || 5001;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}

mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes); // Use /api/auth for auth routes
app.use('/api/attendees', attendeeRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
