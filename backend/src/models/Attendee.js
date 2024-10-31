const mongoose = require('mongoose');

const AttendeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
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
  checkedIn: {
    type: Boolean,
    default: false,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  ticketType: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  sex: {
    type: String,  // Options could be "Male", "Female", or "Other"
    required: false,
  },
  dob: {
    type: Date,  // Date of birth
    required: false,
  },
  consent: {
    type: Boolean,  // Consent to be photographed and filmed
    default: false,
  }
});

module.exports = mongoose.model('Attendee', AttendeeSchema);
