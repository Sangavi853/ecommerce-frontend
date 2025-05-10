console.log("E-Commerce Website Loaded");

// Toggle navigation menu on small screens
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });

    loadProducts();
});

let cart = [];  // To store cart items

// Update cart count display
function updateCartCount() {
    const cartCountElement = document.querySelector(".cart-count");
    cartCountElement.textContent = cart.length;  // Update the count based on the cart array length
}

// Function to add item to the cart
function addToCart(product) {
    cart.push(product);  // Add product to the cart
    updateCartCount();  // Update the cart icon count
    console.log("Added to cart:", product);
}

// Open cart modal
function openCartModal() {
    const modal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItemsContainer.innerHTML = '';  // Clear previous cart items

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

        // Calculate total price
        const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.innerHTML = `Total: $${totalPrice.toFixed(2)}`;
    } else {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.innerHTML = "";
    }

    modal.style.display = 'block';
}

// Close cart modal
function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'none';
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);  // Remove item from cart by index
    updateCartCount();  // Update the cart count
    openCartModal();  // Reopen the modal to reflect changes
}

// Sample product data
function loadProducts() {
    const grid = document.getElementById('product-grid');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    // Show loading message
    loading.style.display = 'block';

    fetch('https://fakestoreapi.com/products')
        .then(response => {
            if (!response.ok) {
                throw new Error("API request failed");
            }
            return response.json();
        })
        .then(products => {
            loading.style.display = 'none';
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" loading="lazy" />
                    <div class="product-details">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-price">$${product.price}</p>
                        <p class="product-description">${product.description.substring(0, 100)}...</p>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                `;
                
                // Add event listener for the "Add to Cart" button
                const addToCartButton = card.querySelector('.add-to-cart');
                addToCartButton.addEventListener('click', () => addToCart(product));

                grid.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error loading products:", error);
            loading.style.display = 'none';
            errorMessage.textContent = "Failed to load products. Please try again later.";
        });
}

// Open cart when cart icon is clicked
document.querySelector('.cart-icon').addEventListener('click', openCartModal);

// Close cart modal when close button is clicked
document.getElementById('close-modal').addEventListener('click', closeCartModal);
