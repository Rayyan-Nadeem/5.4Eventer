const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// Ensure these handlers are correctly defined and imported
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

module.exports = router;
