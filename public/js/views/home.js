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
        // For simplicity in this demo, we'll ALWAYS prepend them unless the user is specifically filtering out their categories/names.
        // But to keep it "dumb" and simple as requested: just prepend them to the list passed in.

        let allDisplayProducts = [...placeholderProducts, ...productsToRender];

        // If filtering is active (search or category), we might want to filter the placeholders too, 
        // but for a "demo" presence, let's keep them handy or just filter them simply.
        // Let's rely on the upstream filter for real products, and do a quick client-side filter for placeholders if needed.
        // Actually, to ensure they show up in searches, let's just add them to the initial 'products' list effectively 
        // by modifying the upstream call or just handling it here. 
        // Simplest approach: Just render them at the top always for visibility.

        // Re-filtering for search/category on placeholders to respect UI state:
        const searchTerm = searchBar.value.toLowerCase();
        const categoryId = categoryFilter.value;

        if (searchTerm || categoryId) {
            const filteredPlaceholders = placeholderProducts.filter(p => {
                const matchesSearch = p.title.toLowerCase().includes(searchTerm);
                // Placeholder categories are strings "Textbooks", real categories use IDs in filter. 
                // This mismatch makes category filtering placeholders tricky without mapping.
                // Let's just show them if no category is selected, or ignore category filter for them to keep them visible as "Featured".
                return matchesSearch;
            });
            // usage:
            allDisplayProducts = [...filteredPlaceholders, ...productsToRender];
        }


        if (allDisplayProducts.length > 0) {
            productGrid.innerHTML = allDisplayProducts.map(p => {
                // Safe title for onclick
                const safeTitle = p.title.replace(/'/g, "\\'");
                const safeSellerName = p.sellerName.replace(/'/g, "\\'");

                return `
                <div class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
                    <a href="#/products/${p.id}" class="block">
                        <img src="${p.image_url}" alt="${p.title}" class="w-full h-48 object-cover">
                    </a>
                    <div class="p-4 flex flex-col flex-grow">
                        <a href="#/products/${p.id}">
                            <h3 class="font-bold text-lg">${p.title}</h3>
                        </a>
                        <p class="text-indigo-600 font-semibold text-xl">$${p.price}</p>
                        <div class="mt-2 mb-4">
                            ${p.categories ? p.categories.split(',').map(cat => `<span class="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">${cat}</span>`).join('') : ''}
                        </div>
                        
                        <div class="mt-auto space-y-2">
                             <div class="grid grid-cols-2 gap-2">
                                <button onclick="window.addToWishlist('${p.id}', '${safeTitle}', '${safeSellerName}')" class="flex items-center justify-center px-3 py-2 border border-indigo-600 text-indigo-600 text-sm font-medium rounded-md hover:bg-indigo-50">
                                    <i class="far fa-heart mr-2"></i> Wishlist
                                </button>
                                <button onclick="alert('Demo: Contacting seller ${p.sellerName}...')" class="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50">
                                    <i class="far fa-envelope mr-2"></i> Contact
                                </button>
                            </div>
                            <button onclick="alert('Demo: Starting purchase for ${p.title}...')" class="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
                                <i class="fas fa-shopping-cart mr-2"></i> Buy Now
                            </button>
                        </div>

                        <p class="text-gray-500 text-xs mt-3">Sold by <a href="#/profile/${p.sellerId}" class="text-indigo-600 hover:underline" onclick="event.stopPropagation()">${p.sellerName}</a></p>
                    </div>
                </div>
            `;
            }).join('');
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
