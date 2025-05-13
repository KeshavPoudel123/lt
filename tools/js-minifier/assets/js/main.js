/**
 * JavaScript Minifier Tool
 * 
 * This tool allows users to minify JavaScript code to reduce file size and improve load times.
 * It removes unnecessary characters, whitespace, and comments from JavaScript code.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the JavaScript minifier
    initJsMinifier();
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
 * Initialize the JavaScript minifier
 */
function initJsMinifier() {
    // DOM elements
    const inputJs = document.getElementById('input-js');
    const outputJs = document.getElementById('output-js');
    const minifyBtn = document.getElementById('minify-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    // Options elements
    const removeComments = document.getElementById('remove-comments');
    const removeWhitespace = document.getElementById('remove-whitespace');
    const mangleVariables = document.getElementById('mangle-variables');
    const compressCode = document.getElementById('compress-code');
    const preserveSemicolons = document.getElementById('preserve-semicolons');
    const es6Support = document.getElementById('es6-support');
    
    // Stats elements
    const originalSize = document.getElementById('original-size');
    const minifiedSize = document.getElementById('minified-size');
    const sizeReduction = document.getElementById('size-reduction');
    
    // Event listeners
    minifyBtn.addEventListener('click', minifyJs);
    pasteBtn.addEventListener('click', pasteJs);
    clearBtn.addEventListener('click', clearJs);
    sampleBtn.addEventListener('click', loadSampleJs);
    copyBtn.addEventListener('click', copyJs);
    downloadBtn.addEventListener('click', downloadJs);
    
    // Initial sample JavaScript
    loadSampleJs();
    
    /**
     * Minify JavaScript
     */
    function minifyJs() {
        const js = inputJs.value;
        
        if (!js) {
            showNotification('Please enter JavaScript to minify', 'error');
            return;
        }
        
        try {
            // Get minification options
            const options = {
                compress: compressCode.checked ? {
                    drop_console: false,
                    drop_debugger: true,
                    ecma: es6Support.checked ? 2020 : 5,
                    passes: 2
                } : false,
                mangle: mangleVariables.checked ? {
                    toplevel: true
                } : false,
                format: {
                    comments: removeComments.checked ? false : 'some',
                    semicolons: preserveSemicolons.checked
                },
                ecma: es6Support.checked ? 2020 : 5,
                sourceMap: false
            };
            
            let minified = js;
            
            // Check if the Terser library is available
            if (typeof Terser !== 'undefined' && typeof Terser.minify === 'function') {
                // Use the Terser library
                Terser.minify(js, options).then(result => {
                    if (result.error) {
                        throw result.error;
                    }
                    
                    // Update output
                    outputJs.value = result.code;
                    
                    // Update stats
                    updateStats(js, result.code);
                    
                    showNotification('JavaScript minified successfully', 'success');
                }).catch(error => {
                    console.error('Error minifying JavaScript:', error);
                    showNotification('Error minifying JavaScript: ' + error.message, 'error');
                    
                    // In case of error, just copy the input to output
                    outputJs.value = js;
                    updateStats(js, js);
                });
            } else {
                // Fallback to basic minification
                console.warn('Terser library not available, using fallback minification');
                
                // Basic minification
                if (removeComments.checked) {
                    // Remove single line comments
                    minified = minified.replace(/\/\/.*$/gm, '');
                    // Remove multi-line comments
                    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
                }
                
                if (removeWhitespace.checked) {
                    // Remove whitespace
                    minified = minified.replace(/\s+/g, ' ');
                    // Remove whitespace around operators
                    minified = minified.replace(/\s*([=+\-*/%&|^<>!?:;,(){}[\]])\s*/g, '$1');
                    // Remove whitespace at the beginning and end of lines
                    minified = minified.replace(/^\s+|\s+$/gm, '');
                }
                
                // Update output
                outputJs.value = minified;
                
                // Update stats
                updateStats(js, minified);
                
                showNotification('JavaScript minified successfully (basic minification)', 'success');
            }
        } catch (error) {
            console.error('Error minifying JavaScript:', error);
            showNotification('Error minifying JavaScript: ' + error.message, 'error');
            
            // In case of error, just copy the input to output
            outputJs.value = js;
            updateStats(js, js);
        }
    }
    
    /**
     * Update statistics
     * @param {string} original - Original JavaScript
     * @param {string} minified - Minified JavaScript
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
     * Paste JavaScript from clipboard
     */
    async function pasteJs() {
        try {
            const text = await navigator.clipboard.readText();
            inputJs.value = text;
            showNotification('JavaScript pasted from clipboard', 'success');
        } catch (err) {
            console.error('Failed to read clipboard: ', err);
            showNotification('Failed to paste from clipboard', 'error');
        }
    }
    
    /**
     * Clear JavaScript input
     */
    function clearJs() {
        inputJs.value = '';
        outputJs.value = '';
        originalSize.textContent = '0 bytes';
        minifiedSize.textContent = '0 bytes';
        sizeReduction.textContent = '0%';
        showNotification('Input cleared', 'error');
    }
    
    /**
     * Copy minified JavaScript to clipboard
     */
    function copyJs() {
        const js = outputJs.value;
        
        if (!js) {
            showNotification('No minified JavaScript to copy', 'error');
            return;
        }
        
        // Use the modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(js)
                .then(() => {
                    showNotification('JavaScript copied to clipboard', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback to the older method
                    fallbackCopyToClipboard(js);
                });
        } else {
            // Fallback for browsers that don't support the Clipboard API
            fallbackCopyToClipboard(js);
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
                showNotification('JavaScript copied to clipboard', 'success');
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
     * Download minified JavaScript as a file
     */
    function downloadJs() {
        const js = outputJs.value;
        
        if (!js) {
            showNotification('No minified JavaScript to download', 'error');
            return;
        }
        
        const fileName = `minified_js_${new Date().getTime()}.js`;
        const blob = new Blob([js], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        
        URL.revokeObjectURL(url);
        
        showNotification(`Downloaded as ${fileName}`, 'success');
    }
    
    /**
     * Load sample JavaScript
     */
    function loadSampleJs() {
        inputJs.value = `/**
 * Sample JavaScript code for testing minification
 * This includes various JavaScript features and patterns
 */

// Define a class
class Person {
    constructor(name, age, email) {
        this.name = name;
        this.age = age;
        this.email = email;
    }
    
    // Method to get full info
    getInfo() {
        return \`Name: \${this.name}, Age: \${this.age}, Email: \${this.email}\`;
    }
    
    // Static method
    static createAnonymous() {
        return new Person('Anonymous', 0, 'anonymous@example.com');
    }
}

// Create a person object
const person = new Person('John Doe', 30, 'john.doe@example.com');
console.log(person.getInfo());

// Array methods
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filter even numbers
const evenNumbers = numbers.filter(function(number) {
    return number % 2 === 0;
});

// Map to squares
const squares = numbers.map(number => number * number);

// Reduce to sum
const sum = numbers.reduce((total, current) => total + current, 0);

console.log('Even numbers:', evenNumbers);
console.log('Squares:', squares);
console.log('Sum:', sum);

// Async function example
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Promise example
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// IIFE (Immediately Invoked Function Expression)
(function() {
    console.log('This function runs immediately');
    
    // Local variables
    let counter = 0;
    
    // Closure example
    function incrementCounter() {
        counter++;
        console.log('Counter:', counter);
    }
    
    // Call the function
    incrementCounter();
    incrementCounter();
})();

// Object destructuring
const user = {
    id: 1,
    username: 'johndoe',
    address: {
        street: '123 Main St',
        city: 'Anytown',
        zipCode: '12345'
    }
};

const { username, address: { city } } = user;
console.log(\`User \${username} lives in \${city}\`);

// Array destructuring
const [first, second, ...rest] = numbers;
console.log('First:', first);
console.log('Second:', second);
console.log('Rest:', rest);

// Event listener example
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Get elements
    const button = document.getElementById('my-button');
    
    // Add event listener
    if (button) {
        button.addEventListener('click', function(event) {
            console.log('Button clicked!', event);
        });
    }
});

// Export example (for modules)
export { Person, fetchData, delay };`;
        
        showNotification('Sample JavaScript loaded', 'info');
    }
}
