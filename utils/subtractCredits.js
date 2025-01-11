const { db } = require("../config/firebaseConfig");

// Subtrai créditos do usuário
const subtractCredits = async (userId, price) => {
  try {
    // Recupera o usuário no Firestore
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    const updatedCredits = (userData.credits || 0) - price;

    // Atualiza os créditos do usuário
    // await userRef.update({ credits: updatedCredits });

    return updatedCredits;
  } catch (error) {
    console.error("Erro ao subtrair créditos:", error.message);
    throw error;
  }
};

module.exports = { subtractCredits };
