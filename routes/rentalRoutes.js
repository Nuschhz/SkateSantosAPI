const express = require("express");
const {
  createRental,
  listRentals,
  updateRental,
  deleteRental,
} = require("../controllers/rentalController");
const verifyUserExists = require("../middlewares/verifyUserExists");

const router = express.Router();

// Rota para criar um novo aluguel
router.post("/", verifyUserExists, createRental);

// Rota para listar todos os aluguéis de um usuário
router.get("/:id", verifyUserExists, listRentals);

// Rota para atualizar um aluguel específico
router.patch("/:id", verifyUserExists, updateRental);

// Rota para excluir um aluguel
router.delete("/:id", verifyUserExists, deleteRental);

module.exports = router;
