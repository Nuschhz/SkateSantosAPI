const express = require("express");
const {
  createRental,
  listRentals,
  updateRental,
  deleteRental,
} = require("../controllers/rentalController");
const verifyUserExists = require("../middlewares/verifyUserExists");
const validateRentalStatus = require("../middlewares/validateRentalStatus");
const validateCredits = require("../middlewares/validateCredits");
const validateSkate = require("../middlewares/validateSkate");
const verifyActiveRental = require("../middlewares/verifyCurrentRental");
const verifyUserStrikes = require("../middlewares/verifyUserStrikes");

const router = express.Router();

// Rota para criar um novo aluguel
router.post(
  "/",
  verifyUserExists,
  verifyUserStrikes,
  verifyActiveRental,
  validateCredits,
  validateSkate,
  createRental
);

// Rota para listar todos os aluguéis de um usuário
router.get("/:id", verifyUserExists, listRentals);

// Rota para atualizar um aluguel específico
router.patch("/:id", validateRentalStatus, updateRental);

// Rota para excluir um aluguel
router.delete("/:id", deleteRental);

module.exports = router;
