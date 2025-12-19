import { apiRequest } from '../services/api.js';
import { getCart, addToCart, removeFromCart } from '../services/cart.js';
import { updateNav } from '../app.js';

const productDetailView = () => `
     <div id="product-detail-content" class="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <div class="text-center p-8 text-gray-500">Loading details... <i class="fas fa-spinner fa-spin"></i></div>
    </div>
    <div id="comments-section" class="max-w-4xl mx-auto mt-8">
        <h2 class="text-2xl font-bold mb-4">Comments</h2>
        <div id="comments-list" class="space-y-4"></div>
        <form id="comment-form" class="mt-4">
            <textarea name="comment" class="w-full px-3 py-2 border rounded-lg" placeholder="Add a comment..." required></textarea>
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

        detailContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img src="${product.image_url}" alt="${product.title}" class="w-full h-auto rounded-lg shadow-lg">
                </div>
                <div>
                    <h1 class="text-3xl font-bold mb-2">${product.title}</h1>
                    <div class="flex items-center mb-4">
                        <p class="text-3xl text-indigo-600 font-bold mr-4">$${product.price}</p>
                        ${product.categories ? product.categories.split(',').map(cat => `<span class="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">${cat}</span>`).join('') : ''}
                    </div>
                    <p class="text-gray-700 mb-6">${product.description}</p>
                    <div class="flex gap-4 mb-4">
                        <button id="wishlist-btn" class="w-full py-2 rounded-lg ${isWishlisted ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white">
                            ${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </button>
                        <button id="cart-btn" class="w-full py-2 rounded-lg ${isInCart ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} text-white">
                            ${isInCart ? 'Remove from Cart' : 'Add to Cart'}
                        </button>
                    </div>
                    <div class="bg-gray-100 p-4 rounded-lg">
                        <h2 class="text-xl font-semibold mb-2">Seller Information</h2>
                        <p><strong>Name:</strong> <a href="#/profile/${product.sellerId}" class="text-indigo-600 hover:underline">${product.sellerName}</a></p>
                        <p><strong>Department:</strong> ${product.sellerDept}</p>
                        <p><strong>Contact Phone:</strong> ${product.sellerPhone}</p>
                    </div>
                </div>
            </div>
        `;

        const commentsList = document.getElementById('comments-list');
        if (comments.length > 0) {
            commentsList.innerHTML = comments.map(c => `
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="font-bold">${c.userName}</p>
                    <p class="text-gray-600">${new Date(c.created_at).toLocaleString()}</p>
                    <p class="mt-2">${c.comment}</p>
                </div>
            `).join('');
        } else {
            commentsList.innerHTML = '<p>No comments yet.</p>';
        }

        const wishlistBtn = document.getElementById('wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', async () => {
                if (isWishlisted) {
                    await apiRequest(`/wishlist/${product.id}`, 'DELETE');
                } else {
                    await apiRequest('/wishlist', 'POST', { productId: product.id });
                }
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
