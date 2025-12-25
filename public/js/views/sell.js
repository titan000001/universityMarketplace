// public/js/views/sell.js
import { apiRequest } from '../services/api.js';
import { navigate } from '../router.js';

const sellView = () => `
    <div class="max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md transition-colors duration-200">
        <h2 class="text-2xl font-bold text-center mb-6 dark:text-white">List a New Item</h2>
        <form id="sell-form" enctype="multipart/form-data" class="space-y-4">
            <div id="shop-selection-container" class="hidden animate__animated animate__fadeIn">
                <label for="shop_id" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sell via Your Shop?</label>
                <select id="shop_id" name="shop_id" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">No, sell as Individual</option>
                </select>
                <p class="text-xs text-gray-500 mt-1 italic">Link this item to your business channel for better branding.</p>
            </div>
            <div class="mb-4">
                <label for="title" class="block text-gray-700 dark:text-gray-300">Item Title</label>
                <input type="text" id="title" name="title" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            </div>
            <div class="mb-4">
                <label for="price" class="block text-gray-700 dark:text-gray-300">Price ($)</label>
                <input type="number" id="price" name="price" step="0.01" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            </div>
            <div class="mb-4">
                <label for="image" class="block text-gray-700 dark:text-gray-300">Image</label>
                <input type="file" id="image" name="image" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 dark:text-gray-300">Categories</label>
                <div id="categories-container" class="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-200">
                    <!-- Categories will be loaded here -->
                </div>
            </div>

            <div class="mb-4">
                <label for="tags" class="block text-gray-700 dark:text-gray-300">Tags (SEO keywords)</label>
                <input type="text" id="tags" name="tags" placeholder="e.g. Calculus, Textbook, Math 101" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate tags with commas.</p>
            </div>

            <!-- Meetup Location Selector -->
            <div class="mb-4">
                <label for="location_select" class="block text-gray-700 dark:text-gray-300">Preferred Meetup Spot</label>
                <select id="location_select" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Select a location...</option>
                    <option value='{"name":"Main Library", "lat":40.7128, "lng":-74.0060}'>Main Library</option>
                    <option value='{"name":"Student Center", "lat":40.7138, "lng":-74.0070}'>Student Center</option>
                    <option value='{"name":"Science Hall", "lat":40.7118, "lng":-74.0050}'>Science Hall</option>
                    <option value='{"name":"Gymnasium", "lat":40.7148, "lng":-74.0080}'>Gymnasium</option>
                    <option value='{"name":"Dormitory A", "lat":40.7158, "lng":-74.0090}'>Dormitory A</option>
                </select>
            </div>

            <div class="mb-6">
                <label for="description" class="block text-gray-700 dark:text-gray-300">Description</label>
                <textarea id="description" name="description" rows="4" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required></textarea>
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">List Item</button>
        </form>
    </div>
`;

const initSell = async () => {
    const categories = await apiRequest('/categories');
    const categoriesContainer = document.getElementById('categories-container');
    categoriesContainer.innerHTML = categories.map(cat => `
        <label class="flex items-center">
            <input type="checkbox" name="categories" value="${cat.id}" class="mr-2">
            ${cat.name}
        </label>
    `).join('');

    // Load User Shops
    try {
        const shops = await apiRequest('/shops/me');
        if (shops.length > 0) {
            const shopSelect = document.getElementById('shop_id');
            const shopContainer = document.getElementById('shop-selection-container');
            shopContainer.classList.remove('hidden');
            shops.forEach(shop => {
                const opt = document.createElement('option');
                opt.value = shop.id;
                opt.textContent = `Yes, via "${shop.name}"`;
                shopSelect.appendChild(opt);
            });
        }
    } catch (err) { console.error('Error fetching shops:', err); }

    document.getElementById('sell-form').addEventListener('submit', async e => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Handle categories
        const checkedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked'))
            .map(cb => cb.value);
        formData.delete('categories');
        checkedCategories.forEach(catId => formData.append('categories', catId));

        // Handle Location
        const locationSelect = document.getElementById('location_select');
        const selectedOption = locationSelect.value;
        if (selectedOption) {
            const locData = JSON.parse(selectedOption);
            formData.append('location_name', locData.name);
            formData.append('latitude', locData.lat);
            formData.append('longitude', locData.lng);
        }

        // ... continue submission

        try {
            await apiRequest('/products', 'POST', formData);
            alert('Item listed successfully!');
            navigate('/profile');
        } catch (error) { /* alert is handled in apiRequest */ }
    });
};

export { sellView, initSell };
