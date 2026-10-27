/**
 * yahooLogin.js - Inicio de sesión con Yahoo.
 * Requiere una app creada en developer.yahoo.com (Client ID y Client Secret en Firebase).
 * Yahoo no tiene clase propia: se usa OAuthProvider con el id "yahoo.com".
 */
import { OAuthProvider } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { socialLogin } from "./socialLogin.js";

const yahooButton = document.querySelector("#yahoo-login");

yahooButton.addEventListener("click", () => {
    const provider = new OAuthProvider("yahoo.com");
    // Pide al usuario iniciar sesión cada vez (útil para la demostración)
    provider.setCustomParameters({ prompt: "login" });
    socialLogin(provider, "Yahoo");
});
