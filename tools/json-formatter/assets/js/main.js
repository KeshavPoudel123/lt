// ===== JSON FORMATTER SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the JSON formatter
    initJsonFormatter();
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
 * Initialize the JSON formatter
 */
function initJsonFormatter() {
    // Get DOM elements
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const urlInput = document.getElementById('url-input');
    const formatBtn = document.getElementById('format-btn');
    const fetchBtn = document.getElementById('fetch-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const minifyOutput = document.getElementById('minify-output');
    const indentSize = document.getElementById('indent-size');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');

    // Check if there's saved JSON in localStorage
    const savedJson = localStorage.getItem('jsonFormatterInput');
    if (savedJson) {
        jsonInput.value = savedJson;
    }

    // Format button click event
    if (formatBtn) {
        formatBtn.addEventListener('click', () => {
            formatJson();
        });
    }

    // Fetch button click event
    if (fetchBtn) {
        fetchBtn.addEventListener('click', () => {
            fetchJson();
        });
    }

    // Clear button click event
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            jsonInput.value = '';
            jsonOutput.innerHTML = '// Formatted JSON will appear here';
            hideError();
            localStorage.removeItem('jsonFormatterInput');
            showNotification('Input cleared', 'error');
        });
    }

    // Sample button click event
    if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
            loadSampleJson();
            showNotification('Sample JSON loaded', 'info');
        });
    }

    // Copy button click event
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            copyFormattedJson();
        });
    }

    // Download button click event
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadJson();
        });
    }

    // Input change event
    if (jsonInput) {
        jsonInput.addEventListener('input', () => {
            localStorage.setItem('jsonFormatterInput', jsonInput.value);
        });

        // Format on Ctrl+Enter
        jsonInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                formatJson();
            }
        });
    }

    /**
     * Format JSON
     */
    function formatJson() {
        const input = jsonInput.value.trim();

        if (!input) {
            showError('Please enter JSON to format');
            return;
        }

        try {
            // Parse JSON to validate
            const parsedJson = JSON.parse(input);

            // Format JSON
            const formatted = formatJsonString(parsedJson);

            // Display formatted JSON
            jsonOutput.innerHTML = formatted;

            // Apply syntax highlighting
            hljs.highlightElement(jsonOutput);

            // Hide error
            hideError();

            // Show success notification
            showNotification('JSON formatted successfully', 'success');
        } catch (error) {
            // Show error
            showError(error.message);

            // Highlight error line if possible
            highlightErrorLine(error);
        }
    }

    /**
     * Format JSON string
     * @param {object} json - The parsed JSON object
     * @returns {string} - Formatted JSON string
     */
    function formatJsonString(json) {
        const isMinify = minifyOutput.checked;
        const indent = getIndentString();

        if (isMinify) {
            return JSON.stringify(json);
        } else {
            return JSON.stringify(json, null, indent);
        }
    }

    /**
     * Get indent string based on settings
     * @returns {string|number} - Indent string or number
     */
    function getIndentString() {
        const value = indentSize.value;

        if (value === 'tab') {
            return '\t';
        } else {
            return parseInt(value);
        }
    }

    /**
     * Fetch JSON from URL
     */
    async function fetchJson() {
        const url = urlInput.value.trim();

        if (!url) {
            showError('Please enter a URL');
            return;
        }

        try {
            // Show loading state
            formatBtn.disabled = true;
            formatBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

            // Fetch JSON
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Update input with fetched JSON
            jsonInput.value = JSON.stringify(data);

            // Format JSON
            formatJson();
        } catch (error) {
            showError(`Failed to fetch JSON: ${error.message}`);
        } finally {
            // Reset loading state
            formatBtn.disabled = false;
            formatBtn.innerHTML = '<i class="fas fa-check-circle"></i> Validate & Format';
        }
    }

    /**
     * Load sample JSON
     */
    function loadSampleJson() {
        const sampleJson = {
            "name": "Latest Online Tools",
            "version": "1.0.0",
            "description": "A collection of useful online tools",
            "tools": [
                {
                    "id": "json-formatter",
                    "name": "JSON Formatter",
                    "description": "Format and validate JSON data",
                    "category": "Developer Tools",
                    "isNew": true
                },
                {
                    "id": "word-counter",
                    "name": "Word Counter",
                    "description": "Count words, characters, and analyze text",
                    "category": "Text Tools",
                    "isNew": false
                },
                {
                    "id": "qr-generator",
                    "name": "QR Code Generator",
                    "description": "Generate QR codes for URLs, text, and vCards",
                    "category": "Generators",
                    "isNew": false
                }
            ],
            "settings": {
                "theme": "dark",
                "language": "en",
                "notifications": true
            },
            "stats": {
                "users": 10000,
                "pageViews": 50000,
                "toolsUsed": 25000
            }
        };

        jsonInput.value = JSON.stringify(sampleJson);
        formatJson();
    }

    /**
     * Copy formatted JSON to clipboard
     */
    function copyFormattedJson() {
        const formattedJson = jsonOutput.textContent;

        if (!formattedJson || formattedJson === '// Formatted JSON will appear here') {
            showNotification('No formatted JSON to copy', 'error');
            return;
        }

        // Use the modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(formattedJson)
                .then(() => {
                    showNotification('JSON copied to clipboard', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback to the older method
                    fallbackCopyToClipboard(formattedJson);
                });
        } else {
            // Fallback for browsers that don't support the Clipboard API
            fallbackCopyToClipboard(formattedJson);
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
                showNotification('JSON copied to clipboard', 'success');
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
     * Download JSON file
     */
    function downloadJson() {
        const formattedJson = jsonOutput.textContent;

        if (!formattedJson || formattedJson === '// Formatted JSON will appear here') {
            showNotification('No formatted JSON to download', 'error');
            return;
        }

        const fileName = `formatted_json_${new Date().getTime()}.json`;
        const blob = new Blob([formattedJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();

        URL.revokeObjectURL(url);

        showNotification(`Downloaded as ${fileName}`, 'success');
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    function showError(message) {
        errorContainer.classList.add('show');
        errorMessage.textContent = message;
    }

    /**
     * Hide error message
     */
    function hideError() {
        errorContainer.classList.remove('show');
        errorMessage.textContent = 'No errors found.';
    }

    /**
     * Highlight error line in JSON
     * @param {Error} error - JSON parse error
     */
    function highlightErrorLine(error) {
        const message = error.message;

        // Try to extract line number from error message
        const lineMatch = message.match(/line (\d+)/i);

        if (lineMatch && lineMatch[1]) {
            const lineNumber = parseInt(lineMatch[1]);

            // Split input by lines
            const lines = jsonInput.value.split('\n');

            // Add error class to the line
            if (lineNumber > 0 && lineNumber <= lines.length) {
                const errorLine = lines[lineNumber - 1];

                // Display error in output
                jsonOutput.innerHTML = lines.map((line, index) => {
                    if (index === lineNumber - 1) {
                        return `<span class="error-line">${line}</span>`;
                    }
                    return line;
                }).join('\n');
            }
        }
    }
}
