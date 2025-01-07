const { db } = require("../config/firebaseConfig");

// Listar aluguéis
const getRentals = async (req, res) => {
  try {
    const snapshot = await db.collection("rentals").get();
    const rentals = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar aluguel
const createRental = async (req, res) => {
  const { equipment, userId, rentalDate } = req.body;
  try {
    const rental = await db.collection("rentals").add({
      equipment,
      userId,
      rentalDate,
      createdAt: new Date(),
    });
    res.status(201).json({ message: "Aluguel criado!", id: rental.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getRentals, createRental };
