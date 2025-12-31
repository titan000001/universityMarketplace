// public/js/views/login.js
import { apiRequest } from '../services/api.js';
import { navigate } from '../router.js';
import { setLoading } from '../utils/loading.js';

const loginView = () => `
    <div class="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md transition-colors duration-200">
        <h2 class="text-2xl font-bold text-center mb-6 dark:text-white">Login</h2>
        <form id="login-form">
            <div class="mb-4">
                <label for="student_id" class="block text-gray-700 dark:text-gray-300">Student ID</label>
                <input type="text" id="student_id" name="student_id" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            </div>
            <div class="mb-6">
                <label for="password" class="block text-gray-700 dark:text-gray-300">Password</label>
                <input type="password" id="password" name="password" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Login</button>
            <p class="text-center mt-4 dark:text-gray-400">
                Don't have an account? <a href="#/register" class="text-indigo-600 dark:text-indigo-400 hover:underline">Register here</a>.
            </p>
        </form>
    </div>
`;

const initLogin = () => {
    document.getElementById('login-form').addEventListener('submit', async e => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            setLoading(btn, true, 'Logging in...');
            const result = await apiRequest('/login', 'POST', data);
            localStorage.setItem('token', result.token);
            navigate('/');
        } catch (error) {
            /* alert is handled in apiRequest */
            setLoading(btn, false);
        }
    });
};

export { loginView, initLogin };
