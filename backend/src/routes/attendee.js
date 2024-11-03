const express = require('express');
const {
  createAttendee,
  getAttendees,
  getAttendeeById,
  updateAttendee,
  deleteAttendee,

  checkInAttendee,
  checkOutAllAttendees,
  generateCSV,
  getQRCode,
  gettickettypes,
  handleGForm,
} = require('../controllers/attendeeController');
const router = express.Router();

router.post('/', createAttendee);
router.get('/', getAttendees);
router.get('/get-ticket-types', gettickettypes); 
router.get('/:id', getAttendeeById);
router.put('/:id', updateAttendee);
router.delete('/:id', deleteAttendee);
router.patch('/:id/checkin', checkInAttendee);
router.patch('/checkout-all', checkOutAllAttendees);
router.post('/generate-csv', generateCSV);
router.post('/get-qrcode', getQRCode);
router.post('/gform', handleGForm);

module.exports = router;

