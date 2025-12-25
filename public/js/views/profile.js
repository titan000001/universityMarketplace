// public/js/views/profile.js
import { apiRequest } from '../services/api.js';

const profileView = () => `
    <div id="profile-content" class="max-w-4xl mx-auto">
        <div class="text-center p-8 text-gray-500">Loading profile... <i class="fas fa-spinner fa-spin"></i></div>
    </div>
`;

const initProfile = async (param) => {
    try {
        const { user, products } = await apiRequest(`/users/${param}`);
        const profileContent = document.getElementById('profile-content');

        const currentUserToken = localStorage.getItem('token');
        let isOwner = false;
        if (currentUserToken) {
            const currentUser = JSON.parse(atob(currentUserToken.split('.')[1]));
            // Check if param is "my-profile" (handled by router logic passing ID) or specific ID matches
            isOwner = currentUser.userId == user.id;
        }

        const socialLinks = user.social_links ? JSON.parse(user.social_links) : {};
        const avatarUrl = user.avatar_url || 'https://placehold.co/150';

        profileContent.innerHTML = `
            <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8 transition-colors duration-200">
                <div class="flex flex-col md:flex-row items-center">
                    <img src="${avatarUrl}" alt="${user.name}" class="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 dark:border-gray-700 mb-4 md:mb-0 md:mr-8">
                    <div class="text-center md:text-left flex-1">
                        <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">${user.name}</h1>
                        <p class="text-lg text-indigo-600 dark:text-indigo-400 font-medium mb-3">${user.dept}</p>
                        ${user.bio ? `<p class="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl">${user.bio}</p>` : '<p class="text-gray-400 italic mb-4">No bio provided.</p>'}

                        <div class="flex justify-center md:justify-start space-x-4 mb-4">
                            ${socialLinks.linkedin ? `<a href="${socialLinks.linkedin}" target="_blank" class="text-blue-600 hover:text-blue-800 text-2xl"><i class="fab fa-linkedin"></i></a>` : ''}
                            ${socialLinks.github ? `<a href="${socialLinks.github}" target="_blank" class="text-gray-800 dark:text-gray-200 hover:text-black text-2xl"><i class="fab fa-github"></i></a>` : ''}
                            ${socialLinks.website ? `<a href="${socialLinks.website}" target="_blank" class="text-green-600 hover:text-green-800 text-2xl"><i class="fas fa-globe"></i></a>` : ''}
                        </div>
                    </div>
                    ${isOwner ? `
                        <button id="edit-profile-btn" class="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            <i class="fas fa-edit mr-2"></i> Edit Profile
                        </button>
                    ` : ''}
                </div>

                <!-- Edit Form (Hidden by default) -->
                ${isOwner ? `
                    <div id="edit-profile-form-container" class="hidden mt-8 border-t dark:border-gray-700 pt-6">
                        <h3 class="text-xl font-bold mb-4 dark:text-white">Edit Profile</h3>
                        <form id="edit-profile-form">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                                    <textarea name="bio" rows="3" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">${user.bio || ''}</textarea>
                                </div>
                                <div>
                                    <label class="block text-gray-700 dark:text-gray-300 mb-2">Profile Picture</label>
                                    <input type="file" name="avatar" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label class="block text-gray-700 dark:text-gray-300 mb-2">LinkedIn URL</label>
                                    <input type="url" name="linkedin" value="${socialLinks.linkedin || ''}" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                </div>
                                <div>
                                    <label class="block text-gray-700 dark:text-gray-300 mb-2">GitHub URL</label>
                                    <input type="url" name="github" value="${socialLinks.github || ''}" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                </div>
                                <div>
                                    <label class="block text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
                                    <input type="url" name="website" value="${socialLinks.website || ''}" class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                </div>
                            </div>
                            <div class="flex justify-end gap-2">
                                <button type="button" id="cancel-edit-btn" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">Cancel</button>
                                <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Save Changes</button>
                            </div>
                        </form>
                    </div>
                ` : ''}
            </div>

            <div>
                <h2 class="text-2xl font-bold mb-4 dark:text-white">Items for Sale</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${products.length > 0 ? products.map(p => `
                        <a href="#/products/${p.id}" class="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border dark:border-gray-700">
                            <img src="${p.image_url}" alt="${p.title}" class="w-full h-48 object-cover">
                            <div class="p-4">
                                <h3 class="font-bold text-lg dark:text-white">${p.title}</h3>
                                <p class="text-indigo-600 dark:text-indigo-400 font-semibold text-xl">$${p.price}</p>
                            </div>
                        </a>
                    `).join('') : '<p class="dark:text-gray-300">This user has no items for sale.</p>'}
                </div>
            </div>
        `;

        // Event Listeners for Edit Form
        if (isOwner) {
            const editBtn = document.getElementById('edit-profile-btn');
            const formContainer = document.getElementById('edit-profile-form-container');
            const cancelBtn = document.getElementById('cancel-edit-btn');
            const form = document.getElementById('edit-profile-form');

            editBtn.addEventListener('click', () => formContainer.classList.remove('hidden'));
            cancelBtn.addEventListener('click', () => formContainer.classList.add('hidden'));

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);

                // Construct social links JSON
                const socialLinks = {
                    linkedin: formData.get('linkedin'),
                    github: formData.get('github'),
                    website: formData.get('website')
                };
                formData.append('social_links', JSON.stringify(socialLinks));

                // Remove individual social fields to avoid cluttering backend if logic differed,
                // but since backend ignores unknown fields or we sent everything in FormData,
                // we just need to make sure backend looks for 'social_links'.
                // Our backend expects 'social_links' in body.
                // FormData automatically handles file uploads ('avatar') and text fields.

                try {
                    await apiRequest('/users/profile', 'PUT', formData);
                    alert('Profile updated successfully!');
                    initProfile(param); // Refresh view
                } catch (error) {
                    console.error(error);
                    alert('Failed to update profile.');
                }
            });
        }

    } catch (error) {
        document.getElementById('main-content').innerHTML = `<p class="text-center text-red-500">Could not find this user's profile.</p>`;
    }
};

export { profileView, initProfile };
