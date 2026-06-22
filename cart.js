function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEls = document.querySelectorAll(".cart-count");
  cartCountEls.forEach(el => el.textContent = count);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCartItems();
}

function changeQuantity(productId, newQty) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);

  if (!item) return;

  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  item.quantity = newQty;
  saveCart(cart);
  renderCartItems();
}

function renderCartItems() {
  const cartContainer = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  if (!cartContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-state">
        <h3>Your cart is empty</h3>
        <p class="text-muted">Add some products to continue shopping.</p>
        <a href="products.html" class="btn btn-primary mt-3">Go to Shop</a>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = "Rs. 0";
    if (totalEl) totalEl.textContent = "Rs. 0";
    return;
  }

  let subtotal = 0;

  cartContainer.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return "";

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="cart-item d-flex flex-column flex-md-row align-items-center gap-3">
        <img src="${product.image}" class="cart-img" alt="${product.name}">
        <div class="flex-grow-1">
          <h5>${product.name}</h5>
          <p class="mb-1 text-muted">${product.category}</p>
          <p class="mb-1">Price: <strong>Rs. ${product.price}</strong></p>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-secondary btn-sm" onclick="changeQuantity(${product.id}, ${item.quantity - 1})">-</button>
          <span class="fw-bold">${item.quantity}</span>
          <button class="btn btn-outline-secondary btn-sm" onclick="changeQuantity(${product.id}, ${item.quantity + 1})">+</button>
        </div>
        <div>
          <p class="fw-bold mb-1">Rs. ${itemTotal}</p>
          <button class="btn btn-danger btn-sm" onclick="removeFromCart(${product.id})">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal}`;
  if (totalEl) totalEl.textContent = `Rs. ${subtotal}`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartItems();
});