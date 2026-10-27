/**
 * imageUtils.js - Validación, redimensionado y compresión de imágenes en el navegador.
 * Firestore no guarda archivos, así que cada imagen se convierte a texto Base64 (Data URL)
 * y se mantiene por debajo de ~300 KB para no acercarse al límite de 1 MiB por documento.
 */

export const MIN_IMAGES = 1;
export const MAX_IMAGES = 5;
const MAX_WIDTH = 800;                 // ancho máximo en píxeles
const MAX_BYTES = 300 * 1024;          // ~300 KB por imagen ya en Base64
const MAX_ORIGINAL_BYTES = 15 * 1024 * 1024; // no aceptamos archivos originales de más de 15 MB

/**
 * Revisa la cantidad, el tipo y el peso de los archivos elegidos.
 * @param {FileList|File[]} files
 * @param {boolean} allowEmpty - true al editar (0 archivos = conservar las imágenes actuales)
 * @returns {string|null} mensaje de error, o null si todo está bien
 */
export function validateFiles(files, allowEmpty = false) {
    const list = Array.from(files);

    if (list.length === 0 && !allowEmpty) {
        return `Debes agregar al menos ${MIN_IMAGES} imagen.`;
    }
    if (list.length > MAX_IMAGES) {
        return `Solo puedes subir un máximo de ${MAX_IMAGES} imágenes (elegiste ${list.length}).`;
    }
    const notImage = list.find((f) => !f.type.startsWith("image/"));
    if (notImage) {
        return `"${notImage.name}" no es una imagen. Solo se permiten archivos de imagen (JPG, PNG, WebP...).`;
    }
    const tooBig = list.find((f) => f.size > MAX_ORIGINAL_BYTES);
    if (tooBig) {
        return `"${tooBig.name}" pesa demasiado (máximo 15 MB por archivo).`;
    }
    return null;
}

/** Lee un archivo y lo carga en un elemento <img> (usa FileReader + Data URL). */
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`No se pudo leer la imagen "${file.name}".`));
            img.src = reader.result;
        };
        reader.onerror = () => reject(new Error(`No se pudo leer el archivo "${file.name}".`));
        reader.readAsDataURL(file);
    });
}

/**
 * Redimensiona (máx. 800 px de ancho) y comprime a JPEG con <canvas>.
 * Si sigue pesando más de 300 KB, baja la calidad y luego el tamaño hasta que quepa.
 * @returns {Promise<{data: string, nombreArchivo: string}>}
 */
export async function compressImage(file) {
    const img = await loadImage(file);
    let width = Math.min(MAX_WIDTH, img.width);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    for (let attempt = 0; attempt < 6; attempt++) {
        const height = Math.round(img.height * (width / img.width));
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = "#ffffff";            // fondo blanco (JPEG no tiene transparencia)
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Prueba calidades de mayor a menor
        for (const quality of [0.8, 0.7, 0.6, 0.5, 0.4]) {
            const data = canvas.toDataURL("image/jpeg", quality);
            if (data.length <= MAX_BYTES) {
                return { data, nombreArchivo: file.name };
            }
        }
        width = Math.round(width * 0.8);      // aún pesa mucho: reducimos 20 % el tamaño
    }
    throw new Error(`No se pudo comprimir "${file.name}" por debajo de 300 KB.`);
}

/** Comprime varias imágenes en orden. */
export async function compressAll(files) {
    const result = [];
    for (const file of Array.from(files)) {
        result.push(await compressImage(file));
    }
    return result;
}

/** Tamaño aproximado en KB de un Data URL (para mostrarlo en la vista previa). */
export function sizeKB(dataUrl) {
    return Math.round(dataUrl.length / 1024);
}
