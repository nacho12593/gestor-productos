/**
 * showMessage.js - Muestra notificaciones al usuario con un Toast de Bootstrap.
 * @param {string} message - Texto a mostrar
 * @param {"success"|"error"} type - Tipo de mensaje (cambia el color)
 */
export function showMessage(message, type = "success") {
    const toastEl = document.querySelector("#app-toast");
    const toastBody = document.querySelector("#app-toast-body");

    toastBody.textContent = message;

    // Verde para éxito, rojo para error
    toastEl.classList.remove("text-bg-success", "text-bg-danger");
    toastEl.classList.add(type === "success" ? "text-bg-success" : "text-bg-danger");

    // Crea (o reutiliza) la instancia del toast y la muestra
    bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4000 }).show();
}
