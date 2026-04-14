const admin = require('firebase-admin');
let serviceAccount;

try {
  serviceAccount = require('../../serviceAccountKey.json');
} catch (error) {
  console.error("ERRO: Arquivo serviceAccountKey.json não encontrado na raiz do projeto!");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };
