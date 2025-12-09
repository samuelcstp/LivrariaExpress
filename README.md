# Livraria Express - Fullstack Project

Este projeto é uma aplicação de livraria completa, permitindo o gerenciamento de livros e reviews. Possui um sistema de autenticação com **Express Sessions**, suporte a **Tema Dark/Light** e fluxo de **Recuperação de Senha** via e-mail.

---

## onfiguração do Backend

1. **Acesse a pasta do backend:**
   ```bash
   cd LivrariaExpress
Instale as dependências:

Bash

npm install
Crie um arquivo .env na raiz do backend com as seguintes variáveis:

Snippet de código

PORT=3333
SESSION_SECRET=sua_sessao_secreta
RESET_SECRET=seu_segredo_jwt_reset
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app_google
Inicie o servidor:

Bash

npm start
O servidor rodará em: http://localhost:3333

Arquitetura e Componentes
O servidor foi construído seguindo o padrão Controller-Repository, separando a lógica de negócio das consultas ao banco de dados para garantir um código limpo e organizado.

Principais Pastas e Arquivos (src/)
controllers/auth.controller.js: Gerencia o ciclo de vida do usuário (Login, Registro, Logout). Agora inclui os métodos forgotPassword (gera token JWT e envia e-mail) e resetPassword (valida token e atualiza senha).

repositories/users.repository.js: Camada de acesso ao SQLite. Contém o novo método updatePassword para persistir a nova senha criptografada do usuário no banco.

models/user.model.js: Define o esquema do usuário e centraliza as regras de validação de dados (regex de e-mail, força de senha e sanitização).

services/email.service.js: Configuração do Nodemailer para disparar os e-mails com links seguros de recuperação de senha.
