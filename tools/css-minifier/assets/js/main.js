/**
 * CSS Minifier Tool
 * 
 * This tool allows users to minify CSS code to reduce file size and improve load times.
 * It removes unnecessary characters, whitespace, and comments from CSS code.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the CSS minifier
    initCssMinifier();
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
 * Initialize the CSS minifier
 */
function initCssMinifier() {
    // DOM elements
    const inputCss = document.getElementById('input-css');
    const outputCss = document.getElementById('output-css');
    const minifyBtn = document.getElementById('minify-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    // Options elements
    const removeComments = document.getElementById('remove-comments');
    const removeWhitespace = document.getElementById('remove-whitespace');
    const compressColors = document.getElementById('compress-colors');
    const compressFontWeight = document.getElementById('compress-font-weight');
    const removeEmptyRules = document.getElementById('remove-empty-rules');
    const mergeAdjacent = document.getElementById('merge-adjacent');
    
    // Stats elements
    const originalSize = document.getElementById('original-size');
    const minifiedSize = document.getElementById('minified-size');
    const sizeReduction = document.getElementById('size-reduction');
    
    // Event listeners
    minifyBtn.addEventListener('click', minifyCss);
    pasteBtn.addEventListener('click', pasteCss);
    clearBtn.addEventListener('click', clearCss);
    sampleBtn.addEventListener('click', loadSampleCss);
    copyBtn.addEventListener('click', copyCss);
    downloadBtn.addEventListener('click', downloadCss);
    
    // Initial sample CSS
    loadSampleCss();
    
    /**
     * Minify CSS
     */
    function minifyCss() {
        const css = inputCss.value;
        
        if (!css) {
            showNotification('Please enter CSS to minify', 'error');
            return;
        }
        
        try {
            // Get minification options
            const options = {
                comments: removeComments.checked ? false : 'all',
                restructure: mergeAdjacent.checked,
                forceMediaMerge: mergeAdjacent.checked
            };
            
            let minified = css;
            
            // Check if the CSSO library is available
            if (typeof window.csso !== 'undefined' && typeof window.csso.minify === 'function') {
                // Use the CSSO library
                minified = window.csso.minify(css, options).css;
            } else {
                // Fallback to basic minification
                console.warn('CSSO library not available, using fallback minification');
                
                // Basic minification
                if (removeComments.checked) {
                    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
                }
                
                if (removeWhitespace.checked) {
                    minified = minified.replace(/\s+/g, ' ');
                    minified = minified.replace(/\s*({|}|;|:|,)\s*/g, '$1');
                    minified = minified.replace(/;}/, '}');
                }
            }
            
            // Additional processing based on options
            if (compressColors.checked) {
                // Compress color values (e.g., #ffffff to #fff)
                minified = minified.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, '#$1$2$3');
            }
            
            if (compressFontWeight.checked) {
                // Compress font-weight values (e.g., normal to 400, bold to 700)
                minified = minified.replace(/font-weight\s*:\s*normal/gi, 'font-weight:400');
                minified = minified.replace(/font-weight\s*:\s*bold/gi, 'font-weight:700');
            }
            
            if (removeEmptyRules.checked) {
                // Remove empty rules
                minified = minified.replace(/[^{}]+\{\s*\}/g, '');
            }
            
            // Update output
            outputCss.value = minified;
            
            // Update stats
            updateStats(css, minified);
            
            showNotification('CSS minified successfully', 'success');
        } catch (error) {
            console.error('Error minifying CSS:', error);
            showNotification('Error minifying CSS: ' + error.message, 'error');
            
            // In case of error, just copy the input to output
            outputCss.value = css;
            updateStats(css, css);
        }
    }
    
    /**
     * Update statistics
     * @param {string} original - Original CSS
     * @param {string} minified - Minified CSS
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
     * Paste CSS from clipboard
     */
    async function pasteCss() {
        try {
            const text = await navigator.clipboard.readText();
            inputCss.value = text;
            showNotification('CSS pasted from clipboard', 'success');
        } catch (err) {
            console.error('Failed to read clipboard: ', err);
            showNotification('Failed to paste from clipboard', 'error');
        }
    }
    
    /**
     * Clear CSS input
     */
    function clearCss() {
        inputCss.value = '';
        outputCss.value = '';
        originalSize.textContent = '0 bytes';
        minifiedSize.textContent = '0 bytes';
        sizeReduction.textContent = '0%';
        showNotification('Input cleared', 'error');
    }
    
    /**
     * Copy minified CSS to clipboard
     */
    function copyCss() {
        const css = outputCss.value;
        
        if (!css) {
            showNotification('No minified CSS to copy', 'error');
            return;
        }
        
        // Use the modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(css)
                .then(() => {
                    showNotification('CSS copied to clipboard', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback to the older method
                    fallbackCopyToClipboard(css);
                });
        } else {
            // Fallback for browsers that don't support the Clipboard API
            fallbackCopyToClipboard(css);
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
                showNotification('CSS copied to clipboard', 'success');
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
     * Download minified CSS as a file
     */
    function downloadCss() {
        const css = outputCss.value;
        
        if (!css) {
            showNotification('No minified CSS to download', 'error');
            return;
        }
        
        const fileName = `minified_css_${new Date().getTime()}.css`;
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        
        URL.revokeObjectURL(url);
        
        showNotification(`Downloaded as ${fileName}`, 'success');
    }
    
    /**
     * Load sample CSS
     */
    function loadSampleCss() {
        inputCss.value = `/* Sample CSS for testing minification */
body {
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.6;
    color: #333333;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Header styles */
header {
    background-color: #35424a;
    color: #ffffff;
    padding: 20px;
    text-align: center;
}

header h1 {
    margin: 0;
    font-size: 2.5rem;
}

/* Navigation styles */
nav {
    background-color: #333333;
    color: #ffffff;
}

nav ul {
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 0;
    margin: 0;
}

nav ul li {
    padding: 15px;
}

nav ul li a {
    color: #ffffff;
    text-decoration: none;
}

nav ul li a:hover {
    color: #cccccc;
}

/* Main content */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    overflow: auto;
}

/* Sections */
section {
    margin-bottom: 30px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

section h2 {
    color: #35424a;
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 10px;
}

/* Buttons */
.btn {
    display: inline-block;
    background-color: #35424a;
    color: #ffffff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.btn:hover {
    background-color: #2a363e;
}

.btn-primary {
    background-color: #4285f4;
}

.btn-primary:hover {
    background-color: #3367d6;
}

/* Footer */
footer {
    background-color: #35424a;
    color: #ffffff;
    text-align: center;
    padding: 20px;
    margin-top: 20px;
}

/* Media Queries */
@media (max-width: 768px) {
    nav ul {
        flex-direction: column;
    }
    
    nav ul li {
        padding: 10px;
        text-align: center;
    }
    
    .container {
        padding: 10px;
    }
}`;
        
        showNotification('Sample CSS loaded', 'info');
    }
}
