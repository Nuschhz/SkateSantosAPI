const express = require("express");
const { createItem, listItemsById } = require("../controllers/itemController");
const validateItem = require("../middlewares/validateItemStatus");

const router = express.Router();

// Rota para cadastrar um item
router.post("/", validateItem, createItem);

// Rota para listar um item específico
router.get("/:id", listItemsById);

module.exports = router;
