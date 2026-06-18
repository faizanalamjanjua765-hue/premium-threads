// Cart array to store items
let cart = [];

// DOM Elements
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartIcon = document.querySelector('.fa-shopping-cart');

// Toggle Cart Sidebar
if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
}

// Add to Cart Function
function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    updateCartUI();
    
    // Auto open cart when item added
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    }
}

// Update Cart User Interface & Count
function updateCartUI() {
    // 1. Update Cart Badge/Count
    const cartBadge = document.querySelector('.cart-count');
    if (cartBadge) {
        cartBadge.innerText = cart.length;
    }

    // 2. Clear previous items
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        cartTotalPrice.innerText = 'Rs. 0';
        return;
    }

    // 3. Render items
    cart.forEach((item, index) => {
        total += item.price;
        const itemEl = document.createElement('div');
        itemEl.style.display = 'flex';
        itemEl.style.justifyContent = 'space-between';
        itemEl.style.marginBottom = '10px';
        itemEl.style.padding = '5px 0';
        itemEl.style.borderBottom = '1px solid #333';
        
        itemEl.innerHTML = `
            <span>${item.name}</span>
            <span class="text-warning">Rs. ${item.price}</span>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    cartTotalPrice.innerText = `Rs. ${total}`;
}

// Checkout Button (WhatsApp Integration)
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        let message = "*--- NEW ORDER FROM PREMIUM THREADS ---*\n\n";
        let total = 0;
        
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name} - Rs. ${item.price}\n`;
            total += item.price;
        });

        message += `\n*Total Amount:* Rs. ${total}\n`;
        message += "\nKindly reply with your Name and Delivery Address to confirm your order!";

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/923295720165?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    });
}
