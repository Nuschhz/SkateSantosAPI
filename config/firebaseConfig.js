const admin = require("firebase-admin");
const serviceAccount = require("../firebase-adminsdk.json"); // Caminho do JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL, // Database URL do Firebase
});

const db = admin.firestore();

module.exports = { admin, db };
