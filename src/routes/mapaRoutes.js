const express = require('express');
const mapaController = require('../controllers/mapaController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// POST /distancia - Exige autenticação
router.post('/distancia', authMiddleware, mapaController.calcularDistancia);

module.exports = router;
