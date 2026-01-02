
import { showToast } from '../utils/toast.js';

const contactView = () => `
    <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden glass-panel animate__animated animate__fadeInUp">
        <div class="p-8 md:p-12">
            <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Contact Support</h1>
            <p class="text-gray-600 dark:text-gray-300 mb-8">
                Have a question or run into a bug? Fill out the form below and our team will get back to you within 24 hours.
            </p>

            <form id="contact-form" class="space-y-6">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                    <input type="text" id="name" name="name" required
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all">
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input type="email" id="email" name="email" required
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all">
                </div>

                <div>
                    <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                    <select id="subject" name="subject"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all">
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="report_bug">Report a Bug</option>
                        <option value="report_user">Report a User</option>
                        <option value="billing">Billing/ Refund</option>
                    </select>
                </div>

                <div>
                    <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                    <textarea id="message" name="message" rows="5" required
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all"></textarea>
                </div>

                <div class="flex items-center gap-4">
                    <button type="submit"
                        class="flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:-translate-y-0.5 transition-all btn-flashy">
                        Send Message
                    </button>
                    <a href="#/" class="text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200">Cancel</a>
                </div>
            </form>
        </div>
    </div>
`;

const initContact = () => {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate sending
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Sent!';
            btn.classList.add('bg-green-600');
            btn.classList.remove('bg-indigo-600');

            setTimeout(() => {
                showToast("Thanks! Your message has been sent to our support team.", 'success');
                window.location.hash = '/';
            }, 500);
        }, 1500);
    });
};

export { contactView, initContact };
