const Pedido = require('../models/Pedido')
const Produto = require('../models/Produto')

// Criar pedido
const criarPedido = async (req, res) => {
  try {
    const { 
      produtoId, 
      quantidade, 
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      formaPagamento, 
      precisaTroco, 
      valorPagamento 
    } = req.body

    // Busca o produto para pegar o preço atual
    const produto = await Produto.findById(produtoId)
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }
    if (!produto.disponivel) {
      return res.status(400).json({ mensagem: 'Produto não está disponível' })
    }

    // Calcula o valor total do pedido
    const valorTotal = produto.preco * quantidade

    // Calcula o troco se necessário
    let troco = 0
    if (precisaTroco && valorPagamento > 0) {
      troco = valorPagamento - valorTotal
      if (troco < 0) {
        return res.status(400).json({ mensagem: 'Valor de pagamento menor que o total do pedido' })
      }
    }

    // Cria o pedido
    const pedido = await Pedido.create({
      cliente: req.usuario.id,
      produto: produtoId,
      quantidade,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      formaPagamento,
      precisaTroco,
      valorPagamento,
      troco,
      valorTotal
    })

    // Retorna o pedido completo
    const pedidoCompleto = await Pedido.findById(pedido._id)
      .populate('cliente', 'nome email')
      .populate('produto', 'nome preco')

    res.status(201).json({ mensagem: 'Pedido criado com sucesso', pedido: pedidoCompleto })
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar pedido', erro: erro.message })
  }
}

// Listar todos os pedidos
const listarTodosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('cliente', 'nome email')
      .populate('produto', 'nome preco')
      .sort({ createdAt: -1 })
    res.json(pedidos)
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao listar pedidos', erro: erro.message })
  }
}

// Listar pedidos do cliente logado
const meusPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ cliente: req.usuario.id })
      .populate('produto', 'nome preco')
      .sort({ createdAt: -1 })
    res.json(pedidos)
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao listar pedidos', erro: erro.message })
  }
}

// Atualizar status do pedido
const atualizarStatus = async (req, res) => {
  try {
    const { status } = req.body

    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('cliente', 'nome email')
      .populate('produto', 'nome preco')

    if (!pedido) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' })
    }

    res.json({ mensagem: 'Status atualizado com sucesso', pedido })
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar status', erro: erro.message })
  }
}

module.exports = { criarPedido, listarTodosPedidos, meusPedidos, atualizarStatus }