const { db } = require("../config/firebaseConfig");

const createItem = async (req, res) => {
  const { statusMapped, description } = req.body;

  try {
    // Criação do item
    const itemRef = await db.collection("items").add({
      status: statusMapped,
      description: description || null, // Campo opcional
      createdAt: new Date(), // Data de criação
    });

    res.status(201).json({
      message: "Item successfully created!",
      itemId: itemRef.id, // Retorna o ID gerado automaticamente
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating item.",
      error: error.message,
    });
  }
};

module.exports = {
  createItem,
};
