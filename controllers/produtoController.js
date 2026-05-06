const Produto = require('../models/Produto')

const listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find({ disponivel: true })
    res.json(produtos)
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao listar produtos', erro: erro.message })
  }
}

const listarTodosProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find()
    res.json(produtos)
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao listar produtos', erro: erro.message })
  }
}

const criarProduto = async (req, res) => {
  try {
    const { nome, descricao, preco } = req.body
    const produto = await Produto.create({ nome, descricao, preco })
    res.status(201).json({ mensagem: 'Produto criado com sucesso', produto })
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar produto', erro: erro.message })
  }
}

const editarProduto = async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    )
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }
    res.json({ mensagem: 'Produto atualizado com sucesso', produto })
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao editar produto', erro: erro.message })
  }
}

const deletarProduto = async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id)
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }
    res.json({ mensagem: 'Produto deletado com sucesso' })
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao deletar produto', erro: erro.message })
  }
}

module.exports = { listarProdutos, listarTodosProdutos, criarProduto, editarProduto, deletarProduto }