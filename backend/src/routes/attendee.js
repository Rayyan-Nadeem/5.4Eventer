// backend/src/routes/attendee.js
const express = require('express');
const { createAttendee, getAttendees, getAttendeeById, updateAttendee, deleteAttendee } = require('../controllers/attendeeController');
const router = express.Router();

router.post('/', createAttendee);
router.get('/', getAttendees);
router.get('/:id', getAttendeeById);
router.put('/:id', updateAttendee);
router.delete('/:id', deleteAttendee);

module.exports = router;
