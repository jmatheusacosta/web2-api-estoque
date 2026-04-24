const express = require('express');
const estoqueController = require('../controllers/estoqueController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /estoque - Listar todos
router.get('/estoque', authMiddleware, estoqueController.listarUnidades);

// POST /estoque - Inserir item
router.post('/estoque', authMiddleware, estoqueController.inserirItem);

// DELETE /estoque/:id - Excluir item
router.delete('/estoque/:id', authMiddleware, estoqueController.excluirItem);

// GET /estoque/buscar/:codigo - Buscar por código
router.get('/estoque/buscar/:codigo', authMiddleware, estoqueController.buscarPorCodigo);

// PUT /estoque/:id - Atualizar item
router.put('/estoque/:id', authMiddleware, estoqueController.atualizarItem);

module.exports = router;
