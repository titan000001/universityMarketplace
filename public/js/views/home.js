// public/js/views/home.js
import { apiRequest } from '../services/api.js';

const homeView = () => `
    <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Marketplace</h1>
        <p class="text-lg text-gray-600">Buy and sell items from fellow students.</p>
    </div>
    <div class="mb-8 flex justify-center gap-4">
        <input type="search" id="search-bar" placeholder="Search for items..." class="w-full md:w-1/2 px-4 py-2 border rounded-lg">
        <select id="category-filter" class="px-4 py-2 border rounded-lg">
            <option value="">All Categories</option>
            <!-- Categories will be loaded here -->
        </select>
    </div>
    <div id="product-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="text-center p-8 text-gray-500">Loading items... <i class="fas fa-spinner fa-spin"></i></div>
    </div>
`;

const initHome = async () => {
    const [products, categories] = await Promise.all([
        apiRequest('/products'),
        apiRequest('/categories')
    ]);

    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.innerHTML += categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');

    const productGrid = document.getElementById('product-grid');
    const searchBar = document.getElementById('search-bar');

    const renderProducts = (productsToRender) => {
        if (productsToRender.length > 0) {
            productGrid.innerHTML = productsToRender.map(p => `
                <a href="#/products/${p.id}" class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <img src="${p.image_url}" alt="${p.title}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h3 class="font-bold text-lg">${p.title}</h3>
                        <p class="text-indigo-600 font-semibold text-xl">$${p.price}</p>
                        <div class="mt-2">
                            ${p.categories ? p.categories.split(',').map(cat => `<span class="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">${cat}</span>`).join('') : ''}
                        </div>
                        <p class="text-gray-500 text-sm mt-2">Sold by <a href="#/profile/${p.sellerId}" class="text-indigo-600 hover:underline" onclick="event.stopPropagation()">${p.sellerName}</a></p>
                    </div>
                </a>
            `).join('');
        } else {
             productGrid.innerHTML = '<p class="text-center col-span-full">No items match your search.</p>';
        }
    };

    renderProducts(products);

    const filterAndRender = async () => {
        const searchTerm = searchBar.value;
        const categoryId = categoryFilter.value;
        let url = '/products?';
        if (searchTerm) {
            url += `search=${searchTerm}&`;
        }
        if (categoryId) {
            url += `category=${categoryId}`;
        }
        const filteredProducts = await apiRequest(url);
        renderProducts(filteredProducts);
    };

    searchBar.addEventListener('input', filterAndRender);
    categoryFilter.addEventListener('change', filterAndRender);
};

export { homeView, initHome };
