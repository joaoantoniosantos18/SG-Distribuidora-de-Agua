require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const conectarBancoDeDados = require('./config/database')

const authRoutes = require('./routes/authRoutes')
const produtoRoutes = require('./routes/produtoRoutes')
const pedidoRoutes = require('./routes/pedidoRoutes')

const app = express()

// Conecta ao banco de dados
conectarBancoDeDados()

// Middlewares globais
app.use(cors())
app.use(express.json())

// ADICIONA ESSA LINHA - Serve arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/produtos', produtoRoutes)
app.use('/api/pedidos', pedidoRoutes)

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: '🚰 API da Distribuidora funcionando!' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})