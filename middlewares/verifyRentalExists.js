const { db } = require("../config/firebaseConfig");

const verifyRentalExists = async (req, res, next) => {
  const rentalId = req.params.id || req.body.rentalId;

  if (!rentalId) {
    return res.status(400).json({ message: "O rentalId é obrigatório." });
  }

  try {
    // Verifica a existência do aluguel no Firestore
    const rentalDoc = await db.collection("rentals").doc(rentalId).get();

    if (!rentalDoc.exists) {
      return res.status(404).json({ message: "Aluguel não encontrado." });
    }

    // Se o aluguel existe, continua para a próxima etapa
    next();
  } catch (error) {
    res.status(500).json({
      message: "Erro ao verificar aluguel.",
      error: error.message,
    });
  }
};

module.exports = verifyRentalExists;
