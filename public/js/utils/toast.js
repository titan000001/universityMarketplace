// public/js/utils/toast.js

/**
 * Shows a toast notification.
 * @param {string} message - The message to display.
 * @param {'success'|'error'|'info'} type - The type of toast.
 */
export function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    // a11y: Set roles for screen readers
    const isError = type === 'error';
    toast.setAttribute('role', isError ? 'alert' : 'status');
    toast.setAttribute('aria-live', isError ? 'assertive' : 'polite');

    toast.className = `
        pointer-events-auto flex items-center w-full max-w-sm overflow-hidden
        bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4
        transform transition-all duration-300 translate-x-full
    `;

    const colors = {
        success: { border: 'border-green-500', icon: 'text-green-500', iconClass: 'fa-check-circle' },
        error: { border: 'border-red-500', icon: 'text-red-500', iconClass: 'fa-exclamation-circle' },
        info: { border: 'border-blue-500', icon: 'text-blue-500', iconClass: 'fa-info-circle' }
    };
    const style = colors[type] || colors.info;
    toast.classList.add(style.border);

    toast.innerHTML = `
        <div class="p-4 w-full">
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <i class="fas ${style.iconClass} ${style.icon}"></i>
                </div>
                <div class="ml-3 w-0 flex-1 pt-0.5">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${type.charAt(0).toUpperCase() + type.slice(1)}
                    </p>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        ${message}
                    </p>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                    <button class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span class="sr-only">Close</span>
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Close button logic
    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });

    container.appendChild(toast);

    // Animation in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
    });

    // Auto dismiss with hover pause
    let timeout;
    const startTimer = () => timeout = setTimeout(() => removeToast(toast), 5000);
    const stopTimer = () => clearTimeout(timeout);

    toast.addEventListener('mouseenter', stopTimer);
    toast.addEventListener('mouseleave', startTimer);
    startTimer();
}

function removeToast(toast) {
    toast.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300); // Wait for transition
}
