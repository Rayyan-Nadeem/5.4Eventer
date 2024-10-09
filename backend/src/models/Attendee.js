// backend/src/models/Attendee.js
const mongoose = require('mongoose');

const AttendeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  allergyInfo: {
    type: String,
  },
  foodRestrictions: {
    type: String,
  },
  daysAttending: {
    type: [Number],
    required: true,
  },
  checkedIn: {
    type: Boolean,
    default: false,
  },
  checkedInHistory: {
    type: Map,
    of: Boolean,
    default: {},
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  profilePic: {
    type: String,
  },
});

module.exports = mongoose.model('Attendee', AttendeeSchema);
