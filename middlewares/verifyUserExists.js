const { db } = require("../config/firebaseConfig");

const verifyUserExists = async (req, res, next) => {
  const userId = req.params.id || req.body.userId;

  if (!userId) {
    return res.status(400).json({ message: "O userId é obrigatório." });
  }

  try {
    // Verifica a existência do usuário no Firestore
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Se o usuário existe, continua para a próxima etapa
    next();
  } catch (error) {
    res.status(500).json({
      message: "Erro ao verificar usuário.",
      error: error.message,
    });
  }
};

module.exports = verifyUserExists;
