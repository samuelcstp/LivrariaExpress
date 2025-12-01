// src/routes/livros.routes.js (CORRIGIDO PARA UPLOAD DE ARQUIVO)

const express = require("express");
const router = express.Router();

// Controllers
const LivrosController = require("../controllers/livros.controller");
const livrosController = new LivrosController();

// Middlewares
const { validarParamId } = require("../middlewares/validar/livros.validar");
// 💡 1. IMPORTAÇÃO DO MULTER: Assumindo que você o exportou em '../config/upload'
const upload = require('../config/upload'); 


// bind: vincula o contexto do 'this' ao controller
router.get("/", livrosController.listarLivros.bind(livrosController));
router.get("/:id", validarParamId, livrosController.buscarLivroPorId.bind(livrosController));

// 🛑 2. CORREÇÃO CRÍTICA: Insere o Multer como middleware
// O nome 'capaFile' deve ser o mesmo usado no input do LivroForm.jsx
router.post("/", upload.single('capaFile'), livrosController.criarLivro.bind(livrosController)); 

// 💡 RECOMENDADO: Adicionar o Multer também na rota de atualização
router.put("/:id", validarParamId, upload.single('capaFile'), livrosController.atualizarLivro.bind(livrosController)); 

router.delete("/:id", validarParamId, livrosController.removerLivro.bind(livrosController));

module.exports = router;