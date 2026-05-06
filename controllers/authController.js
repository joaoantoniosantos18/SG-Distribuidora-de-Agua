const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Cadastrar novo usuário
const cadastrar = async (req, res) => {
  try {
    const { nome, email, senha, cep, logradouro, numero, complemento, bairro, cidade, estado } = req.body

    // Verifica se já existe um usuário com esse email
    const usuarioExistente = await Usuario.findOne({ email })
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' })
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10)

    // Cria o usuário no banco
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaCriptografada,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado
    })

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        role: novoUsuario.role
      }
    })
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar', erro: erro.message })
  }
}

// Logar usuário
const login = async (req, res) => {
  try {
    const { email, senha } = req.body

    // Procura o usuário pelo email
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(400).json({ mensagem: 'Email ou senha incorretos' })
    }

    // Compara a senha digitada com a senha criptografada no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: 'Email ou senha incorretos' })
    }

    // Gera o token JWT
    const token = jwt.sign(
      { 
        id: usuario._id, 
        nome: usuario.nome, 
        role: usuario.role,
        endereco: {
          cep: usuario.cep,
          logradouro: usuario.logradouro,
          numero: usuario.numero,
          complemento: usuario.complemento,
          bairro: usuario.bairro,
          cidade: usuario.cidade,
          estado: usuario.estado
        }
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        endereco: {
          cep: usuario.cep,
          logradouro: usuario.logradouro,
          numero: usuario.numero,
          complemento: usuario.complemento,
          bairro: usuario.bairro,
          cidade: usuario.cidade,
          estado: usuario.estado
        }
      }
    })
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao fazer login', erro: erro.message })
  }
}

module.exports = { cadastrar, login }