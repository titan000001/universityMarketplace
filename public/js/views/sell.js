// public/js/views/sell.js
import { apiRequest } from '../services/api.js';
import { navigate } from '../router.js';

const sellView = () => `
    <div class="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center mb-6">List a New Item</h2>
        <form id="sell-form" enctype="multipart/form-data">
            <div class="mb-4">
                <label for="title" class="block text-gray-700">Item Title</label>
                <input type="text" id="title" name="title" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <div class="mb-4">
                <label for="price" class="block text-gray-700">Price ($)</label>
                <input type="number" id="price" name="price" step="0.01" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <div class="mb-4">
                <label for="image" class="block text-gray-700">Image</label>
                <input type="file" id="image" name="image" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700">Categories</label>
                <div id="categories-container" class="grid grid-cols-2 gap-2">
                    <!-- Categories will be loaded here -->
                </div>
            </div>
            <div class="mb-6">
                <label for="description" class="block text-gray-700">Description</label>
                <textarea id="description" name="description" rows="4" class="w-full px-3 py-2 border rounded-lg" required></textarea>
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

    document.getElementById('sell-form').addEventListener('submit', async e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // Since FormData can't handle multiple values for the same key from checkboxes,
        // we get them manually and append them.
        const checkedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked'))
                                       .map(cb => cb.value);
        
        // Remove the default categories entry if it exists
        formData.delete('categories');
        
        checkedCategories.forEach(catId => {
            formData.append('categories', catId);
        });

        try {
            await apiRequest('/products', 'POST', formData);
            alert('Item listed successfully!');
            navigate('/profile');
        } catch (error) { /* alert is handled in apiRequest */ }
    });
};

export { sellView, initSell };
