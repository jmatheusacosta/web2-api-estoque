const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /logar
router.post('/logar', authController.logar);

module.exports = router;
