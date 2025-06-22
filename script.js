// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        // Close other open items
        faqItems.forEach(i => {
            if (i !== item) i.classList.remove('active');
        });
        // Toggle current
        item.classList.toggle('active');
    });
});

// Optional: Mobile nav toggle (if you want to implement responsive nav)
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Cart functionality
let cart = [];
let cartTotal = 0;

// Cart modal elements
const checkoutModal = document.getElementById('checkoutModal');
const cartItems = document.getElementById('cartItems');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const closeModal = document.getElementById('closeModal');
const continueShopping = document.getElementById('continueShopping');
const placeOrder = document.getElementById('placeOrder');
const cartBadge = document.getElementById('cartBadge');

// Open cart modal
const cartBtn = document.querySelector('.cart-btn');
if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Close modal functions
function closeCartModal() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

closeModal.addEventListener('click', closeCartModal);
continueShopping.addEventListener('click', closeCartModal);

// Close modal when clicking outside
checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        closeCartModal();
    }
});

// Quick Add functionality - now adds to cart
const quickAddButtons = document.querySelectorAll('.quick-add');

quickAddButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productItem = button.closest('.product-item');
        const productName = productItem.querySelector('.product-name').textContent;
        const productPrice = productItem.querySelector('.product-price').textContent;
        const productImage = productItem.querySelector('.product-image img').src;
        
        addToCart(productName, productPrice, productImage);
        showNotification(`${productName} added to cart!`);
    });
});

// Add item to cart
function addToCart(name, price, image) {
    const priceNumber = parseInt(price.replace(/[^\d]/g, ''));
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: priceNumber,
            image: image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    updateCartTotal();
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
}

// Update cart total
function updateCartTotal() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 15000 : 0;
    const total = cartTotal + shipping;
    
    subtotalElement.textContent = `Rp ${cartTotal.toLocaleString()}`;
    totalElement.textContent = `Rp ${total.toLocaleString()}`;
    
    // Update cart badge
    updateCartBadge();
}

// Update cart badge
function updateCartBadge() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (totalItems > 0) {
        cartBadge.textContent = totalItems > 99 ? '99+' : totalItems;
        cartBadge.classList.add('show');
    } else {
        cartBadge.classList.remove('show');
    }
}

// Place order functionality
placeOrder.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Show order confirmation
    showNotification('Order placed successfully! Thank you for your purchase.');
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    updateCartTotal();
    
    // Close modal
    closeCartModal();
});

// Initialize cart display
updateCartDisplay();
updateCartTotal();

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
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
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            showNotification('Thank you for subscribing!');
            newsletterForm.reset();
        }
    });
}

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        // If it's an external link (like catalog.html), don't prevent default
        if (targetId && !targetId.startsWith('#')) {
            return; // Allow normal navigation
        }
        
        // Only prevent default for internal anchor links
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#ffffff';
        header.style.backdropFilter = 'none';
    }
});

// Product image hover effect
const productImages = document.querySelectorAll('.product-image img');
productImages.forEach(img => {
    img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.05)';
    });
    
    img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
    });
});

// Category link hover effects
const categoryLinks = document.querySelectorAll('.category-link');
categoryLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.borderBottomColor = 'transparent';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.borderBottomColor = 'white';
    });
});

// Country selector change
const countrySelect = document.querySelector('.country-select');
if (countrySelect) {
    countrySelect.addEventListener('change', (e) => {
        console.log('Country changed to:', e.target.value);
        // Here you would typically handle country/region changes
    });
}

// Search functionality (placeholder)
const searchBtn = document.querySelector('.search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        // Here you would typically open a search modal or navigate to search page
        console.log('Search clicked');
    });
}

// Account functionality (placeholder)
const accountBtn = document.querySelector('.account-btn');
if (accountBtn) {
    accountBtn.addEventListener('click', () => {
        // Here you would typically open account/login modal
        console.log('Account clicked');
    });
} 