const LivrosRepository = require("../repositories/livros.repository");
const Livro = require("../models/livro.model"); 
const fs = require('fs'); 
const path = require('path'); 

class LivrosController {
    constructor() {
        this.livrosRepository = new LivrosRepository();
    }

    async listarLivros(req, res, next) {
        try {
            const livros = await this.livrosRepository.findAll();
            res.status(200).json(livros);
        } catch (err) { next(err); }
    }

    async buscarLivroPorId(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const livro = await this.livrosRepository.findById(id);
            if (!livro) {
                return res.status(404).json({ erro: "Livro não encontrado" });
            }
            res.status(200).json(livro);
        } catch (err) { next(err); }
    }

    async criarLivro(req, res, next) {
        // 1. Captura o arquivo do Multer e define o caminho
        const capaFile = req.file; 
        const capaCaminho = capaFile ? `uploads/livros/${capaFile.filename}` : null;
        
        try {
            // 2. req.body contém apenas os campos de texto
            const { titulo, autor, categoria, ano, editora } = req.body;
            
            // 3. Instancia o modelo para validação
            const novoLivro = new Livro({
                titulo,
                autor,
                categoria,
                ano: parseInt(ano),
                editora,
                capa_caminho: capaCaminho // Usando o caminho local
            });

            // 4. Salva no banco de dados
            const created = await this.livrosRepository.create(novoLivro.toJSON());
            
            res.status(201).json({
                mensagem: "Livro criado com sucesso",
                data: created
            });

        } catch (err) { 
            // 5. Em caso de erro (ex: validação), DELETA o arquivo que o Multer salvou
            if (capaFile) {
                fs.unlink(capaFile.path, () => {}); 
            }
            next(err); 
        }
    }

    async atualizarLivro(req, res, next) {
        const id = parseInt(req.params.id);
        
        // 1. Captura o novo arquivo do Multer (se houver)
        const novaCapaFile = req.file;
        let novaCapaCaminho = novaCapaFile ? `uploads/livros/${novaCapaFile.filename}` : null;
        
        try {
            const existente = await this.livrosRepository.findById(id);
            if (!existente) {
                // Se não encontrou o livro, deleta o arquivo recém-subido
                if (novaCapaFile) { fs.unlink(novaCapaFile.path, () => {}); }
                return res.status(404).json({ erro: "Livro não encontrado" });
            }

            const { titulo, autor, categoria, ano, editora } = req.body;
            
            // 2. Decide qual caminho usar e gerencia a exclusão do arquivo antigo
            if (!novaCapaCaminho) {
                // Se nenhum arquivo novo foi enviado, mantém o caminho existente no DB
                novaCapaCaminho = existente.capa_caminho;
            } else {
                // Se uma NOVA capa foi subida, DELETA a capa antiga do disco.
                if (existente.capa_caminho) {
                    // Monta o caminho completo baseado na pasta 'uploads' (assumindo que está no root do backend)
                    const oldPath = path.resolve(__dirname, '..', '..', existente.capa_caminho);
                    fs.unlink(oldPath, (err) => {
                        if (err) console.error("Erro ao deletar capa antiga:", err);
                    });
                }
            }
            
            // 3. Instancia o modelo atualizado para validação
            const livroAtualizado = new Livro({
                ...existente.toJSON(), // Dados antigos
                titulo, autor, categoria, 
                ano: parseInt(ano), editora,
                capa_caminho: novaCapaCaminho
            });

            // 4. Atualiza no DB
            const updated = await this.livrosRepository.update(id, livroAtualizado.toJSON());

            res.status(200).json({
                mensagem: "Livro atualizado com sucesso",
                data: updated
            });

        } catch (err) {
            // 5. Em caso de erro na atualização, deleta o arquivo recém-subido
            if (novaCapaFile) {
                fs.unlink(novaCapaFile.path, () => {});
            }
            next(err);
        }
    }

    async removerLivro(req, res, next) {
        const id = parseInt(req.params.id);
        try {
            // 1. Deleta do DB, mas retorna o objeto para pegar o caminho da capa
            const livroRemovido = await this.livrosRepository.delete(id);
            
            // 2. Deleta o arquivo da capa do disco
            if (livroRemovido && livroRemovido.capa_caminho) {
                const fullPath = path.resolve(__dirname, '..', '..', livroRemovido.capa_caminho);
                fs.unlink(fullPath, (err) => {
                    if (err) console.error("Erro ao deletar capa do livro removido:", err);
                });
            }

            res.status(200).json({
                mensagem: "Livro removido com sucesso",
                data: livroRemovido
            });
        } catch (err) { next(err); }
    }
}

module.exports = LivrosController;