/**
 * state.js - Estado compartido entre módulos.
 * Guarda quién es el usuario actual y qué producto se está editando.
 */
export const state = {
    uid: null,            // uid del usuario autenticado (null si no hay sesión)
    editingId: null,      // id del producto en edición (null = creando uno nuevo)
    processedImages: [],  // imágenes ya comprimidas y listas para guardar [{data, nombreArchivo}]
    unsubscribe: null     // función para dejar de escuchar Firestore (onSnapshot)
};

/** Rutas de Firestore organizadas por usuario: users/{uid}/products/... */
export const paths = {
    products: (uid) => ["users", uid, "products"],
    images: (uid, productId) => ["users", uid, "products", productId, "images"]
};
