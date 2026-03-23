const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const estoqueRoutes = require('./src/routes/estoqueRoutes');
const logRoutes = require('./src/routes/logRoutes');
const relatorioRoutes = require('./src/routes/relatorioRoutes');
const diaSemanaMiddleware = require('./src/middlewares/diaSemanaMiddleware');
const logMiddleware = require('./src/middlewares/logMiddleware');

const app = express();

// Middleware para interpretar JSON no body das requisições
app.use(express.json());

// Servir arquivos estáticos (Frontend)
app.use(express.static('public'));

// Rota principal para o Frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Middlewares Globais
app.use(diaSemanaMiddleware); // Requisito D (Acesso apenas Seg-Sex)
app.use(logMiddleware);       // Requisito E (Registro de logs)

// Cadastro das Rotas
app.use(authRoutes);
app.use(estoqueRoutes);
app.use(logRoutes);           // Requisito F (Consulta de logs)
app.use(relatorioRoutes);     // Requisito G (Download PDF)

const { resetDB } = require('./src/data/db');

// Rota para resetar o banco de dados (Requisito extra)
app.post('/reset', (req, res) => {
  resetDB();
  res.json({ mensagem: 'Banco de dados resetado com sucesso!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

