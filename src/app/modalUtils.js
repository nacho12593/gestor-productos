/**
 * modalUtils.js - Funciones auxiliares para los modales de Bootstrap.
 */

// Cierra un modal a partir de su selector (ej. "#signin-modal")
export function closeModal(selector) {
    const modalEl = document.querySelector(selector);
    // getInstance devuelve el modal ya abierto; si no existe no hace nada
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}
