/**
 * productDelete.js - Elimina un producto y todas sus imágenes.
 */
import { state } from "./state.js";
import { deleteProduct } from "./productService.js";
import { resetProductForm } from "./productForm.js";
import { showMessage } from "./showMessage.js";

const list = document.querySelector("#product-list");

list.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action='delete']");
    if (!btn || !state.uid) return;

    const name = btn.closest(".card").querySelector(".card-title").textContent;
    if (!confirm(`¿Eliminar "${name}" y todas sus imágenes?`)) return;

    btn.disabled = true;
    try {
        await deleteProduct(state.uid, btn.dataset.id);
        if (state.editingId === btn.dataset.id) resetProductForm(); // si se estaba editando, limpia el formulario
        showMessage("Producto eliminado.");
    } catch (err) {
        console.error(err);
        btn.disabled = false;
        showMessage("No se pudo eliminar el producto.", "error");
    }
});
