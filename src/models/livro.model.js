// src/models/livro.model.js (COMPLETO E CORRIGIDO)
const db = require("../database/sqlite"); // Assumindo que você usa isso em outros lugares

class Livro {
    constructor({ id = null, titulo, autor, categoria, ano, editora = '', capa_url = '' }) {
        this.id = id !== undefined ? id : null;
        
        // Campos obrigatórios:
        this.titulo = String(titulo).trim();
        this.autor = String(autor).trim();
        this.categoria = String(categoria).trim();
        this.ano = Number.isInteger(ano) ? ano : parseInt(ano, 10);
        
        // Campos opcionais (Segurança contra null/undefined do DB):
        this.editora = (editora !== null && editora !== undefined) ? String(editora).trim() : '';
        this.capa_url = (capa_url !== null && capa_url !== undefined) ? String(capa_url).trim() : '';

        this._validar();
    }

    static fromJSON(json) {
        return new Livro({
            // Usamos ?? (nullish coalescing) para garantir que null/undefined se tornem null, mas o construtor já trata isso
            id: json.id ?? null,
            titulo: json.titulo,
            autor: json.autor,
            categoria: json.categoria,
            ano: json.ano,
            editora: json.editora,
            capa_url: json.capa_url
        });
    }

    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            autor: this.autor,
            categoria: this.categoria,
            ano: this.ano,
            editora: this.editora,
            capa_url: this.capa_url
        };
    }

    _validar() {
        const erros = [];

        if (!this.titulo || this.titulo.trim().length === 0) erros.push("Título é obrigatório");
        if (!this.autor || this.autor.trim().length === 0) erros.push("Autor é obrigatório");
        if (!this.categoria || this.categoria.trim().length === 0) erros.push("Categoria é obrigatória");
        if (!Number.isInteger(this.ano) || isNaN(this.ano)) erros.push("Ano deve ser um número válido");

        if (erros.length > 0) {
            const error = new Error("Dados inválidos");
            error.statusCode = 400; // 🚨 Gera um 400 que o Controller deve capturar!
            error.details = erros;
            throw error;
        }
    }
}

module.exports = Livro;