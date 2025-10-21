const LivrosRepository = require("../repositories/livros.repository");

class LivrosController {
  constructor() {
    this.repository = new LivrosRepository();
  }

  async listarLivros(req, res, next) {
    const livros = await this.repository.findAll();
    res.status(200).json(livros);
  }

  async buscarLivroPorId(req, res, next) {
    const id = parseInt(req.params.id);
    const livro = await this.repository.findById(id);
    if (!livro) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }
    res.status(200).json(livro);
  }

  async criarLivro(req, res, next) {
    try {
      const { titulo, autor, categoria, ano, editora, numPag } = req.body;

      const novoLivro = await this.repository.create({
        titulo,
        autor,
        categoria,
        ano: parseInt(ano),
        editora,
        numPag: parseInt(numPag),
      });

      res.status(201).json({
        mensagem: "Livro criado com sucesso",
        data: novoLivro,
      });
    } catch (err) {
      next(err); // encaminha para o middleware de erro
    }
  }

  async atualizarLivro(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const dados = req.body;

      if (dados.ano) dados.ano = parseInt(dados.ano);
      if (dados.numPag) dados.numPag = parseInt(dados.numPag);

      const livroAtualizado = await this.repository.update(id, dados);

      res.status(200).json({
        mensagem: "Livro atualizado com sucesso",
        data: livroAtualizado,
      });
    } catch (err) {
      next(err);
    }
  }

  async removerLivro(req, res, next) {
    const id = parseInt(req.params.id);
    const livroRemovido = await this.repository.delete(id);
    res.status(200).json({
      mensagem: "Livro removido com sucesso",
      data: livroRemovido,
    });
  }
}

module.exports = LivrosController;