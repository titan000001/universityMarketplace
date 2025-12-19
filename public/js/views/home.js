// public/js/views/home.js
import { apiRequest } from '../services/api.js';

const homeView = () => `
    <div class="relative bg-gray-900 text-white rounded-2xl overflow-hidden mb-12 shadow-2xl h-[400px] group">
        <img src="/images/hero-banner.jpg" alt="University Campus" class="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105">
        <div class="relative z-10 p-8 md:p-16 h-full flex flex-col justify-center items-start text-left bg-gradient-to-r from-indigo-900/90 via-indigo-900/40 to-transparent">
            <h1 class="text-5xl md:text-7xl font-extrabold mb-4 text-white drop-shadow-xl tracking-tight leading-tight">
                UniMarket
                <span class="block text-2xl md:text-3xl font-medium mt-3 text-indigo-200">Your Campus. Your Economy.</span>
            </h1>
            <p class="text-lg md:text-xl text-gray-100 max-w-lg mb-8 drop-shadow-md font-light leading-relaxed">
                The trusted platform to find cheap textbooks, sell old gear, and connect safely with students at your university.
            </p>
            <div class="flex gap-4">
                <button onclick="document.getElementById('product-grid').scrollIntoView({behavior: 'smooth'})" class="px-8 py-3 bg-white text-indigo-700 font-bold rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
                    Browse Items
                </button>
                <a href="#/sell" class="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-500 hover:shadow-xl transition-all transform hover:-translate-y-1 border border-indigo-400 backdrop-blur-sm bg-opacity-90">
                    Start Selling
                </a>
            </div>
        </div>
    </div>
    <div class="mb-8 flex justify-center gap-4">
        <input type="search" id="search-bar" placeholder="Search for items..." class="w-full md:w-1/2 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
        <select id="category-filter" class="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">All Categories</option>
            <!-- Categories will be loaded here -->
        </select>
    </div>
    <div id="product-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="text-center p-8 text-gray-500 dark:text-gray-400">Loading items... <i class="fas fa-spinner fa-spin"></i></div>
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
                <a href="#/products/${p.id}" class="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
                    <img src="${p.image_url}" alt="${p.title}" class="w-full h-48 object-cover">
                    <div class="p-4 flex flex-col flex-grow justify-between">
                        <div>
                            <h3 class="font-bold text-lg mb-1 dark:text-white">${p.title}</h3>
                            <p class="text-indigo-600 dark:text-indigo-400 font-semibold text-xl mb-2">$${p.price}</p>
                            <div class="mb-2">
                                ${p.categories ? p.categories.split(',').map(cat => `<span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full border border-gray-300 dark:border-gray-600">${cat}</span>`).join('') : ''}
                            </div>
                        </div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                            Sold by <span class="text-indigo-600 dark:text-indigo-400 font-medium">${p.sellerName}</span>
                        </p>
                    </div>
                </a>
            `).join('');
        } else {
            productGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <img src="/images/empty-state.png" alt="No items found" class="mx-auto w-48 mb-4 opacity-75">
                    <p class="text-xl text-gray-500 dark:text-gray-400">Oops! No items match your search.</p>
                </div>
            `;
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
