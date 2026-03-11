const express = require('express');
const estoqueController = require('../controllers/estoqueController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /estoque
router.get('/estoque', authMiddleware, estoqueController.listarUnidades);

module.exports = router;
