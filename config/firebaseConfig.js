const admin = require("firebase-admin");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (e) {
    console.error("Erro ao parsear FIREBASE_SERVICE_ACCOUNT:", e);
  }
} else {
  try {
    console.log("Carregando credenciais locais do Firebase...");
    serviceAccount = require("../firebase-adminsdk.json");
  } catch (e) {
    console.warn(
      "Arquivo firebase-adminsdk.json não encontrado. Necessário para dev local."
    );
  }
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL,
  });
  console.log("Firebase Admin inicializado com sucesso.");
} else {
  console.error(
    "Credenciais do Firebase não foram carregadas. O App Admin NÃO foi inicializado."
  );
}

const db = admin.firestore();

module.exports = { admin, db };
