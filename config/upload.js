const multer = require('multer')
const path = require('path')

// Configuração de onde e como salvar os arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // pasta onde vai salvar
  },
  filename: function (req, file, cb) {
    // Gera um nome único: timestamp + nome original
    const nomeUnico = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, nomeUnico + path.extname(file.originalname))
  }
})

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  // Tipos de arquivo permitidos
  const tiposPermitidos = /jpeg|jpg|png|gif|webp/
  
  // Verifica a extensão
  const extname = tiposPermitidos.test(path.extname(file.originalname).toLowerCase())
  
  // Verifica o mimetype
  const mimetype = tiposPermitidos.test(file.mimetype)
  
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'))
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limite de 5MB
  fileFilter: fileFilter
})

module.exports = upload