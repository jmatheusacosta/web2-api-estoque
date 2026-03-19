// Banco de dados em memória (mock)
const usuarios = [
  { id: 1, email: 'admin@loja.com', senha: '123' }
];

const estoque = [
  { id: 1, codigo: 'TEC-001', nome: 'Notebook Dell Inspiron', preco: 3500, quantidade: 10 },
  { id: 2, codigo: 'TEC-002', nome: 'Mouse Sem Fio Logitech', preco: 150, quantidade: 45 },
  { id: 3, codigo: 'TEC-003', nome: 'Teclado Mecânico Redragon', preco: 250, quantidade: 20 },
  { id: 4, codigo: 'TEC-004', nome: 'Monitor LG 24 polegadas', preco: 800, quantidade: 15 },
  { id: 5, codigo: 'TEC-005', nome: 'Placa de Vídeo RTX 3060', preco: 2200, quantidade: 5 }
];

const logs = [];

module.exports = {
  usuarios,
  estoque,
  logs
};

