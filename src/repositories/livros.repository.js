// src/repositories/livros.repository.js
const RepositoryBase = require("./repository.interface");
const db = require("../database/sqlite");
const Livro = require("../models/livro.model");

// Seleciona todos os campos, incluindo o novo
const LIVRO_FIELDS = "id, titulo, autor, categoria, ano, editora, capa_url"; 

class LivrosRepository extends RepositoryBase {
    constructor() {
        super();
    }

    async findAll() {
        const rows = db.all(`SELECT ${LIVRO_FIELDS} FROM livros ORDER BY id ASC`);
        return rows.map(row => Livro.fromJSON(row));
    }

    async findById(id) {
        const row = db.get(`SELECT ${LIVRO_FIELDS} FROM livros WHERE id = ?`, [id]);
        return row ? Livro.fromJSON(row) : null;
    }

    async create(livroData) {
        const novoLivro = new Livro({ id: null, ...livroData });
        const result = db.run(
            `INSERT INTO livros (titulo, autor, categoria, ano, editora, capa_url) 
             VALUES (?, ?, ?, ?, ?, ?)`, // 👈 Adicionado capa_url
            [
                novoLivro.titulo, 
                novoLivro.autor, 
                novoLivro.categoria, 
                novoLivro.ano, 
                novoLivro.editora, 
                novoLivro.capa_url // 👈 Adicionado
            ]
        );
        return this.findById(result.lastInsertRowid);
    }

    async update(id, dadosAtualizados) {
        const existente = await this.findById(id);

        if (!existente) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }
        const atualizado = new Livro({ ...existente.toJSON(), ...dadosAtualizados });
        
        db.run(
            `UPDATE livros 
             SET titulo = ?, autor = ?, categoria = ?, ano = ?, editora = ?, capa_url = ? 
             WHERE id = ?`, // 👈 Adicionado capa_url no SET
            [
                atualizado.titulo, 
                atualizado.autor, 
                atualizado.categoria, 
                atualizado.ano, 
                atualizado.editora, 
                atualizado.capa_url, // 👈 Adicionado
                id
            ]
        );
        return this.findById(id);
    }

    async delete(id) {
        const existente = await this.findById(id); // Use await aqui para garantir que o objeto seja retornado
        if (!existente) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }
        db.run("DELETE FROM livros WHERE id = ?", [id]);
        return existente;
    }
}

module.exports = LivrosRepository;