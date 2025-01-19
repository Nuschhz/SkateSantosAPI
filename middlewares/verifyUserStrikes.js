const { db } = require("../config/firebaseConfig");

const verifyUserStrikes = async (req, res, next) => {
  const { userId } = req.body;

  try {
    // Recupera o usuário no Firestore
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Verifica o status dos strikes do usuário
    if (userData.strikes === "banned") {
      return res.status(403).json({
        message: "Usuário está banido e não pode criar um aluguel.",
        userId: userId,
        strikes: userData.strikes,
      });
    }

    next(); // Permite a continuação se o usuário não estiver banido
  } catch (error) {
    res.status(500).json({
      message: "Erro ao validar strikes.",
      error: error.message,
    });
  }
};

module.exports = verifyUserStrikes;
