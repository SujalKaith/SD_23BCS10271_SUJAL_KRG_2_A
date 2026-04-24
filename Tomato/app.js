// ===== DATA (mirrors Java TomatoApp) =====
const RESTAURANTS = [
  {
    id: 1, name: "Bikaner", location: "Delhi", emoji: "🏪", rating: "4.7",
    menu: [
      { code: "P1", name: "Chole Bhature", price: 120 },
      { code: "P2", name: "Samosa", price: 15 },
    ],
  },
  {
    id: 2, name: "Haldiram", location: "Kolkata", emoji: "🍽️", rating: "4.5",
    menu: [
      { code: "P1", name: "Raj Kachori", price: 80 },
      { code: "P2", name: "Pav Bhaji", price: 100 },
      { code: "P3", name: "Dhokla", price: 50 },
    ],
  },
  {
    id: 3, name: "Saravana Bhavan", location: "Chennai", emoji: "🥘", rating: "4.9",
    menu: [
      { code: "P1", name: "Masala Dosa", price: 90 },
      { code: "P2", name: "Idli Vada", price: 60 },
      { code: "P3", name: "Filter Coffee", price: 30 },
    ],
  },
];

// ===== STATE =====
let state = {
  selectedRestaurant: null,
  cart: [],           // [{code, name, price}]
  orderCounter: 0,
};

// ===== SEARCH =====
function quickSearch(city) {
  document.getElementById("location-input").value = city;
  searchRestaurants();
  document.getElementById("restaurants").scrollIntoView({ behavior: "smooth", block: "start" });
}

function searchRestaurants() {
  const query = document.getElementById("location-input").value.trim().toLowerCase();
  const grid = document.getElementById("restaurant-grid");
  const subtitle = document.getElementById("restaurants-subtitle");
  const empty = document.getElementById("empty-state");

  const results = query
    ? RESTAURANTS.filter((r) => r.location.toLowerCase().includes(query))
    : [];

  if (!query) {
    grid.innerHTML = "";
    grid.appendChild(buildEmptyState("Enter a city name above to discover restaurants", "🗺️"));
    subtitle.textContent = "Search a city above to find restaurants near you";
    return;
  }

  if (results.length === 0) {
    grid.innerHTML = "";
    grid.appendChild(buildEmptyState(`No restaurants found in "${query.charAt(0).toUpperCase() + query.slice(1)}"`, "😔"));
    subtitle.textContent = `No results for "${query}"`;
    return;
  }

  subtitle.textContent = `${results.length} restaurant${results.length > 1 ? "s" : ""} found in ${results[0].location}`;
  grid.innerHTML = "";
  results.forEach((r) => grid.appendChild(buildRestaurantCard(r)));
}

function buildEmptyState(msg, icon) {
  const div = document.createElement("div");
  div.className = "empty-state";
  div.innerHTML = `<div class="empty-icon">${icon}</div><p>${msg}</p>`;
  return div;
}

// ===== RESTAURANT CARD =====
function buildRestaurantCard(restaurant) {
  const card = document.createElement("div");
  card.className = "restaurant-card" + (state.selectedRestaurant?.id === restaurant.id ? " selected" : "");
  card.id = `restaurant-card-${restaurant.id}`;

  const menuHTML = restaurant.menu
    .map(
      (item) => `
    <div class="menu-item">
      <div class="menu-item-left">
        <div class="menu-dot"></div>
        <span class="menu-item-name">${item.name}</span>
      </div>
      <div class="menu-item-right">
        <span class="menu-item-price">₹${item.price}</span>
        <button class="add-btn ${isInCart(restaurant, item) ? "added" : ""}"
          id="btn-${restaurant.id}-${item.code}"
          onclick="handleAddToCart(event, ${restaurant.id}, '${item.code}')">
          ${isInCart(restaurant, item) ? "✓" : "+"}
        </button>
      </div>
    </div>`
    )
    .join("");

  card.innerHTML = `
    <div class="restaurant-img-wrap">
      <span class="restaurant-emoji">${restaurant.emoji}</span>
      <div class="restaurant-badge">⭐ ${restaurant.rating}</div>
    </div>
    <div class="restaurant-info">
      <div class="restaurant-name">${restaurant.name}</div>
      <div class="restaurant-location">📍 ${restaurant.location}</div>
      <div class="menu-section-title">Menu</div>
      ${menuHTML}
    </div>`;

  return card;
}

function isInCart(restaurant, item) {
  return (
    state.selectedRestaurant?.id === restaurant.id &&
    state.cart.some((c) => c.code === item.code)
  );
}

// ===== ADD TO CART =====
function handleAddToCart(e, restaurantId, itemCode) {
  e.stopPropagation();
  const restaurant = RESTAURANTS.find((r) => r.id === restaurantId);

  // If different restaurant, ask to clear
  if (state.selectedRestaurant && state.selectedRestaurant.id !== restaurantId) {
    if (!confirm(`Your cart has items from ${state.selectedRestaurant.name}. Start fresh with ${restaurant.name}?`)) return;
    state.cart = [];
  }

  state.selectedRestaurant = restaurant;

  const item = restaurant.menu.find((m) => m.code === itemCode);
  const alreadyIdx = state.cart.findIndex((c) => c.code === itemCode);

  if (alreadyIdx !== -1) {
    // Remove from cart (toggle)
    state.cart.splice(alreadyIdx, 1);
  } else {
    state.cart.push({ ...item });
  }

  refreshCartBadge();
  refreshRestaurantCard(restaurant);
  if (isCartOpen()) refreshCartSidebar();
}

function refreshRestaurantCard(restaurant) {
  const existing = document.getElementById(`restaurant-card-${restaurant.id}`);
  if (!existing) return;
  const fresh = buildRestaurantCard(restaurant);
  existing.replaceWith(fresh);
}

// ===== CART =====
function isCartOpen() {
  return document.getElementById("cart-sidebar").classList.contains("open");
}

function openCart() {
  refreshCartSidebar();
  document.getElementById("cart-overlay").classList.add("open");
  document.getElementById("cart-sidebar").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cart-overlay").classList.remove("open");
  document.getElementById("cart-sidebar").classList.remove("open");
  document.body.style.overflow = "";
}

function refreshCartBadge() {
  document.getElementById("cart-badge").textContent = state.cart.length;
}

function refreshCartSidebar() {
  const nameEl = document.getElementById("cart-restaurant-name");
  const itemsEl = document.getElementById("cart-items");
  const footerEl = document.getElementById("cart-footer");
  const subtotalEl = document.getElementById("cart-subtotal");
  const grandEl = document.getElementById("cart-grand-total");

  nameEl.textContent = state.selectedRestaurant ? state.selectedRestaurant.name : "No restaurant selected";

  if (state.cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty" id="cart-empty-msg">
      <div class="empty-bowl">🥣</div>
      <p>Your cart is empty</p>
      <span>Add items from a restaurant to get started</span>
    </div>`;
    footerEl.style.display = "none";
    return;
  }

  itemsEl.innerHTML = state.cart
    .map(
      (item) => `
    <div class="cart-line-item">
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-price">₹${item.price}</span>
      <button class="remove-btn" onclick="removeFromCart('${item.code}')">×</button>
    </div>`
    )
    .join("");

  const total = state.cart.reduce((s, i) => s + i.price, 0);
  subtotalEl.textContent = `₹${total}`;
  grandEl.textContent = `₹${total}`;
  footerEl.style.display = "block";
}

function removeFromCart(code) {
  state.cart = state.cart.filter((i) => i.code !== code);
  if (state.cart.length === 0) state.selectedRestaurant = null;
  refreshCartBadge();
  refreshCartSidebar();
  // Refresh visible restaurant card
  if (state.selectedRestaurant) refreshRestaurantCard(state.selectedRestaurant);
  else RESTAURANTS.forEach((r) => {
    if (document.getElementById(`restaurant-card-${r.id}`)) refreshRestaurantCard(r);
  });
}

// ===== CHECKOUT =====
function openCheckout() {
  if (state.cart.length === 0) return;
  closeCart();
  setTimeout(() => {
    // Populate summary
    document.getElementById("summary-restaurant").textContent = state.selectedRestaurant.name;
    document.getElementById("summary-items").textContent = state.cart.map((i) => i.name).join(", ");
    const total = state.cart.reduce((s, i) => s + i.price, 0);
    document.getElementById("summary-total").textContent = `₹${total}`;

    document.getElementById("checkout-overlay").classList.add("open");
    document.getElementById("checkout-modal").classList.add("open");
    document.body.style.overflow = "hidden";
  }, 200);
}

function closeCheckout() {
  document.getElementById("checkout-overlay").classList.remove("open");
  document.getElementById("checkout-modal").classList.remove("open");
  document.body.style.overflow = "";
}

function togglePaymentFields() {
  const isUpi = document.getElementById("radio-upi").checked;
  document.getElementById("upi-section").style.display = isUpi ? "block" : "none";
  document.getElementById("card-section").style.display = isUpi ? "none" : "block";
}

function placeOrder() {
  // Validate
  const isUpi = document.getElementById("radio-upi").checked;
  if (isUpi) {
    const upi = document.getElementById("upi-input").value.trim();
    if (!upi) { shakeInput("upi-input"); return; }
  } else {
    const card = document.getElementById("card-input").value.trim();
    if (card.length < 16) { shakeInput("card-input"); return; }
  }

  const btn = document.getElementById("place-order-btn");
  btn.disabled = true;
  document.getElementById("order-btn-text").textContent = "Processing...";

  setTimeout(() => {
    state.orderCounter++;
    const total = state.cart.reduce((s, i) => s + i.price, 0);
    const orderType = document.getElementById("radio-delivery").checked ? "Delivery" : "Pickup";
    const payMethod = isUpi ? `UPI (${document.getElementById("upi-input").value.trim()})` : "Credit Card";
    const now = new Date().toLocaleString("en-IN");

    // Build receipt
    const itemsHTML = state.cart
      .map((i) => `<div class="receipt-row"><span>${i.name}</span><span>₹${i.price}</span></div>`)
      .join("");

    document.getElementById("order-receipt").innerHTML = `
      <div class="receipt-row"><span>Order ID</span><span>#${state.orderCounter}</span></div>
      <div class="receipt-row"><span>Restaurant</span><span>${state.selectedRestaurant.name}</span></div>
      ${itemsHTML}
      <div class="receipt-row"><span>Order Type</span><span>${orderType}</span></div>
      <div class="receipt-row"><span>Payment</span><span>${payMethod}</span></div>
      <div class="receipt-row"><span>Time</span><span>${now}</span></div>
      <div class="receipt-row bold"><span>Total Paid</span><span>₹${total}</span></div>
    `;

    // Close checkout, open success
    closeCheckout();
    setTimeout(() => {
      const successModal = document.getElementById("success-modal");
      const successOverlay = document.getElementById("success-overlay");
      successOverlay.classList.add("open");
      successModal.style.display = "block";
      successModal.classList.add("open");
      document.body.style.overflow = "hidden";
    }, 100);

    btn.disabled = false;
    document.getElementById("order-btn-text").textContent = "Place Order 🎉";
  }, 1800);
}

function shakeInput(id) {
  const el = document.getElementById(id);
  el.style.borderColor = "var(--red)";
  el.style.animation = "shake 0.4s ease";
  setTimeout(() => { el.style.animation = ""; el.style.borderColor = ""; }, 500);
}

// ===== RESET =====
function resetAll() {
  state.cart = [];
  state.selectedRestaurant = null;
  refreshCartBadge();

  document.getElementById("success-modal").classList.remove("open");
  document.getElementById("success-modal").style.display = "none";
  document.getElementById("success-overlay").classList.remove("open");
  document.getElementById("upi-input").value = "";
  document.getElementById("card-input").value = "";
  document.body.style.overflow = "";

  // Refresh cards
  RESTAURANTS.forEach((r) => {
    const el = document.getElementById(`restaurant-card-${r.id}`);
    if (el) el.replaceWith(buildRestaurantCard(r));
  });
}

// ===== NAVBAR SCROLL =====
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (window.scrollY > 10) {
    nav.style.background = "rgba(13,13,13,0.95)";
  } else {
    nav.style.background = "rgba(13,13,13,0.8)";
  }
});

// ===== SEARCH ON ENTER =====
document.getElementById("location-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchRestaurants();
});

// ===== SHAKE ANIMATION =====
const style = document.createElement("style");
style.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}
  40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}
  80%{transform:translateX(4px)}
}`;
document.head.appendChild(style);
