const { logs } = require('../data/db');

exports.listarLogsPorData = (req, res) => {
  const { data } = req.query; // Espera formato YYYY-MM-DD (ex: 2026-03-18)
  
  if (!data) {
    return res.json(logs);
  }

  const logsFiltrados = logs.filter(log => log.horario.startsWith(data));
  res.json(logsFiltrados);
};
