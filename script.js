// Product Data - Aap yahan 5 shirts aur 5 pants add kar sakte hain
const products = [
    { id: 1, name: "Premium Slim-Fit Shirt", category: "shirt", price: 2199 },
    { id: 2, name: "Royal Blue Formal Shirt", category: "shirt", price: 2350 },
    { id: 3, name: "Charcoal Casual Shirt", category: "shirt", price: 1999 },
    { id: 4, name: "Classic White Luxury Shirt", category: "shirt", price: 2500 },
    { id: 5, name: "Black Matt Finished Shirt", category: "shirt", price: 2250 },
    { id: 6, name: "Classic Chino Pants", category: "pant", price: 2499 },
    { id: 7, name: "Luxury Denim Jeans", category: "pant", price: 2999 },
    { id: 8, name: "Khaki Smart Chinos", category: "pant", price: 2399 },
    { id: 9, name: "Jet Black Skinny Jeans", category: "pant", price: 2899 },
    { id: 10, name: "Charcoal Formal Trousers", category: "pant", price: 2650 }
];

let cart = [];

// Cart Toggle Logic
const cartSidebar = document.getElementById('cart-sidebar');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');

openCartBtn.addEventListener('click', (e) => { e.preventDefault(); cartSidebar.classList.add('active'); });
closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('active'));

// Add to Cart
function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalPriceEl = document.getElementById('total-price');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartItems.innerHTML += `<div class="cart-item">${item.name} - Rs. ${item.price} <button onclick="removeFromCart(${index})">x</button></div>`;
    });

    cartCount.innerText = cart.length;
    totalPriceEl.innerText = `Rs. ${total}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Search & Filter Logic
const searchInput = document.getElementById('search-input');
const navFilters = document.querySelectorAll('.nav-filter');

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        card.style.display = name.includes(term) ? 'block' : 'none';
    });
});

navFilters.forEach(filter => {
    filter.addEventListener('click', (e) => {
        e.preventDefault();
        const category = filter.getAttribute('data-filter');
        document.querySelectorAll('.product-card').forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// WhatsApp Checkout
document.getElementById('whatsapp-checkout').addEventListener('click', () => {
    if (cart.length === 0) return alert("Cart is empty!");
    let msg = "Order Request:\n" + cart.map(i => i.name + " - Rs." + i.price).join("\n");
    window.open(`https://wa.me/923295720165?text=${encodeURIComponent(msg)}`, '_blank');
});

// Render Products
const grid = document.getElementById('products-grid');
products.forEach(p => {
    grid.innerHTML += `
        <div class="product-card" data-category="${p.category}" data-name="${p.name}">
            <h3>${p.name}</h3>
            <p>Rs. ${p.price}</p>
            <button onclick="addToCart('${p.name}', ${p.price})">Add to Cart</button>
        </div>
    `;
});
