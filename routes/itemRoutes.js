const express = require("express");
const { createItem } = require("../controllers/itemController");
const validateItem = require("../middlewares/validateItemStatus");

const router = express.Router();

router.post("/", validateItem, createItem);

module.exports = router;
