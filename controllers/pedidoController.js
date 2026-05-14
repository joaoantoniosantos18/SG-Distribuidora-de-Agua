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

    const produto = await Produto.findById(produtoId)
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }
    if (!produto.disponivel) {
      return res.status(400).json({ mensagem: 'Produto não está disponível' })
    }

    const valorTotal = produto.preco * quantidade

    let troco = 0
    if (precisaTroco && valorPagamento > 0) {
      troco = valorPagamento - valorTotal
      if (troco < 0) {
        return res.status(400).json({ mensagem: 'Valor de pagamento menor que o total do pedido' })
      }
    }

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

// ─── Relatório financeiro ─────────────────────────────────────────────────────
// GET /api/pedidos/relatorio?mes=5&ano=2026
const relatorio = async (req, res) => {
  try {
    const agora = new Date()
    const mes = parseInt(req.query.mes) || agora.getMonth() + 1
    const ano = parseInt(req.query.ano) || agora.getFullYear()

    // Início e fim do mês atual solicitado
    const inicioPeriodo = new Date(ano, mes - 1, 1)
    const fimPeriodo    = new Date(ano, mes, 0, 23, 59, 59)

    // Início e fim do mês anterior (para comparativo)
    const inicioMesAnterior = new Date(ano, mes - 2, 1)
    const fimMesAnterior    = new Date(ano, mes - 1, 0, 23, 59, 59)

    // ── 1. Pedidos do mês atual ───────────────────────────────────────────────
    const pedidosMes = await Pedido.find({
      createdAt: { $gte: inicioPeriodo, $lte: fimPeriodo }
    }).populate('produto', 'nome')

    // ── 2. Pedidos do mês anterior ────────────────────────────────────────────
    const pedidosMesAnterior = await Pedido.find({
      createdAt: { $gte: inicioMesAnterior, $lte: fimMesAnterior }
    })

    // ── 3. Calcula totais do mês atual ────────────────────────────────────────
    const totalPedidos    = pedidosMes.length
    const faturamentoTotal = pedidosMes.reduce((soma, p) => soma + p.valorTotal, 0)
    const faturamentoEntregues = pedidosMes
      .filter(p => p.status === 'entregue')
      .reduce((soma, p) => soma + p.valorTotal, 0)
    const ticketMedio = totalPedidos > 0 ? faturamentoTotal / totalPedidos : 0

    // ── 4. Totais do mês anterior ─────────────────────────────────────────────
    const totalPedidosAnterior     = pedidosMesAnterior.length
    const faturamentoMesAnterior   = pedidosMesAnterior.reduce((soma, p) => soma + p.valorTotal, 0)

    // Variação percentual (evita divisão por zero)
    const variacaoPedidos = totalPedidosAnterior > 0
      ? ((totalPedidos - totalPedidosAnterior) / totalPedidosAnterior) * 100
      : null
    const variacaoFaturamento = faturamentoMesAnterior > 0
      ? ((faturamentoTotal - faturamentoMesAnterior) / faturamentoMesAnterior) * 100
      : null

    // ── 5. Pedidos por status ─────────────────────────────────────────────────
    const porStatus = {
      pendente:   pedidosMes.filter(p => p.status === 'pendente').length,
      em_entrega: pedidosMes.filter(p => p.status === 'em_entrega').length,
      entregue:   pedidosMes.filter(p => p.status === 'entregue').length,
    }

    // ── 6. Faturamento por dia ────────────────────────────────────────────────
    // Monta um objeto { 'YYYY-MM-DD': valorTotal }
    const diasNoMes = new Date(ano, mes, 0).getDate()
    const porDia = {}
    for (let d = 1; d <= diasNoMes; d++) {
      const chave = `${ano}-${String(mes).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      porDia[chave] = 0
    }
    pedidosMes.forEach(pedido => {
      const chave = pedido.createdAt.toISOString().slice(0, 10)
      if (porDia[chave] !== undefined) {
        porDia[chave] += pedido.valorTotal
      }
    })
    const faturamentoPorDia = Object.entries(porDia).map(([dia, valor]) => ({
      dia: dia.slice(8), // só o número do dia: "01", "02"...
      valor: parseFloat(valor.toFixed(2))
    }))

    // ── 7. Produtos mais vendidos ─────────────────────────────────────────────
    const contadorProdutos = {}
    pedidosMes.forEach(pedido => {
      const nome = pedido.produto?.nome || 'Desconhecido'
      if (!contadorProdutos[nome]) {
        contadorProdutos[nome] = { quantidade: 0, faturamento: 0 }
      }
      contadorProdutos[nome].quantidade  += pedido.quantidade
      contadorProdutos[nome].faturamento += pedido.valorTotal
    })
    const produtosMaisVendidos = Object.entries(contadorProdutos)
      .map(([nome, dados]) => ({ nome, ...dados }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5)

    // ── 8. Formas de pagamento ────────────────────────────────────────────────
    const pagamentos = { pix: 0, dinheiro: 0, cartao: 0 }
    pedidosMes.forEach(p => {
      if (pagamentos[p.formaPagamento] !== undefined) {
        pagamentos[p.formaPagamento]++
      }
    })
    const formasPagamento = [
      { nome: 'PIX',      quantidade: pagamentos.pix },
      { nome: 'Dinheiro', quantidade: pagamentos.dinheiro },
      { nome: 'Cartão',   quantidade: pagamentos.cartao },
    ].filter(f => f.quantidade > 0)

    // ── Resposta ──────────────────────────────────────────────────────────────
    res.json({
      periodo: { mes, ano },
      resumo: {
        totalPedidos,
        faturamentoTotal: parseFloat(faturamentoTotal.toFixed(2)),
        faturamentoEntregues: parseFloat(faturamentoEntregues.toFixed(2)),
        ticketMedio: parseFloat(ticketMedio.toFixed(2)),
        variacaoPedidos:      variacaoPedidos      !== null ? parseFloat(variacaoPedidos.toFixed(1))      : null,
        variacaoFaturamento:  variacaoFaturamento  !== null ? parseFloat(variacaoFaturamento.toFixed(1))  : null,
        totalPedidosAnterior,
        faturamentoMesAnterior: parseFloat(faturamentoMesAnterior.toFixed(2)),
      },
      porStatus,
      faturamentoPorDia,
      produtosMaisVendidos,
      formasPagamento,
    })
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao gerar relatório', erro: erro.message })
  }
}

module.exports = { criarPedido, listarTodosPedidos, meusPedidos, atualizarStatus, relatorio }