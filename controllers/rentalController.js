// Adiciona um novo aluguel
const { db } = require("../config/firebaseConfig");
const calculatePrice = require("../utils/calculatePrice");

const createRental = async (req, res) => {
  const { userId, rentalItemId } = req.body;

  if (!userId || !rentalItemId) {
    return res.status(400).json({
      message: "Os campos userId, rentalItemId são obrigatórios.",
    });
  }

  try {
    // Cria um novo rental
    const userRef = await db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (userData.currentRental) {
      return res.status(400).json({
        message: "O usuário já possui um rental ativo.",
        currentRental: userData.currentRental,
      });
    }

    const rentalRef = await db.collection("rentals").add({
      userId,
      rentalItemId,
      startDate: new Date(),
      endDate: null,
      status: "active",
      price: null,
      createdAt: new Date(),
    });

    // Atualiza o documento do usuário com o ID do rental ativo
    await db.collection("users").doc(userId).update({
      currentRental: rentalRef.id,
    });

    res.status(201).json({
      message: "Rental criado com sucesso!",
      rentalId: rentalRef.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar rental.",
      error: error.message,
    });
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
  const { statusMapped } = req.body;

  if (!id) {
    return res.status(400).json({ message: "O ID do rental é obrigatório." });
  }

  try {
    // Atualiza o rental
    const rentalRef = db.collection("rentals").doc(id);
    const rentalDoc = await rentalRef.get();
    const rentalData = rentalDoc.data();

    let updates = { status: statusMapped };

    if (["done", "canceled"].includes(statusMapped)) {
      const endDate = new Date(); // Define o término como o momento atual
      const price = calculatePrice(rentalData.startDate.toDate(), endDate); // Utiliza o utilitário para calcular o preço

      updates = {
        ...updates,
        endDate,
        price,
      };
    }

    await rentalRef.update(updates);

    // Verifica se o rental foi concluído
    if (["done", "canceled"].includes(statusMapped)) {
      // Remove o rental ativo do usuário
      await db.collection("users").doc(rentalData.userId).update({
        currentRental: null,
      });
    }

    res.status(200).json({ message: "Rental atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar rental.",
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
  updateRental,
  deleteRental,
};
