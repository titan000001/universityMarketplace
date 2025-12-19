// public/js/views/profile.js
import { apiRequest } from '../services/api.js';

const profileView = () => `
    <div id="profile-content" class="max-w-4xl mx-auto">
        <div class="text-center p-8 text-gray-500">Loading profile... <i class="fas fa-spinner fa-spin"></i></div>
    </div>
`;

const initProfile = async (param) => {
    try {
        const { user, products } = await apiRequest(`/users/${param}`);
        const profileContent = document.getElementById('profile-content');

        profileContent.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-md mb-8">
                <h1 class="text-4xl font-bold text-gray-800">${user.name}</h1>
                <p class="text-lg text-gray-600">${user.dept}</p>
            </div>
            <div>
                <h2 class="text-2xl font-bold mb-4">Items for Sale</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${products.length > 0 ? products.map(p => `
                        <a href="#/products/${p.id}" class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                            <img src="${p.image_url}" alt="${p.title}" class="w-full h-48 object-cover">
                            <div class="p-4">
                                <h3 class="font-bold text-lg">${p.title}</h3>
                                <p class="text-indigo-600 font-semibold text-xl">$${p.price}</p>
                            </div>
                        </a>
                    `).join('') : '<p>This user has no items for sale.</p>'}
                </div>
            </div>
        `;
    } catch (error) {
        document.getElementById('main-content').innerHTML = `<p class="text-center text-red-500">Could not find this user's profile.</p>`;
    }
};

export { profileView, initProfile };
