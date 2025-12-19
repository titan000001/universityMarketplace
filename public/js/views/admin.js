// public/js/views/admin.js
import { apiRequest } from '../services/api.js';

const adminView = () => `
    <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p class="text-lg text-gray-600">Manage users and products.</p>
    </div>
    <div id="admin-content"></div>
`;

const initAdmin = async () => {
    try {
        const users = await apiRequest('/admin/users');
        const adminContent = document.getElementById('admin-content');
        adminContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">All Users</h2>
            <div class="bg-white p-4 rounded-lg shadow-md">
                <table class="w-full">
                    <thead>
                        <tr>
                            <th class="text-left">ID</th>
                            <th class="text-left">Name</th>
                            <th class="text-left">Student ID</th>
                            <th class="text-left">Role</th>
                            <th class="text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.student_id}</td>
                                <td>${user.role}</td>
                                <td>
                                    <button data-id="${user.id}" class="delete-user-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        adminContent.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const userId = e.target.dataset.id;
                if (confirm(`Are you sure you want to delete user ${userId}?`)) {
                    try {
                        await apiRequest(`/admin/users/${userId}`, 'DELETE');
                        initAdmin(); // Refresh the user list
                    } catch (error) {
                        // alert is handled in apiRequest
                    }
                }
            });
        });
    } catch (error) {
        document.getElementById('main-content').innerHTML = `<p class="text-center text-red-500">You do not have permission to view this page.</p>`;
    }
};

export { adminView, initAdmin };
