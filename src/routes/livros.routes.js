const express = require("express");
const router = express.Router();
// Controllers
const LivrosController = require("../controllers/livros.controller");
const livrosController = new LivrosController();

router.get("/", (req, res, next) => livrosController.listarLivros(req, res, next));
router.get("/:id", (req, res, next) => livrosController.buscarLivroPorId(req, res, next));
router.post("/", (req, res, next) => livrosController.criarLivro(req, res, next));
router.put("/:id", (req, res, next) => livrosController.atualizarLivro(req, res, next));
router.delete("/:id", (req, res, next) => livrosController.removerLivro(req, res, next));
module.exports = router;