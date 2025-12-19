// public/js/views/register.js
import { apiRequest } from '../services/api.js';
import { navigate } from '../router.js';

const registerView = () => `
    <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form id="register-form">
            <div class="mb-4">
                <label for="name" class="block text-gray-700">Full Name</label>
                <input type="text" id="name" name="name" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <div class="mb-4">
                <label for="student_id" class="block text-gray-700">Student ID</label>
                <input type="text" id="student_id" name="student_id" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <div class="mb-4">
                <label for="phone" class="block text-gray-700">Phone Number</label>
                <input type="tel" id="phone" name="phone" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <div class="mb-4">
                <label for="dept" class="block text-gray-700">Department</label>
                <input type="text" id="dept" name="dept" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <div class="mb-6">
                <label for="password" class="block text-gray-700">Password</label>
                <input type="password" id="password" name="password" class="w-full px-3 py-2 border rounded-lg" required>
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Register</button>
        </form>
    </div>
`;

const initRegister = () => {
    document.getElementById('register-form').addEventListener('submit', async e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
         try {
            await apiRequest('/register', 'POST', data);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) { /* alert is handled in apiRequest */ }
    });
};

export { registerView, initRegister };
