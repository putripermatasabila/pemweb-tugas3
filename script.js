const products = [
  { id: crypto.randomUUID(), name: "Pulpen", price: 5000 },
  { id: crypto.randomUUID(), name: "Buku Tulis", price: 12000 },
  { id: crypto.randomUUID(), name: "Spidol", price: 8000 },
  { id: crypto.randomUUID(), name: "Penggaris", price: 6000 },
  { id: crypto.randomUUID(), name: "Penghapus", price: 3000 }
];

const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");

function formatPrice(price) {
  return `Rp${Number(price).toLocaleString("id-ID")}`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

function renderProducts(items) {
  productCount.textContent = `${items.length} produk`;

  productList.innerHTML = items
    .map(
      (product) => `
        <article class="product-card">
          <h2>${escapeHtml(product.name)}</h2>
          <p class="product-price">${formatPrice(product.price)}</p>
          <div class="card-actions">
            <button class="edit-button" type="button" data-action="edit" data-id="${product.id}">Edit</button>
            <button class="delete-button" type="button" data-action="delete" data-id="${product.id}">Hapus</button>
          </div>
        </article>
      `
    )
    .join("");
}

renderProducts(products);
