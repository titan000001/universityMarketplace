// public/js/services/order.js
const API_URL = '/api';

export const checkout = async (productIds) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productIds })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Checkout failed');
    }

    return await response.json();
};
