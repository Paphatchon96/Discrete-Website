/* ===========================================================
   SETCORE — product data, cart, filtering, and checkout logic
   =========================================================== */

/* ---------- PRODUCT DATA (real, currently-available PC parts) ---------- */
const PRODUCTS = [
  { id:1,  name:"GeForce RTX 4070 Super",     category:"GPU",         brand:"NVIDIA",         price:599, oldPrice:649, inStock:true,  isNew:false, onSale:true,  rating:4.8, icon:"gpu",  tags:["12GB GDDR6X","PCIe 4.0","DLSS 3.5","Ray Tracing","3-Year Warranty"] },
  { id:2,  name:"Radeon RX 7800 XT",          category:"GPU",         brand:"AMD",            price:479, oldPrice:null,inStock:true,  isNew:true,  onSale:false, rating:4.5, icon:"gpu",  tags:["16GB GDDR6","PCIe 4.0","FSR 3","Ray Tracing","2-Year Warranty"] },
  { id:3,  name:"Ryzen 7 7800X3D",            category:"CPU",         brand:"AMD",            price:359, oldPrice:null,inStock:true,  isNew:true,  onSale:false, rating:4.9, icon:"cpu",  tags:["8-Core","5.0GHz Boost","3D V-Cache","AM5 Socket","3-Year Warranty"] },
  { id:4,  name:"Core i5-14600K",             category:"CPU",         brand:"Intel",          price:319, oldPrice:349, inStock:true,  isNew:false, onSale:true,  rating:4.6, icon:"cpu",  tags:["14-Core","5.3GHz Boost","LGA1700","Unlocked","1-Year Warranty"] },
  { id:5,  name:"Vengeance DDR5 32GB Kit",    category:"RAM",         brand:"Corsair",        price:109, oldPrice:null,inStock:true,  isNew:false, onSale:false, rating:4.7, icon:"ram",  tags:["DDR5-6000","2x16GB","XMP 3.0","Lifetime Warranty"] },
  { id:6,  name:"Trident Z5 RGB DDR5 32GB",   category:"RAM",         brand:"G.Skill",        price:129, oldPrice:159, inStock:true,  isNew:false, onSale:true,  rating:4.6, icon:"ram",  tags:["DDR5-6400","2x16GB","RGB Lighting","Lifetime Warranty"] },
  { id:7,  name:"990 Pro 2TB NVMe SSD",       category:"Storage",     brand:"Samsung",        price:169, oldPrice:null,inStock:true,  isNew:true,  onSale:false, rating:4.9, icon:"ssd",  tags:["PCIe 4.0","7,450 MB/s","5-Year Warranty"] },
  { id:8,  name:"Black SN850X 1TB NVMe SSD",  category:"Storage",     brand:"Western Digital",price:89,  oldPrice:null,inStock:true,  isNew:false, onSale:false, rating:4.7, icon:"ssd",  tags:["PCIe 4.0","7,300 MB/s","5-Year Warranty"] },
  { id:9,  name:"ROG Strix B650E-F Gaming",   category:"Motherboard", brand:"ASUS",           price:259, oldPrice:null,inStock:true,  isNew:false, onSale:false, rating:4.5, icon:"mobo", tags:["AM5 Socket","DDR5","PCIe 5.0","Wi-Fi 6E","3-Year Warranty"] },
  { id:10, name:"PRO Z790-A WiFi",            category:"Motherboard", brand:"MSI",            price:219, oldPrice:null,inStock:false, isNew:false, onSale:false, rating:4.3, icon:"mobo", tags:["LGA1700","DDR5","PCIe 5.0","Wi-Fi 6E","3-Year Warranty"] },
  { id:11, name:"RM850x",                     category:"PSU",         brand:"Corsair",        price:139, oldPrice:159, inStock:true,  isNew:false, onSale:true,  rating:4.8, icon:"psu",  tags:["850W","80+ Gold","Fully Modular","10-Year Warranty"] },
  { id:12, name:"Focus GX-750",               category:"PSU",         brand:"Seasonic",       price:109, oldPrice:null,inStock:true,  isNew:false, onSale:false, rating:4.6, icon:"psu",  tags:["750W","80+ Gold","Fully Modular","10-Year Warranty"] },
  { id:13, name:"Kraken Elite 360",           category:"Cooling",     brand:"NZXT",           price:279, oldPrice:null,inStock:true,  isNew:true,  onSale:false, rating:4.4, icon:"cool", tags:["360mm AIO","LCD Display","RGB Lighting","6-Year Warranty"] },
  { id:14, name:"NH-D15",                     category:"Cooling",     brand:"Noctua",         price:109, oldPrice:null,inStock:true,  isNew:false, onSale:false, rating:4.9, icon:"cool", tags:["Dual-Tower Air","2x140mm Fans","Near-Silent","6-Year Warranty"] },
  { id:15, name:"North",                      category:"Case",        brand:"Fractal Design", price:159, oldPrice:null,inStock:true,  isNew:false, onSale:false, rating:4.7, icon:"case", tags:["Mid Tower ATX","Walnut Front Panel","Mesh Airflow","2-Year Warranty"] },
  { id:16, name:"Lancool 216",                category:"Case",        brand:"Lian Li",        price:109, oldPrice:129, inStock:true,  isNew:false, onSale:true,  rating:4.5, icon:"case", tags:["Mid Tower ATX","High-Airflow Mesh","3 ARGB Fans Included","2-Year Warranty"] },
];

const ALL_CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];
const ALL_BRANDS     = [...new Set(PRODUCTS.map(p => p.brand))].sort();
const MAX_PRICE      = Math.max(...PRODUCTS.map(p => p.price));

/* ---------- small helpers ---------- */
function formatPrice(n){ return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 0 }); }

function starString(rating){
  const full = Math.round(rating);
  let out = "";
  for (let i = 1; i <= 5; i++) out += (i <= full) ? "\u2605" : "\u2606";
  return out;
}

function findProduct(id){ return PRODUCTS.find(p => p.id === Number(id)); }

/* ---------- category icon artwork (flat, minimal, no stock photography) ---------- */
const ICONS = {
  gpu:  '<svg viewBox="0 0 64 64" fill="none"><rect x="8" y="20" width="48" height="26" rx="4" stroke="currentColor" stroke-width="2.5"/><circle cx="20" cy="33" r="6" stroke="currentColor" stroke-width="2.5"/><circle cx="38" cy="33" r="6" stroke="currentColor" stroke-width="2.5"/><path d="M8 20V15a3 3 0 0 1 3-3h9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M50 46v6M18 46v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  cpu:  '<svg viewBox="0 0 64 64" fill="none"><rect x="16" y="16" width="32" height="32" rx="3" stroke="currentColor" stroke-width="2.5"/><rect x="24" y="24" width="16" height="16" rx="1.5" stroke="currentColor" stroke-width="2.5"/><path d="M24 8v8M32 8v8M40 8v8M24 48v8M32 48v8M40 48v8M8 24h8M8 32h8M8 40h8M48 24h8M48 32h8M48 40h8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  ram:  '<svg viewBox="0 0 64 64" fill="none"><rect x="10" y="18" width="44" height="30" rx="2.5" stroke="currentColor" stroke-width="2.5"/><path d="M18 18v-4a2 2 0 0 1 2-2h4M30 18v-4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4M44 18v-4a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M18 48v4M26 48v4M34 48v4M42 48v4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  ssd:  '<svg viewBox="0 0 64 64" fill="none"><rect x="10" y="14" width="44" height="36" rx="3" stroke="currentColor" stroke-width="2.5"/><circle cx="20" cy="24" r="2.4" fill="currentColor"/><path d="M18 36h28M18 42h18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  mobo: '<svg viewBox="0 0 64 64" fill="none"><rect x="9" y="9" width="46" height="46" rx="3" stroke="currentColor" stroke-width="2.5"/><rect x="17" y="17" width="14" height="14" rx="1.5" stroke="currentColor" stroke-width="2.5"/><path d="M38 17h9M38 24h9M17 38h9v9h-9zM33 40h13M33 46h13" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  psu:  '<svg viewBox="0 0 64 64" fill="none"><rect x="10" y="16" width="44" height="32" rx="3" stroke="currentColor" stroke-width="2.5"/><circle cx="32" cy="32" r="9" stroke="currentColor" stroke-width="2.5"/><path d="M32 25v4M32 35v4M25 32h4M35 32h4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  cool: '<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="20" stroke="currentColor" stroke-width="2.5"/><path d="M32 32c4-9 4-16-1-19M32 32c9 3 16 1 18-5M32 32c-4 9-4 16 1 19M32 32c-9-3-16-1-18 5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="32" r="3" fill="currentColor"/></svg>',
  case: '<svg viewBox="0 0 64 64" fill="none"><rect x="16" y="7" width="32" height="50" rx="3" stroke="currentColor" stroke-width="2.5"/><path d="M23 16h4M23 22h4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="34" cy="41" r="8" stroke="currentColor" stroke-width="2.5"/></svg>',
};

/* BOOKMARK: BOOLEAN LOGIC
   Cart state uses boolean/conditional checks internally; no lesson UI is exposed.
*/
/* =========================================================
   CART — persisted as { productId: quantity }
   ========================================================= */
const CART_KEY = "setcore_cart_v2";

function getCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch { return {}; }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function cartQty(id){ return getCart()[id] || 0; }
function addToCart(id, qty = 1){
  const cart = getCart();
  cart[id] = (cart[id] || 0) + qty;
  saveCart(cart);
  return cart[id];
}
function setCartQty(id, qty){
  const cart = getCart();
  if (qty <= 0) delete cart[id];
  else cart[id] = qty;
  saveCart(cart);
  return cart[id] || 0;
}
function removeFromCart(id){
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
}
function cartCount(){
  return Object.values(getCart()).reduce((sum, q) => sum + q, 0);
}
function cartLines(){
  return Object.entries(getCart())
    .map(([id, qty]) => ({ product: findProduct(id), qty }))
    .filter(line => line.product);
}
function cartSubtotal(){
  return cartLines().reduce((sum, l) => sum + l.product.price * l.qty, 0);
}
function updateCartBadge(){
  document.querySelectorAll("[data-cart-count]").forEach(el => { el.textContent = cartCount(); });
}

/* BOOKMARK: SET THEORY
   Set-based filtering is represented by category/brand selections below.
   The mathematical explanation is intentionally hidden from the interface.
*/
/* =========================================================
   FILTERING (products.html)
   ========================================================= */
function filterProducts({ categories, brands, stockOnly, maxPrice, saleOnly }){
  const catActive   = categories.size > 0;
  const brandActive = brands.size > 0;

  return PRODUCTS.filter(p => {
    if (catActive && !categories.has(p.category)) return false;
    if (brandActive && !brands.has(p.brand)) return false;
    if (stockOnly && !p.inStock) return false;
    if (saleOnly && !p.onSale) return false;
    if (p.price > maxPrice) return false;
    return true;
  });
}

function featuredProducts(){
  return PRODUCTS.filter(p => p.onSale || p.isNew);
}

function sortProducts(list, mode){
  const copy = [...list];
  if (mode === "price-asc") copy.sort((a, b) => a.price - b.price);
  else if (mode === "price-desc") copy.sort((a, b) => b.price - a.price);
  else if (mode === "rating-desc") copy.sort((a, b) => b.rating - a.rating);
  else copy.sort((a, b) => a.id - b.id);
  return copy;
}

/* =========================================================
   CARD RENDERING (shared by index + products pages)
   ========================================================= */
function cartControlHTML(p){
  const qty = cartQty(p.id);
  if (!p.inStock) {
    return `<button class="btn btn-block" disabled>Out of stock</button>`;
  }
  if (qty > 0) {
    return `
      <div class="qty-stepper" data-qty-for="${p.id}">
        <button type="button" class="qty-btn" data-step="-1" aria-label="Decrease quantity">&minus;</button>
        <span class="qty-value">${qty}</span>
        <button type="button" class="qty-btn" data-step="1" aria-label="Increase quantity">+</button>
      </div>`;
  }
  return `<button type="button" class="btn btn-block" data-add-id="${p.id}">Add to cart</button>`;
}

function productCard(p, opts = {}){

  let mediaBadge = "";
  if (!p.inStock) mediaBadge = `<span class="badge badge-out">Out of stock</span>`;
  else if (p.onSale) mediaBadge = `<span class="badge badge-sale">Sale</span>`;
  else if (p.isNew) mediaBadge = `<span class="badge badge-new">New</span>`;

  const priceRow = p.oldPrice
    ? `<span class="price">${formatPrice(p.price)}</span><span class="price-old">${formatPrice(p.oldPrice)}</span>`
    : `<span class="price">${formatPrice(p.price)}</span>`;


  return `
  <article class="card" data-product-id="${p.id}">
    <div class="card-media icon-${p.icon}">
      ${mediaBadge}
      <div class="card-icon">${ICONS[p.icon] || ""}</div>
    </div>
    <div class="card-body">
      <div class="card-cat">${p.category} &middot; ${p.brand}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-rating">${starString(p.rating)} <span class="rating-num">${p.rating.toFixed(1)}</span></div>
      <div class="card-price-row">${priceRow}</div>
      <div class="card-actions" data-cart-control="${p.id}">${cartControlHTML(p)}</div>
    </div>
  </article>`;
}

function refreshCartControl(id){
  const holder = document.querySelector(`[data-cart-control="${id}"]`);
  if (!holder) return;
  const p = findProduct(id);
  holder.innerHTML = cartControlHTML(p);
  bindCartControl(holder, p);
}

function bindCartControl(holder, p){
  const addBtn = holder.querySelector("[data-add-id]");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      addToCart(p.id, 1);
      refreshCartControl(p.id);
    });
  }
  const stepBtns = holder.querySelectorAll("[data-step]");
  stepBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const delta = Number(btn.dataset.step);
      setCartQty(p.id, cartQty(p.id) + delta);
      refreshCartControl(p.id);
    });
  });
}

function bindCardEvents(container){
  container.querySelectorAll("[data-cart-control]").forEach(holder => {
    const id = Number(holder.dataset.cartControl);
    bindCartControl(holder, findProduct(id));
  });
}

/* ---------- tiny toast for inline messages (replaces alert()) ---------- */
function showToast(message){
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* BOOKMARK: LOGIC
   Page initialization is controlled with conditional checks for whichever page is loaded.
*/
/* ---------- run on every page ---------- */
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* ===================== INDEX PAGE ===================== */
  const featuredGrid = document.getElementById("featured-grid");
  if (featuredGrid) {
    featuredGrid.innerHTML = featuredProducts().map(p => productCard(p)).join("");
    bindCardEvents(featuredGrid);
  }

  const chipsWrap = document.getElementById("category-chips");
  if (chipsWrap) {
    chipsWrap.innerHTML = ALL_CATEGORIES.map(c => `
      <a class="cat-chip" href="products.html?category=${encodeURIComponent(c)}">
        <span class="cat-chip-icon">${ICONS[PRODUCTS.find(p => p.category === c).icon]}</span>
        ${c}
      </a>`
    ).join("");
  }

  /* ===================== PRODUCTS PAGE ===================== */
  const productGrid = document.getElementById("product-grid");
  if (productGrid) {
    const catFilterWrap   = document.getElementById("category-filters");
    const brandFilterWrap = document.getElementById("brand-filters");

    catFilterWrap.innerHTML = ALL_CATEGORIES.map(c => `
      <label class="filter-option"><input type="checkbox" data-filter-category value="${c}"> ${c}</label>`
    ).join("");
    brandFilterWrap.innerHTML = ALL_BRANDS.map(b => `
      <label class="filter-option"><input type="checkbox" data-filter-brand value="${b}"> ${b}</label>`
    ).join("");

    const catBoxes   = document.querySelectorAll("[data-filter-category]");
    const brandBoxes = document.querySelectorAll("[data-filter-brand]");
    const stockBox   = document.getElementById("filter-stock");
    const saleBox    = document.getElementById("filter-sale");
    const priceRange = document.getElementById("filter-price");
    const priceLabel = document.getElementById("filter-price-label");
    const sortSelect = document.getElementById("sort-select");
    const resultCount = document.getElementById("result-count");
    const clearBtn    = document.getElementById("clear-filters");

    priceRange.max = MAX_PRICE;
    priceRange.value = MAX_PRICE;
    priceLabel.textContent = formatPrice(MAX_PRICE);

    const params = new URLSearchParams(location.search);
    const presetCategory = params.get("category");
    if (presetCategory) {
      document.querySelectorAll("[data-filter-category]").forEach(box => {
        if (box.value === presetCategory) box.checked = true;
      });
    }

    function currentSelection(){
      return {
        categories: new Set([...document.querySelectorAll("[data-filter-category]")].filter(b => b.checked).map(b => b.value)),
        brands: new Set([...document.querySelectorAll("[data-filter-brand]")].filter(b => b.checked).map(b => b.value)),
        stockOnly: stockBox.checked,
        saleOnly: saleBox.checked,
        maxPrice: Number(priceRange.value),
      };
    }

    function render(){
      const sel = currentSelection();
      let list = filterProducts(sel);
      list = sortProducts(list, sortSelect.value);

      resultCount.textContent = `${list.length} of ${PRODUCTS.length} products`;

      productGrid.innerHTML = list.length
        ? list.map(p => productCard(p)).join("")
        : `<div class="empty-state">No products match these filters. Try widening your search.</div>`;

      bindCardEvents(productGrid);
    }

    document.addEventListener("change", (e) => {
      if (e.target.matches("[data-filter-category],[data-filter-brand]")) render();
    });
    stockBox.addEventListener("change", render);
    saleBox.addEventListener("change", render);
    sortSelect.addEventListener("change", render);
    priceRange.addEventListener("input", () => {
      priceLabel.textContent = formatPrice(Number(priceRange.value));
      render();
    });
    clearBtn.addEventListener("click", () => {
      catBoxes.forEach(b => b.checked = false);
      document.querySelectorAll("[data-filter-category],[data-filter-brand]").forEach(b => b.checked = false);
      stockBox.checked = false;
      saleBox.checked = false;
      priceRange.value = MAX_PRICE;
      priceLabel.textContent = formatPrice(MAX_PRICE);
      render();
    });

    render();
  }

  /* ===================== CART PAGE ===================== */
  const cartRoot = document.getElementById("cart-root");
  if (cartRoot) {
    function renderCart(){
      const lines = cartLines();
      if (lines.length === 0) {
        cartRoot.innerHTML = `
          <div class="empty-state empty-cart">
            <p>Your cart is empty.</p>
            <a class="btn btn-solid" href="products.html">Browse the catalog</a>
          </div>`;
        document.getElementById("cart-summary").style.display = "none";
        return;
      }

      document.getElementById("cart-summary").style.display = "block";

      cartRoot.innerHTML = lines.map(({ product: p, qty }) => `
        <div class="cart-line" data-line-id="${p.id}">
          <div class="cart-line-icon icon-${p.icon}">${ICONS[p.icon] || ""}</div>
          <div class="cart-line-info">
            <div class="cart-line-cat">${p.category} &middot; ${p.brand}</div>
            <div class="cart-line-name">${p.name}</div>
            <button type="button" class="link-remove" data-remove-id="${p.id}">Remove</button>
          </div>
          <div class="qty-stepper" data-qty-for="${p.id}">
            <button type="button" class="qty-btn" data-step="-1" aria-label="Decrease quantity">&minus;</button>
            <span class="qty-value">${qty}</span>
            <button type="button" class="qty-btn" data-step="1" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-line-total">${formatPrice(p.price * qty)}</div>
        </div>`
      ).join("");

      cartRoot.querySelectorAll("[data-step]").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = Number(btn.closest("[data-qty-for]").dataset.qtyFor);
          setCartQty(id, cartQty(id) + Number(btn.dataset.step));
          renderCart();
          renderSummary();
        });
      });
      cartRoot.querySelectorAll("[data-remove-id]").forEach(btn => {
        btn.addEventListener("click", () => {
          removeFromCart(Number(btn.dataset.removeId));
          renderCart();
          renderSummary();
        });
      });
    }

    function renderSummary(){
      const subtotal = cartSubtotal();
      const shipping = subtotal > 0 ? (subtotal >= 150 ? 0 : 9) : 0;
      const saved = JSON.parse(localStorage.getItem("setcore_discount") || "null");
      const discount = saved && saved.code === "SET10" ? subtotal * 0.10 : 0;
      const total = Math.max(0, subtotal + shipping - discount);
      document.getElementById("summary-subtotal").textContent = formatPrice(subtotal);
      document.getElementById("summary-shipping").textContent = shipping === 0 ? "Free" : formatPrice(shipping);
      document.getElementById("summary-discount").textContent = discount > 0 ? `-${formatPrice(discount)}` : "—";
      document.getElementById("summary-total").textContent = formatPrice(total);
    }

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (cartLines().length === 0) return;
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem("setcore_discount");
        updateCartBadge();
        cartRoot.innerHTML = `
          <div class="empty-state empty-cart order-confirmed">
            <p class="confirm-title">Order placed</p>
            <p>Thanks for your order &mdash; a confirmation has been sent to your email.</p>
            <a class="btn btn-solid" href="products.html">Continue shopping</a>
          </div>`;
        document.getElementById("cart-summary").style.display = "none";
      });
    }

    renderCart();
    renderSummary();
  }
});

/* =========================
   DISCOUNT CODE
   Valid code: SET10 — 10% off
   ========================= */
(function setupDiscount() {
  const input = document.getElementById("discount-code");
  const apply = document.getElementById("apply-discount");
  const message = document.getElementById("discount-message");
  if (!input || !apply) return;

  const DISCOUNT_CODE = "SET10";
  const DISCOUNT_RATE = 0.10;
  const summaryTotal = document.getElementById("summary-total");

  function renderDiscount() {
    const saved = JSON.parse(localStorage.getItem("setcore_discount") || "null");
    const subtotal = typeof cartSubtotal === "function" ? cartSubtotal() : 0;
    const shipping = subtotal > 0 ? (subtotal >= 150 ? 0 : 9) : 0;
    const discount = saved && saved.code === DISCOUNT_CODE ? subtotal * DISCOUNT_RATE : 0;
    const total = Math.max(0, subtotal + shipping - discount);
    const discountEl = document.getElementById("summary-discount");
    if (discountEl) discountEl.textContent = discount > 0 ? `-${formatPrice(discount)}` : "—";
    if (summaryTotal) summaryTotal.textContent = formatPrice(total);
  }

  apply.addEventListener("click", function () {
    const code = input.value.trim().toUpperCase();
    if (code === DISCOUNT_CODE) {
      localStorage.setItem("setcore_discount", JSON.stringify({ code: DISCOUNT_CODE, rate: DISCOUNT_RATE }));
      message.textContent = "Discount applied — 10% off.";
      renderDiscount();
    } else {
      localStorage.removeItem("setcore_discount");
      message.textContent = code ? "Invalid discount code." : "Enter a discount code.";
      renderDiscount();
    }
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") apply.click();
  });

  const saved = JSON.parse(localStorage.getItem("setcore_discount") || "null");
  if (saved && saved.code === DISCOUNT_CODE) {
    input.value = DISCOUNT_CODE;
    message.textContent = "Discount applied — 10% off.";
  }
})();

