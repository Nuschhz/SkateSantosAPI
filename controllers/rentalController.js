// Adiciona um novo aluguel
const { db } = require("../config/firebaseConfig");
const calculatePrice = require("../utils/calculatePrice");
const { subtractCredits } = require("../utils/subtractCredits");

const createRental = async (req, res) => {
  const { userId, skateId, initialStationId } = req.body;

  if (!userId || !skateId || !initialStationId) {
    return res.status(400).json({
      message: "Os campos userId, skateId e initialStationId são obrigatórios.",
    });
  }

  try {
    // Recupera a estação inicial e suas células
    const stationRef = db.collection("stations").doc(initialStationId);
    const stationDoc = await stationRef.get();
    const stationData = stationDoc.data();

    // Atualiza as células da estação, liberando a célula que contém o skate
    const updatedCells = stationData.cells.map((cell) =>
      cell.skateId === skateId ? { ...cell, skateId: null } : cell
    );

    // Atualiza a estação no Firestore
    await stationRef.update({ cells: updatedCells });

    // Cria o rental
    const rentalRef = await db.collection("rentals").add({
      userId,
      skateId,
      startDate: new Date(),
      endDate: null,
      initialStationId,
      lastStationId: null,
      status: "active",
      price: null,
      createdAt: new Date(),
    });

    // Atualiza o documento do item com o ID do renatal ativo
    await db.collection("items").doc(skateId).update({
      currentRental: rentalRef.id,
    });

    // Atualiza o documento do usuário com o ID do rental ativo
    await db.collection("users").doc(userId).update({
      currentRental: rentalRef.id,
    });

    res.status(201).json({
      message: "Aluguel criado com sucesso!",
      rentalId: rentalRef.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar rental.",
      error: error.message,
    });
  }
};

// Lista todos os aluguéis
const listRentals = async (req, res) => {
  try {
    const snapshot = await db.collection("rentals").get();
    const rentals = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(rentals);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao listar aluguéis.", error: error.message });
  }
};

// Lista todos os aluguéis (filtrado por usuário)
const listRentalsById = async (req, res) => {
  const { id: userId } = req.params;

  try {
    // Filtra os aluguéis pelo userId
    const query = db.collection("rentals").where("userId", "==", userId);
    const snapshot = await query.get();

    // Mapeia os resultados
    const rentals = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar aluguéis.",
      error: error.message,
    });
  }
};

// Atualiza um aluguel pelo ID
const updateRental = async (req, res) => {
  const { id } = req.params;
  const { statusMapped } = req.body;

  if (!id) {
    return res.status(400).json({ message: "O ID do aluguel é obrigatório." });
  }

  try {
    // Atualiza o rental
    const rentalRef = db.collection("rentals").doc(id);
    const rentalDoc = await rentalRef.get();
    const rentalData = rentalDoc.data();

    let updates = { status: statusMapped };

    // Verifica se o rental foi concluído
    if (["done", "canceled"].includes(statusMapped)) {
      const endDate = new Date(); // Define o término como o momento atual
      const price = calculatePrice(rentalData.startDate.toDate(), endDate);
      const finalAmount = await subtractCredits(rentalData.userId, price);

      updates = {
        ...updates,
        endDate,
        price,
      };

      await rentalRef.update(updates);

      // Remove o rental ativo do skate
      await db.collection("items").doc(rentalData.skateId).update({
        currentRental: null,
      });

      // Remove o rental ativo do usuário
      await db.collection("users").doc(rentalData.userId).update({
        currentRental: null,
        credits: finalAmount,
      });
    }

    res.status(200).json({ message: "Aluguel atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar aluguel.",
      error: error.message,
    });
  }
};

// Exclui um aluguel pelo ID
const deleteRental = async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection("rentals").doc(id).delete();
    res.status(200).json({ message: "Aluguel excluído com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao excluir aluguel.", error: error.message });
  }
};

module.exports = {
  createRental,
  listRentals,
  listRentalsById,
  updateRental,
  deleteRental,
};
