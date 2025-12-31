/**
 * Manages the loading state of a button element.
 *
 * @param {HTMLElement} button - The button element to modify.
 * @param {boolean} isLoading - Whether to show the loading state.
 * @param {string} [loadingText='Processing...'] - The text to show while loading.
 */
export const setLoading = (button, isLoading, loadingText = 'Processing...') => {
    if (!button) return;

    if (isLoading) {
        // Save original content if not already saved
        if (!button.dataset.originalContent) {
            button.dataset.originalContent = button.innerHTML;
        }

        // Update state
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        button.classList.add('opacity-75', 'cursor-not-allowed');

        // Update content
        // We use a specific class for the spinner to make it easy to style if needed
        button.innerHTML = `<i class="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i><span>${loadingText}</span>`;
    } else {
        // Restore state
        button.disabled = false;
        button.setAttribute('aria-busy', 'false');
        button.classList.remove('opacity-75', 'cursor-not-allowed');

        // Restore content
        if (button.dataset.originalContent) {
            button.innerHTML = button.dataset.originalContent;
        }
    }
};
