/**
 * productService.js - Todas las operaciones con Cloud Firestore.
 * Siempre se trabaja dentro de users/{uid}/products, usando el uid del usuario
 * autenticado, para que cada usuario solo vea y modifique SUS productos.
 *
 * Estructura:
 *   users/{uid}/products/{productId}               -> nombre, descripcion, precio, categoria, existencias, fechaCreacion
 *   users/{uid}/products/{productId}/images/{id}   -> data (Base64), nombreArchivo, orden
 */
import {
    collection, doc, getDoc, getDocs, query, orderBy,
    writeBatch, serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { paths } from "./state.js";

/** Referencia a la colección de productos del usuario. */
export const productsRef = (uid) => collection(db, ...paths.products(uid));

/** Referencia a la subcolección de imágenes de un producto. */
const imagesRef = (uid, productId) => collection(db, ...paths.images(uid, productId));

/**
 * Crea un producto y sus imágenes en una sola operación (writeBatch):
 * o se guarda todo, o no se guarda nada.
 */
export async function createProduct(uid, data, images) {
    const batch = writeBatch(db);
    const productDoc = doc(productsRef(uid));          // genera un id nuevo
    batch.set(productDoc, { ...data, fechaCreacion: serverTimestamp() });
    images.forEach((img, i) => {
        batch.set(doc(imagesRef(uid, productDoc.id)), {
            data: img.data,
            nombreArchivo: img.nombreArchivo,
            orden: i
        });
    });
    await batch.commit();
    return productDoc.id;
}

/**
 * Actualiza los datos de un producto.
 * Si llegan imágenes nuevas, borra las anteriores y guarda las nuevas.
 * Si images es null, las imágenes actuales se conservan.
 */
export async function updateProduct(uid, productId, data, images = null) {
    const batch = writeBatch(db);
    batch.update(doc(db, ...paths.products(uid), productId), {
        ...data,
        fechaActualizacion: serverTimestamp()
    });
    if (images) {
        const old = await getDocs(imagesRef(uid, productId));
        old.forEach((d) => batch.delete(d.ref));
        images.forEach((img, i) => {
            batch.set(doc(imagesRef(uid, productId)), {
                data: img.data,
                nombreArchivo: img.nombreArchivo,
                orden: i
            });
        });
    }
    await batch.commit();
}

/** Elimina un producto junto con todas sus imágenes. */
export async function deleteProduct(uid, productId) {
    const batch = writeBatch(db);
    const imgs = await getDocs(imagesRef(uid, productId));
    imgs.forEach((d) => batch.delete(d.ref));             // primero las imágenes
    batch.delete(doc(db, ...paths.products(uid), productId)); // luego el producto
    await batch.commit();
}

/** Lee un producto (lectura única con getDoc). */
export async function getProduct(uid, productId) {
    const snap = await getDoc(doc(db, ...paths.products(uid), productId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Lee las imágenes de un producto ordenadas por el campo "orden". */
export async function getImages(uid, productId) {
    const snap = await getDocs(query(imagesRef(uid, productId), orderBy("orden")));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
