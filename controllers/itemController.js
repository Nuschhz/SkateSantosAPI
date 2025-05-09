const { db } = require("../config/firebaseConfig");

const createItem = async (req, res) => {
  const { statusMapped, description } = req.body;

  try {
    // Criação do item
    const itemRef = await db.collection("items").add({
      status: statusMapped,
      currentRental: null,
      description: description || null, // Campo opcional
      createdAt: new Date(), // Data de criação
    });

    res.status(201).json({
      message: "Item criado com sucesso!",
      itemId: itemRef.id, // Retorna o ID gerado automaticamente
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ao criar item.",
      error: error.message,
    });
  }
};

// Obtém um item específico pelo ID
const listItemsById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "O ID do item é obrigatório." });
  }

  try {
    const itemDoc = await db.collection("items").doc(id).get();

    if (!itemDoc.exists) {
      return res.status(404).json({ message: "Item não encontrado." });
    }

    res.status(200).json({ id: itemDoc.id, ...itemDoc.data() });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar item.", error: error.message });
  }
};

module.exports = {
  createItem,
  listItemsById,
};
