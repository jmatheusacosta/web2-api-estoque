const { db } = require('../src/config/firebase');
const bcrypt = require('bcryptjs');

const usuarios = [
  { email: 'admin@loja.com', senha: '123' },
  { email: 'joao.matheus08@aluno.ifce.edu.br', senha: '123' },
  { email: 'joao.douglas06@aluno.ifce.edu.br', senha: '123' }
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
    // Apaga usuários antigos para não dar conflito com senhas antigas em plain text
    const usersSnapshot = await db.collection('usuarios').get();
    if (!usersSnapshot.empty) {
      const batch = db.batch();
      usersSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log("Usuários antigos removidos.");
    }

    for (const u of usuarios) {
      const hash = await bcrypt.hash(u.senha, 10);
      await db.collection('usuarios').add({ email: u.email, senha: hash });
      console.log(`Usuário ${u.email} adicionado com senha criptografada.`);
    }

    // Apaga estoque antigo para evitar duplicatas
    const estoqueSnapshot = await db.collection('estoque').get();
    if (!estoqueSnapshot.empty) {
      const batchEstoque = db.batch();
      estoqueSnapshot.docs.forEach((doc) => {
        batchEstoque.delete(doc.ref);
      });
      await batchEstoque.commit();
      console.log("Itens de estoque antigos removidos.");
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
