const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const { usuarios } = require('../data/db');

exports.logar = (req, res) => {
  const { email, senha } = req.body;

  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    // Gera um token válido
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email }, 
      authConfig.secret, 
      { expiresIn: authConfig.expiresIn }
    );
    return res.json({ mensagem: 'Login realizado com sucesso', token });
  }

  return res.status(401).json({ mensagem: 'Credenciais inválidas' });
};
