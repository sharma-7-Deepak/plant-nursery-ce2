/**
 * products.js - Safe version with DOM guards and delayed init
 */

let sampleProducts = [];
if (typeof window !== 'undefined' && window.allProductsData && Array.isArray(window.allProductsData) && window.allProductsData.length > 0) {
  sampleProducts = window.allProductsData;
  console.log('✅ Products loaded from server:', sampleProducts.length);
} else {
  console.log('⚠️ Using fallback sample products');
  sampleProducts = [
    { id: 1, name: "Monstera Deliciosa", category: "indoor", price: 45.99, originalPrice: 55.99, discount: 18, rating: 4.8, reviews: 124, image: "", description: "A stunning tropical plant with large, split leaves.", size: "medium", care: "easy", inStock: true, badge: "popular" },
    { id: 2, name: "Snake Plant (Sansevieria)", category: "indoor", price: 29.99, discount: 0, rating: 4.9, reviews: 89, image: "", description: "Low-maintenance plant that thrives in low light.", size: "small", care: "easy", inStock: true, badge: "new" }
  ];
}

let currentProducts = [...sampleProducts];
let filteredProducts = [...sampleProducts];
let currentPage = 1;
const productsPerPage = 12;
let currentView = 'grid';
let currentSort = 'featured';

function displayProducts(products = filteredProducts, page = currentPage) {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) {
    console.warn('⚠️ No products-grid element found, skipping display.');
    return;
  }

  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToShow = products.slice(startIndex, endIndex);

  productsGrid.classList.add('loading');

  setTimeout(() => {
    productsGrid.innerHTML = '';
    productsToShow.forEach((product, index) => {
      const productCard = createProductCard(product);
      productCard.style.animationDelay = `${index * 0.1}s`;
      productsGrid.appendChild(productCard);
    });

    updateResultsCount(products.length, startIndex + 1, Math.min(endIndex, products.length));
    updatePagination(products.length, page);
    productsGrid.classList.remove('loading');
    productsGrid.className = `products-grid ${currentView}-view`;
  }, 100);
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('data-product-id', product.id);
  const imageHtml = product.image ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
    : `<i class="fas fa-seedling" style="font-size: 3rem; color: var(--secondary-green);"></i><p>${product.name}</p>`;
  const badgeHtml = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';
  const discountHtml = product.discount > 0 ? `<span class="discount">-${product.discount}%</span>` : '';
  const originalPriceHtml = product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : '';
  const starsHtml = createStarsHtml(product.rating);
  const outOfStockClass = product.inStock ? '' : 'out-of-stock';
  const addToCartText = product.inStock ? 'Add to Cart' : 'Out of Stock';
  const addToCartDisabled = product.inStock ? '' : 'disabled';

  card.innerHTML = `
    <div class="product-image ${outOfStockClass}">
      ${imageHtml}
      ${badgeHtml}
      ${!product.inStock ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
    </div>
    <div class="product-details">
      <h3>${product.name}</h3>
      <div class="product-rating">
        <div class="stars">${starsHtml}</div><span class="rating-text">(${product.reviews})</span>
      </div>
      <div class="product-price">
        <span class="current-price">$${product.price.toFixed(2)}</span>
        ${originalPriceHtml}${discountHtml}
      </div>
      <p>${product.description}</p>
      <div class="product-actions">
        <button class="add-to-cart-btn" ${addToCartDisabled}>🛒 ${addToCartText}</button>
        <button class="wishlist-btn">♡</button>
      </div>
    </div>
  `;
  return card;
}

function createStarsHtml(rating) {
  let starsHtml = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  for (let i = 0; i < fullStars; i++) starsHtml += '<i class="fas fa-star"></i>';
  if (hasHalfStar) starsHtml += '<i class="fas fa-star-half-alt"></i>';
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) starsHtml += '<i class="far fa-star"></i>';
  return starsHtml;
}

function updateResultsCount(total, start, end) {
  const el = document.getElementById('results-count');
  if (el) el.textContent = `Showing ${start}-${end} of ${total} products`;
}

function updatePagination(totalProducts, currentPageNum) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const pageNumbersContainer = document.getElementById('page-numbers');
  if (!pageNumbersContainer) return;
  pageNumbersContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `page-num ${i === currentPageNum ? 'active' : ''}`;
    btn.addEventListener('click', () => goToPage(i));
    pageNumbersContainer.appendChild(btn);
  }
}

function goToPage(pageNum) {
  currentPage = pageNum;
  displayProducts(filteredProducts, pageNum);
  const section = document.querySelector('.products-section');
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initializeProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) {
    console.log('No product grid found, skipping product initialization.');
    return;
  }
  displayProducts();
  console.log('✅ Products module initialized with', filteredProducts.length, 'products');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProducts);
} else {
  initializeProducts();
}
