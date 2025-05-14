console.log("E-Commerce Website Loaded");

// Cart logic with localStorage persistence
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count on all elements with class .cart-count
function updateCartCount() {
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cart.length;
    });
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(product) {
    cart.push(product);
    updateCartCount();
    alert("Added to cart: " + product.title);
    console.log("Added to cart:", product);
}

// Remove product from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    openCartModal();
}

// Cart modal logic
function openCartModal() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return; // Don't run on product.html

    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItemsContainer.innerHTML = '';
    if (cart.length > 0) {
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div>${item.title}</div>
                <div>$${item.price}</div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.innerHTML = `Total: $${totalPrice.toFixed(2)}`;
    } else {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.innerHTML = "";
    }
    modal.style.display = 'block';
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = 'none';
}

// Hamburger menu for mobile
document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }

    // Cart modal event listeners (only on index.html)
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon && document.getElementById('cart-modal')) {
        cartIcon.addEventListener('click', openCartModal);
        document.getElementById('close-modal').addEventListener('click', closeCartModal);
    }

    // Product list page
    if (document.getElementById('product-grid')) {
        loadProducts();
    }

    // Product detail page
    if (window.location.pathname.includes("product.html")) {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        if (productId) {
            loadProductDetails(productId);
        }
    }
});

// Load products for index.html
function loadProducts() {
    const grid = document.getElementById('product-grid');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    loading.style.display = 'block';

    fetch('https://fakestoreapi.com/products')
        .then(response => {
            if (!response.ok) throw new Error("API request failed");
            return response.json();
        })
        .then(products => {
            loading.style.display = 'none';
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <a href="product.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.title}" loading="lazy" />
                        <div class="product-details">
                            <h3 class="product-title">${product.title}</h3>
                            <p class="product-price">$${product.price}</p>
                        </div>
                    </a>
                `;
                grid.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error loading products:", error);
            loading.style.display = 'none';
            errorMessage.textContent = "Failed to load products. Please try again later.";
        });
}

// Load product details for product.html
function loadProductDetails(productId) {
    const loading = document.getElementById('loading');
    const title = document.getElementById('product-title');
    const price = document.getElementById('product-price');
    const description = document.getElementById('product-description');
    const image = document.getElementById('product-main-image');
    const addBtn = document.getElementById('add-to-cart-btn');

    loading.style.display = 'block';
    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => {
            if (!response.ok) throw new Error("API request failed");
            return response.json();
        })
        .then(product => {
            loading.style.display = 'none';
            title.textContent = product.title;
            price.textContent = `$${product.price}`;
            description.textContent = product.description;
            image.src = product.image;
            image.alt = product.title;

            addBtn.disabled = false;
            addBtn.textContent = "Add to Cart";
            addBtn.onclick = function() {
                addToCart(product);
            };
        })
        .catch(error => {
            console.error("Error loading product details:", error);
            loading.style.display = 'none';
            title.textContent = "Failed to load product details.";
            addBtn.disabled = true;
        });
}
