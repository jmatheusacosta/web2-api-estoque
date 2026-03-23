const { db } = require('../data/db');
const { logs } = db;

exports.listarLogsPorData = (req, res) => {
  const { data } = req.query; // Espera formato YYYY-MM-DD (ex: 2026-03-18)
  
  if (!data) {
    return res.json(logs);
  }

  // Filtra pela dataLocal (que respeita o fuso do servidor/usuário)
  const logsFiltrados = logs.filter(log => log.dataLocal === data);
  res.json(logsFiltrados);
};
