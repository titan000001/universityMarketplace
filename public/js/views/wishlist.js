// public/js/views/wishlist.js
import { apiRequest } from '../services/api.js';

const wishlistView = () => `
    <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">My Wishlist</h1>
        <p class="text-lg text-gray-600">Here are the items you have saved.</p>
    </div>
    <div id="wishlist-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="text-center p-8 text-gray-500">Loading your wishlist... <i class="fas fa-spinner fa-spin"></i></div>
    </div>
`;

const initWishlist = async () => {
    try {
        const wishlist = await apiRequest('/wishlist');
        const wishlistGrid = document.getElementById('wishlist-grid');

        if (wishlist.length > 0) {
            wishlistGrid.innerHTML = wishlist.map(p => `
                <a href="#/products/${p.id}" class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <img src="${p.image_url}" alt="${p.title}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h3 class="font-bold text-lg">${p.title}</h3>
                        <p class="text-indigo-600 font-semibold text-xl">$${p.price}</p>
                    </div>
                </a>
            `).join('');
        } else {
            wishlistGrid.innerHTML = '<p class="text-center col-span-full">Your wishlist is empty.</p>';
        }
    } catch (error) {
        document.getElementById('main-content').innerHTML = `<p class="text-center text-red-500">You must be logged in to see this page.</p>`;
    }
};

export { wishlistView, initWishlist };
