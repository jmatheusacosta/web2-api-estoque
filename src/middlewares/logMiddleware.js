const { logs } = require('../data/db');

module.exports = (req, res, next) => {
  const log = {
    rota: req.originalUrl,
    metodo: req.method,
    horario: new Date().toISOString()
  };

  logs.push(log);
  console.log(`[LOG] ${log.horario} - ${log.metodo} ${log.rota}`);
  
  next();
};
