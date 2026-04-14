const { db } = require('../config/firebase');

exports.listarUnidades = async (req, res) => {
  try {
    const snapshot = await db.collection('estoque').get();
    const estoque = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(estoque);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar estoque', erro: error.message });
  }
};

exports.inserirItem = async (req, res) => {
  const { codigo, nome, preco, quantidade } = req.body;
  try {
    const novoItemRef = db.collection('estoque').doc();
    const novoItem = { codigo, nome, preco, quantidade };
    await novoItemRef.set(novoItem);
    res.status(201).json({ mensagem: 'Item inserido com sucesso', item: { id: novoItemRef.id, ...novoItem } });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao inserir item', erro: error.message });
  }
};

exports.excluirItem = async (req, res) => {
  const { id } = req.params;
  try {
    const itemRef = db.collection('estoque').doc(id);
    const doc = await itemRef.get();
    if (!doc.exists) {
      return res.status(404).json({ mensagem: 'Item não encontrado' });
    }
    await itemRef.delete();
    res.json({ mensagem: 'Item excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao excluir item', erro: error.message });
  }
};

exports.buscarPorCodigo = async (req, res) => {
  const { codigo } = req.params;
  try {
    const snapshot = await db.collection('estoque').where('codigo', '==', codigo).get();
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return res.json({ id: doc.id, ...doc.data() });
    }
    res.status(404).json({ mensagem: 'Item não encontrado pelo código informado' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar item', erro: error.message });
  }
};
