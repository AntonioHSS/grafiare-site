// ==========================================================================
// APP — lógica do catálogo, orçamento e WhatsApp
// ==========================================================================
// CONFIGURE AQUI:
const CONFIG = {
  brand: "Grafiare",
  // Número do WhatsApp no formato internacional (DDI+DDD+número), apenas dígitos
  whatsappNumber: "5551985930980",
  waMessageIntro: "Olá! Gostaria de solicitar um orçamento dos seguintes produtos:",
  waMessageOutro: "Por favor, informe valores, disponibilidade e condições de entrega/retirada. Obrigado!",
  currency: "", // sem preços; deixe vazio
};

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initFilters();
  initSearch();
  renderProducts();
  initModal();
  initCart();
  initWhatsAppLink();
});

// ---------- Helpers ----------
function catLabel(id) {
  const c = window.CATEGORIES.find((x) => x.id === id);
  return c ? c.label : id;
}

function imgOrPlaceholder(src, alt) {
  // returns an img element with fallback on error
  const img = document.createElement("img");
  img.alt = alt || "";
  img.src = src;
  img.onerror = function () {
    this.onerror = null;
    this.replaceWith(makePlaceholder(alt));
  };
  return img;
}

function makePlaceholder(text) {
  const div = document.createElement("div");
  div.className = "placeholder";
  div.textContent = text || "Sem imagem";
  return div;
}

// ---------- Render ----------
const state = { filter: "all", query: "" };

function filteredProducts() {
  return window.PRODUCTS.filter((p) => {
    if (state.filter !== "all" && p.category !== state.filter) return false;
    if (state.query) {
      const q = state.query.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  const empty = document.getElementById("emptyState");
  grid.innerHTML = "";
  const list = filteredProducts();
  if (list.length === 0) {
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;
  list.forEach((p) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const imgWrap = document.createElement("div");
    imgWrap.className = "img";
    const tag = document.createElement("span");
    tag.className = "cat-tag";
    tag.textContent = catLabel(p.category);
    imgWrap.appendChild(tag);
    imgWrap.appendChild(imgOrPlaceholder(p.image, p.name));

    const body = document.createElement("div");
    body.className = "body";
    const link = document.createElement("a");
    link.className = "product-link";
    link.href = `produto.html?id=${p.code}`;
    link.target = "_blank";
    link.textContent = p.name;
    const h3 = document.createElement("h3");
    h3.appendChild(link);
    const desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = p.description;
    const actions = document.createElement("div");
    actions.className = "actions";
    const addBtn = document.createElement("button");
    addBtn.className = "btn btn-primary btn-sm";
    addBtn.textContent = "Adicionar";
    addBtn.addEventListener("click", () => addToCart(p.id));
    actions.append(addBtn);
    body.append(h3, desc, actions);

    const footer = document.createElement("div");
    footer.className = "product-footer";
    const codeEl = document.createElement("span");
    codeEl.className = "product-code";
    codeEl.textContent = `Cod: ${p.code || "—"}`;
    const priceEl = document.createElement("span");
    priceEl.className = "product-price";
    priceEl.textContent = p.price || "Consulte";
    footer.append(codeEl, priceEl);
    body.append(footer);

    card.append(imgWrap, body);
    grid.appendChild(card);
  });
}

// ---------- Filters ----------
function initFilters() {
  const container = document.getElementById("filters");
  if (!container) return;
  // keep "all" button
  window.CATEGORIES.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.cat = c.id;
    btn.textContent = c.label;
    btn.addEventListener("click", () => setFilter(c.id));
    container.appendChild(btn);
  });
  container.querySelectorAll(".filter-btn").forEach((btn) => {
    if (btn.dataset.cat === "all") btn.addEventListener("click", () => setFilter("all"));
  });
}

function setFilter(cat) {
  state.filter = cat;
  document.querySelectorAll(".filter-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.cat === cat);
  });
  renderProducts();
}

// ---------- Search ----------
function initSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  input.addEventListener("input", (e) => {
    state.query = e.target.value.trim();
    renderProducts();
  });
}

// ---------- Modal ----------
function openModal(id) {
  const p = window.PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  const body = document.getElementById("modalBody");
  body.innerHTML = "";
  const imgWrap = document.createElement("div");
  imgWrap.className = "modal-img";
  imgWrap.appendChild(imgOrPlaceholder(p.image, p.name));
  body.appendChild(imgWrap);

  const cat = document.createElement("div");
  cat.className = "cat";
  cat.textContent = catLabel(p.category);
  body.appendChild(cat);

  const h3 = document.createElement("h3");
  h3.textContent = p.name;
  body.appendChild(h3);

  const meta = document.createElement("div");
  meta.style.display = "flex";
  meta.style.justifyContent = "space-between";
  meta.style.fontSize = "13px";
  meta.style.marginBottom = "8px";
  const codeMeta = document.createElement("span");
  codeMeta.className = "product-code";
  codeMeta.textContent = `Cod: ${p.code || "—"}`;
  const priceMeta = document.createElement("span");
  priceMeta.className = "product-price";
  priceMeta.textContent = p.price || "Consulte";
  meta.append(codeMeta, priceMeta);
  body.appendChild(meta);

  const desc = document.createElement("p");
  desc.className = "desc";
  desc.textContent = p.description;
  body.appendChild(desc);

  const bulletin = document.createElement("div");
  bulletin.className = "bulletin";
  const bh = document.createElement("h4");
  bh.textContent = "Boletim Técnico";
  bulletin.appendChild(bh);
  const ul = document.createElement("ul");
  (p.bulletin || []).forEach((line) => {
    const li = document.createElement("li");
    li.textContent = line;
    ul.appendChild(li);
  });
  bulletin.appendChild(ul);
  body.appendChild(bulletin);

  const actions = document.createElement("div");
  actions.style.marginTop = "16px";
  const addBtn = document.createElement("button");
  addBtn.className = "btn btn-primary";
  addBtn.textContent = "Adicionar ao orçamento";
  addBtn.addEventListener("click", () => {
    addToCart(p.code);
  });
  actions.appendChild(addBtn);
  body.appendChild(actions);

  document.getElementById("productModal").classList.add("open");
  document.getElementById("productModal").setAttribute("aria-hidden", "false");
}

function closeModal() {
  const m = document.getElementById("productModal");
  m.classList.remove("open");
  m.setAttribute("aria-hidden", "true");
}

function initModal() {
  const m = document.getElementById("productModal");
  if (!m) return;
  m.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeCart();
    }
  });
}

// ---------- Cart ----------
const CART_KEY = "orcamento_cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function cartCount(cart) {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function addToCart(id) {
  const cart = loadCart();
  const item = cart.find((i) => i.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart(cart);
  updateCartUI();
  openCart();
}

function removeFromCart(id) {
  const cart = loadCart().filter((i) => i.id !== id);
  saveCart(cart);
  updateCartUI();
}

function setQty(id, qty) {
  const cart = loadCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  if (qty <= 0) return removeFromCart(id);
  item.qty = qty;
  saveCart(cart);
  updateCartUI();
}

function clearCart() {
  saveCart([]);
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById("cartBadge");
  const list = document.getElementById("cartItems");
  if (!badge || !list) return;
  const cart = loadCart();
  badge.textContent = cartCount(cart);
  list.innerHTML = "";
  if (cart.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-cart";
    empty.textContent = "Seu orçamento está vazio. Adicione produtos do catálogo.";
    list.appendChild(empty);
    return;
  }
  cart.forEach((ci) => {
    const p = window.PRODUCTS.find((x) => x.id === ci.id);
    if (!p) return;
    const row = document.createElement("div");
    row.className = "cart-item";

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;
    img.onerror = function () { this.style.display = "none"; };
    row.appendChild(img);

    const info = document.createElement("div");
    info.className = "info";
    const strong = document.createElement("strong");
    strong.textContent = p.name;
    const small = document.createElement("small");
    small.textContent = catLabel(p.category);
    info.append(strong, document.createElement("br"), small);
    row.appendChild(info);

    const qty = document.createElement("div");
    qty.className = "qty";
    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.addEventListener("click", () => setQty(ci.id, ci.qty - 1));
    const span = document.createElement("span");
    span.textContent = ci.qty;
    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.addEventListener("click", () => setQty(ci.id, ci.qty + 1));
    qty.append(minus, span, plus);
    row.appendChild(qty);

    const rem = document.createElement("button");
    rem.className = "remove";
    rem.textContent = "×";
    rem.addEventListener("click", () => removeFromCart(ci.id));
    row.appendChild(rem);

    list.appendChild(row);
  });

  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.textContent = cartCount(cart);
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (drawer) drawer.classList.add("open");
  if (overlay) overlay.hidden = false;
}
function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (drawer) drawer.classList.remove("open");
  if (overlay) overlay.hidden = true;
}

function initCart() {
  const toggle = document.getElementById("cartToggle");
  if (!toggle) return;
  toggle.addEventListener("click", openCart);
  const close = document.getElementById("cartClose");
  if (close) close.addEventListener("click", closeCart);
  const overlay = document.getElementById("cartOverlay");
  if (overlay) overlay.addEventListener("click", closeCart);
  const clear = document.getElementById("clearCart");
  if (clear) clear.addEventListener("click", () => {
    if (confirm("Limpar toda a lista de orçamento?")) clearCart();
  });
  const send = document.getElementById("sendWhatsApp");
  if (send) send.addEventListener("click", sendWhatsApp);
  updateCartUI();
}

// ---------- WhatsApp ----------
function buildMessage() {
  const cart = loadCart();
  if (cart.length === 0) return null;
  const lines = [CONFIG.waMessageIntro, ""];
  cart.forEach((ci, idx) => {
    const p = window.PRODUCTS.find((x) => x.id === ci.id);
    if (!p) return;
    lines.push(`${idx + 1}. ${p.name}`);
    lines.push(`   Código: ${p.code || "—"}`);
    lines.push(`   Categoria: ${catLabel(p.category)}`);
    lines.push(`   Preço: ${p.price || "Consulte"}`);
    lines.push(`   Quantidade: ${ci.qty}`);
  });
  lines.push("");
  lines.push(CONFIG.waMessageOutro);
  return lines.join("\n");
}

function sendWhatsApp() {
  const msg = buildMessage();
  if (!msg) {
    alert("Adicione ao menos um produto ao orçamento.");
    return;
  }
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank", "noopener");
}

function initWhatsAppLink() {
  const a = document.getElementById("waLink");
  if (!a) return;
  a.href = `https://wa.me/${CONFIG.whatsappNumber}`;
  a.textContent = "(51) 9 8593-0980";
}

function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}