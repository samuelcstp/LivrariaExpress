// src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const UsersRepository = require('../repositories/users.repository');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken'); // 💡 Importar JWT
const { enviarEmailRecuperacao } = require('../services/email.service'); // 💡 Importar Serviço de E-mail

class AuthController {
    constructor() {
        this.usersRepository = new UsersRepository();
    }

    async register(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const userInput = new User({ username, email, password });

            // Verifica se username já existe
            const existingUsername = await this.usersRepository.findByUsername(userInput.username);
            if (existingUsername) { const e = new Error('Nome de usuário já existe'); e.statusCode = 409; throw e; }

            // Verifica se email já existe
            const existingEmail = await this.usersRepository.findByEmail(userInput.email);
            if (existingEmail) { const e = new Error('Email já cadastrado'); e.statusCode = 409; throw e; }

            const passwordHash = await bcrypt.hash(String(password), 10);
            const created = await this.usersRepository.create({ username: userInput.username, email: userInput.email, passwordHash });
            req.session.userId = created.id;
            res.status(201).json({ mensagem: 'Usuário registrado com sucesso', user: created });
        } catch (err) { next(err); }
    }
    
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) { const e = new Error('Credenciais inválidas'); e.statusCode = 400; throw e; }
            const row = await this.usersRepository.findByEmail(email);
            if (!row || !(await bcrypt.compare(String(password), row.password_hash))) {
                const e = new Error('Email ou senha inválidos'); e.statusCode = 401; throw e;
            }
            req.session.userId = row.id;
            const user = User.fromDB(row);
            res.status(200).json({ mensagem: 'Login efetuado', user });
        } catch (err) { next(err); }
    }

    async me(req, res, next) {
        try {
            if (!req.session.userId) return res.status(401).json({ erro: 'Não autenticado' });
            const user = await this.usersRepository.findById(req.session.userId);
            if (!user) return res.status(401).json({ erro: 'Sessão inválida' });
            res.status(200).json(user);
        } catch (err) { next(err); }
    }

    async logout(req, res, next) {
        try { req.session.destroy(err => err ? next(err) : res.status(200).json({ mensagem: 'Logout realizado com sucesso.' })); }
        catch (err) { next(err); }
    }

    // 💡 NOVO MÉTODO: SOLICITAR RECUPERAÇÃO DE SENHA
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const userRow = await this.usersRepository.findByEmail(email);

            // Responde 200/OK mesmo se o usuário não for encontrado por segurança (evitar enumeração)
            if (!userRow) {
                return res.status(200).json({ mensagem: 'Se o e-mail estiver cadastrado, um link de recuperação será enviado.' });
            }

            // 1. Geração do Token JWT (Expira em 1h)
            const token = jwt.sign({ id: userRow.id }, process.env.RESET_SECRET, { expiresIn: '1h' });

            // 2. Envio do E-mail
            await enviarEmailRecuperacao(userRow.email, token);

            res.status(200).json({ mensagem: 'Link de recuperação enviado para seu e-mail.' });

        } catch (err) {
            console.error('Erro no forgotPassword:', err);
            // Se o erro for no envio do e-mail, ainda assim retornamos 500
            const e = new Error('Não foi possível enviar o e-mail de recuperação.'); e.statusCode = 500;
            next(e);
        }
    }

    // 💡 NOVO MÉTODO: REDEFINIR SENHA
    async resetPassword(req, res, next) {
       try {
            const { token, newPassword } = req.body;
            
            // 1. Validação básica de entrada
            if (!token || !newPassword) { 
                const e = new Error('Token e nova senha são obrigatórios.'); e.statusCode = 400; throw e; 
            }

            // 2. Validação básica da senha (Melhor mover para uma função utilitária, mas aqui resolve)
            if (String(newPassword).length < 6) { // Exemplo de regra
                const e = new Error('A nova senha deve ter pelo menos 6 caracteres.'); e.statusCode = 400; throw e;
            }

            // 3. Verificação do Token
            const decoded = jwt.verify(token, process.env.RESET_SECRET);
            const userId = decoded.id;

            // 4. Hashing da nova senha e atualização no banco
            const passwordHash = await bcrypt.hash(String(newPassword), 10);
            await this.usersRepository.updatePassword(userId, passwordHash);

            res.status(200).json({ mensagem: 'Senha redefinida com sucesso! Você já pode fazer login.' });

        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                const e = new Error('O link de recuperação expirou.'); e.statusCode = 401; next(e); return;
            }
            if (err.name === 'JsonWebTokenError') {
                const e = new Error('Token de recuperação inválido.'); e.statusCode = 401; next(e); return;
            }
            // Erros de validação (400) ou outros erros internos (500)
            next(err); 
        }
    }
}

module.exports = AuthController;