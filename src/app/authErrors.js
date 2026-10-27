/**
 * authErrors.js - Traduce los códigos de error de Firebase (auth/...)
 * a mensajes claros en español. No revelan información sensible:
 * por ejemplo, en el login no decimos si el correo existe o no.
 */
const messages = {
    // Correo / contraseña
    "auth/invalid-email": "El correo no tiene un formato válido.",
    "auth/missing-password": "Escribe una contraseña.",
    "auth/weak-password": "La contraseña es muy débil (mínimo 6 caracteres).",
    "auth/email-already-in-use": "Ese correo ya está registrado. Intenta iniciar sesión.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/wrong-password": "Correo o contraseña incorrectos.",
    "auth/user-not-found": "Correo o contraseña incorrectos.",
    "auth/user-disabled": "Esta cuenta está deshabilitada.",
    "auth/too-many-requests": "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",

    // Proveedores con ventana emergente (popup)
    "auth/popup-closed-by-user": "Cerraste la ventana antes de terminar el inicio de sesión.",
    "auth/cancelled-popup-request": "Se canceló la solicitud de inicio de sesión.",
    "auth/popup-blocked": "El navegador bloqueó la ventana emergente. Permite popups para este sitio.",
    "auth/account-exists-with-different-credential":
        "Ya existe una cuenta con ese correo usando otro método de inicio de sesión.",
    "auth/operation-not-allowed": "Este método de inicio de sesión no está habilitado.",
    "auth/unauthorized-domain": "Este dominio no está autorizado en Firebase.",
    "auth/network-request-failed": "Error de red. Revisa tu conexión a internet."
};

export function getAuthErrorMessage(error) {
    // Si el código no está en la lista, mensaje genérico (error desconocido)
    return messages[error.code] || "Ocurrió un error inesperado. Inténtalo de nuevo.";
}
