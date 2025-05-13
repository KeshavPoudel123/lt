// ===== FLOATING SEARCH BUTTON =====
document.addEventListener('DOMContentLoaded', () => {
    const floatingSearchBtn = document.querySelector('.floating-search-btn');

    // Initially hide the floating search button
    if (floatingSearchBtn) {
        floatingSearchBtn.style.transform = 'translateY(100px)';
        floatingSearchBtn.style.opacity = '0';
    }

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Handle floating search button visibility
        if (floatingSearchBtn) {
            if (scrollTop > 300) {
                floatingSearchBtn.style.transform = 'translateY(0)';
                floatingSearchBtn.style.opacity = '1';
            } else {
                floatingSearchBtn.style.transform = 'translateY(100px)';
                floatingSearchBtn.style.opacity = '0';
            }
        }
    });

    // Add click event to the floating search button
    if (floatingSearchBtn) {
        floatingSearchBtn.addEventListener('click', () => {
            // Get the current path to determine the correct search page URL
            const path = window.location.pathname.replace(/\\/g, '/');
            let searchUrl = '';

            // Get any existing search input value
            let searchTerm = '';
            const searchInput = document.querySelector('.search-container input') ||
                               document.getElementById('search-input') ||
                               document.getElementById('tools-filter');

            if (searchInput) {
                searchTerm = searchInput.value.trim();
            }

            // Check if we're in a tools directory or subdirectory
            if (path.includes('/tools/')) {
                // We're in the tools directory or a subdirectory

                // If we're already on the search page, just focus the search input
                if (path.endsWith('/search.html') || path.endsWith('/tools/search.html')) {
                    if (searchInput) {
                        searchInput.focus();
                        return;
                    }
                }

                // If we're in a subdirectory of tools (like tools/onlinenotepad)
                if (path.split('/').filter(Boolean).length > path.split('/').filter(Boolean).indexOf('tools') + 1) {
                    searchUrl = '../search.html'; // Go up one level
                } else {
                    searchUrl = 'search.html'; // We're already in the tools directory
                }
            } else {
                // We're at the root
                searchUrl = 'tools/search.html';
            }

            // Add search term if available
            if (searchTerm) {
                searchUrl += `?q=${encodeURIComponent(searchTerm)}#search-results`;
            }

            // Navigate to the search page
            window.location.href = searchUrl;
        });
    }
});
