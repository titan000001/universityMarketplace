// public/js/app.js
import { router, navigate } from './router.js';
import { getCart } from './services/cart.js';

const navLinks = document.getElementById('nav-links');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuButton = document.getElementById('mobile-menu-button');

function parseJwt (token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

function updateNav() {
    const token = localStorage.getItem('token');
    const cart = getCart();
    let links;
    if (token) {
        const user = parseJwt(token);
        const isAdmin = user && user.role === 'admin';

        links = `
            <a href="#/" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">Home</a>
            <a href="#/sell" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">Sell an Item</a>
            <a href="#/my-profile" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">My Listings</a>
            <a href="#/wishlist" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">My Wishlist</a>
            <a href="#/cart" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">Cart (${cart.length})</a>
            ${isAdmin ? '<a href="#/admin" class="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">Admin</a>' : ''}
            <a href="#" id="logout-btn" class="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50">Logout</a>
        `;
    } else {
        links = `
            <a href="#/" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">Home</a>
            <a href="#/login" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">Login</a>
            <a href="#/register" class="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Register</a>
        `;
    }
    navLinks.innerHTML = links;
    mobileMenu.innerHTML = `<div class="px-2 pt-2 pb-3 space-y-1">${links.replace(/class="/g, 'class="block ')}</div>`;

    document.getElementById('logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        navigate('/login');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    window.addEventListener('hashchange', router);
    router();
    updateNav(); // Also call on initial load
});

export { updateNav };

