document.addEventListener('DOMContentLoaded', () => {
    let cart = [];

    // Elements
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartIcon = document.querySelector('.fa-shopping-cart').parentElement;
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Dynamic Badge Create
    const cartBadge = document.createElement('span');
    cartBadge.style.cssText = `
        position: absolute; top: -8px; right: -10px; background-color: #b8860b;
        color: white; font-size: 11px; padding: 2px 6px; border-radius: 50%;
        font-weight: 600; display: none;
    `;
    cartIcon.style.position = 'relative';
    cartIcon.appendChild(cartBadge);

    // Open & Close Cart
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });

    const closeCart = () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    };

    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Add to Cart Logic
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const name = productCard.querySelector('h3').textContent;
            // Extract numeric price from "Rs. 2,499"
            const priceText = productCard.querySelector('.price').textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));

            // Add item to array
            cart.push({ name, price });
            updateCartUI();

            // Notification
            showNotification(`${name} added to cart!`);
        });
    });

    // Update Cart UI
    function updateCartUI() {
        // Update Badge
        if (cart.length > 0) {
            cartBadge.textContent = cart.length;
            cartBadge.style.display = 'block';
        } else {
            cartBadge.style.display = 'none';
        }

        // Update List
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            cartTotalPrice.textContent = 'Rs. 0';
            return;
        }

        let total = 0;
        cart.forEach(item => {
            total += item.price;
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Rs. ${item.price.toLocaleString()}</p>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalPrice.textContent = `Rs. ${total.toLocaleString()}`;
    }

  // ==========================================
    // 8. Next-Level WhatsApp Checkout System
    // ==========================================
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }

        // --- APNA WHATSAPP NUMBER YAHAN LIKHEIN ---
        // Format: Country code kay sath bina "+" ya extra zeros kay (e.g., 923001234567)
        const whatsappNumber = "923295720165"; 

        // Order Details Message Build Karein
        let messageText = `*New Order - Premium Threads*\n`;
        messageText += `-------------------------\n`;
        
        let total = 0;
        cart.forEach((item, index) => {
            messageText += `${index + 1}. *${item.name}* - Rs. ${item.price.toLocaleString()}\n`;
            total += item.price;
        });

        messageText += `-------------------------\n`;
        messageText += `*Total Bill:* Rs. ${total.toLocaleString()}\n\n`;
        messageText += `Kindly confirm my order!`;

        // URL Encode taaky spaces aur line breaks WhatsApp par sahi chalain
        const encodedMessage = encodeURIComponent(messageText);
        
        // WhatsApp API Link
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Notification dikhayein aur new tab mein WhatsApp kholein
        showNotification('Redirecting to WhatsApp...');
        
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
            // Order clear karein checkout kay baad
            cart = [];
            updateCartUI();
            closeCart();
        }, 1000);
    });
    // Toast Notification System
    function showNotification(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; background-color: #111111;
            color: #ffffff; padding: 15px 30px; border-left: 4px solid #b8860b;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2); border-radius: 4px; font-size: 14px;
            z-index: 10000; opacity: 0; transform: translateY(20px); transition: all 0.4s ease-in-out;
        `;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 10);
        setTimeout(() => {
            toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
    // ==========================================
    // 5. Next-Level Product Filter System
    // ==========================================
    const filterLinks = document.querySelectorAll('.nav-filter');
    const productCards = document.querySelectorAll('.product-card');

    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all links and add to clicked one
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const filterValue = link.getAttribute('data-filter');

            productCards.forEach(card => {
                // Animation effect directly via JS styling
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    if (filterValue === 'all' || card.classList.contains(filterValue)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
    // ==========================================
    // 6. Contact Form Submission
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values
            const name = document.getElementById('name').value;
            
            // Show premium toast notification
            showNotification(`Thank you, ${name}! Your message has been sent.`);
            
            // Reset form
            contactForm.reset();
        });
    }
    // ==========================================
    // 7. Mobile Menu Toggle Logic
    // ==========================================
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    const navLinksContainer = document.querySelector('.nav-links');
    const eachNavLink = document.querySelectorAll('.nav-filter');

    if (mobileMenuIcon) {
        mobileMenuIcon.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
            // Icon change from Bars to Times (X)
            const icon = mobileMenuIcon.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Menu link par click hotay hi menu band ho jaye
    eachNavLink.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('open')) {
                navLinksContainer.classList.remove('open');
                const icon = mobileMenuIcon.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });
});