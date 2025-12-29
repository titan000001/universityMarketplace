export const setLoading = (button, isLoading, loadingText = 'Loading...') => {
    if (isLoading) {
        if (!button.dataset.originalText) {
            button.dataset.originalText = button.innerHTML;
        }
        button.disabled = true;
        button.classList.add('cursor-not-allowed', 'opacity-75');
        // FontAwesome spinner
        button.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${loadingText}`;
    } else {
        button.disabled = false;
        button.classList.remove('cursor-not-allowed', 'opacity-75');
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
    }
};
