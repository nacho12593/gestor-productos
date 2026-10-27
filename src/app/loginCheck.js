/**
 * loginCheck.js - Muestra u oculta elementos según el estado de la sesión
 * y arranca o detiene el módulo de productos. Se llama desde onAuthStateChanged (main.js).
 */
import { state } from "./state.js";
import { startProductsListener, stopProductsListener } from "./productList.js";
import { resetProductForm } from "./productForm.js";

const loggedInLinks = document.querySelectorAll(".logged-in");
const loggedOutLinks = document.querySelectorAll(".logged-out");

export function loginCheck(user) {
    if (user) {
        // Hay sesión: mostrar Logout y productos, ocultar Sign In / Sign Up
        loggedInLinks.forEach((el) => (el.style.display = "block"));
        loggedOutLinks.forEach((el) => (el.style.display = "none"));

        document.querySelector("#user-email").textContent = user.displayName || user.email || "usuario";
        // Proveedor con el que se inició ESTA sesión (viene en el ID token).
        // providerData[0] no sirve si la cuenta tiene varios proveedores vinculados.
        const providerEl = document.querySelector("#user-provider");
        providerEl.textContent = user.providerData[0]?.providerId ?? "";
        user.getIdTokenResult()
            .then((token) => (providerEl.textContent = token.signInProvider))
            .catch(() => {});

        // Solo se consultan los productos de ESTE usuario (users/{uid}/products)
        if (state.uid !== user.uid) {
            state.uid = user.uid;
            resetProductForm();
            startProductsListener(user.uid);
        }
    } else {
        // Sin sesión: ocultar todo y limpiar la pantalla para no dejar datos del usuario anterior
        loggedInLinks.forEach((el) => (el.style.display = "none"));
        loggedOutLinks.forEach((el) => (el.style.display = "block"));

        state.uid = null;
        stopProductsListener();
        resetProductForm();
        document.querySelector("#user-email").textContent = "";
        document.querySelector("#user-provider").textContent = "";
    }
}
