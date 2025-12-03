// src/services/email.service.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // As variáveis vêm do seu arquivo .env
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, 
    },
});

const enviarEmailRecuperacao = (toEmail, token) => {
    // Monta o link que o usuário receberá (aponta para a rota de redefinição no frontend)
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: toEmail,
        subject: 'Recuperação de Senha - API Livraria',
        html: `
            <h1>Recuperação de Senha</h1>
            <p>Você solicitou a recuperação de senha. Clique no link abaixo para redefini-la:</p>
            <a href="${resetLink}">Redefinir Senha</a>
            <p>Este link expira em 1 hora.</p>
        `,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { enviarEmailRecuperacao };