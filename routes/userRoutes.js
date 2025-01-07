const express = require("express");
const {
  registerUser,
  listUsers,
  getUserById,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();

// Rota para registrar um novo usuário
router.post("/register", registerUser);

// Rota para listar usuários
router.get("/", listUsers);

// Rota para buscar usuário pelo ID
router.get("/:id", getUserById);

// Rota para deletar usuário pelo ID
router.delete("/:id", deleteUser);

module.exports = router;
