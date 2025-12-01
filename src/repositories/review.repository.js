const ReviewModel = require("../models/review.model");
const model = new ReviewModel();

class ReviewRepository {
    async create({ usuarioId, livroId, review, nota }) {
        const result = await model.criarReview(usuarioId, livroId, review, nota);
        return { id: result.lastInsertRowid };
    }

    async findByUser(usuarioId) {
        return model.listarPorUser(usuarioId);
    }

    // AJUSTADO: Recebe usuarioId para garantir autorização no Model
    async update(id, usuarioId, { review, nota }) { 
        return model.atualizarReview(id, usuarioId, review, nota);
    }

    // AJUSTADO: Recebe usuarioId para garantir autorização no Model
    async delete(id, usuarioId) { 
        return model.removerReview(id, usuarioId);
    }
}

module.exports = ReviewRepository;