// public/js/router.js
import { homeView, initHome } from './views/home.js';
import { loginView, initLogin } from './views/login.js';
import { registerView, initRegister } from './views/register.js';
import { sellView, initSell } from './views/sell.js';
import { myProductsView, initMyProducts } from './views/my-products.js';
import { profileView, initProfile } from './views/profile.js';
import { productDetailView, initProductDetail } from './views/product-detail.js';
import { editProductView, initEditProduct } from './views/edit-product.js';
import { adminView, initAdmin } from './views/admin.js';
import { wishlistView, initWishlist } from './views/wishlist.js';
import { cartView, initCart } from './views/cart.js';
import { checkoutView, initCheckout } from './views/checkout.js';
import { updateNav } from './app.js';
import { chatView, initChat } from './views/chat.js';
import { aboutView, initAbout } from './views/about.js';

const routes = {
    '/': { view: homeView, init: initHome },
    '/login': { view: loginView, init: initLogin },
    '/register': { view: registerView, init: initRegister },
    '/sell': { view: sellView, init: initSell },
    '/my-profile': { view: myProductsView, init: initMyProducts },
    '/profile/:id': { view: profileView, init: initProfile },
    '/wishlist': { view: wishlistView, init: initWishlist },
    '/cart': { view: cartView, init: initCart },
    '/products/:id': { view: productDetailView, init: initProductDetail },
    '/edit-product/:id': { view: editProductView, init: initEditProduct },
    '/admin': { view: adminView, init: initAdmin },
    '/chat/:params': { view: chatView, init: initChat },
    '/about': { view: aboutView, init: initAbout },
    '/checkout': { view: checkoutView, init: initCheckout }
};

const mainContent = document.getElementById('main-content');

function navigate(path) {
    window.location.hash = path;
}

async function router() {
    const path = window.location.hash.slice(1) || '/';
    let view, param;

    const match = Object.keys(routes).find(route => {
        const routeParts = route.split('/');
        const pathParts = path.split('/');
        if (routeParts.length !== pathParts.length) return false;

        return routeParts.every((part, i) => {
            return part.startsWith(':') || part === pathParts[i];
        });
    });

    if (match) {
        const routeParts = match.split('/');
        const pathParts = path.split('/');
        const params = {};
        routeParts.forEach((part, i) => {
            if (part.startsWith(':')) {
                params[part.substring(1)] = pathParts[i];
            }
        });
        // Simplistic assumption that we only ever have "id" or "params"
        param = params.id || params.params;
        view = routes[match];
    }

    if (view) {
        mainContent.innerHTML = view.view(param);
        await view.init(param);
        updateNav();
    } else {
        mainContent.innerHTML = '<h1>404 - Page Not Found</h1>';
    }
    document.getElementById('mobile-menu').classList.add('hidden'); // Close mobile menu on navigation
}

export { navigate, router };
