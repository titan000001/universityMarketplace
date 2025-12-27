// public/js/services/api.js
const API_URL = '/api';

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
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            } else {
                const text = await response.text();
                throw new Error(text || `Request failed with status ${response.status}`);
            }
        }
        if (response.status === 204 || (response.status === 200 && method === 'DELETE')) {
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
