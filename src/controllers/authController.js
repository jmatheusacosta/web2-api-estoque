const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const { db } = require('../config/firebase');

exports.logar = async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    const usuariosRef = db.collection('usuarios');
    const snapshot = await usuariosRef.where('email', '==', email).where('senha', '==', senha).get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const usuario = { id: doc.id, ...doc.data() };
      
      // Gera um token válido
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email }, 
        authConfig.secret, 
        { expiresIn: authConfig.expiresIn }
      );
      return res.json({ mensagem: 'Login realizado com sucesso', token });
    }

    return res.status(401).json({ mensagem: 'Credenciais inválidas' });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};
