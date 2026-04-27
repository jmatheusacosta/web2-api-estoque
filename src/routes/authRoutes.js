const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /logar - Etapa 1
router.post('/logar', authController.logar);

// POST /logar/2fa - Etapa 2
router.post('/logar/2fa', authController.validar2FA);

module.exports = router;
