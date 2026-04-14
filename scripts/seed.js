const { db } = require('../src/config/firebase');

const usuarios = [
  { email: 'admin@loja.com', senha: '123' }
];

const estoque = [
  { codigo: 'TEC-001', nome: 'Notebook Dell Inspiron', preco: 3500, quantidade: 10 },
  { codigo: 'TEC-002', nome: 'Mouse Sem Fio Logitech', preco: 150, quantidade: 45 },
  { codigo: 'TEC-003', nome: 'Teclado Mecânico Redragon', preco: 250, quantidade: 20 },
  { codigo: 'TEC-004', nome: 'Monitor LG 24 polegadas', preco: 800, quantidade: 15 },
  { codigo: 'TEC-005', nome: 'Placa de Vídeo RTX 3060', preco: 2200, quantidade: 5 }
];

async function seed() {
  console.log("Iniciando povoamento do Firestore...");
  
  try {
    for (const u of usuarios) {
      await db.collection('usuarios').add(u);
      console.log(`Usuário ${u.email} adicionado.`);
    }

    for (const e of estoque) {
      await db.collection('estoque').add(e);
      console.log(`Item ${e.codigo} adicionado.`);
    }
    
    console.log("Povoamento finalizado com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro no povoamento:", error);
    process.exit(1);
  }
}

seed();
