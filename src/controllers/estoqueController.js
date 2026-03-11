const { estoque } = require('../data/db');

exports.listarUnidades = (req, res) => {
  res.json(estoque);
};
