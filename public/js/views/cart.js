// public/js/views/cart.js
import { getCart, removeFromCart } from '../services/cart.js';
import { updateNav } from '../app.js';

const cartView = () => `
    <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Shopping Cart</h1>
        <p class="text-lg text-gray-600">Contact the sellers to purchase these items.</p>
    </div>
    <div id="cart-items" class="space-y-4">
        <!-- Cart items will be loaded here -->
    </div>
`;

const initCart = () => {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');

    if (cart.length > 0) {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-lg">${item.title}</h3>
                    <p class="text-gray-600">$${item.price}</p>
                    <p class="text-sm text-gray-500">Sold by: ${item.sellerName}</p>
                    <p class="text-sm text-gray-500">Contact: ${item.sellerPhone}</p>
                </div>
                <button data-id="${item.id}" class="remove-from-cart-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Remove</button>
            </div>
        `).join('');

        cartItemsContainer.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id, 10);
                removeFromCart(productId);
                initCart(); // Re-render the cart view
                updateNav(); // Update the cart count in the nav
            });
        });

    } else {
        cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
    }
};

export { cartView, initCart };
