/**
 * cart.js - Shopping cart functionality
 * This file manages the shopping cart, including add/remove items, quantities, and local storage
 * Ready for backend integration - cart data can be synced with user accounts
 */

// Cart state management
let cart = [];
const CART_STORAGE_KEY = 'plant-nursery-cart';

/**
 * Initialize cart from localStorage
 */
function initializeCart() {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (error) {
        console.error('Error loading cart from storage:', error);
        cart = [];
    }
    
    updateCartDisplay();
    updateCartCount();
    
    // Set up cart modal event listeners
    setupCartModal();
    
    console.log('Cart initialized with', cart.length, 'items');
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to storage:', error);
    }
}

/**
 * Add product to cart
 * @param {number|string} productId - ID of the product to add
 * @param {number} quantity - Quantity to add (default: 1)
 */
function addToCart(productId, quantity = 1) {
    // Convert productId to number for consistent comparison
    const id = parseInt(productId);
    if (isNaN(id)) {
        console.error('Invalid product ID provided:', productId);
        showNotification('Invalid product ID!', 'error');
        return;
    }
    
    console.log('Adding to cart - Product ID:', id, 'Quantity:', quantity);
    
    const product = getProductById(id);
    if (!product) {
        console.error('Product not found:', id);
        showNotification('Product not found!', 'error');
        return;
    }
    
    if (!product.inStock) {
        showNotification('Sorry, this product is out of stock!', 'warning');
        return;
    }
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
        showNotification(`Updated ${product.name} quantity in cart!`, 'success');
    } else {
        // Add new item
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            category: product.category
        });
        showNotification(`${product.name} added to cart!`, 'success');
    }
    
    // Update displays
    updateCartCount();
    updateCartDisplay();
    saveCartToStorage();
    
    // Add bounce animation to cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('animate-bounce');
        setTimeout(() => {
            cartIcon.classList.remove('animate-bounce');
        }, 600);
    }
}

/**
 * Remove product from cart
 * @param {number|string} productId - ID of the product to remove
 */
function removeFromCart(productId) {
    // Convert productId to number for consistent comparison
    const id = parseInt(productId);
    if (isNaN(id)) {
        console.warn('Invalid product ID for removal:', productId);
        return;
    }
    
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        
        updateCartCount();
        updateCartDisplay();
        saveCartToStorage();
        
        showNotification(`${removedItem.name} removed from cart!`, 'info');
        console.log('Removed item from cart:', removedItem.name, 'ID:', id);
    } else {
        console.warn('Item not found in cart for removal:', id, 'Available cart items:', cart.map(item => ({ id: item.id, name: item.name })));
    }
}

/**
 * Update quantity of item in cart
 * @param {number|string} productId - ID of the product
 * @param {number} newQuantity - New quantity value
 */
function updateCartItemQuantity(productId, newQuantity) {
    // Convert productId to number for consistent comparison
    const id = parseInt(productId);
    if (isNaN(id)) {
        console.warn('Invalid product ID for quantity update:', productId);
        return;
    }
    
    const item = cart.find(item => item.id === id);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(id);
        } else {
            item.quantity = newQuantity;
            updateCartCount();
            updateCartDisplay();
            saveCartToStorage();
            
            showNotification(`Updated ${item.name} quantity to ${newQuantity}!`, 'success');
        }
    } else {
        console.warn('Item not found in cart for quantity update:', id, 'Available cart items:', cart.map(item => ({ id: item.id, name: item.name })));
    }
}

/**
 * Clear entire cart
 */
function clearCart() {
    cart = [];
    updateCartCount();
    updateCartDisplay();
    saveCartToStorage();
    showNotification('Cart cleared!', 'info');
}

/**
 * Update cart count display
 */
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        
        // Add animation when count changes
        cartCountElement.classList.add('animate-bounce');
        setTimeout(() => {
            cartCountElement.classList.remove('animate-bounce');
        }, 300);
    }
}

/**
 * Update cart display in modal
 */
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    // Clear existing items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some beautiful plants to get started!</p>
            </div>
        `;
        cartTotalElement.textContent = '0.00';
    } else {
        // Display cart items
        let total = 0;
        
        cart.forEach(item => {
            const cartItem = createCartItemElement(item);
            cartItemsContainer.appendChild(cartItem);
            total += item.price * item.quantity;
        });
        
        cartTotalElement.textContent = total.toFixed(2);
    }
}

/**
 * Create cart item HTML element
 * @param {Object} item - Cart item object
 * @returns {HTMLElement} Cart item element
 */
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-product-id', item.id);
    
    // Create image HTML
    const imageHtml = item.image 
        ? `<img src="${item.image}" alt="${item.name}" loading="lazy">`
        : `<i class="fas fa-seedling" style="font-size: 2rem; color: var(--secondary-green);"></i>`;
    
    cartItem.innerHTML = `
        <div class="cart-item-image">
            ${imageHtml}
        </div>
        
        <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
            
            <div class="cart-item-controls">
                <div class="cart-qty-controls">
                    <button class="cart-qty-btn minus" data-action="minus" data-product-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="cart-qty-input" value="${item.quantity}" 
                           min="1" data-product-id="${item.id}">
                    <button class="cart-qty-btn plus" data-action="plus" data-product-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <button class="remove-item-btn" data-product-id="${item.id}" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return cartItem;
}

/**
 * Setup cart modal event listeners
 */
function setupCartModal() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Delegate click events for cart item controls
    document.addEventListener('click', (e) => {
        // Handle quantity plus/minus buttons
        const qtyBtn = e.target.closest('.cart-qty-btn');
        if (qtyBtn) {
            const cartItemEl = qtyBtn.closest('.cart-item');
            if (!cartItemEl) return;
            
            const productId = qtyBtn.getAttribute('data-product-id') || cartItemEl.getAttribute('data-product-id');
            const input = cartItemEl.querySelector('.cart-qty-input');
            let current = parseInt(input.value) || 1;
            
            if (qtyBtn.dataset.action === 'plus') {
                current += 1;
                updateCartItemQuantity(productId, current);
            } else if (qtyBtn.dataset.action === 'minus') {
                if (current === 1) {
                    // If quantity is 1 and user clicks minus, remove the item
                    removeFromCart(productId);
                } else {
                    current -= 1;
                    updateCartItemQuantity(productId, current);
                }
            }
            return;
        }
        
        // Handle remove item button
        const removeBtn = e.target.closest('.remove-item-btn');
        if (removeBtn) {
            const productId = removeBtn.getAttribute('data-product-id');
            if (productId) {
                console.log('Removing product ID:', productId);
                removeFromCart(productId);
            } else {
                console.warn('No product ID found on remove button');
            }
            return;
        }
    });

    // Handle quantity input changes
    document.addEventListener('change', (e) => {
        const input = e.target.closest('.cart-qty-input');
        if (!input) return;
        
        const productId = input.getAttribute('data-product-id');
        const value = Math.max(1, parseInt(input.value) || 1);
        
        if (productId) {
            updateCartItemQuantity(productId, value);
        }
    });

    // Open cart modal
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            openCartModal();
        });
    }
    
    // Close cart modal
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            closeCartModal();
        });
    }
    // Close cart modal
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            closeCartModal();
        });
    }
    
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            closeCartModal();
        });
    }
    
    // Close modal when clicking outside
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            handleCheckout();
        });
    }
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartModal && cartModal.classList.contains('active')) {
            closeCartModal();
        }
    });
}

/**
 * Open cart modal
 */
function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus management for accessibility
        const firstFocusableElement = cartModal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
    }
}

/**
 * Close cart modal
 */
function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

/**
 * Handle checkout process
 */
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }
    
    // Close the cart modal
    closeCartModal();
    
    // Redirect to checkout page
    window.location.href = '/checkout';
}

/**
 * Get cart summary for display or API calls
 * @returns {Object} Cart summary object
 */
function getCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
        items: [...cart], // Create a copy to prevent external modifications
        totalItems,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        isEmpty: cart.length === 0
    };
}

/**
 * Import cart from external source (for user login sync)
 * @param {Array} externalCart - Cart data from backend/account
 */
function importCart(externalCart) {
    if (Array.isArray(externalCart)) {
        cart = [...externalCart];
        updateCartCount();
        updateCartDisplay();
        saveCartToStorage();
        showNotification('Cart synced with your account!', 'success');
    }
}

/**
 * Export cart for backend sync
 * @returns {Array} Current cart data
 */
function exportCart() {
    return [...cart];
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'warning', 'info')
 */
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: ${getNotificationColor(type)};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 500;
        font-size: 14px;
        min-width: 200px;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-in 2.7s forwards;
        pointer-events: auto;
        cursor: pointer;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add click to dismiss
    notification.onclick = () => {
        notification.remove();
    };
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

/**
 * Get notification background color based on type
 * @param {string} type - Notification type
 * @returns {string} CSS color value
 */
function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        case 'info':
        default: return '#17a2b8';
    }
}

/**
 * Get notification icon based on type
 * @param {string} type - Notification type
 * @returns {string} Font Awesome icon class
 */
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info':
        default: return 'fa-info-circle';
    }
}

// Add CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .out-of-stock {
        opacity: 0.6;
        position: relative;
    }
    
    .out-of-stock-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(220, 53, 69, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
        z-index: 2;
    }
`;
document.head.appendChild(style);

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCart);
} else {
    initializeCart();
}

// Export functions for external use
window.cartFunctions = {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartSummary,
    importCart,
    exportCart,
    openCartModal,
    closeCartModal
};

// Make functions globally accessible for onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.clearCart = clearCart;
window.openCart = openCartModal;
window.closeCart = closeCartModal;