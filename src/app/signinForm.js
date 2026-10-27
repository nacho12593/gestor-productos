/**
 * signinForm.js - Inicio de sesión con correo y contraseña.
 */
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { showMessage } from "./showMessage.js";
import { getAuthErrorMessage } from "./authErrors.js";
import { closeModal } from "./modalUtils.js";

const signinForm = document.querySelector("#signin-form");

signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = signinForm["signin-email"].value;
    const password = signinForm["signin-password"].value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        closeModal("#signin-modal");
        signinForm.reset();

        showMessage(`Bienvenido, ${userCredential.user.email}`);
    } catch (error) {
        console.error(error.code, error.message);
        showMessage(getAuthErrorMessage(error), "error");
    }
});
