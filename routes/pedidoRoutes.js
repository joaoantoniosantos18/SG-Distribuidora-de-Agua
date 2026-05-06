const express = require('express')
const router = express.Router()
const { criarPedido, listarTodosPedidos, meusPedidos, atualizarStatus } = require('../controllers/pedidoController')
const { verificarToken, verificarAdmin, verificarCliente } = require('../middleware/auth')

// Criar pedido — só cliente logado
router.post('/', verificarToken, verificarCliente, criarPedido)

// Ver meus pedidos — só cliente logado
router.get('/meus', verificarToken, verificarCliente, meusPedidos)

// Ver todos os pedidos — só Admin
router.get('/', verificarToken, verificarAdmin, listarTodosPedidos)

// Atualizar status — só Admin
router.put('/:id/status', verificarToken, verificarAdmin, atualizarStatus)

module.exports = router