const mongoose = require('mongoose')

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  descricao: {
    type: String,
    trim: true
  },
  preco: {
    type: Number,
    required: true,
    min: 0
  },
  imagemUrl: {
    type: String,
    default: '/uploads/produto-padrao.jpg'
  },
  disponivel: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Produto', produtoSchema)