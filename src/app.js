const express = require('express');
const app = require("./config/express");
const path = require("path");

// Inicializa o banco de dados SQLite puro
const db = require("./database/sqlite");
db.init();

// Todas as rotas da aplicação
const routes = require("./routes");
// Configura o middleware de tratamento de erros
const errorHandler = require("./middlewares/errorHandler");

const UPLOADS_FOLDER_PATH = path.resolve(__dirname, '..', 'uploads'); 

console.log('--- Configuração Estática ---');
console.log(`Caminho absoluto da pasta 'uploads': ${UPLOADS_FOLDER_PATH}`);
console.log(`URL de acesso no frontend: http://localhost:PORTA/uploads/...`);
console.log('-----------------------------');


app.use('/uploads', express.static(UPLOADS_FOLDER_PATH)); 


// Configura as rotas
app.use("/api", routes);

app.use(errorHandler);

// Handler para rotas não encontradas (404)
app.use((req, res) => {
    res.status(404).json({ erro: "Endpoint não encontrado" });
});


module.exports = app;