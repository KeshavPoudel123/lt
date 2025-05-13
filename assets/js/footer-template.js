/**
 * Footer Template Loader
 * This script loads the footer template into all pages
 *
 * USAGE:
 * 1. Include this script in your HTML file:
 *    <script src="path/to/assets/js/footer-template.js"></script>
 *
 * 2. Add a footer element with class "footer" or "tool-footer":
 *    <footer class="footer"></footer>
 *    OR
 *    <footer class="tool-footer"></footer>
 *
 * The script will automatically:
 * - Determine the correct relative path to the root
 * - Load the footer template from includes/footer.html
 * - Replace the footer element with the template content
 * - Replace {{root_path}} placeholders with the correct relative path
 */

document.addEventListener('DOMContentLoaded', function() {
    // Determine the root path based on the current page location
    const getRootPath = () => {
        // Normalize path to use forward slashes for consistency
        const path = window.location.pathname.replace(/\\/g, '/');
        let rootPath = '';



        // Check if we're in a tools directory or subdirectory
        if (path.includes('/tools/')) {
            // Split the path into parts and filter out empty strings
            const pathParts = path.split('/').filter(Boolean);


            // Find the index of 'tools' in the path
            const toolsIndex = pathParts.indexOf('tools');

            // Calculate how many directories deep we are from the root
            if (toolsIndex !== -1) {
                const depth = pathParts.length - toolsIndex - 1;

                // If we're in a subdirectory of tools (like tools/onlinenotepad)
                if (depth > 1) {
                    rootPath = '../../'; // Go up two levels
                } else {
                    rootPath = '../'; // Go up one level
                }
            }
        }


        return rootPath;
    };

    // Load the footer template
    const loadFooter = async () => {
        try {
            const rootPath = getRootPath();
            const templateUrl = `${rootPath}includes/footer.html`;


            const response = await fetch(templateUrl);

            if (!response.ok) {
                throw new Error(`Failed to load footer template: ${response.status}`);
            }

            let footerTemplate = await response.text();


            // Replace the placeholder with the actual root path
            footerTemplate = footerTemplate.replace(/\{\{root_path\}\}/g, rootPath);

            // Try to find the footer element - check for both .footer and .tool-footer
            const footerElement = document.querySelector('footer.footer') || document.querySelector('footer.tool-footer');

            if (footerElement) {

                // Preserve any classes from the original footer
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = footerTemplate;
                const newFooter = tempDiv.firstChild;

                // If the original footer has tool-footer class, add it to the new footer
                if (footerElement.classList.contains('tool-footer')) {
                    newFooter.classList.add('tool-footer');
                }

                // Replace the old footer with the new one
                footerElement.outerHTML = newFooter.outerHTML;
            } else {

                // Look for any footer element as a fallback
                const anyFooter = document.querySelector('footer');
                if (anyFooter) {

                    anyFooter.outerHTML = footerTemplate;
                } else {

                    // Create a fallback footer if none exists
                    const bodyElement = document.body;
                    if (bodyElement) {

                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = footerTemplate;
                        bodyElement.appendChild(tempDiv.firstChild);
                    }
                }
            }
        } catch (error) {

            // Display error in the footer for debugging
            const footerElement = document.querySelector('footer');
            if (footerElement) {
                footerElement.innerHTML = `
                    <div class="container">
                        <div style="color: red; padding: 20px;">
                            Error loading footer template: ${error.message}
                        </div>
                    </div>
                `;
            }
        }
    };

    // Load the footer
    loadFooter();
});
