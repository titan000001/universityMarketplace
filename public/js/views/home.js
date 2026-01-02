// public/js/views/home.js
import { apiRequest } from '../services/api.js';
import { debounce } from '../utils/debounce.js';

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
                <a href="#/sell" class="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg btn-flashy border border-indigo-400 backdrop-blur-sm bg-opacity-90">
                    Start Selling
                </a>
            </div>
        </div>
    </div>
    <div class="mb-8 flex justify-center gap-4">
        <input type="search" id="search-bar" aria-label="Search products" placeholder="Search for items..." class="w-full md:w-1/2 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
        <select id="category-filter" aria-label="Filter by category" class="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
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
    const placeholderProducts = [
        {
            id: 'demo-1',
            title: 'Demo: Engineering Textbook',
            price: '45.00',
            image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=60',
            sellerId: 0,
            sellerName: 'Demo Student',
            categories: 'Textbooks'
        },
        {
            id: 'demo-2',
            title: 'Demo: Graphing Calculator',
            price: '85.50',
            image_url: 'https://images.unsplash.com/photo-1587145820266-a5951eebebb1?auto=format&fit=crop&w=500&q=60',
            sellerId: 0,
            sellerName: 'Demo Student',
            categories: 'Electronics'
        },
        {
            id: 'demo-3',
            title: 'Demo: Study Lamp',
            price: '15.00',
            image_url: 'https://images.unsplash.com/photo-1534234058263-08053a25170d?auto=format&fit=crop&w=500&q=60',
            sellerId: 0,
            sellerName: 'Demo Student',
            categories: 'Furniture'
        }
    ];

    const renderProducts = (productsToRender) => {
        // Combine placeholders with real products if we are showing the initial list or if the search matches them
        let allDisplayProducts = [...placeholderProducts, ...productsToRender];

        // Re-filtering for search/category on placeholders to respect UI state:
        const searchTerm = searchBar.value.toLowerCase();
        const categoryId = categoryFilter.value;

        if (searchTerm || categoryId) {
            const filteredPlaceholders = placeholderProducts.filter(p => {
                const matchesSearch = p.title.toLowerCase().includes(searchTerm);
                // Placeholder categories are strings "Textbooks", real categories use IDs in filter.
                // Let's just show them if no category is selected, or ignore category filter for them.
                return matchesSearch;
            });
            allDisplayProducts = [...filteredPlaceholders, ...productsToRender];
        }

        if (allDisplayProducts.length > 0) {
            productGrid.innerHTML = allDisplayProducts.map((p, i) => {
                // Safe title for onclick
                const safeTitle = p.title.replace(/'/g, "\\'");
                const safeSellerName = p.sellerName.replace(/'/g, "\\'");

                return `
                <div class="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden card-3d flex flex-col h-full animate__animated animate__fadeInUp" style="animation-delay: ${i * 100}ms">
                    <a href="#/products/${p.id}" class="block">
                        <img src="${p.image_url}" alt="${p.title}" class="w-full h-48 object-cover">
                    </a>
                    <div class="p-4 flex flex-col flex-grow">
                        <a href="#/products/${p.id}">
                            <h3 class="font-bold text-lg mb-1 dark:text-white">${p.title}</h3>
                        </a>
                        <p class="text-indigo-600 dark:text-indigo-400 font-semibold text-xl mb-2">$${p.price}</p>
                        <div class="mb-2">
                            ${p.categories ? p.categories.split(',').map(cat => `<span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full border border-gray-300 dark:border-gray-600">${cat}</span>`).join('') : ''}
                        </div>
                        
                        <div class="mt-auto space-y-2">
                             <div class="grid grid-cols-2 gap-2">
                                <button onclick="window.addToWishlist('${p.id}', '${safeTitle}', '${safeSellerName}')" class="flex items-center justify-center px-3 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 text-sm font-medium rounded-md hover:bg-indigo-50 dark:hover:bg-gray-700">
                                    <i class="far fa-heart mr-2"></i> Wishlist
                                </button>
                                <button onclick="alert('Demo: Contacting seller ${safeSellerName}...')" class="flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <i class="far fa-envelope mr-2"></i> Contact
                                </button>
                            </div>
                            <button onclick="alert('Demo: Starting purchase for ${safeTitle}...')" class="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
                                <i class="fas fa-shopping-cart mr-2"></i> Buy Now
                            </button>
                        </div>

                        <p class="text-gray-500 dark:text-gray-400 text-sm mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                            Sold by <a href="#/profile/${p.sellerId}" class="text-indigo-600 dark:text-indigo-400 hover:underline" onclick="event.stopPropagation()">${p.sellerName}</a>
                        </p>
                    </div>
                </div>
            `;
            }).join('');
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

    searchBar.addEventListener('input', debounce(filterAndRender, 300));
    categoryFilter.addEventListener('change', filterAndRender);

    // Global Wishlist Handler
    window.addToWishlist = async (id, title, sellerName) => {
        // Check if demo product
        if (id.toString().startsWith('demo') || isNaN(id)) {
            alert(`Demo: Added ${title} to your Wishlist!`);
            return;
        }

        // Real product logic
        try {
            await apiRequest('/wishlist', 'POST', { productId: id });
            alert(`Success: Added ${title} to your Wishlist!`);
        } catch (error) {
            // apiRequest handles general alert, but we can customize if needed
            if (error.message.includes('token')) {
                alert('Please login to add items to your wishlist.');
                window.location.hash = '/login';
            }
        }
    };
};

export { homeView, initHome };
