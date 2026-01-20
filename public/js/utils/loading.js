export function setLoading(button, isLoading, loadingText = 'Loading...') {
    if (isLoading) {
        if (button.disabled) return; // Prevent double submit if already loading
        button.dataset.originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `
            <i class="fas fa-spinner fa-spin mr-2"></i> ${loadingText}
        `;
        button.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
        button.disabled = false;
        // Only restore if we have original text saved
        if (button.dataset.originalText) {
             button.innerHTML = button.dataset.originalText;
        }
        button.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}
