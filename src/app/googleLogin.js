/**
 * googleLogin.js - Inicio de sesión con Google.
 */
import { GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { socialLogin } from "./socialLogin.js";

const googleButton = document.querySelector("#google-login");

googleButton.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    socialLogin(provider, "Google");
});
