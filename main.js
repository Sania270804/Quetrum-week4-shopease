function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  alert("Product added to cart!");
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEls = document.querySelectorAll(".cart-count");
  cartCountEls.forEach(el => el.textContent = count);
}

function renderFeaturedProducts() {
  const container = document.getElementById("featuredProducts");
  if (!container) return;

  const featured = products.slice(0, 6);

  container.innerHTML = featured.map(product => `
    <div class="col-md-4 col-lg-4 mb-4">
      <div class="card product-card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <span class="badge-category mb-2">${product.category}</span>
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text text-muted">${product.description.substring(0, 70)}...</p>
          <p class="price">Rs. ${product.price}</p>
          <div class="d-flex gap-2">
            <a href="product.html?id=${product.id}" class="btn btn-outline-primary w-50">View</a>
            <button class="btn btn-primary w-50" onclick="addToCart(${product.id})">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function renderProducts(filteredProducts = products) {
  const container = document.getElementById("productsContainer");
  if (!container) return;

  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <h4>No products found</h4>
          <p class="text-muted">Try another search or category.</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredProducts.map(product => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card product-card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <span class="badge-category mb-2">${product.category}</span>
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text text-muted">${product.description.substring(0, 80)}...</p>
          <p class="price">Rs. ${product.price}</p>
          <div class="d-flex gap-2">
            <a href="product.html?id=${product.id}" class="btn btn-outline-primary w-50">View</a>
            <button class="btn btn-primary w-50" onclick="addToCart(${product.id})">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function handleFilters() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");

  if (!searchInput || !categoryFilter || !sortFilter) return;

  function applyFilters() {
    let filtered = [...products];

    const searchValue = searchInput.value.toLowerCase().trim();
    const categoryValue = categoryFilter.value;
    const sortValue = sortFilter.value;

    if (searchValue) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchValue) ||
        product.description.toLowerCase().includes(searchValue)
      );
    }

    if (categoryValue !== "All") {
      filtered = filtered.filter(product => product.category === categoryValue);
    }

    if (sortValue === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortValue === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "name-desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    renderProducts(filtered);
  }

  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  sortFilter.addEventListener("change", applyFilters);
}

function renderProductDetail() {
  const detailContainer = document.getElementById("productDetail");
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));

  const product = products.find(p => p.id === productId);

  if (!product) {
    detailContainer.innerHTML = `
      <div class="empty-state">
        <h3>Product not found</h3>
      </div>
    `;
    return;
  }

  detailContainer.innerHTML = `
    <div class="row g-4 align-items-center">
      <div class="col-md-6">
        <img src="${product.image}" class="product-detail-img" alt="${product.name}">
      </div>
      <div class="col-md-6">
        <span class="badge-category">${product.category}</span>
        <h2 class="mt-3">${product.name}</h2>
        <p class="price fs-4">Rs. ${product.price}</p>
        <p class="text-muted">${product.description}</p>
        <button class="btn btn-primary btn-lg" onclick="addToCart(${product.id})">Add to Cart</button>
        <a href="products.html" class="btn btn-outline-secondary btn-lg ms-2">Back to Shop</a>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderFeaturedProducts();
  renderProducts();
  handleFilters();
  renderProductDetail();
});