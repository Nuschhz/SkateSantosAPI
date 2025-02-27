const express = require("express");
const {
  createTicket,
  listTicket,
  updateTicket,
} = require("../controllers/ticketController");
const verifyUserExists = require("../middlewares/verifyUserExists");
const validateTicketType = require("../middlewares/validateTicketType");
const validateTicketStatus = require("../middlewares/validateTicketStatus");

const router = express.Router();

router.post(
  "/",
  verifyUserExists,
  validateTicketType,
  validateTicketStatus,
  createTicket
);

router.get("/", listTicket);

router.patch("/:id", validateTicketStatus, updateTicket);

module.exports = router;
