// public/js/views/shopProfileView.js
import { apiRequest } from '../services/api.js';

const shopProfileView = () => `
    <div id="shop-header" class="mb-12">
        <div class="text-center p-8 text-gray-500 dark:text-gray-400">Loading shop profile... <i class="fas fa-spinner fa-spin"></i></div>
    </div>

    <div class="mb-8 flex items-center justify-between">
        <h2 class="text-2xl font-bold dark:text-white">Shop Products</h2>
        <div id="product-count" class="text-gray-500 dark:text-gray-400"></div>
    </div>

    <div id="shop-product-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Products will be loaded here -->
    </div>
`;

const initShopProfile = async (id) => {
    try {
        const shopData = await apiRequest(`/shops/${id}`);
        const shopHeader = document.getElementById('shop-header');
        const shopProductGrid = document.getElementById('shop-product-grid');
        const productCount = document.getElementById('product-count');

        shopHeader.innerHTML = `
            <div class="relative rounded-3xl overflow-hidden shadow-2xl mb-8">
                <div class="h-64 md:h-80 bg-gradient-to-br from-indigo-500 to-purple-800">
                    ${shopData.banner_url ? `<img src="${shopData.banner_url}" class="w-full h-full object-cover opacity-60">` : ''}
                </div>
                <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div class="text-center px-4">
                        <div class="mb-6 relative inline-block">
                            <img src="${shopData.logo_url || '/images/default-shop.png'}" class="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-8 border-white dark:border-gray-800 shadow-2xl object-cover bg-white animate__animated animate__bounceIn">
                        </div>
                        <h1 class="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-2xl mb-2">${shopData.name}</h1>
                        <p class="text-indigo-100 text-lg md:text-xl font-medium mb-4 drop-shadow-md">Professional Shop by ${shopData.ownerName}</p>
                    </div>
                </div>
            </div>
            <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 animate__animated animate__fadeIn">
                <h3 class="text-xl font-bold dark:text-white mb-4 flex items-center">
                    <i class="fas fa-info-circle mr-3 text-indigo-500"></i> About the Shop
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg italic italic-indigo-800">${shopData.bio || 'This student entrepreneur is building something amazing! Check out their unique products below.'}</p>
                <div class="mt-6 pt-6 border-t border-gray-50 dark:border-gray-700 flex flex-wrap gap-4 text-sm text-gray-500">
                    <span><i class="fas fa-calendar-alt mr-2"></i> Established ${new Date(shopData.created_at).toLocaleDateString()}</span>
                    <span><i class="fas fa-graduation-cap mr-2"></i> ${shopData.dept}</span>
                </div>
            </div>
        `;

        const products = shopData.products || [];
        productCount.innerText = `${products.length} Items Available`;

        if (products.length > 0) {
            shopProductGrid.innerHTML = products.map((p, i) => `
                <a href="#/products/${p.id}" class="block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden card-3d flex flex-col h-full animate__animated animate__fadeInUp" style="animation-delay: ${i * 100}ms">
                    <img src="${p.image_url}" alt="${p.title}" class="w-full h-48 object-cover">
                    <div class="p-5 flex flex-col flex-grow">
                        <h3 class="font-bold text-lg mb-2 dark:text-white line-clamp-1">${p.title}</h3>
                        <p class="text-indigo-600 dark:text-indigo-400 font-black text-2xl mb-4">$${p.price}</p>
                        <div class="mt-auto">
                            <span class="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-xs font-bold rounded-lg uppercase tracking-wider">
                                View Details
                            </span>
                        </div>
                    </div>
                </a>
            `).join('');
        } else {
            shopProductGrid.innerHTML = `
                <div class="col-span-full text-center py-16 text-gray-400">
                    <p class="text-xl">No products currently listed in this shop.</p>
                </div>
            `;
        }

    } catch (error) {
        console.error('Shop Profile Init Error:', error);
    }
};

export { shopProfileView, initShopProfile };
