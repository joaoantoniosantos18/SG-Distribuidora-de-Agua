# 🚰 Distribuidora de Água - Backend

Sistema de gerenciamento de distribuidora de água mineral com autenticação JWT, upload de imagens e busca por CEP.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## 📋 Sobre o Projeto

API RESTful completa para gerenciamento de distribuidora de água, permitindo cadastro de usuários (clientes e administradores), gerenciamento de produtos com imagens, criação de pedidos e controle de status de entrega.

**Repositório Frontend:** [distribuidora-front](https://github.com/seu-usuario/distribuidora-front)

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express v5** - Framework web
- **MongoDB Atlas** - Banco de dados na nuvem
- **Mongoose** - ODM para MongoDB
- **JWT (jsonwebtoken)** - Autenticação e autorização
- **bcryptjs** - Criptografia de senhas
- **Multer** - Upload de arquivos
- **dotenv v16** - Gerenciamento de variáveis de ambiente


---

## 📁 Estrutura de Pastas

```
distribuidora-back/
├── config/
│   ├── database.js          # Configuração do MongoDB
│   └── upload.js             # Configuração do Multer
├── controllers/
│   ├── authController.js     # Cadastro e login
│   ├── produtoController.js  # CRUD de produtos
│   └── pedidoController.js   # CRUD de pedidos
├── middleware/
│   └── auth.js               # Verificação de token JWT
├── models/
│   ├── Usuario.js            # Schema de usuário
│   ├── Produto.js            # Schema de produto
│   └── Pedido.js             # Schema de pedido
├── routes/
│   ├── authRoutes.js         # Rotas de autenticação
│   ├── produtoRoutes.js      # Rotas de produtos
│   └── pedidoRoutes.js       # Rotas de pedidos
├── uploads/                  # Pasta para imagens dos produtos
├── .env                      # Variáveis de ambiente
├── .gitignore
├── package.json
├── server.js                 # Arquivo principal
└── README.md
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js instalado (versão 16 ou superior)
- MongoDB Atlas configurado
- Git instalado

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/seu-usuario/distribuidora-back.git
cd distribuidora-back
```

### Passo 2: Instalar dependências

```bash
npm install
```

### Passo 3: Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=3000
MONGO_URI=mongodb+srv://USUARIO:SENHA@cluster.mongodb.net/distribuidora?retryWrites=true&w=majority
JWT_SECRET=sua_chave_secreta_aqui
```

**Importante:** Substitua `USUARIO` e `SENHA` pelas suas credenciais do MongoDB Atlas.

### Passo 4: Criar a pasta de uploads

```bash
mkdir uploads
```

Coloque uma imagem padrão chamada `produto-padrao.jpg` dentro da pasta `uploads`.

### Passo 5: Rodar o servidor

**Modo desenvolvimento (com nodemon):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

---

## 📡 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/auth/cadastro` | Cadastrar novo usuário | Não |
| POST | `/api/auth/login` | Fazer login e receber token | Não |

#### Exemplo de Cadastro:
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "cep": "60040-531",
  "logradouro": "Rua Major Facundo",
  "numero": "500",
  "complemento": "Apto 101",
  "bairro": "Centro",
  "cidade": "Fortaleza",
  "estado": "CE"
}
```

#### Exemplo de Login:
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

---

### Produtos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/produtos` | Listar produtos disponíveis | Não |
| GET | `/api/produtos/todos` | Listar todos os produtos | Admin |
| POST | `/api/produtos` | Criar produto com imagem | Admin |
| PUT | `/api/produtos/:id` | Editar produto | Admin |
| DELETE | `/api/produtos/:id` | Deletar produto | Admin |

#### Exemplo de Criação de Produto (FormData):
```javascript
const formData = new FormData()
formData.append('nome', 'Galão 20L sem gás')
formData.append('descricao', 'Água mineral natural')
formData.append('preco', '12.00')
formData.append('imagem', arquivoImagem)
```

---

### Pedidos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/pedidos` | Listar todos os pedidos | Admin |
| GET | `/api/pedidos/meus` | Listar pedidos do cliente logado | Cliente |
| POST | `/api/pedidos` | Criar novo pedido | Cliente |
| PUT | `/api/pedidos/:id/status` | Atualizar status do pedido | Admin |

#### Exemplo de Criação de Pedido:
```json
{
  "produtoId": "507f1f77bcf86cd799439011",
  "quantidade": 2,
  "cep": "60040-531",
  "logradouro": "Rua Major Facundo",
  "numero": "500",
  "complemento": "Apto 101",
  "bairro": "Centro",
  "cidade": "Fortaleza",
  "estado": "CE",
  "formaPagamento": "dinheiro",
  "precisaTroco": true,
  "valorPagamento": 30
}
```

---

## 🔐 Autenticação JWT

Todas as rotas protegidas exigem o token JWT no header da requisição:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

O token é retornado no endpoint de login e tem validade de 30 dias.

---

## 👥 Perfis de Usuário

### Cliente
- Visualizar produtos disponíveis
- Criar pedidos
- Visualizar seus próprios pedidos

### Admin
- Todas as permissões do cliente
- Gerenciar produtos (criar, editar, deletar)
- Visualizar todos os pedidos
- Atualizar status dos pedidos

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.6",
    "dotenv": "^16.3.1",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^9.6.1",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

---

## ⚙️ Configurações Importantes

### DNS Forçado no MongoDB
O arquivo `config/database.js` força o uso dos servidores DNS do Google (8.8.8.8 e 8.8.4.4) para resolver problemas de conexão com o MongoDB Atlas em redes domésticas:

```javascript
const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])
```

### Upload de Imagens
- Tamanho máximo: 5MB
- Formatos aceitos: JPEG, JPG, PNG, GIF, WEBP
- Armazenamento: pasta `uploads/`
- Acesso público: `http://localhost:3000/uploads/nome-da-imagem.jpg`

---

## 🧪 Testando a API

Recomenda-se usar o **Thunder Client** (extensão do VS Code) ou **Postman** para testar os endpoints.

### Exemplo de fluxo de teste:

1. **Cadastrar um cliente:**
   - POST `/api/auth/cadastro`

2. **Fazer login:**
   - POST `/api/auth/login`
   - Copiar o token retornado

3. **Criar um produto (como admin):**
   - POST `/api/produtos`
   - Header: `Authorization: Bearer TOKEN`
   - Body: FormData com imagem

4. **Criar um pedido (como cliente):**
   - POST `/api/pedidos`
   - Header: `Authorization: Bearer TOKEN`
