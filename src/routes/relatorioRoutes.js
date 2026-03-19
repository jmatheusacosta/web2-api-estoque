const express = require('express');
const relatorioController = require('../controllers/relatorioController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /estoque/relatorio - Gera um arquivo PDF para download
router.get('/estoque/relatorio', authMiddleware, relatorioController.gerarRelatorioPDF);

module.exports = router;
