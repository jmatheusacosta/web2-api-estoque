const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Configurando o Multer em memória (apenas intercepta e repassa o buffer pra nuvem)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter: (req, file, cb) => {
    // Aceitar apenas imagens
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Envie apenas imagens.'));
    }
  }
});

// POST /upload - Permite upload de 1 única imagem no campo 'imagem' do multipart/form-data
router.post('/upload', authMiddleware, upload.single('imagem'), uploadController.uploadImagem);

// Tratamento de erros de limite ou formato
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('Formato de arquivo')) {
    return res.status(400).json({ mensagem: err.message });
  }
  next(err);
});

module.exports = router;
