const express = require("express");
const { getRentals, createRental } = require("../controllers/rentalController");
const router = express.Router();

// Rota para listar aluguéis
router.get("/", getRentals);

// Rota para criar aluguel
router.post("/", createRental);

module.exports = router;
