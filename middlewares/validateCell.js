const { db } = require("../config/firebaseConfig");

const validateCell = async (req, res, next) => {
  const { toStationId, toCellNumber } = req.body;

  try {
    const stationRef = db.collection("stations").doc(toStationId);
    const stationDoc = await stationRef.get();
    const stationData = stationDoc.data();

    const cell = stationData.cells.find((c) => c.cellNumber === toCellNumber);

    if (!cell || cell.skateId) {
      return res.status(400).json({ message: "Célula indisponível." });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Erro ao validar célula.",
      error: error.message,
    });
  }
};

module.exports = validateCell;
