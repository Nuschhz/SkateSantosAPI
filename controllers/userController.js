const { admin, db } = require("../config/firebaseConfig");

// Adiciona um novo usuário no Firebase Authentication e Firestore
const registerUser = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  if (!name || !email || !password || !phoneNumber) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    // Cria o usuário no Firebase Authentication
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phoneNumber,
    });

    // Salva informações adicionais no Firestore
    await db.collection("users").doc(user.uid).set({
      name,
      email,
      phoneNumber,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Usuário registrado com sucesso!", user });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erro ao registrar usuário.", error: error.message });
  }
};

// Lista todos os usuários do Firestore
const listUsers = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao listar usuários.", error: error.message });
  }
};

// Obtém um usuário específico pelo ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "O ID do usuário é obrigatório." });
  }

  try {
    const userDoc = await db.collection("users").doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.status(200).json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar usuário.", error: error.message });
  }
};

// Exclui um usuário pelo ID
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "O ID do usuário é obrigatório." });
  }

  try {
    await admin.auth().deleteUser(id);

    await db.collection("users").doc(id).delete();

    res.status(200).json({ message: "Usuário excluído com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao excluir usuário.", error: error.message });
  }
};

module.exports = { registerUser, listUsers, getUserById, deleteUser };
