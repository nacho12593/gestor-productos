/**
 * productForm.js - Formulario para crear y editar productos.
 * Valida los campos y las imágenes, y llama a productService para guardar.
 */
import { state } from "./state.js";
import { createProduct, updateProduct } from "./productService.js";
import { validateFiles } from "./imageUtils.js";
import { clearPreview } from "./imagePreview.js";
import { showMessage } from "./showMessage.js";

const form = document.querySelector("#product-form");
const title = document.querySelector("#product-form-title");
const submitBtn = document.querySelector("#product-submit");
const cancelBtn = document.querySelector("#product-cancel");
const imagesInput = document.querySelector("#product-images");
const imagesLabel = document.querySelector("#product-images-label");

/** Lee y valida los campos de texto/número. Devuelve {data} o {error}. */
function readFields() {
    const nombre = form["product-name"].value.trim();
    const descripcion = form["product-description"].value.trim();
    const categoria = form["product-category"].value;
    const precio = Number(form["product-price"].value);
    const existencias = Number(form["product-stock"].value);

    if (!nombre) return { error: "Escribe el nombre del producto." };
    if (!descripcion) return { error: "Escribe una descripción." };
    if (!categoria) return { error: "Elige una categoría." };
    if (!Number.isFinite(precio) || precio < 0) return { error: "El precio debe ser un número mayor o igual a 0." };
    if (!Number.isInteger(existencias) || existencias < 0) return { error: "Las existencias deben ser un número entero mayor o igual a 0." };

    return { data: { nombre, descripcion, categoria, precio, existencias } };
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!state.uid) return showMessage("Inicia sesión para guardar productos.", "error");

    const { data, error } = readFields();
    if (error) return showMessage(error, "error");

    const editing = state.editingId !== null;

    // Validación de imágenes (también se valida al elegirlas, pero revisamos de nuevo)
    const imgError = validateFiles(imagesInput.files, editing);
    if (imgError) return showMessage(imgError, "error");
    if (imagesInput.files.length > 0 && state.processedImages.length === 0) {
        return showMessage("Espera a que terminen de procesarse las imágenes.", "error");
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Guardando...";
    try {
        if (editing) {
            const newImages = state.processedImages.length ? state.processedImages : null;
            await updateProduct(state.uid, state.editingId, data, newImages);
            showMessage("Producto actualizado.");
        } else {
            await createProduct(state.uid, data, state.processedImages);
            showMessage("Producto guardado.");
        }
        resetProductForm();
    } catch (err) {
        console.error(err);
        showMessage("No se pudo guardar el producto. Revisa tu conexión e inténtalo de nuevo.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = state.editingId ? "Actualizar producto" : "Guardar producto";
    }
});

cancelBtn.addEventListener("click", () => resetProductForm());

/** Deja el formulario vacío y en modo "crear". */
export function resetProductForm() {
    form.reset();
    clearPreview();
    state.editingId = null;
    title.textContent = "Nuevo producto";
    submitBtn.textContent = "Guardar producto";
    cancelBtn.classList.add("d-none");
    imagesLabel.textContent = "Imágenes (mínimo 1, máximo 5):";
}

/** Cambia el formulario a modo "editar" con los datos de un producto. */
export function fillProductForm(product) {
    form["product-name"].value = product.nombre;
    form["product-description"].value = product.descripcion;
    form["product-category"].value = product.categoria;
    form["product-price"].value = product.precio;
    form["product-stock"].value = product.existencias;
    state.editingId = product.id;
    title.textContent = `Editando: ${product.nombre}`;
    submitBtn.textContent = "Actualizar producto";
    cancelBtn.classList.remove("d-none");
    imagesLabel.textContent = "Imágenes nuevas (opcional, de 1 a 5; reemplazan a las actuales):";
    form.scrollIntoView({ behavior: "smooth" });
}
