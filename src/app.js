const app = require("./config/express");
const db = require("./database/sqlite");
db.init(); // garante que a tabela exista antes das rotas
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
app.use("/api", routes);
app.use(errorHandler);

module.exports = app;