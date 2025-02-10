const express = require("express");
const {
  createStation,
  moveSkate,
  addSkate,
  listStations,
  deleteStation,
} = require("../controllers/stationController");
const verifyRentalExists = require("../middlewares/verifyRentalExists");
const validateCell = require("../middlewares/validateCell");
const validateSkate = require("../middlewares/validateSkate");
const verifyToStationExists = require("../middlewares/verifyToStationExists");

const router = express.Router();

// Lista todas as estações
router.get("/", listStations);

// Criar uma nova estação
router.post("/", createStation);

// Mover skate entre estações ou células
router.post("/move-skate", verifyRentalExists, validateCell, moveSkate);

// Mover skate entre estações ou células
router.delete("/:id", verifyToStationExists, deleteStation);

// Adiciona um skate não referenciado à uma célula
router.post(
  "/add-skate",
  validateSkate,
  validateCell,
  verifyToStationExists,
  deleteStation,
  addSkate
);

module.exports = router;
