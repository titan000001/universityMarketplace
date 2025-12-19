// public/js/views/edit-product.js
import { apiRequest } from '../services/api.js';
import { navigate } from '../router.js';

const editProductView = () => `
    <div class="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center mb-6">Edit Item</h2>
        <form id="edit-product-form" enctype="multipart/form-data">
            <input type="hidden" id="product-id" name="id">
            <div class="mb-4">
                <label for="title" class="block text-gray-700">Item Title</label>
                <input type="text" id="title" name="title" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <div class="mb-4">
                <label for="price" class="block text-gray-700">Price ($)</label>
                <input type="number" id="price" name="price" step="0.01" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <div class="mb-4">
                <label for="image" class="block text-gray-700">Image (leave blank to keep current image)</label>
                <input type="file" id="image" name="image" class="w-full px-3 py-2 border rounded-lg">
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
            <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Update Item</button>
        </form>
    </div>
`;

const initEditProduct = async (param) => {
    try {
        const [product, allCategories] = await Promise.all([
            apiRequest(`/products/${param}`),
            apiRequest('/categories')
        ]);

        document.getElementById('product-id').value = product.id;
        document.getElementById('title').value = product.title;
        document.getElementById('price').value = product.price;
        document.getElementById('description').value = product.description;

        const categoriesContainer = document.getElementById('categories-container');
        const productCategories = product.categories ? product.categories.split(',') : [];
        categoriesContainer.innerHTML = allCategories.map(cat => `
            <label class="flex items-center">
                <input type="checkbox" name="categories" value="${cat.id}" class="mr-2" ${productCategories.includes(cat.name) ? 'checked' : ''}>
                ${cat.name}
            </label>
        `).join('');

        document.getElementById('edit-product-form').addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const checkedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked'))
                                           .map(cb => cb.value);
            formData.delete('categories');
            checkedCategories.forEach(catId => {
                formData.append('categories', catId);
            });

            try {
                await apiRequest(`/products/${product.id}`, 'PUT', formData);
                alert('Item updated successfully!');
                navigate('/profile');
            } catch (error) { /* alert is handled in apiRequest */ }
        });
    } catch (error) {
        document.getElementById('main-content').innerHTML = `<p class="text-center text-red-500">Could not find this product.</p>`;
    }
};

export { editProductView, initEditProduct };
