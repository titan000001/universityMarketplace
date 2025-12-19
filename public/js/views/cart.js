// public/js/views/cart.js
import { getCart, removeFromCart, clearCart } from '../services/cart.js';
import { checkout } from '../services/order.js';
import { updateNav } from '../app.js';
import { navigate } from '../router.js';

const cartView = () => `
    <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Shopping Cart</h1>
    </div>
    <div id="cart-message" class="hidden mb-4 p-4 rounded text-center"></div>
    <div id="cart-items" class="space-y-4">
        <!-- Cart items will be loaded here -->
    </div>
    <div id="checkout-section" class="mt-8 text-center hidden">
        <button id="checkout-btn" class="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition duration-300">Checkout</button>
    </div>
`;

const initCart = () => {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const checkoutSection = document.getElementById('checkout-section');
    const cartMessage = document.getElementById('cart-message');

    if (cart.length > 0) {
        checkoutSection.classList.remove('hidden');
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

        document.getElementById('checkout-btn').addEventListener('click', async () => {
            const productIds = cart.map(item => item.id);
            try {
                // Check if user is logged in
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                await checkout(productIds);

                clearCart();
                updateNav();

                cartItemsContainer.innerHTML = '';
                checkoutSection.classList.add('hidden');

                cartMessage.textContent = 'Order placed successfully!';
                cartMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700');
                cartMessage.classList.add('bg-green-100', 'text-green-700');

                // Optional: Redirect after a few seconds
                // setTimeout(() => navigate('/my-profile'), 2000);

            } catch (error) {
                cartMessage.textContent = error.message;
                cartMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
                cartMessage.classList.add('bg-red-100', 'text-red-700');
            }
        });

    } else {
        cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
        checkoutSection.classList.add('hidden');
    }
};

export { cartView, initCart };
