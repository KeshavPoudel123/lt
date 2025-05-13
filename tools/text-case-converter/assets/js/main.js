// Text Case Converter JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the converter
    initTextCaseConverter();
});

/**
 * Initialize the Text Case Converter
 */
function initTextCaseConverter() {
    // Input and output elements
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');

    // Action buttons
    const pasteButton = document.getElementById('paste-text');
    const clearButton = document.getElementById('clear-text');
    const copyButton = document.getElementById('copy-text');
    const downloadButton = document.getElementById('download-text');

    // Conversion option buttons
    const optionButtons = document.querySelectorAll('.option-btn');

    // Settings modal (we've removed the settings button, but keeping the modal for future use)
    const settingsModal = document.getElementById('settings-modal');

    // Initialize text stats
    updateTextStats(inputText.value);

    // Input text event listeners
    inputText.addEventListener('input', () => {
        updateTextStats(inputText.value);

        // Auto convert if enabled
        if (document.getElementById('auto-convert').checked) {
            const activeOption = document.querySelector('.option-btn.active');
            if (activeOption) {
                convertText(inputText.value, activeOption.id);
                // Don't scroll to output on auto-convert to avoid jarring experience
            }
        }
    });

    // Paste button click event
    pasteButton.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            inputText.value = text;
            updateTextStats(text);

            // Auto convert if enabled
            if (document.getElementById('auto-convert').checked) {
                const activeOption = document.querySelector('.option-btn.active');
                if (activeOption) {
                    convertText(text, activeOption.id);
                }
            }
        } catch (err) {
            showNotification('Failed to read from clipboard. Please check permissions.', 'error');
        }
    });

    // Clear button click event
    clearButton.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        updateTextStats('');
        showNotification('Text cleared', 'error');
    });

    // Copy button click event
    copyButton.addEventListener('click', () => {
        if (outputText.value) {
            copyToClipboard(outputText.value);
        } else {
            showNotification('No text to copy', 'error');
        }
    });

    // Download button click event
    downloadButton.addEventListener('click', () => {
        if (outputText.value) {
            downloadText(outputText.value);
        } else {
            showNotification('No text to download', 'error');
        }
    });

    // Conversion option buttons click events
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            optionButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Convert text
            convertText(inputText.value, button.id);

            // Scroll to output section
            scrollToOutput();
        });
    });

    /**
     * Scroll to the output section
     */
    function scrollToOutput() {
        const outputSection = document.querySelector('.output-section');
        if (outputSection) {
            // Add a small delay to ensure the conversion is complete
            setTimeout(() => {
                outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    // We've removed the settings button, but we'll keep the settings functionality
    // in case we need it in the future

    // Settings change events
    const settingsInputs = document.querySelectorAll('#settings-modal input');
    settingsInputs.forEach(input => {
        input.addEventListener('change', () => {
            // Re-convert text if auto-convert is enabled
            if (document.getElementById('auto-convert').checked) {
                const activeOption = document.querySelector('.option-btn.active');
                if (activeOption) {
                    convertText(inputText.value, activeOption.id);
                }
            }
        });
    });
}

/**
 * Update text statistics
 * @param {string} text - Input text
 */
function updateTextStats(text) {
    const characterCount = document.getElementById('character-count');
    const wordCount = document.getElementById('word-count');

    // Update character count
    const chars = text.length;
    characterCount.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;

    // Update word count
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
}

/**
 * Convert text based on selected option
 * @param {string} text - Input text
 * @param {string} option - Conversion option
 */
function convertText(text, option) {
    if (!text) {
        document.getElementById('output-text').value = '';
        return;
    }

    const preserveLinebreaks = document.getElementById('preserve-linebreaks').checked;
    let result = '';

    switch (option) {
        case 'uppercase':
            result = text.toUpperCase();
            break;
        case 'lowercase':
            result = text.toLowerCase();
            break;
        case 'title-case':
            result = toTitleCase(text);
            break;
        case 'sentence-case':
            result = toSentenceCase(text);
            break;
        case 'camel-case':
            result = toCamelCase(text);
            break;
        case 'pascal-case':
            result = toPascalCase(text);
            break;
        case 'snake-case':
            result = toSnakeCase(text);
            break;
        case 'kebab-case':
            result = toKebabCase(text);
            break;
        case 'constant-case':
            result = toConstantCase(text);
            break;
        case 'alternating-case':
            result = toAlternatingCase(text);
            break;
        case 'inverse-case':
            result = toInverseCase(text);
            break;
        case 'capitalize-words':
            result = toCapitalizeWords(text);
            break;
        default:
            result = text;
    }

    document.getElementById('output-text').value = result;
}

/**
 * Convert text to title case
 * @param {string} text - Input text
 * @returns {string} - Title case text
 */
function toTitleCase(text) {
    const capitalizeSmallWords = document.getElementById('capitalize-small-words').checked;
    const smallWordsInput = document.getElementById('small-words').value;
    const smallWords = smallWordsInput.split(',').map(word => word.trim().toLowerCase());

    const preserveLinebreaks = document.getElementById('preserve-linebreaks').checked;

    if (preserveLinebreaks) {
        return text.split('\n').map(line => {
            return toTitleCaseLine(line, capitalizeSmallWords, smallWords);
        }).join('\n');
    } else {
        return toTitleCaseLine(text, capitalizeSmallWords, smallWords);
    }
}

/**
 * Convert a line of text to title case
 * @param {string} line - Line of text
 * @param {boolean} capitalizeSmallWords - Whether to capitalize small words
 * @param {string[]} smallWords - List of small words
 * @returns {string} - Title case line
 */
function toTitleCaseLine(line, capitalizeSmallWords, smallWords) {
    return line.replace(/\w\S*/g, (word, index, fullText) => {
        // Check if it's a small word and not the first or last word
        if (!capitalizeSmallWords &&
            index > 0 &&
            index + word.length < fullText.length &&
            smallWords.includes(word.toLowerCase())) {
            return word.toLowerCase();
        }

        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
}

/**
 * Convert text to sentence case
 * @param {string} text - Input text
 * @returns {string} - Sentence case text
 */
function toSentenceCase(text) {
    const preserveLinebreaks = document.getElementById('preserve-linebreaks').checked;

    if (preserveLinebreaks) {
        return text.split('\n').map(line => {
            return toSentenceCaseLine(line);
        }).join('\n');
    } else {
        return toSentenceCaseLine(text);
    }
}

/**
 * Convert a line of text to sentence case
 * @param {string} line - Line of text
 * @returns {string} - Sentence case line
 */
function toSentenceCaseLine(line) {
    return line.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, match => {
        return match.toUpperCase();
    });
}

/**
 * Convert text to camel case
 * @param {string} text - Input text
 * @returns {string} - Camel case text
 */
function toCamelCase(text) {
    return text
        .replace(/[\s-_]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/[^\w\s]/g, '')
        .replace(/^[A-Z]/, c => c.toLowerCase());
}

/**
 * Convert text to pascal case
 * @param {string} text - Input text
 * @returns {string} - Pascal case text
 */
function toPascalCase(text) {
    return text
        .replace(/[\s-_]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/[^\w\s]/g, '')
        .replace(/^[a-z]/, c => c.toUpperCase());
}

/**
 * Convert text to snake case
 * @param {string} text - Input text
 * @returns {string} - Snake case text
 */
function toSnakeCase(text) {
    return text
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '_')
        .replace(/[A-Z]/g, match => `_${match.toLowerCase()}`)
        .replace(/^_/, '')
        .toLowerCase();
}

/**
 * Convert text to kebab case
 * @param {string} text - Input text
 * @returns {string} - Kebab case text
 */
function toKebabCase(text) {
    return text
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
        .replace(/^-/, '')
        .toLowerCase();
}

/**
 * Convert text to constant case
 * @param {string} text - Input text
 * @returns {string} - Constant case text
 */
function toConstantCase(text) {
    return text
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '_')
        .replace(/[A-Z]/g, match => `_${match}`)
        .replace(/^_/, '')
        .toUpperCase();
}

/**
 * Convert text to alternating case
 * @param {string} text - Input text
 * @returns {string} - Alternating case text
 */
function toAlternatingCase(text) {
    return text.split('').map((char, index) => {
        return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
    }).join('');
}

/**
 * Convert text to inverse case
 * @param {string} text - Input text
 * @returns {string} - Inverse case text
 */
function toInverseCase(text) {
    return text.split('').map(char => {
        if (char === char.toUpperCase()) {
            return char.toLowerCase();
        } else {
            return char.toUpperCase();
        }
    }).join('');
}

/**
 * Capitalize each word in text
 * @param {string} text - Input text
 * @returns {string} - Text with capitalized words
 */
function toCapitalizeWords(text) {
    const preserveLinebreaks = document.getElementById('preserve-linebreaks').checked;

    if (preserveLinebreaks) {
        return text.split('\n').map(line => {
            return line.replace(/\b\w/g, match => match.toUpperCase());
        }).join('\n');
    } else {
        return text.replace(/\b\w/g, match => match.toUpperCase());
    }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    // Use the modern clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showNotification('Text copied to clipboard', 'success');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                // Fallback to the older method
                fallbackCopyToClipboard(text);
            });
    } else {
        // Fallback for browsers that don't support the Clipboard API
        fallbackCopyToClipboard(text);
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
            showNotification('Text copied to clipboard', 'success');
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
 * Download text as a file
 * @param {string} text - Text to download
 */
function downloadText(text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Show notification - Apple-like style
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info, warning)
 */
function showNotification(message, type = 'success') {
    // Get notification element
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    // Clear any existing timeout
    if (window.notificationTimeout) {
        clearTimeout(window.notificationTimeout);
    }

    // Set icon based on type
    let icon;
    switch(type) {
        case 'success':
            icon = 'check_circle';
            break;
        case 'warning':
            icon = 'warning';
            break;
        case 'error':
            icon = 'error';
            break;
        default:
            icon = 'info';
    }

    // Set notification content
    notification.innerHTML = `
        <div class="notification-content">
            <i class="material-icons">${icon}</i>
            <span id="notification-message">${message}</span>
        </div>
    `;

    // Set notification type
    notification.className = `notification ${type}`;

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Hide notification after 3 seconds
    window.notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
