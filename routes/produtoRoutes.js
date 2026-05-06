const express = require('express')
const router = express.Router()
const { listarProdutos, listarTodosProdutos, criarProduto, editarProduto, deletarProduto } = require('../controllers/produtoController')
const { verificarToken, verificarAdmin } = require('../middleware/auth')

// Rota pública — qualquer um pode ver os produtos disponíveis
router.get('/', listarProdutos)

// Rotas protegidas — só o Admin acessa
// verificarToken verifica se está logado, verificarAdmin verifica se é Admin
router.get('/todos', verificarToken, verificarAdmin, listarTodosProdutos)
router.post('/', verificarToken, verificarAdmin, criarProduto)
router.put('/:id', verificarToken, verificarAdmin, editarProduto)
router.delete('/:id', verificarToken, verificarAdmin, deletarProduto)

module.exports = router