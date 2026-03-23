const { db } = require('../data/db');
const { logs } = db;

module.exports = (req, res, next) => {
  const agora = new Date();
  
  const log = {
    rota: req.originalUrl,
    metodo: req.method,
    // Armazena ISO para padrão, mas adicionamos a data local para filtro fácil
    horario: agora.toISOString(), 
    dataLocal: agora.toLocaleDateString('en-CA') // Retorna YYYY-MM-DD no fuso local
  };

  logs.push(log);
  console.log(`[LOG] ${agora.toLocaleString('pt-BR')} - ${log.metodo} ${log.rota}`);
  
  next();
};
