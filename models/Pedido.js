const mongoose = require('mongoose')

const pedidoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
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
  // Endereço de entrega separado
  cep: {
    type: String,
    required: true
  },
  logradouro: {
    type: String,
    required: true
  },
  numero: {
    type: String,
    required: true
  },
  complemento: {
    type: String,
    default: ''
  },
  bairro: {
    type: String,
    required: true
  },
  cidade: {
    type: String,
    required: true
  },
  estado: {
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
    default: 0
  },
  valorTotal: {
    type: Number,
    required: true
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