const Produto = require('../models/Produto')
const fs = require('fs')
const path = require('path')

// Listar produtos disponíveis
const listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find({ disponivel: true })
    res.json(produtos)
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao listar produtos', erro: erro.message })
  }
}

// Listar todos os produtos
const listarTodosProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find()
    res.json(produtos)
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao listar produtos', erro: erro.message })
  }
}

// Criar produto com imagem
const criarProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, disponivel } = req.body
    
    // Se foi enviado arquivo, pega o caminho
    const imagemUrl = req.file ? `/uploads/${req.file.filename}` : '/uploads/produto-padrao.jpg'
    
    const produto = await Produto.create({
      nome,
      descricao,
      preco,
      imagemUrl,
      disponivel: disponivel !== undefined ? disponivel : true
    })
    
    res.status(201).json({ mensagem: 'Produto criado com sucesso', produto })
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar produto', erro: erro.message })
  }
}

// Editar produto
const editarProduto = async (req, res) => {
  try {
    const produtoAntigo = await Produto.findById(req.params.id)
    
    if (!produtoAntigo) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }
    
    // Se foi enviada nova imagem, deleta a antiga e usa a nova
    if (req.file) {
      // Deleta imagem antiga se não for a padrão
      if (produtoAntigo.imagemUrl !== '/uploads/produto-padrao.jpg') {
        const caminhoAntigo = path.join(__dirname, '..', produtoAntigo.imagemUrl)
        if (fs.existsSync(caminhoAntigo)) {
          fs.unlinkSync(caminhoAntigo)
        }
      }
      req.body.imagemUrl = `/uploads/${req.file.filename}`
    }
    
    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    
    res.json({ mensagem: 'Produto atualizado com sucesso', produto })
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao editar produto', erro: erro.message })
  }
}

// Deletar produto
const deletarProduto = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id)
    
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }
    
    // Deleta a imagem se não for a padrão
    if (produto.imagemUrl !== '/uploads/produto-padrao.jpg') {
      const caminhoImagem = path.join(__dirname, '..', produto.imagemUrl)
      if (fs.existsSync(caminhoImagem)) {
        fs.unlinkSync(caminhoImagem)
      }
    }
    
    await Produto.findByIdAndDelete(req.params.id)
    res.json({ mensagem: 'Produto deletado com sucesso' })
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao deletar produto', erro: erro.message })
  }
}

module.exports = { listarProdutos, listarTodosProdutos, criarProduto, editarProduto, deletarProduto }