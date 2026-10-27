/**
 * productEdit.js - Al dar clic en "Editar", carga el producto en el formulario
 * y muestra sus imágenes actuales.
 */
import { state } from "./state.js";
import { getProduct, getImages } from "./productService.js";
import { fillProductForm } from "./productForm.js";
import { renderPreview, clearPreview } from "./imagePreview.js";
import { showMessage } from "./showMessage.js";

const list = document.querySelector("#product-list");

// Delegación de eventos: un solo listener para todos los botones "Editar" de la lista
list.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action='edit']");
    if (!btn || !state.uid) return;

    try {
        const product = await getProduct(state.uid, btn.dataset.id);
        if (!product) return showMessage("El producto ya no existe.", "error");
        clearPreview();
        fillProductForm(product);
        const images = await getImages(state.uid, product.id);
        renderPreview(images, "Imágenes actuales");
    } catch (err) {
        console.error(err);
        showMessage("No se pudo cargar el producto.", "error");
    }
});
