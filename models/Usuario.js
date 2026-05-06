const mongoose = require('mongoose')

// Define a estrutura de um usuário no banco de dados
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
  endereco: {
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