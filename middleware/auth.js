const jwt = require('jsonwebtoken')

// verifica se o usuário está logado
const verificarToken = (req, res, next) => {
  // O token vem no cabeçalho da requisição assim: "Bearer eyJhbGc..."
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Verifica se o token é válido usando o segredo do .env
    const dadosDoToken = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = dadosDoToken
    next() 
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado' })
  }
}

const verificarAdmin = (req, res, next) => {
  if (req.usuario.role !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso restrito ao admin' })
  }
  next()
}

const verificarCliente = (req, res, next) => {
  if (req.usuario.role !== 'cliente') {
    return res.status(403).json({ mensagem: 'Acesso restrito a clientes' })
  }
  next()
}

module.exports = { verificarToken, verificarDono, verificarCliente }