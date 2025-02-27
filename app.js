const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const itemRoutes = require("./routes/itemRoutes.js");
const stationRoutes = require("./routes/stationRoutes.js");
const ticketRoutes = require("./routes/ticketRoutes.js");

const app = express();

require("dotenv").config();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization",
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
