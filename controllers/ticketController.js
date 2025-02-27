const { db } = require("../config/firebaseConfig");

const createTicket = async (req, res) => {
  const { userId, message, typeMapped, statusMapped } = req.body;

  try {
    const ticketRef = await db.collection("tickets");

    if (["strike", "skate", "station"].includes(typeMapped)) {
      await ticketRef.add({
        userId,
        message,
        type: typeMapped,
        status: statusMapped,
        createdAt: new Date(),
      });
    }

    return res.status(201).json({
      message: "Ticket criado com sucesso!",
      ticketId: ticketRef.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar ticket.",
      error: error.message,
    });
  }
};

const listTicket = async (req, res) => {
  try {
    const snapshot = await db.collection("tickets").get();
    const tickets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(tickets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao listar tickets.", error: error.message });
  }
};

const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { statusMapped } = req.body;

  if (!id) {
    return res.status(400).json({ message: "O ID do ticket é obrigatório." });
  }

  try {
    const ticketRef = db.collection("tickets").doc(id);

    let updates = { status: statusMapped };

    if (["done", "open"].includes(statusMapped)) {
      const endDate = new Date();

      updates = {
        ...updates,
        endDate,
      };

      await ticketRef.update(updates);
    }

    res.status(200).json(updates);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao listar tickets.", error: error.message });
  }
};

module.exports = {
  createTicket,
  listTicket,
  updateTicket,
};
