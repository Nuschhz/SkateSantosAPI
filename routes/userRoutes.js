const express = require("express");
const {
  registerUser,
  listUsers,
  getUserById,
  deleteUser,
  addCredits,
  updateStrikes,
} = require("../controllers/userController");
const verifyUserExists = require("../middlewares/verifyUserExists");
const validateStrike = require("../middlewares/validateStrike");
const router = express.Router();

// Rota para registrar um novo usuário
router.post("/register", registerUser);

// Rota para listar usuários
router.get("/", listUsers);

// Rota para buscar usuário pelo ID
router.get("/:id", getUserById);

// Rota para adicionar créditos para o usuário pelo ID
router.patch("/add-credits/:id", verifyUserExists, addCredits);

// Rota para alterar os strikes do usuário pelo ID
router.patch(
  "/update-strikes/:id",
  verifyUserExists,
  validateStrike,
  updateStrikes
);

// Rota para deletar usuário pelo ID
router.delete("/:id", verifyUserExists, deleteUser);

module.exports = router;
