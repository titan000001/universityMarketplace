// public/js/services/cart.js

const CART_KEY = 'shopping_cart';

function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();
    if (!cart.some(item => item.id === product.id)) {
        cart.push(product);
        saveCart(cart);
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
}

export { getCart, addToCart, removeFromCart, clearCart };
