/**
 * firebase.js - Inicializa Firebase y exporta los servicios que usa la app:
 *   - auth: Firebase Authentication (inicio de sesión)
 *   - db:   Cloud Firestore (base de datos de productos)
 * Se usa el SDK modular (v13) cargado desde el CDN de Google.
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

  const firebaseConfig = {

    apiKey: "AIzaSyCz0B6nttPTIPmhrSuLZ2LB-pMCFz0k3Zc",

    authDomain: "gestor-productos-brandon.firebaseapp.com",

    projectId: "gestor-productos-brandon",

    storageBucket: "gestor-productos-brandon.firebasestorage.app",

    messagingSenderId: "669569089030",

    appId: "1:669569089030:web:5003f4a1879ea36b8d8d87"

  };


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
