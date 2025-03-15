const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");

const verifyApiKey = require("./middlewares/verifyApiKey.js");

const userRoutes = require("./routes/userRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const itemRoutes = require("./routes/itemRoutes.js");
const stationRoutes = require("./routes/stationRoutes.js");
const ticketRoutes = require("./routes/ticketRoutes.js");

const app = express();

require("dotenv").config();
app.use(bodyParser.json());

app.use(helmet());
app.use(
  cors({
    origin:[
        process.env.DUCK_DNS,
        "http://localhost:4000"
	],
    methods: "GET,POST,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.enable("trust proxy");

// Limite de requisições por IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "production" ? 100 : 1000,
    message: {
      error: "Muitas requisições deste IP, tente novamente mais tarde",
    },
  })
);

app.use("/api", verifyApiKey);

// Rotas
app.use("/api/users", userRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/itens", itemRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/tickets", ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
