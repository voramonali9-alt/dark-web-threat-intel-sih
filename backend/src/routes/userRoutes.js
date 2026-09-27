const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

// Register ka rasta
router.post('/register', registerUser);

// Login ka rasta (Naya Code)
router.post('/login', loginUser);

module.exports = router;
