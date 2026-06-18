// ============================================================
// DATA — Products with matching images (seed = product name)
// ============================================================
const products = [{
    id: 1,
    name: 'Classic White Shirt',
    category: 'shirts',
    price: 49.99,
    image: 'https://picsum.photos/seed/classic-white-shirt/400/500',
    badge: 'Best Seller'
}, {
    id: 2,
    name: 'Navy Blue Shirt',
    category: 'shirts',
    price: 54.99,
    image: 'https://picsum.photos/seed/navy-blue-shirt/400/500',
    badge: 'New'
}, {
    id: 3,
    name: 'Black Oxford Shirt',
    category: 'shirts',
    price: 59.99,
    image: 'https://picsum.photos/seed/black-oxford-shirt/400/500',
    badge: null
}, {
    id: 4,
    name: 'Light Pink Shirt',
    category: 'shirts',
    price: 44.99,
    image: 'https://picsum.photos/seed/light-pink-shirt/400/500',
    badge: 'Sale'
}, {
    id: 5,
    name: 'Striped Casual Shirt',
    category: 'shirts',
    price: 39.99,
    image: 'https://picsum.photos/seed/striped-casual-shirt/400/500',
    badge: null
}, {
    id: 6,
    name: 'Slim Fit Jeans',
    category: 'pants',
    price: 69.99,
    image: 'https://picsum.photos/seed/slim-fit-jeans/400/500',
    badge: 'Popular'
}, {
    id: 7,
    name: 'Classic Chinos',
    category: 'pants',
    price: 59.99,
    image: 'https://picsum.photos/seed/classic-chinos/400/500',
    badge: null
}, {
    id: 8,
    name: 'Dress Pants',
    category: 'pants',
    price: 79.99,
    image: 'https://picsum.photos/seed/dress-pants/400/500',
    badge: 'Premium'
}, {
    id: 9,
    name: 'Cargo Pants',
    category: 'pants',
    price: 64.99,
    image: 'https://picsum.photos/seed/cargo-pants/400/500',
    badge: null
}, {
    id: 10,
    name: 'Jogger Pants',
    category: 'pants',
    price: 49.99,
    image: 'https://picsum.photos/seed/jogger-pants/400/500',
    badge: 'Comfort'
}];

// ============================================================
// STATE
// ============================================================
let cart = [];
let currentTab = 'all';

// ============================================================
// DOM REFS
// ============================================================
const grid = document.getElementById('productGrid');
const cartItemsList = document.getElementById('cartItemsList');
const cartEmpty = document.getElementById('cartEmpty');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const taxAmountEl = document.getElementById('taxAmount');
const totalAmountEl = document.getElementById('totalAmount');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartOpenBtn = document.getElementById('cartOpenBtn');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// ============================================================
// RENDER PRODUCTS
// ============================================================
function renderProducts(tab = 'all') {
    let filtered = products;
    if (tab === 'shirts') {
        filtered = products.filter(p => p.category === 'shirts');
    } else if (tab === 'pants') {
        filtered = products.filter(p => p.category === 'pants');
    }

    if (filtered.length === 0) {
        grid.innerHTML =
            `<p style="grid-column:1/-1;text-align:center;color:#999;padding:40px 0;">No products found.</p>`;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const badgeHtml = p.badge ? `<span class="badge-tag">${p.badge}</span>` : '';
        return `
            <div class="product-card" data-id="${p.id}" data-category="${p.category}">
                <div class="image-wrap">
                    <img src="${p.image}" alt="${p.name}" loading="lazy" />
                    ${badgeHtml}
                </div>
                <div class="info">
                    <div class="category">${p.category}</div>
                    <h4>${p.name}</h4>
                    <div class="price">$${p.price.toFixed(2)}</div>
                    <button class="add-btn" data-id="${p.id}">
                        <i class="fas fa-plus-circle"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) addToCart(product);
        });
    });
}

// ============================================================
// CART OPERATIONS
// ============================================================
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id);
        return;
    }
    updateCartUI();
}

function getTotalItems() {
    return cart.reduce((sum, i) => sum + i.qty, 0);
}

function getSubtotal() {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getTax(subtotal) {
    return subtotal * 0.05;
}

function getTotal(subtotal, tax) {
    return subtotal + tax;
}

// ============================================================
// UPDATE CART UI
// ============================================================
function updateCartUI() {
    const totalItems = getTotalItems();
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '';
        cartEmpty.style.display = 'block';
    } else {
        cartEmpty.style.display = 'none';
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" />
                <div class="details">
                    <h5>${item.name}</h5>
                    <div class="item-price">$${(item.price * item.qty).toFixed(2)}</div>
                    <div class="qty-control">
                        <button onclick="updateQty(${item.id}, -1)">−</button>
                        <span>${item.qty}</span>
                        <button onclick="updateQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');
    }

    const subtotal = getSubtotal();
    const tax = getTax(subtotal);
    const total = getTotal(subtotal, tax);

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxAmountEl.textContent = `$${tax.toFixed(2)}`;
    totalAmountEl.textContent = `$${total.toFixed(2)}`;
}

// ============================================================
// TOAST
// ============================================================
let toastTimeout;

function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

// ============================================================
// CART SIDEBAR TOGGLE
// ============================================================
function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

cartOpenBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ============================================================
// CHECKOUT – WHATSAPP
// ============================================================
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Your cart is empty! Add some items first.');
        return;
    }

    const subtotal = getSubtotal();
    const tax = getTax(subtotal);
    const total = getTotal(subtotal, tax);

    let itemsStr = cart.map(i =>
        `• ${i.name} × ${i.qty} = $${(i.price * i.qty).toFixed(2)}`
    ).join('%0A');

    const message =
        `🛍️ *Premium Threads Order*%0A%0A` +
        `📦 *Items:*%0A${itemsStr}%0A%0A` +
        `💰 *Subtotal:* $${subtotal.toFixed(2)}%0A` +
        `🧾 *Tax (5%):* $${tax.toFixed(2)}%0A` +
        `🔹 *Total:* $${total.toFixed(2)}%0A%0A` +
        `👤 *Customer Name:* %0A` +
        `📞 *Phone:* %0A` +
        `📍 *Address:* %0A%0A` +
        `✅ *Please confirm my order!*`;

    const url = `https://wa.me/923295720165?text=${message}`;
    window.open(url, '_blank');
});

// ============================================================
// TABS
// ============================================================
document.querySelectorAll('.product-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.product-tabs button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.dataset.tab;
        renderProducts(currentTab);
    });
});

// ============================================================
// MOBILE NAV TOGGLE
// ============================================================
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// ============================================================
// INIT
// ============================================================
renderProducts('all');
updateCartUI();

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
});

document.querySelector('.hero-btn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
});

console.log('🛍️ Premium Threads loaded successfully!');
console.log('📞 WhatsApp: +923295720165');
