const { db } = require("../config/firebaseConfig");

const validateSkate = async (req, res, next) => {
  const { skateId } = req.body;

  try {
    const skateDoc = await db.collection("items").doc(skateId).get();

    if (!skateDoc.exists) {
      return res.status(404).json({ message: "Skate não encontrado." });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Erro ao validar skate.",
      error: error.message,
    });
  }
};

module.exports = validateSkate;
