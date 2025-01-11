const { db } = require("../config/firebaseConfig");

const validateCredits = async (req, res, next) => {
  const { userId } = req.body;

  const minimumPrice = 5;

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Verifica se o usuário tem créditos suficientes
    if ((userData.credits || 0) < minimumPrice) {
      return res.status(403).json({
        message: "Créditos insuficientes para criar o aluguel.",
        requiredCredits: minimumPrice,
        userCredits: userData.credits || 0,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Erro ao validar créditos.",
      error: error.message,
    });
  }
};

module.exports = validateCredits;
