// public/js/services/api.js
const API_URL = 'http://localhost:3000/api';

async function apiRequest(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    const options = {
        method,
        headers: {},
    };
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body instanceof FormData) {
        options.body = body;
    } else if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(API_URL + endpoint, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred');
        }
        if (response.status === 204 || response.status === 200 && method === 'DELETE') {
             return { message: 'Success' };
        }
        return response.json();
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('API Request Error:', error);
        throw error;
    }
}

export { apiRequest };
