/**
 * githubLogin.js - Inicio de sesión con GitHub.
 * Requiere una OAuth App en GitHub (Client ID y Client Secret en Firebase).
 */
import { GithubAuthProvider } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { socialLogin } from "./socialLogin.js";

const githubButton = document.querySelector("#github-login");

githubButton.addEventListener("click", () => {
    const provider = new GithubAuthProvider();
    socialLogin(provider, "GitHub");
});
