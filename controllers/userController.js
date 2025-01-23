const { admin, db } = require("../config/firebaseConfig");

// Adiciona um novo usuário no Firebase Authentication e Firestore
const registerUser = async (req, res) => {
  const { name, email, password, phoneNumber, cpf, profilePicture, birthday } =
    req.body;

  if (!name || !email || !password || !phoneNumber || !cpf || !birthday) {
    return res.status(400).json({
      message:
        "Os campos: name, email, password, phoneNumber, cpf e birthday são obrigatórios.",
    });
  }

  try {
    // Cria o usuário no Firebase Authentication
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const formattedBirthday = new Date(`${birthday}T03:00:00Z`);

    // Salva informações adicionais no Firestore
    await db
      .collection("users")
      .doc(user.uid)
      .set({
        name,
        email,
        createdAt: new Date(),
        currentRental: null,
        credits: 0,
        strikes: "great",
        phoneNumber: phoneNumber,
        cpf: cpf,
        profilePicture: profilePicture || null,
        birthday: formattedBirthday,
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

// Atualiza as informações do usuário pelo ID
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { phoneNumber, profilePicture, email } = req.body;

  try {
    // Referência ao usuário no Firestore
    const userRef = db.collection("users").doc(id);

    // Dados atualizados no Firestore
    const updatedData = {};
    if (profilePicture) updatedData.profilePicture = profilePicture;

    if (email) {
      await admin.auth().updateUser(id, { email });
      updatedData.email = email;
    }

    if (phoneNumber) {
      await admin.auth().updateUser(id, { phoneNumber });
      updatedData.phoneNumber = phoneNumber;
    }

    await userRef.update(updatedData);

    res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar usuário.",
      error: error.message,
    });
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

const addCredits = async (req, res) => {
  const { id } = req.params;
  const { creditsToAdd } = req.body;

  try {
    // Recupera o usuário no Firestore
    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    const updatedCredits = userData.credits + creditsToAdd;

    // Atualiza os créditos do usuário
    await userRef.update({ credits: updatedCredits });

    res.status(200).json({
      message: "Créditos adicionados ao usuário.",
      userId: userRef.id,
    });
  } catch (error) {
    console.error("Erro ao adicionar créditos:", error.message);
    throw error;
  }
};

const updateStrikes = async (req, res) => {
  const { id } = req.params;
  const { strikesMapped } = req.body;

  try {
    const userRef = db.collection("users").doc(id);

    await userRef.update({ strikes: strikesMapped });

    res.status(200).json({
      message: "Strikes do usuário atualizados com sucesso.",
      strikes: strikesMapped,
      userId: id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar strikes.",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  listUsers,
  getUserById,
  deleteUser,
  addCredits,
  updateStrikes,
  updateUser,
};
