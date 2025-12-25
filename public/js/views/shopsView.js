// public/js/views/shopsView.js
import { apiRequest } from '../services/api.js';

const shopsView = () => `
    <div class="mb-12 animate__animated animate__fadeIn">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Student Shops</h1>
                <p class="text-lg text-gray-600 dark:text-gray-400">Discover and support student-led businesses across campus.</p>
            </div>
            <button id="open-create-shop" class="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center">
                <i class="fas fa-plus mr-2"></i> Open Your Shop
            </button>
        </div>
    </div>

    <div id="shops-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="text-center p-8 text-gray-500 dark:text-gray-400">Loading shops... <i class="fas fa-spinner fa-spin"></i></div>
    </div>

    <!-- Create Shop Modal -->
    <div id="create-shop-modal" class="fixed inset-0 z-50 hidden overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-black opacity-50"></div>
            <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 animate__animated animate__zoomIn">
                <button id="close-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <i class="fas fa-times fa-lg"></i>
                </button>
                <h2 class="text-2xl font-bold mb-6 dark:text-white">Create Your Student Shop</h2>
                <form id="create-shop-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shop Name</label>
                        <input type="text" name="name" required class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g., Tech Essentials">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio (Tagline)</label>
                        <textarea name="bio" class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows="3" placeholder="Tell us what you sell..."></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo</label>
                        <input type="file" name="logo" accept="image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
                    </div>
                    <button type="submit" class="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">Launch Shop</button>
                </form>
            </div>
        </div>
    </div>
`;

const initShops = async () => {
    const shopsGrid = document.getElementById('shops-grid');
    const modal = document.getElementById('create-shop-modal');
    const openBtn = document.getElementById('open-create-shop');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('create-shop-form');

    // Modal Logic
    openBtn?.addEventListener('click', () => {
        if (!localStorage.getItem('token')) {
            alert('Please login to create a shop!');
            window.location.hash = '#/login';
            return;
        }
        modal.classList.remove('hidden');
    });

    closeBtn?.addEventListener('click', () => modal.classList.add('hidden'));

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/shops', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                alert('Shop created successfully!');
                modal.classList.add('hidden');
                loadShops();
            } else {
                const data = await response.json();
                alert(data.message || 'Error creating shop');
            }
        } catch (err) {
            console.error('Create Shop Error:', err);
        }
    });

    const loadShops = async () => {
        try {
            const shops = await apiRequest('/shops');
            if (shops.length > 0) {
                shopsGrid.innerHTML = shops.map((shop, i) => `
                    <a href="#/shops/${shop.id}" class="block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all card-3d overflow-hidden border border-gray-100 dark:border-gray-700 animate__animated animate__fadeInUp" style="animation-delay: ${i * 100}ms">
                        <div class="h-32 bg-indigo-100 dark:bg-indigo-900/30 relative">
                            ${shop.banner_url ? `<img src="${shop.banner_url}" class="w-full h-full object-cover">` : ''}
                            <div class="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 absolute -bottom-10 left-6 object-cover bg-white">
                                ${shop.logo_url ? `<img src="${shop.logo_url}" alt="${shop.name}" class="w-full h-full rounded-full object-cover">` : '<div class="w-full h-full flex items-center justify-center text-2xl bg-indigo-200">🏪</div>'}
                            </div>
                        </div>
                        <div class="pt-12 px-6 pb-6">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">${shop.name}</h3>
                            <div class="flex items-center mb-2">
                                <span class="text-yellow-400 mr-1"><i class="fas fa-star"></i></span>
                                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">${shop.average_rating ? parseFloat(shop.average_rating).toFixed(1) : 'New'} <span class="text-gray-400 text-xs">(${shop.review_count || 0})</span></span>
                            </div>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">${shop.bio || 'No bio yet.'}</p>
                            <div class="flex items-center justify-between text-xs text-gray-400">
                                <span><i class="fas fa-user-circle mr-1"></i> ${shop.owner_name}</span>
                                <span><i class="fas fa-clock mr-1"></i> ${new Date(shop.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-between mt-4 pt-4 px-6 border-t border-gray-100 dark:border-gray-700">
                            <span class="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center">
                                View Shop <i class="fas fa-arrow-right ml-2 text-xs"></i>
                            </span>
                        </div>
                    </a>
                `).join('');
            } else {
                shopsGrid.innerHTML = `
                    <div class="col-span-full text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <div class="mb-6 mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <i class="fas fa-store text-3xl text-gray-400"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No student shops yet</h3>
                        <p class="text-gray-500 dark:text-gray-400 mb-8">Be the first to turn your business idea into a campus reality!</p>
                        <button id="cta-create-shop" class="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-all">
                            Create Your Shop
                        </button>
                    </div>
                `;
                document.getElementById('cta-create-shop')?.addEventListener('click', () => openBtn.click());
            }
        } catch (error) {
            console.error('Shops Init Error:', error);
            shopsGrid.innerHTML = '<div class="col-span-full text-center text-red-500">Error loading shops. Please try again.</div>';
        }
    };

    loadShops();
};

export { shopsView, initShops };
