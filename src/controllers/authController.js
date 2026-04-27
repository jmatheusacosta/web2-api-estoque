const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../config/mail');

exports.logar = async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    const usuariosRef = db.collection('usuarios');
    const snapshot = await usuariosRef.where('email', '==', email).get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const usuario = { id: doc.id, ...doc.data() };
      
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      
      if (senhaValida) {
        // Gera um código de 6 dígitos
        const codigo2fa = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Salva o código e expiração (5 minutos)
        await usuariosRef.doc(usuario.id).update({ 
            codigo2fa, 
            codigoExpira: Date.now() + 5 * 60000 
        });

        // Dispara o e-mail
        await sendEmail(email, 'Seu Código de Acesso', `Seu código de acesso para a API de Estoque é: ${codigo2fa}`);

        return res.json({ mensagem: 'Código de validação enviado para o e-mail informado' });
      }
    }

    return res.status(401).json({ mensagem: 'Credenciais inválidas' });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};

exports.validar2FA = async (req, res) => {
  const { email, codigo } = req.body;

  try {
    const usuariosRef = db.collection('usuarios');
    const snapshot = await usuariosRef.where('email', '==', email).get();

    if (snapshot.empty) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado' });
    }

    const doc = snapshot.docs[0];
    const usuario = { id: doc.id, ...doc.data() };

    if (!usuario.codigo2fa || usuario.codigo2fa !== codigo) {
      return res.status(401).json({ mensagem: 'Código inválido' });
    }

    if (Date.now() > usuario.codigoExpira) {
      return res.status(401).json({ mensagem: 'Código expirado' });
    }

    // Limpa o código do banco e emite o JWT
    await usuariosRef.doc(usuario.id).update({
      codigo2fa: null,
      codigoExpira: null
    });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email }, 
      authConfig.secret, 
      { expiresIn: authConfig.expiresIn }
    );

    return res.json({ mensagem: 'Autenticação concluída com sucesso', token });
  } catch (error) {
    console.error("Erro no 2FA:", error);
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
};
