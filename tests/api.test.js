const request = require('supertest');
const jwt = require('jsonwebtoken');
const authConfig = require('../src/config/auth');

// Mocks das dependências externas (Firebase e AWS SDK para B2)
const mockDocRef = {
  get: jest.fn(),
  set: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
  id: 'mock-id'
};

const mockCollection = {
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  get: jest.fn(),
  add: jest.fn().mockResolvedValue({ id: 'mock-id' }),
  doc: jest.fn().mockReturnValue(mockDocRef)
};

const mockDb = {
  collection: jest.fn().mockReturnValue(mockCollection),
  batch: jest.fn().mockReturnValue({
    delete: jest.fn(),
    commit: jest.fn().mockResolvedValue({})
  })
};

jest.mock('../src/config/firebase', () => ({
  db: mockDb
}));

jest.mock('../src/config/b2', () => ({
  s3Client: {
    send: jest.fn().mockResolvedValue({})
  }
}));

// Load app AFTER mocks
const app = require('../index');

describe('API de Estoque - Testes Automatizados', () => {
  let token;

  beforeAll(() => {
    token = jwt.sign({ id: 1, email: 'test@loja.com' }, authConfig.secret, { expiresIn: '1h' });
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Autenticação', () => {
    it('POST /logar - Sucesso', async () => {
      mockCollection.get.mockResolvedValueOnce({
        empty: false,
        docs: [{ id: '1', data: () => ({ email: 'admin@loja.com' }) }]
      });

      const res = await request(app).post('/logar').send({ email: 'admin', senha: '123' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('POST /logar - Falha', async () => {
      mockCollection.get.mockResolvedValueOnce({ empty: true });
      const res = await request(app).post('/logar').send({ email: 'errado', senha: '12' });
      expect(res.status).toBe(401);
    });
  });

  describe('Operações de Estoque (CRUD)', () => {
    it('GET /estoque - Deve listar itens', async () => {
      mockCollection.get.mockResolvedValueOnce({
        docs: [{ id: '1', data: () => ({ codigo: 'X' }) }]
      });
      const res = await request(app).get('/estoque').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('POST /estoque - Deve inserir um item', async () => {
      const res = await request(app).post('/estoque').set('Authorization', `Bearer ${token}`).send({ codigo: 'Z' });
      expect(res.status).toBe(201);
    });

    it('PUT /estoque/:id - Deve atualizar item existente', async () => {
      mockDocRef.get.mockResolvedValueOnce({ exists: true, data: () => ({}) });
      const res = await request(app).put('/estoque/123').set('Authorization', `Bearer ${token}`).send({ preco: 50 });
      expect(res.status).toBe(200);
    });

    it('DELETE /estoque/:id - Deve deletar item existente', async () => {
      mockDocRef.get.mockResolvedValueOnce({ exists: true });
      const res = await request(app).delete('/estoque/123').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });

    it('GET /estoque/buscar/:codigo - Deve retornar item específico', async () => {
      mockCollection.get.mockResolvedValueOnce({
        empty: false,
        docs: [{ id: '1', data: () => ({ codigo: 'Y' }) }]
      });
      const res = await request(app).get('/estoque/buscar/Y').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe('Outras Integrações', () => {
    it('POST /upload - Deve validar imagem e retornar URL', async () => {
      const res = await request(app)
        .post('/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('imagem', Buffer.from('fakeimg'), 'fake.png');
      expect(res.status).toBe(201);
      expect(res.body.url).toBeDefined();
    });

    it('GET /estoque/relatorio - Deve gerar documento PDF', async () => {
      mockCollection.get.mockResolvedValueOnce({
        docs: [{ data: () => ({ codigo: 'R', preco: 1 }) }]
      });
      const res = await request(app).get('/estoque/relatorio').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('application/pdf');
    });
  });
});
