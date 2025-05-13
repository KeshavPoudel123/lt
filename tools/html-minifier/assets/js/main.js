/**
 * HTML Minifier Tool
 *
 * This tool allows users to minify HTML code to reduce file size and improve load times.
 * It removes unnecessary characters, whitespace, and comments from HTML code.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the HTML minifier
    initHtmlMinifier();
});

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info')
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    // Reset classes
    notification.classList.remove('success', 'error', 'info');

    // Add appropriate class based on type
    notification.classList.add(type);

    // Set message
    notificationMessage.textContent = message;

    // Show notification
    notification.classList.add('show');

    // Hide after delay
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Initialize the HTML minifier
 */
function initHtmlMinifier() {
    // DOM elements
    const inputHtml = document.getElementById('input-html');
    const outputHtml = document.getElementById('output-html');
    const minifyBtn = document.getElementById('minify-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');

    // Options elements
    const removeComments = document.getElementById('remove-comments');
    const removeWhitespace = document.getElementById('remove-whitespace');
    const collapseWhitespace = document.getElementById('collapse-whitespace');
    const removeEmptyAttributes = document.getElementById('remove-empty-attributes');
    const removeRedundantAttributes = document.getElementById('remove-redundant-attributes');
    const removeOptionalTags = document.getElementById('remove-optional-tags');
    const minifyCss = document.getElementById('minify-css');
    const minifyJs = document.getElementById('minify-js');
    const useShortDoctype = document.getElementById('use-short-doctype');

    // Stats elements
    const originalSize = document.getElementById('original-size');
    const minifiedSize = document.getElementById('minified-size');
    const sizeReduction = document.getElementById('size-reduction');

    // Event listeners
    minifyBtn.addEventListener('click', minifyHtml);
    pasteBtn.addEventListener('click', pasteHtml);
    clearBtn.addEventListener('click', clearHtml);
    sampleBtn.addEventListener('click', loadSampleHtml);
    copyBtn.addEventListener('click', copyHtml);
    downloadBtn.addEventListener('click', downloadHtml);

    // Initial sample HTML
    loadSampleHtml();

    /**
     * Minify HTML
     */
    function minifyHtml() {
        const html = inputHtml.value;

        if (!html) {
            showNotification('Please enter HTML to minify', 'error');
            return;
        }

        try {
            // Get minification options
            const options = {
                removeComments: removeComments.checked,
                removeCommentsFromCDATA: removeComments.checked,
                collapseWhitespace: collapseWhitespace.checked,
                conservativeCollapse: false,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: removeRedundantAttributes.checked,
                useShortDoctype: useShortDoctype.checked,
                removeEmptyAttributes: removeEmptyAttributes.checked,
                removeOptionalTags: removeOptionalTags.checked,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                minifyJS: minifyJs.checked,
                minifyCSS: minifyCss.checked
            };

            let minified = html;

            // Check if the HTML minifier library is available
            if (typeof window.htmlMinifier !== 'undefined' && typeof window.htmlMinifier.minify === 'function') {
                // Use the library
                minified = window.htmlMinifier.minify(html, options);
            } else {
                // Fallback to basic minification
                console.warn('HTML Minifier library not available, using fallback minification');

                // Basic minification
                if (options.removeComments) {
                    minified = minified.replace(/<!--[\s\S]*?-->/g, '');
                }

                if (options.collapseWhitespace) {
                    minified = minified.replace(/>\s+</g, '><');
                    minified = minified.replace(/\s{2,}/g, ' ');
                }

                if (options.removeAttributeQuotes) {
                    minified = minified.replace(/="\s*([^"]*)\s*"/g, '=$1');
                }
            }

            // Update output
            outputHtml.value = minified;

            // Update stats
            updateStats(html, minified);

            showNotification('HTML minified successfully', 'success');
        } catch (error) {
            console.error('Error minifying HTML:', error);
            showNotification('Error minifying HTML: ' + error.message, 'error');

            // In case of error, just copy the input to output
            outputHtml.value = html;
            updateStats(html, html);
        }
    }

    /**
     * Update statistics
     * @param {string} original - Original HTML
     * @param {string} minified - Minified HTML
     */
    function updateStats(original, minified) {
        // Calculate sizes
        const originalBytes = new Blob([original]).size;
        const minifiedBytes = new Blob([minified]).size;

        // Update size displays
        originalSize.textContent = formatBytes(originalBytes);
        minifiedSize.textContent = formatBytes(minifiedBytes);

        // Calculate and update reduction percentage
        if (originalBytes > 0 && minifiedBytes > 0) {
            const reduction = ((originalBytes - minifiedBytes) / originalBytes) * 100;
            sizeReduction.textContent = `${reduction.toFixed(2)}%`;
        } else {
            sizeReduction.textContent = '0%';
        }
    }

    /**
     * Format bytes to human-readable format
     * @param {number} bytes - Bytes to format
     * @param {number} decimals - Decimal places
     * @returns {string} - Formatted size
     */
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * Paste HTML from clipboard
     */
    async function pasteHtml() {
        try {
            const text = await navigator.clipboard.readText();
            inputHtml.value = text;
            showNotification('HTML pasted from clipboard', 'success');
        } catch (err) {
            console.error('Failed to read clipboard: ', err);
            showNotification('Failed to paste from clipboard', 'error');
        }
    }

    /**
     * Clear HTML input
     */
    function clearHtml() {
        inputHtml.value = '';
        outputHtml.value = '';
        originalSize.textContent = '0 bytes';
        minifiedSize.textContent = '0 bytes';
        sizeReduction.textContent = '0%';
        showNotification('Input cleared', 'error');
    }

    /**
     * Copy minified HTML to clipboard
     */
    function copyHtml() {
        const html = outputHtml.value;

        if (!html) {
            showNotification('No minified HTML to copy', 'error');
            return;
        }

        // Use the modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(html)
                .then(() => {
                    showNotification('HTML copied to clipboard', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback to the older method
                    fallbackCopyToClipboard(html);
                });
        } else {
            // Fallback for browsers that don't support the Clipboard API
            fallbackCopyToClipboard(html);
        }
    }

    /**
     * Fallback method to copy text to clipboard
     * @param {string} text - Text to copy
     */
    function fallbackCopyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';  // Prevent scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('HTML copied to clipboard', 'success');
            } else {
                showNotification('Failed to copy text', 'error');
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy text', 'error');
        }

        document.body.removeChild(textarea);
    }

    /**
     * Download minified HTML as a file
     */
    function downloadHtml() {
        const html = outputHtml.value;

        if (!html) {
            showNotification('No minified HTML to download', 'error');
            return;
        }

        const fileName = `minified_html_${new Date().getTime()}.html`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();

        URL.revokeObjectURL(url);

        showNotification(`Downloaded as ${fileName}`, 'success');
    }

    /**
     * Load sample HTML
     */
    function loadSampleHtml() {
        inputHtml.value = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML Document</title>
    <style>
        /* Sample CSS styles */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background-color: #f4f4f4;
            padding: 20px;
            margin-bottom: 20px;
            text-align: center;
        }

        nav ul {
            list-style: none;
            padding: 0;
            display: flex;
            justify-content: center;
        }

        nav ul li {
            margin: 0 10px;
        }

        nav ul li a {
            text-decoration: none;
            color: #333;
        }

        section {
            margin-bottom: 20px;
        }

        footer {
            text-align: center;
            padding: 20px;
            background-color: #f4f4f4;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <!-- Header section -->
    <header>
        <h1>Welcome to My Website</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <!-- Main content -->
    <main>
        <section id="home">
            <h2>Home</h2>
            <p>Welcome to our website! This is a sample HTML document that demonstrates various HTML elements and structure.</p>
        </section>

        <section id="about">
            <h2>About Us</h2>
            <p>We are a company dedicated to providing high-quality services to our customers.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.</p>
        </section>

        <section id="services">
            <h2>Our Services</h2>
            <ul>
                <li>Web Design</li>
                <li>Web Development</li>
                <li>SEO Optimization</li>
                <li>Content Creation</li>
            </ul>
        </section>

        <section id="contact">
            <h2>Contact Us</h2>
            <form action="#" method="post">
                <div>
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div>
                    <label for="message">Message:</label>
                    <textarea id="message" name="message" rows="4" required></textarea>
                </div>
                <div>
                    <button type="submit">Send Message</button>
                </div>
            </form>
        </section>
    </main>

    <!-- Footer section -->
    <footer>
        <p>&copy; 2023 My Website. All rights reserved.</p>
    </footer>

    <!-- Sample JavaScript -->
    <script>
        // This is a sample JavaScript code
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Document loaded!');

            // Get all navigation links
            const navLinks = document.querySelectorAll('nav a');

            // Add click event listeners
            navLinks.forEach(function(link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });
        });
    </script>
</body>
</html>`;

        showNotification('Sample HTML loaded', 'info');
    }
}
