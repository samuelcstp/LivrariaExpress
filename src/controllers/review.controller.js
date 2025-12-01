const ReviewRepository = require("../repositories/review.repository");
const repo = new ReviewRepository();

class ReviewController {
    async criarReview(req, res) {
        try {
            // 🔒 Pega o ID do usuário logado da sessão, não do body
            const usuarioId = req.session.userId; 
            const { livroId, review, nota } = req.body;

            if (!usuarioId || !livroId) {
                // Se o requireAuth passou, usuarioId existe.
                return res.status(400).json({
                    erro: "livroId é obrigatório."
                });
            }

            const nova = await repo.create({ usuarioId, livroId, review, nota });
            res.status(201).json({
                mensagem: "Review criada",
                id: nova.id
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    // AJUSTADO para listar as reviews do usuário logado
    async listarMinhasReviews(req, res) {
        try {
            // 🔒 Pega o ID do usuário logado da sessão
            const usuarioId = req.session.userId;

            const reviews = await repo.findByUser(usuarioId);
            res.json(reviews);

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    async atualizarReview(req, res) {
        try {
            const id = req.params.id; // ID da review
            // 🔒 Pega o ID do usuário logado da sessão para autorização
            const usuarioId = req.session.userId; 
            const { review, nota } = req.body;

            // ⚠️ Passa o usuarioId para garantir que o usuário só edite a própria review
            const resultado = await repo.update(id, usuarioId, { review, nota });
            
            if (resultado.changes === 0) {
                 return res.status(403).json({ 
                    erro: "Review não encontrada ou você não tem permissão para editá-la." 
                 });
            }

            res.json({
                mensagem: "Review atualizada",
                alteracoes: resultado.changes
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    async removerReview(req, res) {
        try {
            const id = req.params.id; // ID da review
            // 🔒 Pega o ID do usuário logado da sessão para autorização
            const usuarioId = req.session.userId; 

            // ⚠️ Passa o usuarioId para garantir que o usuário só remova a própria review
            const resultado = await repo.delete(id, usuarioId);

             if (resultado.changes === 0) {
                 return res.status(403).json({ 
                    erro: "Review não encontrada ou você não tem permissão para removê-la." 
                 });
            }

            res.json({
                mensagem: "Review removida",
                alteracoes: resultado.changes
            });

        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = ReviewController;