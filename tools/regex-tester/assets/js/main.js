/**
 * Regex Tester Tool
 * 
 * This tool allows users to test regular expressions against text and see the results in real-time.
 * It provides highlighting of matches, detailed match information, and explanations of regex patterns.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the regex tester
    initRegexTester();
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
 * Initialize the regex tester
 */
function initRegexTester() {
    // DOM elements
    const regexPattern = document.getElementById('regex-pattern');
    const regexFlags = document.getElementById('regex-flags');
    const testString = document.getElementById('test-string');
    const highlightedResults = document.getElementById('highlighted-results');
    const matchesList = document.getElementById('matches-list');
    const regexExplanation = document.getElementById('regex-explanation');
    const matchCount = document.getElementById('match-count');
    const optionGlobal = document.getElementById('option-global');
    const optionCaseInsensitive = document.getElementById('option-case-insensitive');
    const optionMultiline = document.getElementById('option-multiline');
    const optionDotall = document.getElementById('option-dotall');
    const pasteBtn = document.getElementById('paste-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const copyMatchesBtn = document.getElementById('copy-matches-btn');
    
    // Initialize with sample data if the test string is empty
    if (!testString.value) {
        testString.value = getSampleText();
    }
    
    // Event listeners
    regexPattern.addEventListener('input', updateRegex);
    testString.addEventListener('input', updateRegex);
    
    optionGlobal.addEventListener('change', updateFlags);
    optionCaseInsensitive.addEventListener('change', updateFlags);
    optionMultiline.addEventListener('change', updateFlags);
    optionDotall.addEventListener('change', updateFlags);
    
    pasteBtn.addEventListener('click', pasteText);
    clearBtn.addEventListener('click', clearText);
    sampleBtn.addEventListener('click', loadSampleText);
    copyMatchesBtn.addEventListener('click', copyMatches);
    
    // Initial update
    updateRegex();
    
    /**
     * Update regex flags based on checkboxes
     */
    function updateFlags() {
        let flags = '';
        
        if (optionGlobal.checked) flags += 'g';
        if (optionCaseInsensitive.checked) flags += 'i';
        if (optionMultiline.checked) flags += 'm';
        if (optionDotall.checked) flags += 's';
        
        regexFlags.textContent = flags;
        updateRegex();
    }
    
    /**
     * Update regex results
     */
    function updateRegex() {
        const pattern = regexPattern.value;
        const flags = regexFlags.textContent;
        const text = testString.value;
        
        if (!pattern || !text) {
            highlightedResults.innerHTML = text;
            matchesList.innerHTML = '';
            regexExplanation.innerHTML = '';
            matchCount.textContent = '0 matches';
            return;
        }
        
        try {
            const regex = new RegExp(pattern, flags);
            
            // Update highlighted results
            updateHighlightedResults(text, regex);
            
            // Update matches list
            updateMatchesList(text, regex);
            
            // Update regex explanation
            updateRegexExplanation(pattern);
        } catch (error) {
            // Show error in results
            highlightedResults.innerHTML = text;
            matchesList.innerHTML = `<div class="error-message">${error.message}</div>`;
            regexExplanation.innerHTML = '';
            matchCount.textContent = '0 matches';
        }
    }
    
    /**
     * Update highlighted results
     * @param {string} text - Test string
     * @param {RegExp} regex - Regular expression
     */
    function updateHighlightedResults(text, regex) {
        // Reset regex to ensure we start from the beginning
        regex.lastIndex = 0;
        
        let result = '';
        let lastIndex = 0;
        let match;
        let matches = [];
        
        // Find all matches
        while ((match = regex.exec(text)) !== null) {
            matches.push({
                index: match.index,
                length: match[0].length,
                value: match[0],
                groups: match.slice(1)
            });
            
            // Prevent infinite loops for zero-length matches
            if (regex.lastIndex === match.index) {
                regex.lastIndex++;
            }
        }
        
        // Build highlighted HTML
        for (const match of matches) {
            // Add text before match
            result += escapeHtml(text.substring(lastIndex, match.index));
            
            // Add match with highlighting
            result += `<span class="match">${escapeHtml(match.value)}</span>`;
            
            lastIndex = match.index + match.length;
        }
        
        // Add remaining text
        result += escapeHtml(text.substring(lastIndex));
        
        // Update results
        highlightedResults.innerHTML = result || text;
        
        // Update match count
        matchCount.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''}`;
    }
    
    /**
     * Update matches list
     * @param {string} text - Test string
     * @param {RegExp} regex - Regular expression
     */
    function updateMatchesList(text, regex) {
        // Reset regex to ensure we start from the beginning
        regex.lastIndex = 0;
        
        let result = '';
        let match;
        let matchIndex = 0;
        
        // Find all matches
        while ((match = regex.exec(text)) !== null) {
            result += `<div class="match-item">`;
            result += `<div><span class="match-index">Match ${matchIndex}:</span> <span class="match-value">${escapeHtml(match[0])}</span></div>`;
            
            // Add groups if any
            if (match.length > 1) {
                result += `<div class="match-groups">`;
                for (let i = 1; i < match.length; i++) {
                    result += `<div class="group-item">Group ${i}: ${escapeHtml(match[i] || '')}</div>`;
                }
                result += `</div>`;
            }
            
            result += `</div>`;
            
            matchIndex++;
            
            // Prevent infinite loops for zero-length matches
            if (regex.lastIndex === match.index) {
                regex.lastIndex++;
            }
        }
        
        // Update matches list
        matchesList.innerHTML = result || '<div class="no-matches">No matches found</div>';
    }
    
    /**
     * Update regex explanation
     * @param {string} pattern - Regex pattern
     */
    function updateRegexExplanation(pattern) {
        if (!pattern) {
            regexExplanation.innerHTML = '';
            return;
        }
        
        let explanation = '';
        
        try {
            // Simple explanation based on common regex patterns
            const explanations = explainRegex(pattern);
            
            if (explanations.length > 0) {
                explanation = explanations.map(item => {
                    return `<div class="explanation-token">
                        <div class="token-name">${item.token}</div>
                        <div class="token-description">${item.description}</div>
                    </div>`;
                }).join('');
            } else {
                explanation = '<div class="no-explanation">No detailed explanation available for this pattern.</div>';
            }
        } catch (error) {
            explanation = `<div class="error-message">Error explaining regex: ${error.message}</div>`;
        }
        
        regexExplanation.innerHTML = explanation;
    }
    
    /**
     * Paste text from clipboard
     */
    async function pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            testString.value = text;
            updateRegex();
            showNotification('Text pasted from clipboard', 'success');
        } catch (err) {
            console.error('Failed to read clipboard: ', err);
            showNotification('Failed to paste from clipboard', 'error');
        }
    }
    
    /**
     * Clear text
     */
    function clearText() {
        testString.value = '';
        updateRegex();
        showNotification('Test string cleared', 'error');
    }
    
    /**
     * Load sample text
     */
    function loadSampleText() {
        testString.value = getSampleText();
        updateRegex();
        showNotification('Sample text loaded', 'info');
    }
    
    /**
     * Copy matches to clipboard
     */
    function copyMatches() {
        const matches = matchesList.textContent;
        
        if (!matches || matches.includes('No matches found')) {
            showNotification('No matches to copy', 'error');
            return;
        }
        
        // Use the modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(matches)
                .then(() => {
                    showNotification('Matches copied to clipboard', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    showNotification('Failed to copy matches', 'error');
                });
        } else {
            // Fallback for browsers that don't support the Clipboard API
            const textarea = document.createElement('textarea');
            textarea.value = matches;
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showNotification('Matches copied to clipboard', 'success');
                } else {
                    showNotification('Failed to copy matches', 'error');
                }
            } catch (err) {
                console.error('Failed to copy text: ', err);
                showNotification('Failed to copy matches', 'error');
            }
            
            document.body.removeChild(textarea);
        }
    }
}

/**
 * Get sample text for testing
 * @returns {string} - Sample text
 */
function getSampleText() {
    return `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Email: john.doe@example.com
Phone: (123) 456-7890
Date: 2023-05-15
IP Address: 192.168.1.1
URL: https://www.example.com/path/to/page?query=value#fragment
HTML Tag: <div class="container">Content</div>
JSON: {"name": "John", "age": 30, "city": "New York"}
CSV: John,Doe,30,New York
Markdown: # Heading 1
- List item 1
- List item 2

**Bold text** and *italic text*`;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Explain regex pattern
 * @param {string} pattern - Regex pattern
 * @returns {Array} - Array of explanations
 */
function explainRegex(pattern) {
    const explanations = [];
    
    // Character classes
    if (pattern.includes('\\d')) explanations.push({ token: '\\d', description: 'Matches any digit (0-9)' });
    if (pattern.includes('\\D')) explanations.push({ token: '\\D', description: 'Matches any non-digit character' });
    if (pattern.includes('\\w')) explanations.push({ token: '\\w', description: 'Matches any word character (alphanumeric + underscore)' });
    if (pattern.includes('\\W')) explanations.push({ token: '\\W', description: 'Matches any non-word character' });
    if (pattern.includes('\\s')) explanations.push({ token: '\\s', description: 'Matches any whitespace character (spaces, tabs, line breaks)' });
    if (pattern.includes('\\S')) explanations.push({ token: '\\S', description: 'Matches any non-whitespace character' });
    if (pattern.includes('[')) explanations.push({ token: '[...]', description: 'Character class: matches any character inside the brackets' });
    if (pattern.includes('[^')) explanations.push({ token: '[^...]', description: 'Negated character class: matches any character NOT inside the brackets' });
    
    // Anchors
    if (pattern.includes('^')) explanations.push({ token: '^', description: 'Matches the start of a line' });
    if (pattern.includes('$')) explanations.push({ token: '$', description: 'Matches the end of a line' });
    if (pattern.includes('\\b')) explanations.push({ token: '\\b', description: 'Word boundary: matches the position between a word character and a non-word character' });
    if (pattern.includes('\\B')) explanations.push({ token: '\\B', description: 'Non-word boundary: matches any position that is not a word boundary' });
    
    // Quantifiers
    if (pattern.includes('*')) explanations.push({ token: '*', description: 'Matches 0 or more of the preceding token' });
    if (pattern.includes('+')) explanations.push({ token: '+', description: 'Matches 1 or more of the preceding token' });
    if (pattern.includes('?')) explanations.push({ token: '?', description: 'Matches 0 or 1 of the preceding token (makes it optional)' });
    if (pattern.includes('{')) explanations.push({ token: '{n}', description: 'Matches exactly n occurrences of the preceding token' });
    if (pattern.includes('{n,}')) explanations.push({ token: '{n,}', description: 'Matches n or more occurrences of the preceding token' });
    if (pattern.includes('{n,m}')) explanations.push({ token: '{n,m}', description: 'Matches between n and m occurrences of the preceding token' });
    
    // Groups and alternation
    if (pattern.includes('(')) explanations.push({ token: '(...)', description: 'Capturing group: groups together tokens and remembers the match' });
    if (pattern.includes('(?:')) explanations.push({ token: '(?:...)', description: 'Non-capturing group: groups together tokens without remembering the match' });
    if (pattern.includes('|')) explanations.push({ token: '|', description: 'Alternation: matches either the expression before or after the |' });
    
    // Special characters
    if (pattern.includes('.')) explanations.push({ token: '.', description: 'Matches any character except newline' });
    if (pattern.includes('\\')) explanations.push({ token: '\\', description: 'Escape character: used to escape special characters' });
    
    return explanations;
}
