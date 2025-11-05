const express = require("express");
const router = express.Router();
// Controllers
const LivrosController = require("../controllers/livros.controller");
const livrosController = new LivrosController();
const { requireAuth } = require('../middlewares/auth');

router.get("/", requireAuth, (req, res, next) => livrosController.listarLivros(req, res, next));
router.get("/:id", requireAuth, (req, res, next) => livrosController.buscarLivroPorId(req, res, next));
router.post("/", requireAuth, (req, res, next) => livrosController.criarLivro(req, res, next));
router.put("/:id", requireAuth, (req, res, next) => livrosController.atualizarLivro(req, res, next));
router.delete("/:id", requireAuth, (req, res, next) => livrosController.removerLivro(req, res, next));
module.exports = router;