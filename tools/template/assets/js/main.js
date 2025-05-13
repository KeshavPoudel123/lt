// ===== TOOL SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the tool
    initTool();

    // Initialize settings
    initSettings();
});

/**
 * Initialize the tool
 */
function initTool() {
    // Tool initialization

    // Add your tool-specific initialization code here
}

/**
 * Initialize settings
 */
function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtn = document.querySelector('.close-btn');
    const darkModeToggle = document.getElementById('dark-mode');
    const themeToggle = document.getElementById('theme-toggle');

    // Open settings modal
    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.style.display = 'flex';
        });
    }

    // Close settings modal
    if (closeBtn && settingsModal) {
        closeBtn.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });

        // Close when clicking outside the modal
        window.addEventListener('click', (event) => {
            if (event.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });
    }

    // Dark mode toggle
    if (darkModeToggle) {
        // Check if dark mode is enabled in localStorage
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        darkModeToggle.checked = isDarkMode;

        // Apply dark mode if enabled
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        // Toggle dark mode
        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
                if (themeToggle) {
                    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                }
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
                if (themeToggle) {
                    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                }
            }
        });
    }

    // Theme toggle button
    if (themeToggle) {
        // Set initial icon based on dark mode
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

        // Toggle theme
        themeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.contains('dark-mode');

            if (isDarkMode) {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                if (darkModeToggle) {
                    darkModeToggle.checked = false;
                }
            } else {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                if (darkModeToggle) {
                    darkModeToggle.checked = true;
                }
            }
        });
    }
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');

    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

    // Set notification content and type
    notification.innerHTML = `<p>${message}</p>`;
    notification.className = `notification ${type}`;

    // Show notification
    notification.classList.add('show');

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Copy text to clipboard
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} - Whether the copy was successful
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
        return true;
    } catch (err) {
        // Error handling for clipboard operations
        showNotification('Failed to copy to clipboard', 'error');
        return false;
    }
}

/**
 * Download a file
 * @param {string} content - The content of the file
 * @param {string} fileName - The name of the file
 * @param {string} contentType - The content type of the file
 */
function downloadFile(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

/**
 * Format a date
 * @param {Date} date - The date to format
 * @returns {string} - The formatted date
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}
