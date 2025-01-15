const express = require("express");
const {
  createStation,
  moveSkate,
  addSkate,
} = require("../controllers/stationController");
const verifyRentalExists = require("../middlewares/verifyRentalExists");
const validateCell = require("../middlewares/validateCell");
const validateSkate = require("../middlewares/validateSkate");
const verifyToStationExists = require("../middlewares/verifyToStationExists");

const router = express.Router();

// Criar uma nova estação
router.post("/", createStation);

// Mover skate entre estações ou células
router.post("/move-skate", verifyRentalExists, validateCell, moveSkate);

// Adiciona um skate não referenciado à uma célula
router.post(
  "/add-skate",
  validateSkate,
  validateCell,
  verifyToStationExists,
  addSkate
);

module.exports = router;
