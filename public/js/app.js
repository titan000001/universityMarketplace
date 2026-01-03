// public/js/app.js
import { router, navigate } from './router.js';
import { getCart } from './services/cart.js';
import { apiRequest } from './services/api.js';

const navLinks = document.getElementById('nav-links');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuButton = document.getElementById('mobile-menu-button');

// Socket.io initialization
const socket = io();

// Notification Logic
socket.on('connect', () => {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = parseJwt(token);
        if (payload && payload.userId) {
            socket.emit('join_notifications', payload.userId);
        }
    }
});

socket.on('receive_notification', (data) => {
    // Assuming showToast is defined elsewhere or needs to be implemented
    // For now, we'll just log and update the badge
    console.log('Received notification:', data.message);
    updateNotificationBadge();
});

function updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    if (badge) {
        let count = parseInt(badge.innerText) || 0;
        badge.innerText = count + 1;
        badge.classList.remove('hidden');
    }
}

// Global functions
window.currentView = 'home';

// Dark Mode Logic
function initDarkMode() {
    const html = document.documentElement;
    const isDark = localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
}

function toggleDarkMode() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    updateNav(); // To update the icon
}

function isTokenExpired(token) {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
}

// Removed window.toggleDarkMode as it's blocked by CSP

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

async function updateNav() {
    const token = localStorage.getItem('token');
    const navLinks = document.getElementById('nav-links');
    const mobileMenu = document.getElementById('mobile-menu');

    if (token && isTokenExpired(token)) {
        localStorage.removeItem('token');
        window.location.reload();
        return;
    }

    // Check Dark Mode
    const isDark = document.documentElement.classList.contains('dark');
    const modeIcon = isDark ? 'fa-sun' : 'fa-moon';
    const modeLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    const toggleBtn = `<button aria-label="${modeLabel}" class="theme-toggle px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 ml-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <i class="fas ${modeIcon} theme-toggle-icon"></i>
    </button>`;

    let linksHtml = '';
    const cartCount = getCart().length;
    let wishlistCount = 0;

    if (token) {
        // User logged in
        const user = JSON.parse(atob(token.split('.')[1]));
        const isAdmin = user.role === 'admin';

        try {
            const wishlist = await apiRequest('/wishlist');
            wishlistCount = wishlist.length;
        } catch (e) {
            console.error('Failed to fetch wishlist count', e);
        }

        linksHtml = `
            <a href="#/" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Home</a>
            <a href="#/about" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">About</a>
            <a href="#/cart" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Cart <span id="cart-count" class="bg-red-500 text-white rounded-full px-2 text-xs ${cartCount > 0 ? '' : 'hidden'}">${cartCount}</span></a>
            <a href="#/wishlist" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Wishlist <span id="wishlist-count" class="bg-pink-500 text-white rounded-full px-2 text-xs ${wishlistCount > 0 ? '' : 'hidden'}">${wishlistCount}</span></a>
            <a href="#/shops" class="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40">Student Shops</a>
            <a href="#/sell" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Sell Item</a>
            ${isAdmin ? '<a href="#/admin" class="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100">Admin</a>' : ''}
            <div class="relative inline-block text-left group">
                <button class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
                    <i class="fas fa-user-circle mr-1"></i> ${user.name}
                </button>
                <!-- Dropdown wrapper with padding-top to bridge the gap -->
                <div class="absolute right-0 w-48 pt-2 hidden group-hover:block z-50">
                    <div class="bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-100 dark:border-gray-700">
                        <a href="#/profile/${user.userId}" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">My Profile</a>
                        <a href="#/manage-shop" class="block px-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700">Manage Your Shop</a>
                        <a href="#/my-profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">My Listings</a>
                        <a href="#/orders" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Order History</a>
                        <a href="#/contact" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Support</a>
                        <a href="#" id="logout-btn" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</a>
                    </div>
                </div>
            </div>
            ${toggleBtn}
        `;
    } else {
        // Guest
        linksHtml = `
            <a href="#/" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Home</a>
             <a href="#/cart" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Cart <span id="cart-count" class="bg-red-500 text-white rounded-full px-2 text-xs ${cartCount > 0 ? '' : 'hidden'}">${cartCount}</span></a>
            <a href="#/shops" class="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40">Student Shops</a>
            <a href="#/about" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">About</a>
            <a href="#/login" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Login</a>
            <a href="#/register" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 ml-2">Register</a>
            ${toggleBtn}
        `;
    }
    navLinks.innerHTML = linksHtml;
    mobileMenu.innerHTML = `<div class="px-2 pt-2 pb-3 space-y-1 block md:hidden bg-white dark:bg-gray-800">${linksHtml.replace(/class="/g, 'class="block ')}</div>`;

    document.getElementById('logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        navigate('/login');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initDarkMode(); // Initialize theme preference

    mobileMenuButton.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden');
        mobileMenuButton.setAttribute('aria-expanded', !isHidden);
    });

    // Event delegation for theme toggle (bypasses CSP issues with inline onclick)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.theme-toggle')) {
            toggleDarkMode();
        }
    });

    window.addEventListener('hashchange', router);
    router();
    updateNav(); // Also call on initial load
});

export { updateNav };

