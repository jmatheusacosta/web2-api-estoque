const { db } = require('../config/firebase');

module.exports = (req, res, next) => {
  const log = {
    rota: req.originalUrl,
    metodo: req.method,
    horario: new Date().toISOString()
  };

  console.log(`[LOG] ${log.horario} - ${log.metodo} ${log.rota}`);
  
  // Salva no banco em background sem bloquear a requisição
  db.collection('logs').add(log).catch(err => {
    console.error("Erro interno ao salvar log no Firestore:", err.message);
  });
  
  next();
};
