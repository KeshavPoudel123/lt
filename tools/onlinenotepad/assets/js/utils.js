/**
 * ScribbleSpaceY - Utilities Module
 * Helper functions for the application
 * Developed by Keshav Poudel
 */

const Utils = (function() {
    /**
     * Generate a unique ID
     * @returns {string} Unique ID
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    /**
     * Format date to readable string
     * @param {string} dateString - ISO date string
     * @param {boolean} includeTime - Whether to include time
     * @returns {string} Formatted date string
     */
    function formatDate(dateString, includeTime = false) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
            return '';
        }
        
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        
        const isToday = date.toDateString() === now.toDateString();
        const isYesterday = date.toDateString() === yesterday.toDateString();
        
        let formattedDate = '';
        
        if (isToday) {
            formattedDate = 'Today';
        } else if (isYesterday) {
            formattedDate = 'Yesterday';
        } else {
            formattedDate = date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        
        if (includeTime) {
            formattedDate += ' at ' + date.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        return formattedDate;
    }

    /**
     * Get relative time (e.g., "2 hours ago")
     * @param {string} dateString - ISO date string
     * @returns {string} Relative time string
     */
    function getRelativeTime(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
            return '';
        }
        
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return 'just now';
        }
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
        }
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
        }
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
            return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
        }
        
        return formatDate(dateString);
    }

    /**
     * Truncate text to a specified length
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    function truncateText(text, maxLength) {
        if (!text) return '';
        
        if (text.length <= maxLength) {
            return text;
        }
        
        return text.substring(0, maxLength) + '...';
    }

    /**
     * Count words in text
     * @param {string} text - Text to count words in
     * @returns {number} Word count
     */
    function countWords(text) {
        if (!text) return 0;
        
        // Remove HTML tags
        const plainText = text.replace(/<[^>]*>/g, ' ');
        
        // Split by whitespace and filter out empty strings
        const words = plainText.split(/\s+/).filter(word => word.length > 0);
        
        return words.length;
    }

    /**
     * Count characters in text
     * @param {string} text - Text to count characters in
     * @param {boolean} countSpaces - Whether to count spaces
     * @returns {number} Character count
     */
    function countCharacters(text, countSpaces = true) {
        if (!text) return 0;
        
        // Remove HTML tags
        const plainText = text.replace(/<[^>]*>/g, ' ');
        
        if (countSpaces) {
            return plainText.length;
        } else {
            return plainText.replace(/\s+/g, '').length;
        }
    }

    /**
     * Calculate reading time in minutes
     * @param {string} text - Text to calculate reading time for
     * @param {number} wordsPerMinute - Reading speed in words per minute
     * @returns {number} Reading time in minutes
     */
    function calculateReadingTime(text, wordsPerMinute = 200) {
        const wordCount = countWords(text);
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return Math.max(1, minutes);
    }

    /**
     * Debounce function to limit how often a function is called
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function to limit how often a function is called
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in milliseconds
     * @returns {Function} Throttled function
     */
    function throttle(func, limit) {
        let inThrottle;
        
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} html - HTML to escape
     * @returns {string} Escaped HTML
     */
    function escapeHtml(html) {
        if (!html) return '';
        
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Get file extension from filename
     * @param {string} filename - Filename
     * @returns {string} File extension
     */
    function getFileExtension(filename) {
        if (!filename) return '';
        
        return filename.split('.').pop().toLowerCase();
    }

    /**
     * Convert bytes to human-readable size
     * @param {number} bytes - Size in bytes
     * @returns {string} Human-readable size
     */
    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Get system theme preference (light or dark)
     * @returns {string} 'light' or 'dark'
     */
    function getSystemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /**
     * Watch for system theme changes
     * @param {Function} callback - Callback function when theme changes
     * @returns {Function} Function to remove listener
     */
    function watchSystemTheme(callback) {
        if (!window.matchMedia) return () => {};
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const listener = (e) => {
            callback(e.matches ? 'dark' : 'light');
        };
        
        // Add listener
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', listener);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(listener);
        }
        
        // Return function to remove listener
        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', listener);
            } else {
                mediaQuery.removeListener(listener);
            }
        };
    }

    /**
     * Download data as a file
     * @param {string} content - File content
     * @param {string} filename - Filename
     * @param {string} contentType - Content type
     */
    function downloadFile(content, filename, contentType = 'text/plain') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
    }

    /**
     * Read file as text
     * @param {File} file - File to read
     * @returns {Promise<string>} File content
     */
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            
            reader.onerror = (error) => {
                reject(error);
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * Get cursor position in contentEditable element
     * @returns {Object} Selection information
     */
    function getCaretPosition() {
        const selection = window.getSelection();
        
        if (selection.rangeCount === 0) {
            return null;
        }
        
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(range.startContainer);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        
        return {
            node: range.startContainer,
            offset: range.startOffset,
            text: preCaretRange.toString()
        };
    }

    // Public API
    return {
        generateId,
        formatDate,
        getRelativeTime,
        truncateText,
        countWords,
        countCharacters,
        calculateReadingTime,
        debounce,
        throttle,
        escapeHtml,
        getFileExtension,
        formatBytes,
        getSystemTheme,
        watchSystemTheme,
        downloadFile,
        readFileAsText,
        getCaretPosition
    };
})();
