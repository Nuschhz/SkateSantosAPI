const { db } = require("../config/firebaseConfig");

const createStation = async (req, res) => {
  const { name, latitude, longitude, cells } = req.body;

  if (!cells || cells < 1) {
    return res.status(400).json({
      message: "Uma estação precisa de pelo menos uma célula",
    });
  }

  try {
    const snapshot = await db
      .collection("stations")
      .orderBy("number", "desc")
      .limit(1)
      .get();

    let nextNumber = 1; // Valor padrão para a primeira estação
    if (!snapshot.empty) {
      const lastStation = snapshot.docs[0].data();
      nextNumber = (lastStation.number || 0) + 1;
    }

    // Inicializa as células com skates vazios
    const cellArray = Array.from({ length: cells }, (_, index) => ({
      cellNumber: index + 1,
      skateId: null, // Nenhum skate alocado inicialmente
    }));

    const stationRef = await db.collection("stations").add({
      name,
      latitude,
      longitude,
      cells: cellArray,
      number: nextNumber,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Estação criada com sucesso!",
      stationId: stationRef.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar estação.",
      error: error.message,
    });
  }
};

// Lista todos os usuários do Firestore
const listStations = async (req, res) => {
  try {
    const snapshot = await db.collection("stations").get();
    const stations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(stations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao listar estações.", error: error.message });
  }
};

// Mover um skate para outra célula ou estação
const moveSkate = async (req, res) => {
  const { rentalId, toStationId, toCellNumber } = req.body;

  if (!rentalId || !toStationId || !toCellNumber) {
    return res.status(400).json({
      message:
        "Os campos rentalId, toStationId e toCellNumber são obrigatórios.",
    });
  }

  try {
    // Verifica o rental
    const rentalRef = db.collection("rentals").doc(rentalId);
    const rentalDoc = await rentalRef.get();
    const rentalData = rentalDoc.data();

    const { skateId, lastStationId } = rentalData;

    // Verifica a estação de destino
    const toStationRef = db.collection("stations").doc(toStationId);
    const toStationDoc = await toStationRef.get();
    const toStationData = toStationDoc.data();

    // Atualiza a estação de origem para liberar o skate
    if (lastStationId) {
      const fromStationRef = db.collection("stations").doc(lastStationId);
      const fromStationDoc = await fromStationRef.get();

      if (fromStationDoc.exists) {
        const fromStationData = fromStationDoc.data();
        const updatedFromCells = fromStationData.cells.map((cell) =>
          cell.skateId === skateId ? { ...cell, skateId: null } : cell
        );
        await fromStationRef.update({ cells: updatedFromCells });
      }
    }

    // Atualiza a estação de destino para alocar o skate
    const updatedToCells = toStationData.cells.map((cell) =>
      cell.cellNumber === toCellNumber ? { ...cell, skateId: skateId } : cell
    );
    await toStationRef.update({ cells: updatedToCells });

    // Atualiza o rental com a última estação
    await rentalRef.update({ lastStationId: toStationId });

    res.status(200).json({
      message: "Skate movido com sucesso!",
      rentalId,
      toStationId,
      toCellNumber,
    });
  } catch (error) {
    console.error("Erro ao mover skate:", error.message);
    res.status(500).json({
      message: "Erro ao mover skate.",
      error: error.message,
    });
  }
};

const addSkate = async (req, res) => {
  const { toStationId, toCellNumber, skateId } = req.body;

  if (!toStationId || !toCellNumber || !skateId) {
    return res.status(400).json({
      message:
        "Os campos toStationId, toCellNumber e skateId são obrigatórios.",
    });
  }

  try {
    // Recupera a estação no Firestore
    const stationRef = db.collection("stations").doc(toStationId);
    const stationDoc = await stationRef.get();
    const stationData = stationDoc.data();

    // Atualiza a célula com o skateId
    const updatedCells = stationData.cells.map((c) =>
      c.cellNumber === toCellNumber ? { ...c, skateId } : c
    );

    // Atualiza a estação no Firestore
    await stationRef.update({ cells: updatedCells });

    res.status(200).json({
      message: "Skate adicionado à célula com sucesso!",
      stationId: toStationId,
      cellNumber: toCellNumber,
      skateId,
    });
  } catch (error) {
    console.error("Erro ao adicionar skate:", error.message);
    res.status(500).json({
      message: "Erro ao adicionar skate.",
      error: error.message,
    });
  }
};

// Deleta a estação pelo ID
const deleteStation = async (req, res) => {
  const { id } = req.params;

  try {
    const stationRef = db.collection("stations").doc(id);

    await stationRef.delete();

    return res.status(200).json({ message: "Estação deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar estação:", error.message);
    return res.status(500).json({
      message: "Erro ao deletar estação.",
      error: error.message,
    });
  }
};

module.exports = {
  createStation,
  moveSkate,
  addSkate,
  listStations,
  deleteStation,
};
