const express = require("express");
const {
  registerUser,
  listUsers,
  getUserById,
  deleteUser,
  addCredits,
  updateStrikes,
  updateUser,
} = require("../controllers/userController");
const verifyUserExists = require("../middlewares/verifyUserExists");
const validateStrike = require("../middlewares/validateStrike");
const validateCPF = require("../middlewares/validateCpf");
const verifyCPF = require("../middlewares/verifyCpf");
const router = express.Router();

// Rota para registrar um novo usuário
router.post("/register", validateCPF, verifyCPF, registerUser);

// Rota para listar usuários
router.get("/", listUsers);

// Rota para buscar usuário pelo ID
router.get("/:id", getUserById);

// Rota para atualizar os dados do usuário pelo ID
router.patch("/update-user/:id", verifyUserExists, updateUser);

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
