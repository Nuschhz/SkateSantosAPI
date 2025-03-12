const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");

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
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.DUCK_DNS
        : "http://localhost:3000",
    methods: "GET,POST,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.enable("trust proxy");

app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (req.secure || req.headers["x-forwarded-proto"] === "https") {
      next();
    } else {
      res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
  } else {
    next();
  }
});

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

// Rotas
app.use("/api/users", userRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/itens", itemRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/tickets", ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
