// public/js/views/manageShopView.js
import { apiRequest } from '../services/api.js';
import { navigate } from '../router.js';

const manageShopView = () => `
    <div class="max-w-2xl mx-auto">
        <div id="manage-shop-form-container" class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <!-- Form will be dynamically loaded here -->
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-spinner fa-spin fa-2x"></i>
            </div>
        </div>
    </div>
`;

const initManageShop = async () => {
    try {
        const shops = await apiRequest('/shops/me');
        const container = document.getElementById('manage-shop-form-container');

        const isEditing = shops.length > 0;
        const shop = isEditing ? shops[0] : null;

        container.innerHTML = `
            <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
                ${isEditing ? 'Manage Your Shop' : 'Create Your Shop'}
            </h2>
            <p class="text-gray-500 dark:text-gray-400 mb-8">
                ${isEditing ? 'Update your business details and branding.' : 'Start your entrepreneurial journey today!'}
            </p>

            <form id="shop-form" class="space-y-6">
                <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Shop Name</label>
                    <input type="text" name="name" value="${shop?.name || ''}" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. Pixel Perfect Gear" required>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Shop Bio</label>
                    <textarea name="bio" rows="4" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Tell students what your shop is all about...">${shop?.bio || ''}</textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Shop Logo</label>
                        <div class="relative group">
                            <input type="file" name="logo" class="hidden" id="logo-input" accept="image/*">
                            <label for="logo-input" class="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all bg-gray-50 dark:bg-gray-700/30 overflow-hidden">
                                <div id="logo-preview-container" class="flex flex-col items-center">
                                    ${shop?.logo_url ? `<img src="${shop.logo_url}" class="absolute inset-0 w-full h-full object-cover">` : '<i class="fas fa-image text-3xl text-gray-300 mb-2"></i><span class="text-xs text-gray-500">Upload Logo</span>'}
                                </div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Shop Banner</label>
                        <div class="relative group">
                            <input type="file" name="banner" class="hidden" id="banner-input" accept="image/*">
                            <label for="banner-input" class="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all bg-gray-50 dark:bg-gray-700/30 overflow-hidden">
                                <div id="banner-preview-container" class="flex flex-col items-center">
                                    ${shop?.banner_url ? `<img src="${shop.banner_url}" class="absolute inset-0 w-full h-full object-cover">` : '<i class="fas fa-images text-3xl text-gray-300 mb-2"></i><span class="text-xs text-gray-500">Upload Banner</span>'}
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="flex gap-4 pt-4">
                    <button type="submit" class="flex-grow bg-indigo-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform active:scale-95">
                        ${isEditing ? 'Save Changes' : 'Launch Shop'}
                    </button>
                    ${isEditing ? `
                        <button type="button" id="delete-shop-btn" class="px-6 py-4 border-2 border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-all">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </form>
        `;

        // Preview logic
        ['logo', 'banner'].forEach(type => {
            document.getElementById(`${type}-input`).addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (re) => {
                        document.getElementById(`${type}-preview-container`).innerHTML = `<img src="${re.target.result}" class="absolute inset-0 w-full h-full object-cover">`;
                    };
                    reader.readAsDataURL(file);
                }
            });
        });

        // Delete logic
        document.getElementById('delete-shop-btn')?.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete your shop? Your products will remain as individual listings.')) {
                await apiRequest(`/shops/${shop.id}`, 'DELETE');
                alert('Shop deleted successfully.');
                navigate('/profile');
            }
        });

        // Submit logic
        document.getElementById('shop-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            try {
                const method = isEditing ? 'PUT' : 'POST';
                const url = isEditing ? `/shops/${shop.id}` : '/shops';

                await apiRequest(url, method, formData);
                alert(isEditing ? 'Shop updated!' : 'Congratulations! Your shop is live!');
                navigate('/profile');
            } catch (err) {
                console.error(err);
            }
        });

    } catch (error) {
        console.error('Manage Shop Init Error:', error);
    }
};

export { manageShopView, initManageShop };
