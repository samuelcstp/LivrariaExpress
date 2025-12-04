const express = require("express");
const router = express.Router();

const ReviewController = require("../controllers/review.controller");
const controller = new ReviewController();

const { requireAuth } = require("../middlewares/auth"); 

// Importa a validação de ID (que é para o ID da review, não do usuário)
const { validarParamId } = require("../middlewares/validar/livros.validar"); 
// (Ajustar o nome do arquivo se necessário)

// --- ROTAS PROTEGIDAS ---

// Listar as REVIEWS DO USUÁRIO LOGADO (ID é pego da sessão, não do param)
router.get("/me", requireAuth, controller.listarMinhasReviews.bind(controller)); 

// Criar Review (ID do usuário pego da sessão)
router.post("/", requireAuth, controller.criarReview.bind(controller));

// Atualizar Review (Protegido: Verifica se o ID da review pertence ao usuário logado)
router.put("/:id", requireAuth, validarParamId, controller.atualizarReview.bind(controller));

// Remover Review (Protegido: Verifica se o ID da review pertence ao usuário logado)
router.delete("/:id", requireAuth, validarParamId, controller.removerReview.bind(controller));

module.exports = router;