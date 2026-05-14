const express = require('express')
const router = express.Router()
const {
  criarPedido,
  listarTodosPedidos,
  meusPedidos,
  atualizarStatus,
  relatorio
} = require('../controllers/pedidoController')
const { verificarToken, verificarAdmin, verificarCliente } = require('../middleware/auth')

// Criar pedido — só cliente logado
router.post('/', verificarToken, verificarCliente, criarPedido)

// Ver meus pedidos — só cliente logado
router.get('/meus', verificarToken, verificarCliente, meusPedidos)

// Relatório financeiro — só admin
// IMPORTANTE: essa rota precisa vir ANTES de /:id para não conflitar
router.get('/relatorio', verificarToken, verificarAdmin, relatorio)

// Ver todos os pedidos — só admin
router.get('/', verificarToken, verificarAdmin, listarTodosPedidos)

// Atualizar status — só admin
router.put('/:id/status', verificarToken, verificarAdmin, atualizarStatus)

module.exports = router