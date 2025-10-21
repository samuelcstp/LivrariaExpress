const Livro = require("../models/livro.model");
const db = require("../database/sqlite");

class LivrosRepository {
 async findAll() {
 const rows = await db.all("SELECT id, titulo, autor, categoria, ano, editora, numPag FROM livros ORDER BY id ASC");
 return rows.map(r => Livro.fromJSON(r));
 }
 async findById(id) {
 const row = await db.get("SELECT id, titulo, autor, categoria, ano, editora, numPag FROM livros WHERE id = ?", [id]);
 return row ? Livro.fromJSON(row) : null;
 }
 async create(data) {
  const novo = new Livro({ id: null, ...data });
  const res = await db.run(
    "INSERT INTO livros (titulo, autor, categoria, ano, editora, numPag) VALUES (?, ?, ?, ?, ?, ?)",
    [novo.titulo, novo.autor, novo.categoria, novo.ano, novo.editora, novo.numPag]
  );
  return this.findById(res.lastInsertRowid);
}

async update(id, dados) {
  const atual = new Livro({ id, ...dados });
  await db.run(
    "UPDATE livros SET titulo = ?, autor = ?, categoria = ?, ano = ?, editora = ?, numPag = ? WHERE id = ?",
    [atual.titulo, atual.autor, atual.categoria, atual.ano, atual.editora, atual.numPag, id]
  );
  return this.findById(id);
}

 async delete(id) {
 const existente = await this.findById(id);
 if (!existente) {
 const e = new Error("Livro não encontrado");
 e.statusCode = 404; throw e;
 }
 await db.run("DELETE FROM livros WHERE id = ?", [id]);
 return existente;
 }
}
module.exports = LivrosRepository;