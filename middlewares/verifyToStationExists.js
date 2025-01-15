const { db } = require("../config/firebaseConfig");

const verifyToStationExists = async (req, res, next) => {
  const toStationId = req.params.id || req.body.toStationId;

  if (!toStationId) {
    return res.status(400).json({ message: "O toStationId é obrigatório." });
  }

  try {
    // Verifica a existência da estação no Firestore
    const stationDoc = await db.collection("stations").doc(toStationId).get();

    if (!stationDoc.exists) {
      return res
        .status(404)
        .json({ message: "Estação de destino não encontrada." });
    }

    // Se a estação existe, continua para a próxima etapa
    next();
  } catch (error) {
    res.status(500).json({
      message: "Erro ao verificar estação de destino.",
      error: error.message,
    });
  }
};

module.exports = verifyToStationExists;
