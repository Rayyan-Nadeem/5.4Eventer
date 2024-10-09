// backend/src/controllers/attendeeController.js
const Attendee = require('../models/Attendee');

const createAttendee = async (req, res) => {
  try {
    const attendee = new Attendee(req.body);
    await attendee.save();
    res.status(201).json(attendee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAttendees = async (req, res) => {
  try {
    const attendees = await Attendee.find();
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAttendeeById = async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id);
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    res.json(attendee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAttendee = async (req, res) => {
  try {
    const attendee = await Attendee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    res.json(attendee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAttendee = async (req, res) => {
  try {
    const attendee = await Attendee.findByIdAndDelete(req.params.id);
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    res.json({ message: 'Attendee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAttendee,
  getAttendees,
  getAttendeeById,
  updateAttendee,
  deleteAttendee,
};
