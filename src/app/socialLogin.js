/**
 * socialLogin.js - Lógica común para iniciar sesión con proveedores de terceros
 * (Google, Facebook, GitHub, Microsoft). Cada proveedor tiene su propio archivo
 * que solo crea su "provider" y llama a esta función.
 */
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { showMessage } from "./showMessage.js";
import { getAuthErrorMessage } from "./authErrors.js";
import { closeModal } from "./modalUtils.js";

export async function socialLogin(provider, providerName) {
    try {
        // Abre una ventana emergente con la pantalla de login del proveedor (OAuth)
        const result = await signInWithPopup(auth, provider);

        closeModal("#signin-modal");
        document.querySelector("#signin-form").reset();

        const name = result.user.displayName || result.user.email || "usuario";
        showMessage(`Bienvenido, ${name} (${providerName})`);
    } catch (error) {
        console.error(error.code, error.message);
        showMessage(getAuthErrorMessage(error), "error");
    }
}
