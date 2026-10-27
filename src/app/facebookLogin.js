/**
 * facebookLogin.js - Inicio de sesión con Facebook.
 * Requiere una app creada en developers.facebook.com (App ID y App Secret en Firebase).
 */
import { FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { socialLogin } from "./socialLogin.js";

const facebookButton = document.querySelector("#facebook-login");

facebookButton.addEventListener("click", () => {
    const provider = new FacebookAuthProvider();
    socialLogin(provider, "Facebook");
});
