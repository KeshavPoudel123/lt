// ===== LOREM IPSUM GENERATOR SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Lorem Ipsum generator
    initLoremIpsumGenerator();
});

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info')
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = notification.querySelector('.notification-icon');

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
 * Initialize the Lorem Ipsum generator
 */
function initLoremIpsumGenerator() {
    // Get DOM elements
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const infoBtn = document.getElementById('info-btn');
    const infoModal = document.getElementById('info-modal');
    const closeInfoBtn = document.querySelector('.close-info-btn');
    const outputText = document.getElementById('output-text');

    // Generate initial Lorem Ipsum
    generateLoremIpsum();

    // Generate button click event
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            generateLoremIpsum();
        });
    }

    // Copy button click event
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            copyLoremIpsum();
        });
    }

    // Download button click event
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadLoremIpsum();
        });
    }

    // Info button click event
    if (infoBtn && infoModal) {
        infoBtn.addEventListener('click', () => {
            infoModal.style.display = 'flex';
        });
    }

    // Close info modal
    if (closeInfoBtn && infoModal) {
        closeInfoBtn.addEventListener('click', () => {
            infoModal.style.display = 'none';
        });

        // Close when clicking outside the modal
        window.addEventListener('click', (event) => {
            if (event.target === infoModal) {
                infoModal.style.display = 'none';
            }
        });
    }

    /**
     * Generate Lorem Ipsum text
     */
    function generateLoremIpsum() {
        const amount = parseInt(document.getElementById('lipsum-amount').value);
        const unit = document.getElementById('lipsum-unit').value;
        const startWithLorem = document.getElementById('start-with-lorem').checked;
        const format = document.getElementById('lipsum-format').value;

        if (isNaN(amount) || amount < 1 || amount > 100) {
            showNotification('Amount must be between 1 and 100', 'error');
            return;
        }

        let loremText = '';
        let stats = {};

        switch (unit) {
            case 'paragraphs':
                const paragraphResult = generateParagraphs(amount, startWithLorem);
                loremText = paragraphResult.text;
                stats = {
                    paragraphs: amount,
                    words: paragraphResult.wordCount,
                    characters: paragraphResult.charCount
                };
                break;

            case 'words':
                const wordResult = generateWords(amount, startWithLorem);
                loremText = wordResult.text;
                stats = {
                    paragraphs: 1,
                    words: amount,
                    characters: wordResult.charCount
                };
                break;

            case 'bytes':
                const byteResult = generateBytes(amount, startWithLorem);
                loremText = byteResult.text;
                stats = {
                    paragraphs: byteResult.paragraphCount,
                    words: byteResult.wordCount,
                    characters: amount
                };
                break;

            case 'lists':
                const listResult = generateLists(amount, startWithLorem);
                loremText = listResult.text;
                stats = {
                    lists: amount,
                    items: listResult.itemCount,
                    words: listResult.wordCount,
                    characters: listResult.charCount
                };
                break;
        }

        // Format output
        if (format === 'html') {
            loremText = formatAsHtml(loremText, unit);
        }

        // Display output
        outputText.innerHTML = loremText;

        // Display stats
        const statsElement = document.getElementById('generation-stats');
        let statsText = '';
        switch (unit) {
            case 'paragraphs':
                statsText = `Generated ${stats.paragraphs} paragraph${stats.paragraphs !== 1 ? 's' : ''} with approximately ${stats.words} words (${stats.characters} characters)`;
                break;
            case 'words':
                statsText = `Generated ${stats.words} word${stats.words !== 1 ? 's' : ''} (${stats.characters} characters)`;
                break;
            case 'bytes':
                statsText = `Generated ${stats.characters} byte${stats.characters !== 1 ? 's' : ''} of text with approximately ${stats.words} words in ${stats.paragraphs} paragraph${stats.paragraphs !== 1 ? 's' : ''}`;
                break;
            case 'lists':
                statsText = `Generated ${stats.lists} list${stats.lists !== 1 ? 's' : ''} with ${stats.items} items containing approximately ${stats.words} words (${stats.characters} characters)`;
                break;
        }

        statsElement.textContent = statsText;
    }

    /**
     * Generate Lorem Ipsum paragraphs
     * @param {number} count - Number of paragraphs
     * @param {boolean} startWithLorem - Whether to start with "Lorem ipsum dolor sit amet..."
     * @returns {object} - Object containing generated paragraphs and stats
     */
    function generateParagraphs(count, startWithLorem) {
        const paragraphs = [];
        let totalWords = 0;
        let totalChars = 0;

        for (let i = 0; i < count; i++) {
            let paragraph = '';

            if (i === 0 && startWithLorem) {
                paragraph = getLoremIpsumStart();

                // Count words and characters
                const words = paragraph.split(/\s+/).filter(word => word.length > 0);
                totalWords += words.length;
                totalChars += paragraph.length;
            } else {
                const result = getRandomParagraph();
                paragraph = result.text;
                totalWords += result.wordCount;
                totalChars += result.charCount;
            }

            paragraphs.push(paragraph);
        }

        return {
            text: paragraphs.join('\n\n'),
            wordCount: totalWords,
            charCount: totalChars
        };
    }

    /**
     * Generate Lorem Ipsum words
     * @param {number} count - Number of words
     * @param {boolean} startWithLorem - Whether to start with "Lorem ipsum dolor sit amet..."
     * @returns {object} - Object containing generated words and stats
     */
    function generateWords(count, startWithLorem) {
        let words = [];

        if (startWithLorem) {
            const loremStart = getLoremIpsumStart().split(/\s+/).filter(word => word.length > 0);
            words = loremStart.slice(0, Math.min(count, loremStart.length));

            if (words.length < count) {
                words = words.concat(getRandomWords(count - words.length));
            }
        } else {
            words = getRandomWords(count);
        }

        const text = words.join(' ');

        return {
            text: text,
            charCount: text.length
        };
    }

    /**
     * Generate Lorem Ipsum bytes
     * @param {number} count - Number of bytes
     * @param {boolean} startWithLorem - Whether to start with "Lorem ipsum dolor sit amet..."
     * @returns {object} - Object containing generated text and stats
     */
    function generateBytes(count, startWithLorem) {
        let text = '';
        let paragraphCount = 0;

        if (startWithLorem) {
            text = getLoremIpsumStart();
            paragraphCount = 1;

            if (text.length < count) {
                const additionalParagraphsNeeded = Math.ceil((count - text.length) / 500);
                const additionalText = getRandomText(additionalParagraphsNeeded);
                text += '\n\n' + additionalText;
                paragraphCount += additionalParagraphsNeeded;
            }
        } else {
            const paragraphsNeeded = Math.ceil(count / 500);
            text = getRandomText(paragraphsNeeded);
            paragraphCount = paragraphsNeeded;
        }

        // Trim to exact byte count
        const trimmedText = text.substring(0, count);

        // Count words
        const wordCount = trimmedText.split(/\s+/).filter(word => word.length > 0).length;

        return {
            text: trimmedText,
            paragraphCount: paragraphCount,
            wordCount: wordCount
        };
    }

    /**
     * Generate Lorem Ipsum lists
     * @param {number} count - Number of lists
     * @param {boolean} startWithLorem - Whether to start with "Lorem ipsum dolor sit amet..."
     * @returns {object} - Object containing generated lists and stats
     */
    function generateLists(count, startWithLorem) {
        const lists = [];
        let totalItems = 0;
        let totalWords = 0;
        let totalChars = 0;

        for (let i = 0; i < count; i++) {
            const items = [];
            const itemCount = getRandomInt(3, 8);
            totalItems += itemCount;

            for (let j = 0; j < itemCount; j++) {
                let item = '';

                if (i === 0 && j === 0 && startWithLorem) {
                    // Get first sentence of Lorem Ipsum
                    item = getLoremIpsumStart().split('.')[0] + '.';

                    // Count words and characters
                    const words = item.split(/\s+/).filter(word => word.length > 0);
                    totalWords += words.length;
                    totalChars += item.length;
                } else {
                    const result = getRandomSentence();
                    item = result.text;
                    totalWords += result.wordCount;
                    totalChars += result.charCount;
                }

                items.push('• ' + item);
            }

            lists.push(items.join('\n'));
        }

        return {
            text: lists.join('\n\n'),
            itemCount: totalItems,
            wordCount: totalWords,
            charCount: totalChars
        };
    }

    /**
     * Format text as HTML
     * @param {string} text - Plain text
     * @param {string} unit - Unit type (paragraphs, words, bytes, lists)
     * @returns {string} - HTML formatted text
     */
    function formatAsHtml(text, unit) {
        switch (unit) {
            case 'paragraphs':
                return text.split('\n\n').map(p => `<p>${p}</p>`).join('');

            case 'words':
                return `<p>${text}</p>`;

            case 'bytes':
                // For bytes, we need to preserve paragraph breaks
                return text.split('\n\n').map(p => `<p>${p}</p>`).join('');

            case 'lists':
                return text.split('\n\n').map(list => {
                    const items = list.split('\n').map(item => {
                        // Remove the bullet point if it exists
                        const cleanItem = item.startsWith('• ') ? item.substring(2) : item;
                        return `<li>${cleanItem}</li>`;
                    }).join('');
                    return `<ul>${items}</ul>`;
                }).join('');

            default:
                return text;
        }
    }

    /**
     * Copy Lorem Ipsum text to clipboard
     */
    function copyLoremIpsum() {
        const format = document.getElementById('lipsum-format').value;
        let textToCopy = '';

        if (format === 'html') {
            textToCopy = outputText.innerHTML;
        } else {
            textToCopy = outputText.textContent;
        }

        if (!textToCopy) {
            showNotification('No text to copy', 'error');
            return;
        }

        // Use the modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    showNotification('Text copied to clipboard', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback to the older method
                    fallbackCopyToClipboard(textToCopy);
                });
        } else {
            // Fallback for browsers that don't support the Clipboard API
            fallbackCopyToClipboard(textToCopy);
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
     * Download Lorem Ipsum text
     */
    function downloadLoremIpsum() {
        const format = document.getElementById('lipsum-format').value;
        let textToDownload = '';
        let fileName = '';
        let contentType = '';

        if (format === 'html') {
            textToDownload = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Lorem Ipsum</title>
</head>
<body>
${outputText.innerHTML}
</body>
</html>`;
            fileName = 'lorem-ipsum.html';
            contentType = 'text/html';
        } else {
            textToDownload = outputText.textContent;
            fileName = 'lorem-ipsum.txt';
            contentType = 'text/plain';
        }

        if (!textToDownload) {
            showNotification('No text to download', 'error');
            return;
        }

        downloadFile(textToDownload, fileName, contentType);
    }

    /**
     * Download file
     * @param {string} content - File content
     * @param {string} fileName - File name
     * @param {string} contentType - Content type
     */
    function downloadFile(content, fileName, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification(`Downloaded as ${fileName}`, 'success');
    }

    /**
     * Get Lorem Ipsum start text
     * @returns {string} - Lorem Ipsum start text
     */
    function getLoremIpsumStart() {
        return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.';
    }

    /**
     * Get random paragraph
     * @returns {object} - Object containing random paragraph and stats
     */
    function getRandomParagraph() {
        const sentenceCount = getRandomInt(3, 8);
        const sentences = [];
        let wordCount = 0;
        let charCount = 0;

        for (let i = 0; i < sentenceCount; i++) {
            const result = getRandomSentence();
            sentences.push(result.text);
            wordCount += result.wordCount;
            charCount += result.charCount;
        }

        const text = sentences.join(' ');

        return {
            text: text,
            wordCount: wordCount,
            charCount: charCount
        };
    }

    /**
     * Get random sentence
     * @returns {object} - Object containing random sentence and stats
     */
    function getRandomSentence() {
        const wordCount = getRandomInt(5, 15);
        const words = getRandomWords(wordCount);
        let sentence = words.join(' ');

        // Capitalize first letter
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

        // Add period at the end
        if (!sentence.endsWith('.')) {
            sentence += '.';
        }

        return {
            text: sentence,
            wordCount: words.length,
            charCount: sentence.length
        };
    }

    /**
     * Get random words
     * @param {number} count - Number of words
     * @returns {string[]} - Array of random words
     */
    function getRandomWords(count) {
        const loremWords = [
            'a', 'ac', 'accumsan', 'ad', 'adipiscing', 'aenean', 'aliquam', 'aliquet', 'amet', 'ante',
            'aptent', 'arcu', 'at', 'auctor', 'augue', 'bibendum', 'blandit', 'class', 'commodo',
            'condimentum', 'congue', 'consectetur', 'consequat', 'conubia', 'convallis', 'cras',
            'cubilia', 'cum', 'curabitur', 'curae', 'cursus', 'dapibus', 'diam', 'dictum', 'dictumst',
            'dignissim', 'dis', 'dolor', 'donec', 'dui', 'duis', 'egestas', 'eget', 'eleifend',
            'elementum', 'elit', 'enim', 'erat', 'eros', 'est', 'et', 'etiam', 'eu', 'euismod', 'facilisi',
            'facilisis', 'fames', 'faucibus', 'felis', 'fermentum', 'feugiat', 'fringilla', 'fusce',
            'gravida', 'habitant', 'habitasse', 'hac', 'hendrerit', 'himenaeos', 'iaculis', 'id',
            'imperdiet', 'in', 'inceptos', 'integer', 'interdum', 'ipsum', 'justo', 'lacinia', 'lacus',
            'laoreet', 'lectus', 'leo', 'libero', 'ligula', 'litora', 'lobortis', 'lorem', 'luctus',
            'maecenas', 'magna', 'magnis', 'malesuada', 'massa', 'mattis', 'mauris', 'metus', 'mi',
            'molestie', 'mollis', 'montes', 'morbi', 'mus', 'nam', 'nascetur', 'natoque', 'nec', 'neque',
            'netus', 'nibh', 'nisi', 'nisl', 'non', 'nostra', 'nulla', 'nullam', 'nunc', 'odio', 'orci',
            'ornare', 'parturient', 'pellentesque', 'penatibus', 'per', 'pharetra', 'phasellus', 'placerat',
            'platea', 'porta', 'porttitor', 'posuere', 'potenti', 'praesent', 'pretium', 'primis', 'proin',
            'pulvinar', 'purus', 'quam', 'quis', 'quisque', 'rhoncus', 'ridiculus', 'risus', 'rutrum',
            'sagittis', 'sapien', 'scelerisque', 'sed', 'sem', 'semper', 'senectus', 'sit', 'sociis',
            'sociosqu', 'sodales', 'sollicitudin', 'suscipit', 'suspendisse', 'taciti', 'tellus', 'tempor',
            'tempus', 'tincidunt', 'torquent', 'tortor', 'tristique', 'turpis', 'ullamcorper', 'ultrices',
            'ultricies', 'urna', 'ut', 'varius', 'vehicula', 'vel', 'velit', 'venenatis', 'vestibulum',
            'vitae', 'vivamus', 'viverra', 'volutpat', 'vulputate'
        ];

        const words = [];

        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * loremWords.length);
            words.push(loremWords[randomIndex]);
        }

        return words;
    }

    /**
     * Get random text
     * @param {number} paragraphCount - Number of paragraphs
     * @returns {string} - Random text
     */
    function getRandomText(paragraphCount) {
        const paragraphs = [];

        for (let i = 0; i < paragraphCount; i++) {
            const result = getRandomParagraph();
            paragraphs.push(result.text);
        }

        return paragraphs.join('\n\n');
    }

    /**
     * Get random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Random integer
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
