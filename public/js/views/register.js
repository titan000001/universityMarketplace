// public/js/views/register.js
import { apiRequest } from '../services/api.js';
import { navigate } from '../router.js';
import { showToast } from '../utils/toast.js';
import { setLoading } from '../utils/loading.js';

const registerView = () => `
    <div class="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md transition-colors duration-200">
        <h2 class="text-2xl font-bold text-center mb-6 dark:text-white">Create Account</h2>
        <form id="register-form">
            <div class="mb-4">
                <label for="name" class="block text-gray-700 dark:text-gray-300">Full Name</label>
                <input type="text" id="name" name="name" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            </div>
            <div class="mb-4">
                <label for="student_id" class="block text-gray-700 dark:text-gray-300">Student ID</label>
                <input type="text" id="student_id" name="student_id" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            </div>
            <div class="mb-4">
                <label for="phone" class="block text-gray-700 dark:text-gray-300">Phone Number</label>
                <input type="tel" id="phone" name="phone" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            </div>
            <div class="mb-4">
                <label for="dept" class="block text-gray-700 dark:text-gray-300">Department</label>
                <select id="dept" name="dept" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                    <option value="">Select Department...</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="English">English</option>
                    <option value="Law">Law</option>
                    <option value="Media & Journalism">Media & Journalism</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="mb-6">
                <label for="password" class="block text-gray-700 dark:text-gray-300">Password</label>
                <div class="relative">
                    <input type="password" id="password" name="password" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10" required>
                    <button type="button" id="toggle-password" class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Show password">
                        <i class="fas fa-eye" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Register</button>
        </form>
    </div>
`;

const initRegister = () => {
    const form = document.getElementById('register-form');

    // Password Toggle Logic
    const toggleBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';

            // Update Icon
            const icon = toggleBtn.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');

            // Update ARIA Label
            toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            setLoading(submitBtn, true, 'Registering...');
            await apiRequest('/register', 'POST', data);
            showToast('Registration successful! Please log in.', 'success');
            navigate('/login');
        } catch (error) {
            /* toast is handled in apiRequest */
        } finally {
            setLoading(submitBtn, false);
        }
    });
};

export { registerView, initRegister };
