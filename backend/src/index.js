// backend/src/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const attendeeRoutes = require('./routes/attendee');

const app = express();

app.use(express.json());

const port = process.env.PORT || 5001;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/attendees', attendeeRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
