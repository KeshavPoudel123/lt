// ===== FLOATING HOME BUTTON =====
document.addEventListener('DOMContentLoaded', () => {
    const floatingHomeBtn = document.querySelector('.floating-home-btn');

    // Make the floating home button visible immediately
    if (floatingHomeBtn) {
        floatingHomeBtn.style.transform = 'translateY(0)';
        floatingHomeBtn.style.opacity = '1';
    }

    // No need for scroll event listener since we want the button always visible
});
