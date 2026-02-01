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
                <div class="relative">
                    <input type="password" id="password" name="password" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10" required>
                    <button type="button" id="toggle-password" class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Show password">
                        <i class="fas fa-eye" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all flex justify-center items-center gap-2">
                <span>Login</span>
            </button>
            <p class="text-center mt-4 dark:text-gray-400">
                Don't have an account? <a href="#/register" class="text-indigo-600 dark:text-indigo-400 hover:underline">Register here</a>.
            </p>
        </form>
    </div>
`;

const initLogin = () => {
    const form = document.getElementById('login-form');

    // Password Toggle Logic
    const toggleBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const icon = toggleBtn.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                toggleBtn.setAttribute('aria-label', 'Hide password');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                toggleBtn.setAttribute('aria-label', 'Show password');
            }
        });
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        try {
            setLoading(submitBtn, true, 'Logging in...');
            const result = await apiRequest('/login', 'POST', data);
            localStorage.setItem('token', result.token);
            navigate('/');
        } catch (error) {
            /* alert is handled in apiRequest */
        } finally {
            setLoading(submitBtn, false);
        }
    });
};

export { loginView, initLogin };
