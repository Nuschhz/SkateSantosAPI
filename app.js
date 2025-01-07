const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const app = express();

// Configurações básicas
require("dotenv").config();
app.use(bodyParser.json());

// Rotas
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
