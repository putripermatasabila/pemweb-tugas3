const defaultProducts = [
  { id: crypto.randomUUID(), name: "Pulpen", price: 5000 },
  { id: crypto.randomUUID(), name: "Buku Tulis", price: 12000 },
  { id: crypto.randomUUID(), name: "Spidol", price: 8000 },
  { id: crypto.randomUUID(), name: "Penggaris", price: 6000 },
  { id: crypto.randomUUID(), name: "Penghapus", price: 3000 }
];

const storageKey = "manajemen-produk";
let products = readProducts();

const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");
const searchInput = document.querySelector("#search-input");
const modalBackdrop = document.querySelector("#modal-backdrop");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const productForm = document.querySelector("#product-form");
const productId = document.querySelector("#product-id");
const productName = document.querySelector("#product-name");
const productPrice = document.querySelector("#product-price");
const submitButton = document.querySelector("#submit-button");

function readProducts() {
  const savedProducts = localStorage.getItem(storageKey);

  if (!savedProducts) {
    return [...defaultProducts];
  }

  try {
    const parsedProducts = JSON.parse(savedProducts);
    return Array.isArray(parsedProducts) ? parsedProducts : [...defaultProducts];
  } catch {
    return [...defaultProducts];
  }
}

function saveProducts() {
  localStorage.setItem(storageKey, JSON.stringify(products));
}

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

function renderProducts(items = products) {
  productCount.textContent = `${items.length} produk`;

  if (items.length === 0) {
    productList.innerHTML = '<p class="empty-state">Produk tidak ditemukan.</p>';
    return;
  }

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

function openModal(product = null) {
  const isEditing = Boolean(product);
  modalTitle.textContent = isEditing ? "Edit Produk" : "Tambah Produk";
  modalDescription.textContent = isEditing
    ? "Perbarui informasi produk yang dipilih."
    : "Masukkan informasi produk yang baru.";
  submitButton.textContent = isEditing ? "Simpan Perubahan" : "Simpan Produk";
  productId.value = product?.id || "";
  productName.value = product?.name || "";
  productPrice.value = product?.price || "";
  modalBackdrop.hidden = false;
  productName.focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  productForm.reset();
}

document.querySelector("#add-product-button").addEventListener("click", () => openModal());
document.querySelector("#modal-close").addEventListener("click", closeModal);
document.querySelector("#cancel-button").addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalBackdrop.hidden) {
    closeModal();
  }
});

productList.addEventListener("click", (event) => {
  const button = event.target.closest('button[data-action="edit"]');
  if (!button) {
    return;
  }

  const product = products.find((item) => item.id === button.dataset.id);
  if (product) {
    openModal(product);
  }
});

productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = productName.value.trim();
  const price = Number(productPrice.value);

  if (!name || !Number.isFinite(price) || price < 0) {
    return;
  }

  if (productId.value) {
    products = products.map((product) =>
      product.id === productId.value ? { ...product, name, price } : product
    );
  } else {
    products.push({ id: crypto.randomUUID(), name, price });
  }

  saveProducts();
  renderProducts();
  closeModal();
});

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(keyword)
  );
  renderProducts(filteredProducts);
});

renderProducts();
