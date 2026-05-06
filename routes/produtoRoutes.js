const express = require('express')
const router = express.Router()
const upload = require('../config/upload')
const { listarProdutos, listarTodosProdutos, criarProduto, editarProduto, deletarProduto } = require('../controllers/produtoController')
const { verificarToken, verificarAdmin } = require('../middleware/auth')

// Rota pública
router.get('/', listarProdutos)

// Rotas protegidas - admin
router.get('/todos', verificarToken, verificarAdmin, listarTodosProdutos)

// upload.single('imagem') significa que espera um arquivo com o nome 'imagem'
router.post('/', verificarToken, verificarAdmin, upload.single('imagem'), criarProduto)

router.put('/:id', verificarToken, verificarAdmin, upload.single('imagem'), editarProduto)

router.delete('/:id', verificarToken, verificarAdmin, deletarProduto)

module.exports = router