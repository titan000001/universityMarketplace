// public/js/views/login.js
import { apiRequest } from '../services/api.js';
import { navigate } from '../router.js';

const loginView = () => `
    <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
        <form id="login-form">
            <div class="mb-4">
                <label for="student_id" class="block text-gray-700">Student ID</label>
                <input type="text" id="student_id" name="student_id" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <div class="mb-6">
                <label for="password" class="block text-gray-700">Password</label>
                <input type="password" id="password" name="password" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Login</button>
            <p class="text-center mt-4">
                Don't have an account? <a href="#/register" class="text-indigo-600 hover:underline">Register here</a>.
            </p>
        </form>
    </div>
`;

const initLogin = () => {
    document.getElementById('login-form').addEventListener('submit', async e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        try {
            const result = await apiRequest('/login', 'POST', data);
            localStorage.setItem('token', result.token);
            navigate('/');
        } catch (error) { /* alert is handled in apiRequest */ }
    });
};

export { loginView, initLogin };
