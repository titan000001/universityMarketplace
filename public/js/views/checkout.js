// public/js/views/checkout.js
import { getCart, clearCart } from '../services/cart.js';
import { apiRequest } from '../services/api.js';
import { navigate } from '../router.js';

const checkoutView = () => `
    <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md transition-colors duration-200">
        <h2 class="text-3xl font-bold text-center mb-6 dark:text-white">Checkout</h2>
        
        <div id="checkout-items" class="mb-6 space-y-4">
            <!-- Items summary -->
        </div>

        <div class="border-t pt-4 dark:border-gray-700">
            <div class="flex justify-between items-center text-xl font-bold dark:text-white">
                <span>Total Amount:</span>
                <span id="checkout-total">$0.00</span>
            </div>
        </div>

        <div class="mt-8 bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border border-blue-100 dark:border-gray-600">
            <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-2">Payment Method</h3>
            <div class="flex items-center">
                <i class="fas fa-handshake text-green-500 text-2xl mr-3"></i>
                <div>
                    <p class="font-semibold text-gray-700 dark:text-gray-300">Cash on Meetup</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Pay the seller directly when you meet.</p>
                </div>
            </div>
        </div>

        <button id="confirm-order-btn" class="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold text-lg shadow-lg">
            Confirm Order
        </button>

        <button id="cancel-checkout-btn" class="w-full mt-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            Cancel and Return to Cart
        </button>
    </div>
`;

const initCheckout = () => {
    const cart = getCart();

    if (cart.length === 0) {
        alert('Your cart is empty.');
        navigate('/cart');
        return;
    }

    const itemsContainer = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total');

    itemsContainer.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center border-b pb-2 dark:border-gray-700">
            <div>
                <p class="font-semibold dark:text-white">${item.title}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Sold by: ${item.sellerName}</p>
            </div>
            <p class="font-bold dark:text-gray-200">$${item.price}</p>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    totalEl.textContent = `$${total.toFixed(2)}`;

    // Confirm Order
    document.getElementById('confirm-order-btn').addEventListener('click', async () => {
        try {
            const items = cart.map(item => ({ id: item.id, price: item.price }));
            const response = await apiRequest('/orders', 'POST', { items });

            alert(`Order Placed Successfully! Order ID: ${response.orderId}`);

            clearCart();
            // In a real app, update nav for cart count
            window.location.reload(); // Simplest way to refresh nav and go to home, or use updates
            navigate('/');
        } catch (error) {
            console.error(error);
            // Alert handled by apiRequest mostly, but just in case
        }
    });

    document.getElementById('cancel-checkout-btn').addEventListener('click', () => {
        navigate('/cart');
    });
};

export { checkoutView, initCheckout };
