// Catalog Page JavaScript

// Sample product data
const products = [
    {
        id: 1,
        name: "Sport Bra Premium",
        price: 299000,
        image: "/Assets/WhatsApp Image 2025-06-22 at 00.36.31_f42d5eff.jpg",
        category: "sports-bras"
    },
    {
        id: 2,
        name: "Active Leggings",
        price: 399000,
        image: "/Assets/WhatsApp Image 2025-06-22 at 01.28.11_a970dae9.jpg",
        category: "bottoms"
    },
    {
        id: 3,
        name: "Performance Top",
        price: 249000,
        image: "/Assets/WhatsApp Image 2025-06-22 at 02.19.35_31a4f616.jpg",
        category: "tops"
    },
    {
        id: 4,
        name: "Training Shorts",
        price: 199000,
        image: "/Assets/WhatsApp Image 2025-06-22 at 01.41.40_a25871fd.jpg",
        category: "bottoms"
    },
    {
        id: 5,
        name: "Premium Sports Bra",
        price: 349000,
        image: "/Assets/WhatsApp Image 2025-06-22 at 00.36.31_f42d5eff.jpg",
        category: "sports-bras"
    },
    {
        id: 6,
        name: "High-Waist Leggings",
        price: 449000,
        image: "/Assets/WhatsApp Image 2025-06-22 at 01.28.11_a970dae9.jpg",
        category: "bottoms"
    },
    {
        id: 7,
        name: "Athletic Tank Top",
        price: 279000,
        image: "/Assets/WhatsApp Image 2025-06-22 at 02.19.35_31a4f616.jpg",
        category: "tops"
    },
    {
        id: 8,
        name: "Performance Shorts",
        price: 229000,
        image: "/Assets/WhatsApp Image 2025-06-22 at 01.41.40_a25871fd.jpg",
        category: "bottoms"
    }
];

// Cart functionality
let cart = [];
let cartTotal = 0;

// DOM elements
const filterBtn = document.getElementById('filterBtn');
const filterSidebar = document.getElementById('filterSidebar');
const closeFilters = document.getElementById('closeFilters');
const productsGrid = document.getElementById('productsGrid');
const cartBadge = document.getElementById('cartBadge');

// Cart modal elements
const checkoutModal = document.getElementById('checkoutModal');
const cartItems = document.getElementById('cartItems');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const totalElement = document.getElementById('total');
const closeModal = document.getElementById('closeModal');
const continueShopping = document.getElementById('continueShopping');
const placeOrder = document.getElementById('placeOrder');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupEventListeners();
    updateCartDisplay();
    updateCartTotal();
});

// Setup event listeners
function setupEventListeners() {
    // Filter sidebar
    filterBtn.addEventListener('click', () => {
        filterSidebar.classList.add('active');
    });

    closeFilters.addEventListener('click', () => {
        filterSidebar.classList.remove('active');
    });

    // Cart modal functionality
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            checkoutModal.classList.add('active');
        });
    }

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
        });
    }

    // Continue shopping
    if (continueShopping) {
        continueShopping.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
        });
    }

    // Place order
    if (placeOrder) {
        placeOrder.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            
            showNotification('Order placed successfully! Thank you for your purchase.');
            cart = [];
            updateCartDisplay();
            updateCartTotal();
            checkoutModal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('active');
        }
    });
}

// Render products
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-item">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="quick-add" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">
                        QUICK ADD
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">Rp ${product.price.toLocaleString()}</p>
            </div>
        </div>
    `).join('');
}

// Cart functions
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseInt(price),
            image: image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    updateCartTotal();
    updateCartBadge();
    showNotification(`${name} added to cart!`);
}

// Update cart display
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
                <span>Add some products to get started</span>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">Rp ${item.price.toLocaleString()}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }
}

// Update quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    updateCartDisplay();
    updateCartTotal();
    updateCartBadge();
}

// Update cart total
function updateCartTotal() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 15000 : 0;
    const total = cartTotal + shipping;
    
    subtotalElement.textContent = `Rp ${cartTotal.toLocaleString()}`;
    totalElement.textContent = `Rp ${total.toLocaleString()}`;
}

function updateCartBadge() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (totalItems > 0) {
        cartBadge.textContent = totalItems > 99 ? '99+' : totalItems;
        cartBadge.classList.add('show');
    } else {
        cartBadge.classList.remove('show');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #000;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
} 