// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { requireAuth } = require('../middlewares/auth');

const authController = new AuthController();

// Rotas de Autenticação Padrão
router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.get('/me', requireAuth, (req, res, next) => authController.me(req, res, next));
router.post('/logout', requireAuth, (req, res, next) => authController.logout(req, res, next));

// 💡 NOVAS ROTAS DE RECUPERAÇÃO DE SENHA
router.post('/forgot-password', (req, res, next) => authController.forgotPassword(req, res, next));
router.put('/reset-password', (req, res, next) => authController.resetPassword(req, res, next));

module.exports = router;