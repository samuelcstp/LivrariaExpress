const fs = require("fs");
const path = require("path");
const RepositoryBase = require("./repository.interface");

class LivrosRepository extends RepositoryBase {
  constructor() {
    super();
    this.caminhoArquivo = path.join(__dirname, "../data/livros.json");
  }

  async findAll() {
    const dados = await this._lerArquivo();
    return JSON.parse(dados);
  }

  async findById(id) {
    const livros = await this.findAll();
    return livros.find(l => l.id === id);
  }

  async create(livroData) {
    const livros = await this.findAll();
    const novoId = await this.getNextId();
    const novoLivro = { id: novoId, ...livroData };
    livros.push(novoLivro);
    await this._saveToFile(livros);
    return novoLivro;
  }

  async update(id, dadosAtualizados) {
    const livros = await this.findAll();
    const indice = livros.findIndex(l => l.id === id);
    if (indice === -1) throw new Error("Livro não encontrado");
    livros[indice] = { ...livros[indice], ...dadosAtualizados };
    await this._saveToFile(livros);
    return livros[indice];
  }

  async delete(id) {
    const livros = await this.findAll();
    const indice = livros.findIndex(l => l.id === id);
    if (indice === -1) throw new Error("Livro não encontrado");
    const livroRemovido = livros[indice];
    livros.splice(indice, 1);
    await this._saveToFile(livros);
    return livroRemovido;
  }

  async _saveToFile(data) {
    fs.writeFileSync(this.caminhoArquivo, JSON.stringify(data, null, 2), "utf8");
  }

  async _lerArquivo() {
    return await fs.promises.readFile(this.caminhoArquivo, "utf8");
  }
}

module.exports = LivrosRepository;
