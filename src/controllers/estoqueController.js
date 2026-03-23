const { db } = require('../data/db');
const { estoque } = db;

exports.listarUnidades = (req, res) => {
  res.json(estoque);
};

exports.inserirItem = (req, res) => {
  const { codigo, nome, preco, quantidade } = req.body;
  
  // Encontra o maior ID atual para evitar duplicatas após exclusões
  const maxId = estoque.length > 0 ? Math.max(...estoque.map(item => item.id)) : 0;
  const novoItem = { id: maxId + 1, codigo, nome, preco, quantidade };
  
  estoque.push(novoItem);
  res.status(201).json({ mensagem: 'Item inserido com sucesso', item: novoItem });
};

exports.excluirItem = (req, res) => {
  const { id } = req.params;
  const index = estoque.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    estoque.splice(index, 1);
    return res.json({ mensagem: 'Item excluído com sucesso' });
  }
  res.status(404).json({ mensagem: 'Item não encontrado' });
};

exports.buscarPorCodigo = (req, res) => {
  const { codigo } = req.params;
  const item = estoque.find(item => item.codigo === codigo);
  if (item) {
    return res.json(item);
  }
  res.status(404).json({ mensagem: 'Item não encontrado pelo código informado' });
};
