const express = require("express");
const router = express.Router();

const livrosRoutes = require("./livros.routes");
const authRoutes = require("./auth.routes");
const reviewRoutes = require("./review.routes");


router.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "Bem-vindo à API da Livraria! Use /livros para gerenciar os livros.",
  });
});

router.use("/livros", livrosRoutes);
router.use("/auth", authRoutes);
router.use("/reviews", reviewRoutes);



module.exports = router;
