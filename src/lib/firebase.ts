// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
// import { getAuth, type Auth } from "firebase/auth"; // Descomente se for usar Firebase Auth

// Suas credenciais do Firebase SDK para Web apps
// Encontre isso no Console do Firebase > Configurações do Projeto > Seus apps > Configuração do SDK
// CRIE UM ARQUIVO .env.local na raiz do seu projeto e adicione estas variáveis:
// NEXT_PUBLIC_FIREBASE_API_KEY="SUA_API_KEY"
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
// NEXT_PUBLIC_FIREBASE_PROJECT_ID="SEU_PROJECT_ID"
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="SEU_SENDER_ID"
// NEXT_PUBLIC_FIREBASE_APP_ID="SEU_APP_ID"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let db: Firestore;
// let auth: Auth; // Descomente se for usar Firebase Auth

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

db = getFirestore(app);
// auth = getAuth(app); // Descomente se for usar Firebase Auth

export { app, db /*, auth */ }; // Exporte auth se for usar
