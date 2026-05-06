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
  disponivel: {
    type: Boolean,
    default: true // quando cadastrado, já fica disponível por padrão
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Produto', produtoSchema)