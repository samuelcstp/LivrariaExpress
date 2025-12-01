// src/config/upload.js

const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// ----------------------------------------------------
// 1. Configuração do Armazenamento (Disk Storage)
// ----------------------------------------------------
const storage = multer.diskStorage({
    
    // Define o diretório de destino: 
    // Vai para a pasta 'uploads/livros' que fica dois níveis acima (../..)
    // da pasta 'config' (onde este arquivo está).
    destination: (req, file, cb) => {
        // Ex: /LivrariaExpress/uploads/livros
        cb(null, path.resolve(__dirname, '..', '..', 'uploads', 'livros'));
    },
    
    // Define como o arquivo será nomeado para evitar conflitos
    filename: (req, file, cb) => {
        // Gera um hash aleatório de 16 bytes
        crypto.randomBytes(16, (err, hash) => {
            if (err) {
                // Se der erro na geração do hash, retorna o erro
                return cb(err);
            }
            
            // Constrói o nome do arquivo: hash-nomeOriginal.jpg
            const filename = `${hash.toString('hex')}-${file.originalname.replace(/ /g, '_')}`;
            cb(null, filename);
        });
    },
});

// ----------------------------------------------------
// 2. Exporta o Middleware do Multer
// ----------------------------------------------------
module.exports = multer({ 
    storage,
    // 💡 Opcional: Define limites para o tamanho do arquivo
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB (limite comum para imagens)
    }
});