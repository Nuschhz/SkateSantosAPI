const { db } = require("../config/firebaseConfig");

const verifyActiveRental = async (req, res, next) => {
  const userId = req.params.id || req.body.userId;

  try {
    // Recupera os dados do usuário no Firestore
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Verifica se o usuário possui um rental ativo
    if (userData.currentRental) {
      return res.status(400).json({
        message: "Usuário já possui um rental ativo.",
        currentRental: userData.currentRental,
      });
    }

    // Continua para a próxima etapa
    next();
  } catch (error) {
    console.error("Erro ao verificar rental ativo:", error.message);
    res.status(500).json({
      message: "Erro ao verificar rental ativo.",
      error: error.message,
    });
  }
};

module.exports = verifyActiveRental;
