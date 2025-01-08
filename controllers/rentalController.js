const { db } = require("../config/firebaseConfig");

// Adiciona um novo aluguel
const createRental = async (req, res) => {
  const { userId, rentalItemId, startDate, endDate, status, price } = req.body;

  if (!userId || !rentalItemId || !startDate || !price) {
    return res.status(400).json({
      message:
        "Os campos userId, rentalItemId, startDate e price são obrigatórios.",
    });
  }

  try {
    const rentalRef = await db.collection("rentals").add({
      userId,
      rentalItemId,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      status: status || "active",
      price,
      createdAt: new Date(),
    });

    res
      .status(201)
      .json({ message: "Aluguel registrado com sucesso!", id: rentalRef.id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao registrar aluguel.", error: error.message });
  }
};

// Lista todos os aluguéis (filtrado por usuário)
const listRentals = async (req, res) => {
  const { id: userId } = req.params; // Captura o userId dos parâmetros da rota

  // Verifica se o userId foi fornecido
  if (!userId) {
    return res.status(400).json({
      message: "O ID do usuário é obrigatório para listar os aluguéis.",
    });
  }

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
  const updates = req.body;

  try {
    const rentalRef = db.collection("rentals").doc(id);
    await rentalRef.update(updates);

    res.status(200).json({ message: "Aluguel atualizado com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar aluguel.", error: error.message });
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
  updateRental,
  deleteRental,
};
