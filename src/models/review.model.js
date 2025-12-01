// src/models/review.model.js
const db = require("../database/sqlite");

class ReviewModel {
    criarReview(usuarioId, livroId, review, nota) {
        return db.run(
            `INSERT INTO review_livro (usuario_id, livro_id, review, nota)
             VALUES (?, ?, ?, ?)`,
            [usuarioId, livroId, review, nota]
        );
    }

    // AJUSTADO: Inclui capa_url no SELECT do JOIN
    listarPorUser(usuarioId) {
        return db.all(
            `SELECT 
                r.id, 
                r.usuario_id, 
                r.livro_id, 
                r.review, 
                r.nota, 
                r.created_at,
                l.titulo AS livro_titulo, 
                l.autor AS livro_autor,
                l.categoria AS livro_categoria,
                l.capa_url AS livro_capa_url /* 👈 Adicionado capa_url */
             FROM review_livro r
             JOIN livros l ON r.livro_id = l.id
             WHERE r.usuario_id = ?
             ORDER BY r.created_at DESC`,
            [usuarioId]
        );
    }

    // ... (atualizarReview e removerReview não precisam de alteração)

    atualizarReview(id, usuarioId, review, nota) {
        return db.run(
            `UPDATE review_livro
             SET review = ?, nota = ?
             WHERE id = ? AND usuario_id = ?`,
            [review, nota, id, usuarioId]
        );
    }

    removerReview(id, usuarioId) {
        return db.run(
            `DELETE FROM review_livro WHERE id = ? AND usuario_id = ?`,
            [id, usuarioId]
        );
    }
}

module.exports = ReviewModel;