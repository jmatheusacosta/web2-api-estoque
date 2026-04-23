# Usar uma imagem leve do Node.js
FROM node:20-slim

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar o restante do código (incluindo o serviceAccountKey.json se ele estiver na raiz)
COPY . .

# Expor a porta que a API usa
EXPOSE 3252

# Comando para rodar a aplicação
CMD ["node", "index.js"]
