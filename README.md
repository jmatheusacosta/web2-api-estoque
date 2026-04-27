# 📋 API de Estoque de Tecnologia — Apresentação dos Requisitos - N1A

Documento de referência para apresentação do trabalho, listando cada requisito, o arquivo onde foi implementado e o trecho de código correspondente.

---

## A. Rota POST `/logar` — Autenticação com JWT

**Descrição:** Recebe `email` e `senha` e retorna um token válido para acessar as demais rotas protegidas.

📁 **Rota declarada em:** `src/routes/authRoutes.js`
```js
router.post('/logar', authController.logar);
```

📁 **Lógica implementada em:** `src/controllers/authController.js`
```js
exports.logar = (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn }
    );
    return res.json({ mensagem: 'Login realizado com sucesso', token });
  }

  return res.status(401).json({ mensagem: 'Credenciais inválidas' });
};
```

---

## B. Rota GET — Listar Todos os Itens

**Descrição:** Retorna a lista completa de itens do estoque. Requer token JWT.

📁 **Arquivo:** `src/routes/estoqueRoutes.js`
```js
router.get('/estoque', authMiddleware, estoqueController.listarUnidades);
```

📁 **Arquivo:** `src/controllers/estoqueController.js`
```js
exports.listarUnidades = (req, res) => {
  res.json(estoque);
};
```

---

## C. Rota POST — Inserir Novo Item

**Descrição:** Recebe os dados de um novo produto no corpo da requisição e o adiciona ao array de estoque em memória.

📁 **Arquivo:** `src/routes/estoqueRoutes.js`
```js
router.post('/estoque', authMiddleware, estoqueController.inserirItem);
```

📁 **Arquivo:** `src/controllers/estoqueController.js`
```js
exports.inserirItem = (req, res) => {
  const { codigo, nome, preco, quantidade } = req.body;
  const novoItem = { id: estoque.length + 1, codigo, nome, preco, quantidade };
  estoque.push(novoItem);
  res.status(201).json({ mensagem: 'Item inserido com sucesso', item: novoItem });
};
```

---

## D. Rota DELETE — Excluir um Item

**Descrição:** Remove um item do estoque com base no `:id` informado na URL.

📁 **Arquivo:** `src/routes/estoqueRoutes.js`
```js
router.delete('/estoque/:id', authMiddleware, estoqueController.excluirItem);
```

📁 **Arquivo:** `src/controllers/estoqueController.js`
```js
exports.excluirItem = (req, res) => {
  const { id } = req.params;
  const index = estoque.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    estoque.splice(index, 1);
    return res.json({ mensagem: 'Item excluído com sucesso' });
  }
  res.status(404).json({ mensagem: 'Item não encontrado' });
};
```

---

## F. Rota GET — Pesquisar Item pelo Código

**Descrição:** Busca um único item pelo campo `codigo` único (ex: `TEC-001`) informado na URL.

📁 **Arquivo:** `src/routes/estoqueRoutes.js`
```js
router.get('/estoque/buscar/:codigo', authMiddleware, estoqueController.buscarPorCodigo);
```

📁 **Arquivo:** `src/controllers/estoqueController.js`
```js
exports.buscarPorCodigo = (req, res) => {
  const { codigo } = req.params;
  const item = estoque.find(item => item.codigo === codigo);
  if (item) {
    return res.json(item);
  }
  res.status(404).json({ mensagem: 'Item não encontrado pelo código informado' });
};
```

---

## D². Middleware — Acesso Apenas de Segunda à Sexta

**Descrição:** Middleware global que bloqueia qualquer requisição feita em Sábado ou Domingo, retornando `403 Forbidden`.

📁 **Arquivo:** `src/middlewares/diaSemanaMiddleware.js`
```js
module.exports = (req, res, next) => {
  const diaSemana = new Date().getDay(); // 0 = Domingo, 6 = Sábado

  if (diaSemana === 0 || diaSemana === 6) {
    return res.status(403).json({
      mensagem: "Acesso negado. A API está disponível apenas de segunda à sexta-feira."
    });
  }

  next();
};
```

📁 **Registrado globalmente em:** `index.js`
```js
app.use(diaSemanaMiddleware);
```

---

## E. Middleware — Registro de Horário e Rota

**Descrição:** Middleware global que salva automaticamente em memória o horário, a rota e o método de cada requisição recebida pela API.

📁 **Arquivo:** `src/middlewares/logMiddleware.js`
```js
module.exports = (req, res, next) => {
  const log = {
    rota: req.originalUrl,
    metodo: req.method,
    horario: new Date().toISOString()
  };

  logs.push(log);
  next();
};
```

📁 **Registrado globalmente em:** `index.js`
```js
app.use(logMiddleware);
```

---

## F². Rota GET — Logs por Data

**Descrição:** Retorna os registros de acesso armazenados em memória. Aceita um parâmetro `?data=YYYY-MM-DD` para filtrar por dia específico.

**Exemplo de uso:** `GET /logs?data=2026-03-18`

📁 **Arquivo:** `src/routes/logRoutes.js`
```js
router.get('/logs', authMiddleware, logController.listarLogsPorData);
```

📁 **Arquivo:** `src/controllers/logController.js`
```js
exports.listarLogsPorData = (req, res) => {
  const { data } = req.query;

  if (!data) {
    return res.json(logs);
  }

  const logsFiltrados = logs.filter(log => log.horario.startsWith(data));
  res.json(logsFiltrados);
};
```

---

## G. Rota GET — Download de Relatório PDF

**Descrição:** Gera dinamicamente um arquivo PDF formatado com a lista de itens do estoque e força o download no cliente.

📁 **Arquivo:** `src/routes/relatorioRoutes.js`
```js
router.get('/estoque/relatorio', authMiddleware, relatorioController.gerarRelatorioPDF);
```

📁 **Arquivo:** `src/controllers/relatorioController.js`
```js
exports.gerarRelatorioPDF = (req, res) => {
  const doc = new PDFDocument();
  const filename = `relatorio-estoque-${Date.now()}.pdf`;

  res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');

  doc.pipe(res);

  doc.fontSize(20).text('Relatório de Estoque - Loja de Tecnologia', { align: 'center' });
  doc.moveDown();

  estoque.forEach(item => {
    doc.fontSize(12).text(`- [${item.codigo}] ${item.nome}`);
    doc.fontSize(10).text(`  Preço: R$ ${item.preco.toFixed(2)} | Qtd: ${item.quantidade}`);
    doc.moveDown(0.5);
  });

  doc.end();
};
```

---

## H. Dados Mockados no Código

**Descrição:** Todos os dados (usuários e itens de estoque) estão definidos como arrays em memória, sem nenhum banco de dados externo.

📁 **Arquivo:** `src/data/db.js`
```js
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
```

---

## I. Versionamento no GitHub

**Descrição:** O código está versionado utilizando Git. O repositório contém o histórico completo dos commits realizados durante o desenvolvimento.


---

## J. Aplicação em Nuvem (VPS)

**Descrição:** A aplicação está disponível em nuvem por meio de uma hospedagem via VPS.


# 📋 Apresentação dos Requisitos - N1B

## A. Armazenar os dados com banco de dados em nuvem (NoSQL)

**Descrição:** A aplicação persiste seus dados (estoque e usuários) utilizando o banco de dados em nuvem **Firebase Firestore** (plataforma NoSQL, semelhante ao MongoDB).

📁 **Arquivo de configuração:** `src/config/firebase.js`
📁 **Script de inicialização:** `scripts/seed.js`

---

## B. Salvar imagem em nuvem

**Descrição:** Implementação de upload de arquivos de imagem (`multipart/form-data` via Multer) salvos diretamente na nuvem utilizando integração (via Amazon S3 API SDK) com a nuvem **Backblaze B2**.

📁 **Arquivo da rota:** `src/routes/uploadRoutes.js`
📁 **Arquivo do controller:** `src/controllers/uploadController.js`

---

## C. Ter rota PUT que atualiza algum dado no BD

**Descrição:** Foi criada a rota `PUT /estoque/:id` para permitir a atualização parcial de dados de um produto (ex: preço, quantidade) persistindo as alterações no banco de dados do Firestore.

📁 **Arquivo:** `src/routes/estoqueRoutes.js`
```js
router.put('/estoque/:id', authMiddleware, estoqueController.atualizarItem);
```

---

## D. Ter testes automatizados, usando JEST, para todas as rotas

**Descrição:** A aplicação possui uma suíte robusta cobrindo as lógicas de todas as 12 rotas (Autenticação, CRUD, Upload, Distância e PDF), simulando ("mockando") as conexões de banco de dados e e-mail para execução rápida.

📁 **Arquivo:** `tests/api.test.js`
📁 **Comando para executar:** `npm test`

---

## E. Documentar a API no Readme.md

**Descrição:** Este documento contém a documentação técnica relacionando os requisitos da N1A e N1B com o código-fonte produzido.

---

## F. Criptografar a senha do usuário no banco

**Descrição:** As senhas dos usuários nunca são guardadas em texto plano. Ao povoar o banco via `seed.js` ou durante a autenticação, utiliza-se a biblioteca `bcryptjs` para aplicar *hashing* seguro.

📁 **Arquivo:** `src/controllers/authController.js`
```js
const senhaValida = await bcrypt.compare(senha, usuario.senha);
```

---

## G. Configurar o CORS, permitindo apenas requisição do mesmo servidor

**Descrição:** O middleware de CORS foi configurado de forma estrita no servidor central para rejeitar origens não permitidas, restringindo o tráfego apenas à origem do host principal da aplicação.

📁 **Arquivo:** `index.js`
```js
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigin = process.env.HOST_URL || `http://localhost:${process.env.PORT || 3252}`;
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pelo CORS: Origem não autorizada'));
    }
  }
};
app.use(cors(corsOptions));
```

---

## H. Ter segundo fator de segurança, com código enviado por sms ou email

**Descrição:** A rota de Autenticação foi estendida para um fluxo de "Dois Fatores" (2FA). Ao conferir a senha, um código de 6 dígitos é gerado e enviado para o **E-mail** do usuário (via pacote `Nodemailer`). O token JWT só é devolvido mediante validação desse código na etapa `/logar/2fa`.

📁 **Arquivos:** `src/controllers/authController.js` e `src/config/mail.js`
```js
await sendEmail(email, 'Seu Código de Acesso', `Seu código de acesso para a API de Estoque é: ${codigo2fa}`);
```

---

## I. Ter rota para calcular distância entre dois pontos em um mapa, através da informação das coordenadas geográficas

**Descrição:** A rota matemática `POST /distancia` recebe as coordenadas de Latitude e Longitude do `pontoA` e `pontoB`. Ela converte graus em radianos e aplica a **Fórmula de Haversine** para devolver a distância exata em linha reta (em km) considerando a curvatura da terra.

📁 **Arquivo:** `src/routes/mapaRoutes.js`
📁 **Lógica em:** `src/controllers/mapaController.js`
```js
const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + ...
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
const distancia = R * c;
```
