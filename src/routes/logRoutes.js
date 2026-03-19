const express = require('express');
const logController = require('../controllers/logController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /logs - Retorna registros de requisição por data informada
router.get('/logs', authMiddleware, logController.listarLogsPorData);

module.exports = router;
