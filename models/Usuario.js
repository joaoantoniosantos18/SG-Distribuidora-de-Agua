const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  senha: {
    type: String,
    required: true
  },
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
  role: {
    type: String,
    enum: ['cliente', 'admin'],
    default: 'cliente'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Usuario', usuarioSchema)