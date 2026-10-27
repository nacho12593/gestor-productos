/**
 * signupForm.js - Registro de usuarios con correo y contraseña.
 */
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { showMessage } from "./showMessage.js";
import { getAuthErrorMessage } from "./authErrors.js";
import { closeModal } from "./modalUtils.js";

const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;

    try {
        // Crea el usuario en Firebase y deja la sesión iniciada
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        closeModal("#signup-modal");
        signupForm.reset(); // Limpia los campos

        showMessage(`Bienvenido, ${userCredential.user.email}`);
    } catch (error) {
        console.error(error.code, error.message);
        showMessage(getAuthErrorMessage(error), "error");
    }
});
