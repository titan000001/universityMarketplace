// public/js/views/my-products.js
import { apiRequest } from '../services/api.js';
import { router } from '../router.js';

const myProductsView = () => `
    <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">My Listings</h1>
        <p class="text-lg text-gray-600">Here are the items you have listed for sale.</p>
    </div>
    <div id="my-product-list" class="space-y-4">
         <div class="text-center p-8 text-gray-500">Loading your items... <i class="fas fa-spinner fa-spin"></i></div>
    </div>
`;

const initMyProducts = async () => {
    try {
        const myProducts = await apiRequest('/my-products');
        const productList = document.getElementById('my-product-list');
         if (myProducts.length > 0) {
            productList.innerHTML = myProducts.map(p => `
                <div class="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                     <div>
                        <h3 class="font-bold text-lg">${p.title}</h3>
                        <p class="text-gray-600">$${p.price}</p>
                    </div>
                    <div>
                        <a href="#/edit-product/${p.id}" class="edit-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2">Edit</a>
                        <button data-id="${p.id}" class="delete-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                    </div>
                </div>
            `).join('');
            // Add event listeners for delete buttons
            productList.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if(confirm('Are you sure you want to delete this item?')) {
                         try {
                            await apiRequest(`/products/${e.target.dataset.id}`, 'DELETE');
                            router(); // Refresh view
                        } catch (error) { /* alert is handled in apiRequest */ }
                    }
                });
            });
        } else {
             productList.innerHTML = '<p class="text-center">You have not listed any items yet.</p>';
        }
    } catch(error) {
        document.getElementById('main-content').innerHTML = `<p class="text-center text-red-500">You must be logged in to see this page.</p>`;
    }
};

export { myProductsView, initMyProducts };
