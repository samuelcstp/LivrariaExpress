const express = require("express");
const router = express.Router(); // Roteador do Express
const fs = require("fs");
const path = require("path");
const livrosPath = path.join(__dirname, "../data/livros.json");
let livros = [
 {
 id: 1,
 titulo: "Clean Code",
 autor: "Robert C. Martin",
 categoria: "Programação",
 ano: 2008
 },
 {
 id: 2,
 titulo: "O Programador Pragmático",
 autor: "Andrew Hunt",
 categoria: "Programação",
 ano: 1999
 }
];

router.get("/", (req, res) => {
 const { titulo, categoria } = req.query;
 let resultados = JSON.parse(fs.readFileSync(livrosPath));
 if (titulo) {
 resultados = resultados.filter(livro => livro.titulo.toLowerCase().includes(titulo.toLowerCase()));
 }
 if (categoria) {
 resultados = resultados.filter(livro => livro.categoria.toLowerCase().includes(categoria.toLowerCase()));
 }
 res.status(200).json(resultados);
});

router.post("/", (req, res) => {
 const { titulo, autor, categoria, ano } = req.body;
 if (!titulo || !autor || !categoria || !ano) {
 return res.status(400).json({ erro: "Preencha todos os campos" });
 }
 const novoLivro = { id: livros.length + 1, titulo, autor, categoria, ano };
 livros.push(novoLivro);
 res.status(201).json({ mensagem: "Livro adicionado", data: novoLivro });
});

router.get("/:id", (req, res) => {
 const id = parseInt(req.params.id);
 const livro = livros.find(l => l.id === id);
 if (!livro) {
 return res.status(404).json({ erro: "Livro não encontrado" });
 }
 res.status(200).json(livro);
});

router.put("/:id", (req, res) => {
 const id = parseInt(req.params.id);
 const { titulo, autor, categoria, ano } = req.body;
 if (!titulo || !autor || !categoria || !ano) {
 return res.status(400).json({ erro: "Preencha todos os campos" });
 }
 const livro = livros.find(l => l.id === id);
 if (!livro) return res.status(404).json({ erro: "Livro não encontrado" });
 // Object.assign: atualiza o objeto existente
 Object.assign(livro, { titulo, autor, categoria, ano });
 res.status(200).json({ mensagem: "Atualizado com sucesso", data: livro });
});

router.delete("/:id", (req, res) => {
 const id = parseInt(req.params.id);
 const index = livros.findIndex(l => l.id === id);
 if (index === -1) return res.status(404).json({ erro: "Livro não encontrado" });
 const removido = livros.splice(index, 1);
 res.status(200).json({ mensagem: "Livro removido", data: removido[0] });
});

router.get("/categoria/:categoria", (req, res) => {
 const categoria = req.params.categoria;
 const filtrados = livros.filter(l => l.categoria.toLowerCase() === categoria.toLowerCase());
 res.status(200).json(filtrados);
});
module.exports = router;