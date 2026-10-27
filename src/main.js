/**
 * main.js - Punto de entrada de la aplicación.
 * Solo importa los módulos; cada uno registra sus propios eventos.
 */
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { auth } from "./app/firebase.js";
import { loginCheck } from "./app/loginCheck.js";

// Autenticación
import "./app/signupForm.js";
import "./app/signinForm.js";
import "./app/googleLogin.js";
import "./app/facebookLogin.js";
import "./app/githubLogin.js";
import "./app/yahooLogin.js";
import "./app/logout.js";

// Productos
import "./app/imagePreview.js";
import "./app/productForm.js";
import "./app/productEdit.js";
import "./app/productDelete.js";

// onAuthStateChanged se ejecuta al cargar la página y cada vez que el usuario
// inicia o cierra sesión. user = objeto del usuario o null.
onAuthStateChanged(auth, (user) => {
    loginCheck(user);
});
