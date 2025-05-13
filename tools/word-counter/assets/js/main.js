// ===== WORD COUNTER SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the word counter
    initWordCounter();

    // Initialize settings
    initSettings();

    // Create notification element if it doesn't exist
    if (!document.querySelector('.notification')) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
});

/**
 * Initialize the word counter
 */
function initWordCounter() {
    // Get DOM elements
    const textInput = document.getElementById('text-input');
    const resetBtn = document.getElementById('reset-btn');
    const copyBtn = document.getElementById('copy-btn');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');
    const charCountNoSpaces = document.getElementById('char-count-no-spaces');
    const paragraphCount = document.getElementById('paragraph-count');
    const sentenceCount = document.getElementById('sentence-count');
    const readingTime = document.getElementById('reading-time');
    const speakingTime = document.getElementById('speaking-time');
    const keywordChart = document.getElementById('keyword-chart');

    // Check if sample text exists in localStorage
    const savedText = localStorage.getItem('wordCounterText');
    if (savedText) {
        textInput.value = savedText;
        updateStats(savedText);
    }

    // Text input event
    if (textInput) {
        textInput.addEventListener('input', () => {
            const text = textInput.value;
            updateStats(text);

            // Save to localStorage
            localStorage.setItem('wordCounterText', text);
        });
    }

    // Reset button click event
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            textInput.value = '';
            updateStats('');
            localStorage.removeItem('wordCounterText');
            showNotification('Text cleared', 'error');
        });
    }

    // Copy button click event
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const text = textInput.value;
            if (text) {
                copyToClipboard(text);
            } else {
                showNotification('No text to copy', 'error');
            }
        });
    }

    /**
     * Update text statistics
     * @param {string} text - The text to analyze
     */
    function updateStats(text) {
        // Count words
        const words = countWords(text);
        wordCount.textContent = words;

        // Count characters
        const chars = text.length;
        charCount.textContent = chars;

        // Count characters without spaces
        const charsNoSpaces = text.replace(/\s/g, '').length;
        charCountNoSpaces.textContent = charsNoSpaces;

        // Count paragraphs
        const paragraphs = countParagraphs(text);
        paragraphCount.textContent = paragraphs;

        // Count sentences
        const sentences = countSentences(text);
        sentenceCount.textContent = sentences;

        // Calculate reading time (200 words per minute)
        const readingMinutes = Math.ceil(words / 200);
        readingTime.textContent = `${readingMinutes} min`;

        // Calculate speaking time (130 words per minute)
        const speakingMinutes = Math.ceil(words / 130);
        speakingTime.textContent = `${speakingMinutes} min`;

        // Update keyword density
        updateKeywordDensity(text);
    }

    /**
     * Count words in text
     * @param {string} text - The text to analyze
     * @returns {number} - Number of words
     */
    function countWords(text) {
        if (!text || text.trim() === '') return 0;
        return text.trim().split(/\s+/).length;
    }

    /**
     * Count paragraphs in text
     * @param {string} text - The text to analyze
     * @returns {number} - Number of paragraphs
     */
    function countParagraphs(text) {
        if (!text || text.trim() === '') return 0;
        return text.split(/\n+/).filter(p => p.trim() !== '').length;
    }

    /**
     * Count sentences in text
     * @param {string} text - The text to analyze
     * @returns {number} - Number of sentences
     */
    function countSentences(text) {
        if (!text || text.trim() === '') return 0;
        // Split by common sentence endings
        return text.split(/[.!?]+/).filter(s => s.trim() !== '').length;
    }

    /**
     * Update keyword density chart
     * @param {string} text - The text to analyze
     */
    function updateKeywordDensity(text) {
        if (!text || text.trim() === '') {
            keywordChart.innerHTML = `
                <div class="empty-state">
                    <p>Enter text to see keyword density</p>
                </div>
            `;
            return;
        }

        // Get word frequency
        const wordFrequency = getWordFrequency(text);

        // Sort by frequency
        const sortedWords = Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Get top 5

        // Calculate total words for percentage
        const totalWords = countWords(text);

        // Create chart HTML
        let chartHTML = '';

        sortedWords.forEach(([word, count]) => {
            const percentage = (count / totalWords * 100).toFixed(1);

            chartHTML += `
                <div class="keyword-bar">
                    <div class="keyword-bar-label">${word}</div>
                    <div class="keyword-bar-container">
                        <div class="keyword-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="keyword-bar-value">${percentage}%</div>
                </div>
            `;
        });

        // Update chart
        keywordChart.innerHTML = chartHTML || `
            <div class="empty-state">
                <p>No keywords found</p>
            </div>
        `;
    }

    /**
     * Get word frequency in text
     * @param {string} text - The text to analyze
     * @returns {object} - Word frequency object
     */
    function getWordFrequency(text) {
        if (!text || text.trim() === '') return {};

        // Common words to exclude (stop words)
        const stopWords = new Set([
            'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
            'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'of', 'from',
            'as', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
            'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his',
            'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself',
            'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
            'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
            'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having',
            'do', 'does', 'did', 'doing', 'would', 'should', 'could', 'ought',
            'i\'m', 'you\'re', 'he\'s', 'she\'s', 'it\'s', 'we\'re', 'they\'re',
            'i\'ve', 'you\'ve', 'we\'ve', 'they\'ve', 'i\'d', 'you\'d', 'he\'d',
            'she\'d', 'we\'d', 'they\'d', 'i\'ll', 'you\'ll', 'he\'ll', 'she\'ll',
            'we\'ll', 'they\'ll', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t',
            'hasn\'t', 'haven\'t', 'hadn\'t', 'doesn\'t', 'don\'t', 'didn\'t',
            'won\'t', 'wouldn\'t', 'shan\'t', 'shouldn\'t', 'can\'t', 'cannot',
            'couldn\'t', 'mustn\'t', 'let\'s', 'that\'s', 'who\'s', 'what\'s',
            'here\'s', 'there\'s', 'when\'s', 'where\'s', 'why\'s', 'how\'s',
            'if', 'then', 'else', 'when', 'where', 'why', 'how', 'all', 'any',
            'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
            'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'
        ]);

        // Split text into words
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];

        // Count word frequency
        const frequency = {};

        words.forEach(word => {
            // Skip stop words and short words
            if (stopWords.has(word) || word.length < 3) return;

            frequency[word] = (frequency[word] || 0) + 1;
        });

        return frequency;
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
                showNotification('Copied to clipboard!', 'success');
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
 * Fallback copy to clipboard method
 * @param {string} text - Text to copy
 */
function fallbackCopyToClipboard(text) {
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (successful) {
            showNotification('Copied to clipboard!', 'success');
        } else {
            showNotification('Failed to copy to clipboard', 'error');
        }
    } catch (err) {
        console.error('Fallback copy method failed:', err);
        showNotification('Failed to copy to clipboard', 'error');
    }
}

/**
 * Show notification - Apple-like style
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info, warning)
 */
function showNotification(message, type = 'success') {
    // Get or create notification element
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

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
            <span>${message}</span>
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