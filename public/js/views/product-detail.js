import { apiRequest } from '../services/api.js';
import { getCart, addToCart, removeFromCart } from '../services/cart.js';
import { updateNav } from '../app.js';

const productDetailView = () => `
     <div id="product-detail-content" class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-4xl mx-auto transition-colors duration-200">
        <div class="text-center p-8 text-gray-500 dark:text-gray-400">Loading details... <i class="fas fa-spinner fa-spin"></i></div>
    </div>
    <div id="comments-section" class="max-w-4xl mx-auto mt-8">
        <h2 class="text-2xl font-bold mb-4 dark:text-white">Comments</h2>
        <div id="comments-list" class="space-y-4"></div>
        <form id="comment-form" class="mt-4">
            <textarea name="comment" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" placeholder="Add a comment..." required></textarea>
            <button type="submit" class="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">Post Comment</button>
        </form>
    </div>
`;

const initProductDetail = async (param) => {
    try {
        const [product, wishlist, comments] = await Promise.all([
            apiRequest(`/products/${param}`),
            localStorage.getItem('token') ? apiRequest('/wishlist').catch(() => []) : Promise.resolve([]),
            apiRequest(`/comments/${param}`)
        ]);

        const detailContent = document.getElementById('product-detail-content');
        const isWishlisted = wishlist.some(item => item.id === product.id);
        const cart = getCart();
        const isInCart = cart.some(item => item.id === product.id);

        // Price Analytics Logic
        let analyticsHtml = '';
        if (product.averagePrice) {
            const diff = product.averagePrice - product.price;
            const percentageOff = (diff / product.averagePrice) * 100;
            const isGoodDeal = percentageOff > 10; // 10% cheaper than average

            analyticsHtml = `
                <div class="mt-4 mb-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg border border-blue-100 dark:border-gray-600">
                    <h3 class="text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide mb-2">Price Analytics</h3>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Market Average for items in this category:</p>
                            <p class="text-lg font-semibold text-gray-800 dark:text-gray-200">$${product.averagePrice.toFixed(2)}</p>
                        </div>
                        ${isGoodDeal ?
                    `<div class="flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full">
                                <i class="fas fa-check-circle mr-2"></i>
                                <span class="font-bold text-sm">Great Deal!</span>
                            </div>` :
                    `<div class="text-sm text-gray-500 dark:text-gray-400">Fair Market Value</div>`
                }
                    </div>
                </div>
            `;
        }

        // Map Logic
        let mapHtml = '';
        if (product.latitude && product.longitude) {
            mapHtml = `
                <div class="mt-6">
                    <h2 class="text-xl font-semibold mb-2 dark:text-white">Suggested Meetup Location</h2>
                    <p class="mb-2 text-gray-600 dark:text-gray-400"><i class="fas fa-map-marker-alt text-red-500 mr-2"></i>${product.location_name || 'Campus Location'}</p>
                    <div id="map" class="w-full h-64 rounded-lg shadow-md z-0"></div>
                </div>
            `;
        }

        detailContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="animate__animated animate__fadeInLeft">
                    <img src="${product.image_url}" alt="${product.title}" class="w-full h-auto rounded-lg shadow-lg mb-6">
                    ${mapHtml}
                </div>
                <div class="animate__animated animate__fadeInRight">
                    <h1 class="text-3xl font-bold mb-2 dark:text-white">${product.title}</h1>
                    <div class="flex items-center mb-4">
                        <p class="text-3xl text-indigo-600 dark:text-indigo-400 font-bold mr-4">$${product.price}</p>
                        ${product.categories ? product.categories.split(',').map(cat => `<span class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full border dark:border-gray-600">${cat}</span>`).join('') : ''}
                    </div>

                    ${product.tags ? `
                        <div class="mb-4 flex flex-wrap gap-2">
                             ${product.tags.split(',').map(tag => `<span class="bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 text-xs px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800">#${tag.trim()}</span>`).join('')}
                        </div>
                    ` : ''}

                    ${analyticsHtml}

                    <p class="text-gray-700 dark:text-gray-300 mb-6">${product.description}</p>
                    <div class="flex gap-4 mb-4">
                        <button id="wishlist-btn" class="w-full py-2 rounded-lg ${isWishlisted ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white">
                            ${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </button>
                        <button id="cart-btn" class="w-full py-2 rounded-lg ${isInCart ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} text-white">
                            ${isInCart ? 'Remove from Cart' : 'Add to Cart'}
                        </button>
                    </div>

                    <a href="#/chat/${product.id}-${product.sellerId}" class="block w-full py-2 mb-4 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition-colors">
                        <i class="fas fa-comments mr-2"></i> Message Seller
                    </a>

                    <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <h2 class="text-xl font-semibold mb-2 dark:text-white">Seller Information</h2>
                        <p class="dark:text-gray-300"><strong>Name:</strong> <a href="#/profile/${product.sellerId}" class="text-indigo-600 dark:text-indigo-400 hover:underline">${product.sellerName}</a></p>
                        <p class="dark:text-gray-300"><strong>Department:</strong> ${product.sellerDept}</p>
                        <p class="dark:text-gray-300"><strong>Contact Phone:</strong> ${product.sellerPhone}</p>
                    </div>
                </div>
            </div>
        `;

        // Initialize Map if data exists
        if (product.latitude && product.longitude && window.L) {
            const map = L.map('map').setView([product.latitude, product.longitude], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([product.latitude, product.longitude]).addTo(map)
                .bindPopup(product.location_name || 'Meetup Spot')
                .openPopup();

            // Leaflet fix for rendering in dynamic container
            setTimeout(() => { map.invalidateSize(); }, 100);
        }

        const commentsList = document.getElementById('comments-list');
        if (comments.length > 0) {
            commentsList.innerHTML = comments.map(c => `
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p class="font-bold dark:text-gray-200">${c.userName}</p>
                    <p class="text-gray-600 dark:text-gray-400">${new Date(c.created_at).toLocaleString()}</p>
                    <p class="mt-2 dark:text-gray-300">${c.comment}</p>
                </div>
            `).join('');
        } else {
            commentsList.innerHTML = '<p class="dark:text-gray-400">No comments yet.</p>';
        }

        const wishlistBtn = document.getElementById('wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', async () => {
                if (isWishlisted) {
                    await apiRequest(`/wishlist/${product.id}`, 'DELETE');
                } else {
                    await apiRequest('/wishlist', 'POST', { productId: product.id });
                }
                updateNav(); // Update the wishlist count in navbar
                initProductDetail(param); // Re-render the view to update the button
            });
        }

        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                if (isInCart) {
                    removeFromCart(product.id);
                } else {
                    addToCart(product);
                }
                initProductDetail(param);
                updateNav();
            });
        }


        document.getElementById('comment-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            try {
                await apiRequest(`/comments/${product.id}`, 'POST', data);
                initProductDetail(param); // Re-render to show the new comment
            } catch (error) {
                // error is already alerted in apiRequest
            }
        });

    } catch (error) {
        document.getElementById('main-content').innerHTML = `<p class="text-center text-red-500">Could not find this product.</p>`;
    }
};

export { productDetailView, initProductDetail };
