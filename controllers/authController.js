const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const cadastrar = async (req, res) => {
  try {
    const { nome, email, senha, endereco } = req.body

    // Verifica se já existe um usuário com esse email
    const usuarioExistente = await Usuario.findOne({ email })
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' })
    }

    // Criptografa a senha — o número 10 é o "custo" da criptografia
    // Quanto maior, mais seguro e mais lento. 10 é o padrão recomendado
    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaCriptografada,
      endereco
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

const login = async (req, res) => {
  try {
    const { email, senha } = req.body

    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(400).json({ mensagem: 'Email ou senha incorretos' })
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: 'Email ou senha incorretos' })
    }

    // Gera o token JWT com os dados essenciais do usuário
    // Esse token expira em 7 dias
    const token = jwt.sign(
      { id: usuario._id, nome: usuario.nome, role: usuario.role },
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
        role: usuario.role
      }
    })
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao fazer login', erro: erro.message })
  }
}

module.exports = { cadastrar, login }