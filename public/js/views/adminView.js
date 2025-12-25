import { apiRequest } from '../services/api.js';

const adminView = () => `
    <div class="mb-8 animate__animated animate__fadeIn">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400">Platform overview and management.</p>
    </div>

    <!-- Stats Cards -->
    <div id="admin-stats" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Users</h3>
            <p id="stat-users" class="text-3xl font-bold text-gray-900 dark:text-white">...</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Products</h3>
            <p id="stat-products" class="text-3xl font-bold text-gray-900 dark:text-white">...</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Orders</h3>
            <p id="stat-orders" class="text-3xl font-bold text-gray-900 dark:text-white">...</p>
        </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">User Growth (Last 7 Days)</h3>
            <canvas id="userGrowthChart"></canvas>
        </div>
        <!-- Placeholder for Sales Chart -->
         <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-center">
            <div class="text-center">
                 <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Sales Analytics</h3>
                 <p class="text-gray-500">Coming soon with payment integration.</p>
            </div>
        </div>
    </div>

    <!-- User Management -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">User Management</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead class="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase font-medium">
                    <tr>
                        <th class="px-6 py-3">Name</th>
                        <th class="px-6 py-3">Student ID</th>
                        <th class="px-6 py-3">Role</th>
                        <th class="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody id="user-list-body" class="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr><td colspan="4" class="px-6 py-4 text-center">Loading users...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
`;

const initAdmin = async () => {
    try {
        const analytics = await apiRequest('/admin/analytics');
        const users = await apiRequest('/admin/users');

        // Update Stats
        document.getElementById('stat-users').innerText = analytics.totalUsers;
        document.getElementById('stat-products').innerText = analytics.totalProducts;
        document.getElementById('stat-orders').innerText = analytics.totalOrders;

        // Render Chart
        const ctx = document.getElementById('userGrowthChart').getContext('2d');
        const labels = analytics.dailyUsers.map(d => new Date(d.date).toLocaleDateString());
        const data = analytics.dailyUsers.map(d => d.count);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'New Users',
                    data: data,
                    borderColor: '#3B82F6',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Render Users Table
        const tbody = document.getElementById('user-list-body');
        if (users.length > 0) {
            tbody.innerHTML = users.map(user => `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td class="px-6 py-4 font-medium">${user.name}</td>
                    <td class="px-6 py-4">${user.student_id}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}">
                            ${user.role}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        ${user.role !== 'admin' ? `
                            <button class="text-red-500 hover:text-red-700 delete-user-btn" data-id="${user.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `).join('');

            // Attach listeners
            document.querySelectorAll('.delete-user-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if (confirm('Are you sure you want to ban this user?')) {
                        const id = e.target.closest('button').dataset.id;
                        await apiRequest(`/admin/users/${id}`, 'DELETE');
                        alert('User banned/deleted.');
                        initAdmin(); // Reload
                    }
                });
            });
        }

    } catch (error) {
        console.error('Admin Init Error:', error);
        window.location.hash = '#/'; // Redirect if unauthorized
    }
};

export { adminView, initAdmin };
