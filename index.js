const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const estoqueRoutes = require('./src/routes/estoqueRoutes');

const app = express();

// Middleware para interpretar JSON no body das requisições
app.use(express.json());

// Cadastro das Rotas
app.use(authRoutes);
app.use(estoqueRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
