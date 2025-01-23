const { db } = require("../config/firebaseConfig");

const verifyCPF = async (req, res, next) => {
  const { cpf } = req.body;

  if (!cpf) {
    return res.status(400).json({
      message: "O campo CPF é obrigatório.",
    });
  }

  try {
    // Consulta no Firestore para verificar se o CPF já existe
    const snapshot = await db.collection("users").where("cpf", "==", cpf).get();

    if (!snapshot.empty) {
      return res.status(400).json({
        message: "O CPF informado já está registrado em outro usuário.",
      });
    }

    next(); // Prossegue para o próximo middleware ou controlador
  } catch (error) {
    res.status(500).json({
      message: "Erro ao verificar o CPF.",
      error: error.message,
    });
  }
};

module.exports = verifyCPF;
