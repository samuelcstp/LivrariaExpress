// src/repositories/livros.repository.js
const RepositoryBase = require("./repository.interface");
const db = require("../database/sqlite");
const Livro = require("../models/livro.model");

// 💡 CAMPO MODIFICADO: capa_url -> capa_caminho
const LIVRO_FIELDS = "id, titulo, autor, categoria, ano, editora, capa_caminho"; 

class LivrosRepository extends RepositoryBase {
    constructor() {
        super();
    }

    async findAll() {
        // Usamos await para garantir que db.all retorne a promise resolvida
        const rows = await db.all(`SELECT ${LIVRO_FIELDS} FROM livros ORDER BY id ASC`);
        return rows.map(row => Livro.fromJSON(row));
    }

    async findById(id) {
        const row = await db.get(`SELECT ${LIVRO_FIELDS} FROM livros WHERE id = ?`, [id]);
        return row ? Livro.fromJSON(row) : null;
    }

    async create(livroData) {
        // O livroData já está validado pelo Controller e contém capa_caminho
        const { titulo, autor, categoria, ano, editora, capa_caminho } = livroData; 
        
        // 💡 SQL MODIFICADO: capa_url -> capa_caminho
        const result = await db.run(
            `INSERT INTO livros (titulo, autor, categoria, ano, editora, capa_caminho) 
             VALUES (?, ?, ?, ?, ?, ?)`, 
            [
                titulo, 
                autor, 
                categoria, 
                ano, 
                editora, 
                capa_caminho // ⬅️ Usando capa_caminho
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
        
        // Assume que dadosAtualizados é um objeto Livro validado pelo Controller
        const { titulo, autor, categoria, ano, editora, capa_caminho } = dadosAtualizados;
        
        // 💡 SQL MODIFICADO: capa_url -> capa_caminho
        await db.run(
            `UPDATE livros 
             SET titulo = ?, autor = ?, categoria = ?, ano = ?, editora = ?, capa_caminho = ? 
             WHERE id = ?`, 
            [
                titulo, 
                autor, 
                categoria, 
                ano, 
                editora, 
                capa_caminho, // ⬅️ Usando capa_caminho
                id
            ]
        );
        return this.findById(id);
    }

    async delete(id) {
        // Retorna o objeto existente para que o Controller possa deletar o arquivo da capa
        const existente = await this.findById(id); 
        if (!existente) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }
        await db.run("DELETE FROM livros WHERE id = ?", [id]);
        return existente;
    }
}

module.exports = LivrosRepository;