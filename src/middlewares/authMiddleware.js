const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // O token geralmente é enviado no formato: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(403).json({ mensagem: 'Token não fornecido' });
  }

  jwt.verify(token, authConfig.secret, (err, userDecoded) => {
    if (err) {
      return res.status(401).json({ mensagem: 'Token inválido' });
    }
    // Salva as informações do usuário logado na requisição (opcional)
    req.user = userDecoded;
    next();
  });
}

module.exports = verificarToken;
