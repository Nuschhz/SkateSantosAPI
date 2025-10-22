const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");

// Carrega as variáveis de ambiente do .env
require("dotenv").config();

const verifyApiKey = require("./middlewares/verifyApiKey.js");

const userRoutes = require("./routes/userRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const itemRoutes = require("./routes/itemRoutes.js");
const stationRoutes = require("./routes/stationRoutes.js");
const ticketRoutes = require("./routes/ticketRoutes.js");

const app = express();

app.use(bodyParser.json());

app.use(helmet());
app.use(
  cors({
    methods: "GET,POST,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Necessário para o rate limiting funcionar atrás do proxy da Vercel
app.enable("trust proxy", 1);

// Limite de requisições por IP
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: process.env.NODE_ENV === "production" ? 500 : 10000,
//     message: {
//       error: "Muitas requisições deste IP, tente novamente mais tarde",
//     },
//   })
// );

app.use("/api", verifyApiKey);

// Rotas
app.use("/api/users", userRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/itens", itemRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/tickets", ticketRoutes);

// Rota "raiz" para verificar se a API está online (opcional, mas recomendado)
app.get("/", (req, res) => {
  res.send("API está funcionando!");
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, "0.0.0.0", () =>
//   console.log(`Servidor rodando na porta ${PORT}`)
// );

module.exports = app;
