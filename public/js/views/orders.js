import { apiRequest } from '../services/api.js';

const ordersView = () => `
    <div id="orders-content" class="max-w-4xl mx-auto p-4">
        <h1 class="text-3xl font-bold mb-6 dark:text-white">Order History</h1>
        <div id="orders-list" class="space-y-6">
            <div class="text-center p-8 text-gray-500">Loading orders... <i class="fas fa-spinner fa-spin"></i></div>
        </div>
    </div>
`;

const initOrders = async () => {
    try {
        const orders = await apiRequest('/orders');
        const ordersList = document.getElementById('orders-list');

        if (orders.length === 0) {
            ordersList.innerHTML = `
                <div class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <i class="fas fa-shopping-bag text-6xl text-gray-300 mb-4"></i>
                    <p class="text-xl text-gray-500 dark:text-gray-400 mb-4">You haven't placed any orders yet.</p>
                    <a href="#/" class="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Start Shopping</a>
                </div>
            `;
            return;
        }

        ordersList.innerHTML = orders.map(order => `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border dark:border-gray-700">
                <div class="p-4 bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Order Placed</p>
                        <p class="font-medium dark:text-white">${new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total</p>
                        <p class="font-medium dark:text-white">$${parseFloat(order.total_amount).toFixed(2)}</p>
                    </div>
                    <div>
                         <p class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Order #</p>
                        <p class="font-medium dark:text-white">${order.id}</p>
                    </div>
                     <div>
                        <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}">
                            ${order.status}
                        </span>
                    </div>
                </div>
                <div class="p-4">
                    ${order.items.map(item => `
                        <div class="flex items-center py-4 border-b dark:border-gray-700 last:border-0">
                            <img src="${item.product.image_url}" alt="${item.product.title}" class="w-16 h-16 object-cover rounded-md border dark:border-gray-600 mr-4">
                            <div class="flex-1">
                                <a href="#/products/${item.product.id}" class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                                    ${item.product.title}
                                </a>
                                <p class="text-gray-500 dark:text-gray-300 text-sm">$${parseFloat(item.price).toFixed(2)}</p>
                            </div>
                            <div class="text-right">
                                <a href="#/products/${item.product.id}" class="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600">Buy Again</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error(error);
        document.getElementById('orders-list').innerHTML = `
            <div class="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                Failed to load orders. Please try again later.
            </div>
        `;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'completed': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export { ordersView, initOrders };
