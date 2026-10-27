/**
 * productList.js - Lista los productos del usuario en tiempo real.
 * onSnapshot escucha users/{uid}/products: cada vez que se crea, edita o elimina
 * un producto, Firestore avisa y la lista se vuelve a dibujar sola.
 */
import { onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { productsRef, getImages } from "./productService.js";
import { state } from "./state.js";
import { showMessage } from "./showMessage.js";

const list = document.querySelector("#product-list");
const counter = document.querySelector("#product-count");

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

/** Empieza a escuchar los productos del usuario indicado. */
export function startProductsListener(uid) {
    stopProductsListener();
    const q = query(productsRef(uid), orderBy("fechaCreacion", "desc"));
    state.unsubscribe = onSnapshot(q, async (snapshot) => {
        const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Para cada producto se leen sus imágenes (subcolección)
        const withImages = await Promise.all(
            products.map(async (p) => ({ ...p, images: await getImages(uid, p.id) }))
        );
        if (state.uid === uid) renderProducts(withImages); // evita pintar datos si ya cerró sesión
    }, (err) => {
        console.error(err);
        showMessage("No se pudieron cargar los productos.", "error");
    });
}

/** Deja de escuchar y limpia la lista (se usa al cerrar sesión). */
export function stopProductsListener() {
    if (state.unsubscribe) {
        state.unsubscribe();
        state.unsubscribe = null;
    }
    list.innerHTML = "";
    counter.textContent = "";
}

/** Dibuja las tarjetas de productos. Se usa textContent para no inyectar HTML del usuario. */
function renderProducts(products) {
    list.innerHTML = "";
    counter.textContent = `(${products.length})`;

    if (products.length === 0) {
        const p = document.createElement("p");
        p.className = "text-secondary";
        p.textContent = "Aún no tienes productos. Registra el primero con el formulario.";
        list.append(p);
        return;
    }

    products.forEach((p) => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";

        const card = document.createElement("div");
        card.className = "card h-100 bg-dark text-light border-secondary";

        // Imágenes: la primera grande y el resto como miniaturas
        const main = document.createElement("img");
        main.className = "card-img-top product-main-img";
        main.alt = p.nombre;
        if (p.images[0]) main.src = p.images[0].data;

        const thumbs = document.createElement("div");
        thumbs.className = "d-flex gap-1 p-2 flex-wrap";
        p.images.forEach((img) => {
            const t = document.createElement("img");
            t.src = img.data;
            t.alt = img.nombreArchivo;
            t.className = "product-thumb";
            t.addEventListener("click", () => (main.src = img.data));
            thumbs.append(t);
        });

        const body = document.createElement("div");
        body.className = "card-body";
        const h = document.createElement("h5");
        h.className = "card-title";
        h.textContent = p.nombre;
        const cat = document.createElement("span");
        cat.className = "badge text-bg-secondary mb-2";
        cat.textContent = p.categoria;
        const desc = document.createElement("p");
        desc.className = "card-text small";
        desc.textContent = p.descripcion;
        const info = document.createElement("p");
        info.className = "mb-0";
        info.textContent = `${money.format(p.precio)} · Existencias: ${p.existencias}`;
        body.append(h, cat, desc, info);

        const footer = document.createElement("div");
        footer.className = "card-footer d-flex gap-2 border-secondary";
        const edit = document.createElement("button");
        edit.className = "btn btn-sm btn-outline-light";
        edit.textContent = "Editar";
        edit.dataset.action = "edit";
        edit.dataset.id = p.id;
        const del = document.createElement("button");
        del.className = "btn btn-sm btn-outline-danger";
        del.textContent = "Eliminar";
        del.dataset.action = "delete";
        del.dataset.id = p.id;
        footer.append(edit, del);

        card.append(main, thumbs, body, footer);
        col.append(card);
        list.append(col);
    });
}
