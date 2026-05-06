require('dotenv').config()
const express = require('express')
const cors = require('cors')
const conectarBancoDeDados = require('./config/database')

const authRoutes = require('./routes/authRoutes')
const produtoRoutes = require('./routes/produtoRoutes')
const pedidoRoutes = require('./routes/pedidoRoutes')

const app = express()

conectarBancoDeDados()

app.use(cors())                  // libera acesso do frontend
app.use(express.json())          // permite ler o corpo das requisições em JSON

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/produtos', produtoRoutes)
app.use('/api/pedidos', pedidoRoutes)

app.get('/', (req, res) => {
  res.json({ mensagem: '🚰 API da Distribuidora funcionando!' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})