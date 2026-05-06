const mongoose = require('mongoose')

const pedidoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId, // referência ao ID do usuário
    ref: 'Usuario',                        // diz que é referência ao model Usuario
    required: true
  },
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  },
  enderecoEntrega: {
    type: String,
    required: true
  },
  formaPagamento: {
    type: String,
    enum: ['dinheiro', 'pix', 'cartao'],
    required: true
  },
  precisaTroco: {
    type: Boolean,
    default: false
  },
  valorPagamento: {
    type: Number,
    default: 0 
  },
  troco: {
    type: Number,
    default: 0 // calculado automaticamente pelo controller
  },
  valorTotal: {
    type: Number,
    required: true // calculado automaticamente pelo controller
  },
  status: {
    type: String,
    enum: ['pendente', 'em_entrega', 'entregue'],
    default: 'pendente'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Pedido', pedidoSchema)