/**
 * Header Template Loader
 * This script loads the header template into all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Determine the root path based on the current page location
    const getRootPath = () => {
        const path = window.location.pathname;
        let rootPath = '';



        // Count directory levels to determine relative path to root
        if (path.includes('/tools/')) {
            const pathParts = path.split('/').filter(Boolean);


            if (pathParts.length > 2) {
                rootPath = '../../'; // For tool pages like /tools/onlinenotepad/index.html
            } else {
                rootPath = '../'; // For pages like /tools/all-tools/index.html
            }
        }


        return rootPath;
    };

    // Load the header template
    const loadHeader = async () => {
        try {
            const rootPath = getRootPath();
            const templateUrl = `${rootPath}includes/header.html`;


            const response = await fetch(templateUrl);

            if (!response.ok) {
                throw new Error(`Failed to load header template: ${response.status}`);
            }

            let headerTemplate = await response.text();


            // Replace the placeholder with the actual root path
            headerTemplate = headerTemplate.replace(/\{\{root_path\}\}/g, rootPath);

            // Find the header element and replace its content
            const headerElement = document.querySelector('header.header');
            if (headerElement) {
                headerElement.outerHTML = headerTemplate;

                // Initialize search functionality after header is loaded
                initializeSearch(rootPath);

                // Set active class on navigation menu items
                setActiveNavItem();
            } else {
                // Create a fallback header if none exists
                const bodyElement = document.body;
                if (bodyElement && bodyElement.firstChild) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = headerTemplate;
                    bodyElement.insertBefore(tempDiv.firstChild, bodyElement.firstChild);
                    initializeSearch(rootPath);

                    // Set active class on navigation menu items
                    setActiveNavItem();
                }
            }
        } catch (error) {

            // Display error in the header for debugging
            const headerElement = document.querySelector('header.header');
            if (headerElement) {
                headerElement.innerHTML = `
                    <div class="container">
                        <div style="color: red; padding: 20px;">
                            Error loading header template: ${error.message}
                        </div>
                    </div>
                `;
            }
        }
    };

    // Initialize search functionality
    const initializeSearch = (rootPath) => {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');

        // Handle search button click
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `${rootPath}tools/search.html?q=${encodeURIComponent(query)}`;
                }
            });
        }

        // Handle enter key press in search input
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        window.location.href = `${rootPath}tools/search.html?q=${encodeURIComponent(query)}`;
                    }
                }
            });
        }
    };

    // Set active class on navigation menu items based on current URL
    const setActiveNavItem = () => {
        try {
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('.nav-menu a');

            if (!navLinks || navLinks.length === 0) return;

            // Remove active class from all nav links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            // Check if we're on the home page
            if (currentPath.endsWith('index.html') ||
                currentPath.endsWith('/') ||
                currentPath.split('/').pop() === '') {
                // Set Home link as active
                const homeLink = document.querySelector('.nav-menu a[href*="index.html"]');
                if (homeLink) {
                    homeLink.classList.add('active');
                }
            }
            // Check if we're on the popular tools page
            else if (currentPath.includes('/popular-tools/')) {
                // Set Popular Tools link as active
                const popularToolsLink = document.querySelector('.nav-menu a[href*="popular-tools"]');
                if (popularToolsLink) {
                    popularToolsLink.classList.add('active');
                }
            }
            // Check if we're on the all tools page
            else if (currentPath.includes('/all-tools/')) {
                // Set All Tools link as active
                const allToolsLink = document.querySelector('.nav-menu a[href*="all-tools"]');
                if (allToolsLink) {
                    allToolsLink.classList.add('active');
                }
            }
        } catch (error) {
            console.error('Error setting active nav item:', error);
        }
    };

    // Load the header
    loadHeader();
});
