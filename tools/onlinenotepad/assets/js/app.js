/**
 * ScribbleSpaceY - Main Application
 * Entry point for the application
 * Developed by Keshav Poudel
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    initApp();

    // Register service worker for offline support
    registerServiceWorker();
});

/**
 * Initialize the application
 */
function initApp() {
    try {
        // Initialize storage
        StorageManager.initStorage();

        // Initialize markdown parser
        MarkdownManager.init();

        // Initialize note manager
        NoteManager.init();

        // Initialize editor
        Editor.init();

        // Initialize UI
        UI.init();

        // Set up keyboard shortcuts
        setupGlobalKeyboardShortcuts();

        // Set up window events
        setupWindowEvents();
    } catch (error) {
        showErrorMessage('Failed to initialize the application. Please refresh the page or clear your browser data.');
    }
}

/**
 * Set up global keyboard shortcuts
 */
function setupGlobalKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + N: New note
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            NoteManager.createNewNote();
        }

        // Escape: Close modals
        if (event.key === 'Escape') {
            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal && settingsModal.style.display === 'flex') {
                UI.closeSettings();
            }
        }
    });
}

/**
 * Set up window events
 */
function setupWindowEvents() {
    // Save before unload
    window.addEventListener('beforeunload', function() {
        Editor.saveCurrentNote();
    });

    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // Refresh notes list when tab becomes visible again
            UI.renderNotesList();
            UI.renderCategoriesList();
        } else {
            // Save current note when tab becomes hidden
            Editor.saveCurrentNote();
        }
    });

    // Handle online/offline status
    window.addEventListener('online', function() {
        // Could sync with cloud storage here if implemented
    });

    window.addEventListener('offline', function() {
        showNotification('You are offline. Changes will be saved locally.');
    });

    // Handle storage events (changes from other tabs)
    window.addEventListener('storage', function(event) {
        if (event.key && event.key.startsWith('scribblespace_')) {
            // Refresh UI to reflect changes
            UI.renderNotesList();
            UI.renderCategoriesList();

            // If the current note was changed, reload it
            const currentNote = NoteManager.getCurrentNote();
            if (currentNote) {
                const updatedNote = StorageManager.getNoteById(currentNote.id);
                if (updatedNote) {
                    NoteManager.setCurrentNote(updatedNote);
                }
            }
        }
    });

    // Handle theme changes
    const removeThemeWatcher = Utils.watchSystemTheme(function(theme) {
        const settings = StorageManager.getSettings();

        // Only update if theme is set to system
        if (settings.theme === 'system') {
            UI.applyTheme();
        }
    });

    // Clean up on page unload
    window.addEventListener('unload', function() {
        removeThemeWatcher();
    });
}

/**
 * Register service worker for offline support
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('./service-worker.js')
                .then(function(registration) {
                    // ServiceWorker registration successful
                })
                .catch(function(error) {
                    // ServiceWorker registration failed
                });
        });
    }
}

/**
 * Show error message to the user
 * @param {string} message - Error message
 */
function showErrorMessage(message) {
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `
        <div class="error-content">
            <h3>Error</h3>
            <p>${message}</p>
            <button id="error-close-btn" class="btn primary-btn">Close</button>
        </div>
    `;

    // Add to body
    document.body.appendChild(errorElement);

    // Add close button event
    document.getElementById('error-close-btn').addEventListener('click', function() {
        errorElement.remove();
    });
}

/**
 * Show notification to the user
 * @param {string} message - Notification message
 * @param {number} [duration=3000] - Duration in milliseconds
 */
function showNotification(message, duration = 3000) {
    // Create notification element
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification';
    notificationElement.textContent = message;

    // Add to body
    document.body.appendChild(notificationElement);

    // Show notification
    setTimeout(function() {
        notificationElement.classList.add('show');
    }, 10);

    // Hide and remove after duration
    setTimeout(function() {
        notificationElement.classList.remove('show');

        // Remove from DOM after animation
        setTimeout(function() {
            notificationElement.remove();
        }, 300);
    }, duration);
}

/**
 * Check browser compatibility
 * @returns {boolean} Whether browser is compatible
 */
function checkBrowserCompatibility() {
    // Check for required features
    const requiredFeatures = [
        'localStorage' in window,
        'JSON' in window,
        'querySelector' in document,
        'addEventListener' in window,
        'classList' in document.documentElement
    ];

    return requiredFeatures.every(feature => feature === true);
}

// Add compatibility check before initialization
if (!checkBrowserCompatibility()) {
    document.body.innerHTML = `
        <div class="compatibility-error">
            <h1>Browser Not Supported</h1>
            <p>Your browser does not support the features required by ScribbleSpaceY.</p>
            <p>Please use a modern browser such as Chrome, Firefox, Safari, or Edge.</p>
        </div>
    `;
}
