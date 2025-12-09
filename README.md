## Instalação e Configuração

### Instale as dependências
```bash
npm install
```
### Crie um arquivo .env na raiz do backend com as seguintes variáveis:
```
PORT=3333
SESSION_SECRET=sua_sessao_secreta
RESET_SECRET=seu_segredo_jwt_reset
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app_google
```
###Inicie o servidor: Bash npm start O servidor rodará em: http://localhost:3333
```bash
npm start
```
O servidor rodará em: http://localhost:3333

## Arquitetura e Componentes

O servidor segue o padrão **Controller–Repository**, separando regras de negócio das consultas ao banco para manter o código organizado e fácil de manter.

### Principais pastas e arquivos (`src/`)

- **controllers/auth.controller.js**  
  Gerencia o ciclo de vida do usuário (login, registro, logout).  
  Inclui também:
  - `forgotPassword` gera o token JWT e envia o e-mail.
  - `resetPassword` valida o token e atualiza a senha.

- **repositories/users.repository.js**  
  Camada de acesso ao SQLite.  
  Possui o método `updatePassword`, responsável por salvar a nova senha criptografada no banco.

- **models/user.model.js**  
  Define o modelo do usuário e centraliza as validações (regex de e-mail, força de senha, sanitização etc).

- **services/email.service.js**  
  Configura o Nodemailer e envia os e-mails com links seguros de recuperação de senha.
