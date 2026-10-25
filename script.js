
const products = [
  {
    id: 1,
    name: "Starter Pack",
    category: "DIGITAL ESSENTIALS",
    description: "A simple starting point for your digital collection.",
    price: 5.00,
    symbol: "S",
    color: "#bd91ff",
    glow: "#8852dd40",
    badge: "POPULAR"
  },
  {
    id: 2,
    name: "Creator Pack",
    category: "CREATOR TOOLS",
    description: "A curated pack for your next creative project.",
    price: 9.00,
    symbol: "C",
    color: "#81d9ff",
    glow: "#349edc35",
    badge: "FEATURED"
  },
  {
    id: 3,
    name: "Pro Collection",
    category: "PREMIUM DIGITAL",
    description: "Explore more options for your digital workflow.",
    price: 15.00,
    symbol: "P",
    color: "#ffc783",
    glow: "#d48d3635",
    badge: "PREMIUM"
  },
  {
    id: 4,
    name: "Utility Bundle",
    category: "DIGITAL ESSENTIALS",
    description: "A handy collection for everyday digital tasks.",
    price: 7.50,
    symbol: "U",
    color: "#8ee8b2",
    glow: "#45b77a30",
    badge: "NEW"
  },
  {
    id: 5,
    name: "Studio Pack",
    category: "CREATOR TOOLS",
    description: "Tools and resources for your creative workspace.",
    price: 12.00,
    symbol: "W",
    color: "#f3a4d5",
    glow: "#c74b9635",
    badge: "LIMITED"
  },
  {
    id: 6,
    name: "Ultimate Bundle",
    category: "PREMIUM DIGITAL",
    description: "A complete demo bundle for the premium collection.",
    price: 20.00,
    symbol: "✦",
    color: "#c2b7ff",
    glow: "#7753dc40",
    badge: "ULTIMATE"
  }
];

// Contoh produk dan harga. Ganti dengan data produk milik Anda.
const cart = new Map();

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");
const emptyState = document.getElementById("emptyState");

let toastTimer;

function formatPrice(price) {
  return "$" + price.toFixed(2);
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const sort = sortSelect.value;

  let filtered = products.filter(product =>
    `${product.name} ${product.category} ${product.description}`
      .toLowerCase()
      .includes(query)
  );

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-visual"
        style="--glow:${product.glow};--product-color:${product.color}">
        <span class="product-badge">${product.badge}</span>
        <span class="product-symbol">${product.symbol}</span>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-button" data-add="${product.id}">
            + Add to cart
          </button>
        </div>
      </div>
    </article>
  `).join("");

  emptyState.hidden = filtered.length > 0;
  document.getElementById("productTotal").textContent =
    `${String(filtered.length).padStart(2, "0")} PRODUCTS`;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function updateCart() {
  let total = 0;

  for (const quantity of cart.values()) {
    total += quantity;
  }

  cartCount.textContent = total;
}

grid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const id = Number(button.dataset.add);
  const product = products.find(item => item.id === id);
  if (!product) return;

  cart.set(id, (cart.get(id) || 0) + 1);
  updateCart();
  showToast(`${product.name} added to cart.`);
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

document.getElementById("cartButton").addEventListener("click", () => {
  if (cart.size === 0) {
    showToast("Your cart is empty.");
    return;
  }

  const lines = [];
  let total = 0;

  for (const [id, quantity] of cart.entries()) {
    const product = products.find(item => item.id === id);
    if (!product) continue;

    const subtotal = product.price * quantity;
    total += subtotal;
    lines.push(`${product.name} × ${quantity} — ${formatPrice(subtotal)}`);
  }

  window.alert(
    "YOUR CART\n\n" +
    lines.join("\n") +
    "\n\nTotal: " + formatPrice(total) +
    "\n\nDemo only. Checkout is not connected to a payment system."
  );
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("open");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
