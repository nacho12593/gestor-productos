/**
 * imagePreview.js - Valida las imágenes en cuanto el usuario las elige,
 * las comprime y muestra una vista previa antes de guardar.
 */
import { validateFiles, compressAll, sizeKB } from "./imageUtils.js";
import { state } from "./state.js";
import { showMessage } from "./showMessage.js";

const input = document.querySelector("#product-images");
const preview = document.querySelector("#image-preview");
const hint = document.querySelector("#image-hint");

input.addEventListener("change", async () => {
    state.processedImages = [];
    preview.innerHTML = "";

    // Al editar se permite 0 imágenes nuevas (se conservan las actuales)
    const error = validateFiles(input.files, state.editingId !== null);
    if (error) {
        showMessage(error, "error");
        input.value = "";              // limpia la selección inválida
        return;
    }
    if (input.files.length === 0) return;

    hint.textContent = "Procesando imágenes...";
    try {
        state.processedImages = await compressAll(input.files);
        renderPreview(state.processedImages, "Nuevas imágenes (vista previa)");
    } catch (err) {
        console.error(err);
        showMessage(err.message, "error");
        input.value = "";
        hint.textContent = "";
    }
});

/**
 * Dibuja miniaturas de las imágenes.
 * @param {{data: string, nombreArchivo: string}[]} images
 * @param {string} title - texto que se muestra arriba de las miniaturas
 */
export function renderPreview(images, title) {
    preview.innerHTML = "";
    hint.textContent = images.length ? `${title}: ${images.length} de 5` : "";
    images.forEach((img, i) => {
        const fig = document.createElement("figure");
        fig.className = "preview-item";
        const el = document.createElement("img");
        el.src = img.data;
        el.alt = img.nombreArchivo;
        const cap = document.createElement("figcaption");
        cap.textContent = `${i + 1}. ${sizeKB(img.data)} KB`;
        fig.append(el, cap);
        preview.append(fig);
    });
}

/** Limpia la selección y la vista previa. */
export function clearPreview() {
    input.value = "";
    preview.innerHTML = "";
    hint.textContent = "";
    state.processedImages = [];
}
