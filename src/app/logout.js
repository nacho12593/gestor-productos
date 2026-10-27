/**
 * logout.js - Cierre de sesión.
 */
import { signOut } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { showMessage } from "./showMessage.js";

const logoutLink = document.querySelector("#logout");

logoutLink.addEventListener("click", async (e) => {
    e.preventDefault(); // Evita que el enlace "#" mueva la página

    try {
        await signOut(auth);
        showMessage("Sesión cerrada correctamente.");
    } catch (error) {
        console.error(error);
        showMessage("No se pudo cerrar la sesión. Inténtalo de nuevo.", "error");
    }
});
