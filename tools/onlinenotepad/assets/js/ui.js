/**
 * ScribbleSpaceY - UI Module
 * Handles UI interactions and rendering
 * Developed by Keshav Poudel
 */

const UI = (function() {
    // DOM elements
    let notesList;
    let categoriesList;
    let searchInput;
    let sortSelect;
    let settingsModal;
    let themeToggle;

    // UI state
    let isSettingsOpen = false;
    let isSidebarCollapsed = false;
    let currentTheme = 'light';
    let isResizing = false;
    let initialX = 0;
    let initialWidth = 0;

    /**
     * Initialize the UI
     */
    function init() {
        // Get DOM elements
        notesList = document.getElementById('notes-list');
        categoriesList = document.getElementById('categories-list');
        searchInput = document.getElementById('search-notes');
        sortSelect = document.getElementById('sort-notes');
        settingsModal = document.getElementById('settings-modal');
        themeToggle = document.getElementById('theme-toggle');

        // Set up event listeners
        setupEventListeners();

        // Listen for note and category changes
        NoteManager.addEventListener('noteChanged', handleNoteChanged);
        NoteManager.addEventListener('noteCreated', handleNoteCreated);
        NoteManager.addEventListener('noteDeleted', handleNoteDeleted);
        NoteManager.addEventListener('noteSaved', handleNoteSaved);
        NoteManager.addEventListener('categoryChanged', handleCategoryChanged);
        NoteManager.addEventListener('categoryCreated', handleCategoryCreated);
        NoteManager.addEventListener('categoryDeleted', handleCategoryDeleted);

        // Initial render
        renderNotesList();
        renderCategoriesList();

        // Apply theme
        applyTheme();
    }

    /**
     * Set up event listeners for UI elements
     */
    function setupEventListeners() {
        // New note button
        const newNoteBtn = document.getElementById('new-note-btn');
        if (newNoteBtn) {
            newNoteBtn.addEventListener('click', () => {
                NoteManager.createNewNote();
            });
        }

        // Search input
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(() => {
                renderNotesList();
            }, 300));
        }

        // Sort select
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                renderNotesList();
            });
        }

        // Add category button
        const addCategoryBtn = document.getElementById('add-category-btn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => {
                const categoryName = prompt('Enter category name:');
                if (categoryName && categoryName.trim()) {
                    const newCategory = {
                        id: Utils.generateId(),
                        name: categoryName.trim(),
                        color: getRandomColor()
                    };

                    NoteManager.createCategory(newCategory);
                }
            });
        }

        // Settings button
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                openSettings();
            });
        }

        // Close settings button
        const closeSettingsBtn = document.querySelector('.modal-header .close-btn');
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => {
                closeSettings();
            });
        }

        // Click outside modal to close
        if (settingsModal) {
            settingsModal.addEventListener('click', (event) => {
                if (event.target === settingsModal) {
                    closeSettings();
                }
            });
        }

        // Theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                toggleTheme();
            });
        }

        // Settings form controls
        setupSettingsControls();

        // Fullscreen functionality removed as requested

        // Export button dropdown
        const exportLinks = document.querySelectorAll('.dropdown-content a[data-format]');
        exportLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const format = link.getAttribute('data-format');
                exportCurrentNote(format);
            });
        });

        // Trash button
        const trashBtn = document.getElementById('trash-btn');
        if (trashBtn) {
            trashBtn.addEventListener('click', () => {
                showTrash();
            });
        }

        // Export all notes button
        const exportAllBtn = document.getElementById('export-all-btn');
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => {
                exportAllNotes();
            });
        }

        // Import notes button
        const importBtn = document.getElementById('import-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                importNotes();
            });
        }

        // Clear data button
        const clearDataBtn = document.getElementById('clear-data-btn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                    clearAllData();
                }
            });
        }

        // Sidebar resizer
        const sidebarResizer = document.getElementById('sidebar-resizer');
        const sidebar = document.querySelector('.sidebar');

        if (sidebarResizer && sidebar) {
            sidebarResizer.addEventListener('mousedown', (e) => {
                isResizing = true;
                initialX = e.clientX;
                initialWidth = parseInt(window.getComputedStyle(sidebar).width, 10);

                sidebarResizer.classList.add('active');

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', () => {
                    isResizing = false;
                    sidebarResizer.classList.remove('active');
                    document.removeEventListener('mousemove', handleMouseMove);

                    // Save sidebar width to localStorage
                    localStorage.setItem('sidebarWidth', sidebar.style.width);
                });
            });

            // Load saved sidebar width if available
            const savedWidth = localStorage.getItem('sidebarWidth');
            if (savedWidth) {
                sidebar.style.width = savedWidth;
            }
        }
    }

    /**
     * Set up settings form controls
     */
    function setupSettingsControls() {
        const settings = StorageManager.getSettings();

        // Font family
        const fontFamilySelect = document.getElementById('font-family');
        if (fontFamilySelect) {
            fontFamilySelect.value = settings.fontFamily;
            fontFamilySelect.addEventListener('change', () => {
                const newSettings = {
                    fontFamily: fontFamilySelect.value
                };

                StorageManager.saveSettings(newSettings);
                Editor.updateSettings(newSettings);
            });
        }

        // Font size
        const fontSizeRange = document.getElementById('font-size');
        const fontSizeValue = document.getElementById('font-size-value');
        if (fontSizeRange && fontSizeValue) {
            fontSizeRange.value = settings.fontSize;
            fontSizeValue.textContent = `${settings.fontSize}px`;

            fontSizeRange.addEventListener('input', () => {
                const fontSize = parseInt(fontSizeRange.value);
                fontSizeValue.textContent = `${fontSize}px`;

                const newSettings = {
                    fontSize
                };

                StorageManager.saveSettings(newSettings);
                Editor.updateSettings(newSettings);
            });
        }

        // Line height
        const lineHeightRange = document.getElementById('line-height');
        const lineHeightValue = document.getElementById('line-height-value');
        if (lineHeightRange && lineHeightValue) {
            lineHeightRange.value = settings.lineHeight;
            lineHeightValue.textContent = settings.lineHeight;

            lineHeightRange.addEventListener('input', () => {
                const lineHeight = parseFloat(lineHeightRange.value);
                lineHeightValue.textContent = lineHeight;

                const newSettings = {
                    lineHeight
                };

                StorageManager.saveSettings(newSettings);
                Editor.updateSettings(newSettings);
            });
        }

        // Show line numbers
        const showLineNumbersCheck = document.getElementById('show-line-numbers');
        if (showLineNumbersCheck) {
            showLineNumbersCheck.checked = settings.showLineNumbers;

            showLineNumbersCheck.addEventListener('change', () => {
                const newSettings = {
                    showLineNumbers: showLineNumbersCheck.checked
                };

                StorageManager.saveSettings(newSettings);
                Editor.updateSettings(newSettings);
            });
        }

        // Auto save
        const autoSaveCheck = document.getElementById('auto-save');
        if (autoSaveCheck) {
            autoSaveCheck.checked = settings.autoSave;

            autoSaveCheck.addEventListener('change', () => {
                const newSettings = {
                    autoSave: autoSaveCheck.checked
                };

                StorageManager.saveSettings(newSettings);
                Editor.updateSettings(newSettings);
            });
        }

        // Spell check
        const spellCheckCheck = document.getElementById('spell-check');
        if (spellCheckCheck) {
            spellCheckCheck.checked = settings.spellCheck;

            spellCheckCheck.addEventListener('change', () => {
                const newSettings = {
                    spellCheck: spellCheckCheck.checked
                };

                StorageManager.saveSettings(newSettings);
                Editor.updateSettings(newSettings);
            });
        }
    }

    /**
     * Render the notes list
     */
    function renderNotesList() {
        if (!notesList) return;

        // Clear current list
        notesList.innerHTML = '';

        // Get filter options
        const searchQuery = searchInput ? searchInput.value : '';
        const sortValue = sortSelect ? sortSelect.value : 'modified-desc';

        // Parse sort value
        const [sortBy, sortOrder] = sortValue.split('-');

        // Get notes with filters
        const notes = NoteManager.getNotes({
            searchQuery,
            sortBy: sortBy === 'name' ? 'title' : sortBy,
            sortOrder
        });

        // Get current note
        const currentNote = NoteManager.getCurrentNote();

        // Render each note
        notes.forEach(note => {
            const listItem = document.createElement('li');
            listItem.className = 'note-item';

            if (currentNote && note.id === currentNote.id) {
                listItem.classList.add('active');
            }

            if (note.pinned) {
                listItem.classList.add('pinned');
            }

            // Create note color indicator if set
            let colorIndicator = '';
            if (note.color) {
                colorIndicator = `<span class="note-color" style="background-color: ${note.color}"></span>`;
            }

            // Create note preview
            const previewText = Utils.truncateText(
                note.content.replace(/<[^>]*>/g, ' '),
                60
            );

            // Format date
            const dateText = Utils.getRelativeTime(note.modifiedAt);

            listItem.innerHTML = `
                <div class="note-item-content">
                    ${colorIndicator}
                    <div class="note-details">
                        <div class="note-title">${note.title}</div>
                        <div class="note-preview">${previewText}</div>
                        <div class="note-meta">
                            <span class="note-date">${dateText}</span>
                            <span class="note-word-count">${Utils.countWords(note.content)} words</span>
                        </div>
                    </div>
                </div>
                <div class="note-actions">
                    <button class="btn icon-btn pin-note-btn" title="${note.pinned ? 'Unpin' : 'Pin'} Note">
                        <i class="fas ${note.pinned ? 'fa-thumbtack' : 'fa-thumbtack'}"></i>
                    </button>
                    <button class="btn icon-btn delete-note-btn" title="Delete Note">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Add click event to load note
            listItem.querySelector('.note-item-content').addEventListener('click', () => {
                NoteManager.setCurrentNote(note);
            });

            // Add pin/unpin event
            listItem.querySelector('.pin-note-btn').addEventListener('click', (event) => {
                event.stopPropagation();
                NoteManager.saveCurrentNote({
                    ...note,
                    pinned: !note.pinned
                });
                renderNotesList();
            });

            // Add delete event
            listItem.querySelector('.delete-note-btn').addEventListener('click', (event) => {
                event.stopPropagation();
                if (confirm('Are you sure you want to delete this note?')) {
                    NoteManager.deleteNote(note.id);
                }
            });

            notesList.appendChild(listItem);
        });

        // Show empty state if no notes
        if (notes.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';

            if (searchQuery) {
                emptyState.innerHTML = `
                    <p>No notes found matching "${searchQuery}"</p>
                    <button id="clear-search-btn" class="btn secondary-btn">Clear Search</button>
                `;

                // Add event to clear search
                emptyState.querySelector('#clear-search-btn').addEventListener('click', () => {
                    searchInput.value = '';
                    renderNotesList();
                });
            } else {
                emptyState.innerHTML = `
                    <p>No notes yet</p>
                    <button id="create-first-note-btn" class="btn primary-btn">Create Your First Note</button>
                `;

                // Add event to create note
                emptyState.querySelector('#create-first-note-btn').addEventListener('click', () => {
                    NoteManager.createNewNote();
                });
            }

            notesList.appendChild(emptyState);
        }
    }

    /**
     * Render the categories list
     */
    function renderCategoriesList() {
        if (!categoriesList) return;

        // Clear current list
        categoriesList.innerHTML = '';

        // Get categories
        const categories = NoteManager.getCategories();

        // Get current note to highlight active category
        const currentNote = NoteManager.getCurrentNote();
        const currentCategoryId = currentNote ? currentNote.categoryId : null;

        // Render each category
        categories.forEach(category => {
            const listItem = document.createElement('li');
            listItem.className = 'category-item';

            if (currentCategoryId === category.id) {
                listItem.classList.add('active');
            }

            listItem.innerHTML = `
                <div class="category-color" style="background-color: ${category.color}"></div>
                <span class="category-name">${category.name}</span>
                ${category.id !== 'default' ? `
                    <div class="category-actions">
                        <button class="btn icon-btn edit-category-btn" title="Edit Category">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn icon-btn delete-category-btn" title="Delete Category">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                ` : ''}
            `;

            // Add click event to filter notes by category
            listItem.addEventListener('click', () => {
                // TODO: Implement category filtering
                // For now, just highlight the category
                const activeCategory = categoriesList.querySelector('.category-item.active');
                if (activeCategory) {
                    activeCategory.classList.remove('active');
                }
                listItem.classList.add('active');
            });

            // Add edit event
            const editBtn = listItem.querySelector('.edit-category-btn');
            if (editBtn) {
                editBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const newName = prompt('Enter new category name:', category.name);
                    if (newName && newName.trim()) {
                        NoteManager.updateCategory(category.id, {
                            name: newName.trim()
                        });
                    }
                });
            }

            // Add delete event
            const deleteBtn = listItem.querySelector('.delete-category-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    if (confirm(`Are you sure you want to delete the category "${category.name}"? Notes in this category will be moved to the Default category.`)) {
                        NoteManager.deleteCategory(category.id);
                    }
                });
            }

            categoriesList.appendChild(listItem);
        });
    }

    /**
     * Handle note changed event
     * @param {Object} data - Event data with oldNote and newNote
     */
    function handleNoteChanged(data) {
        renderNotesList();
        renderCategoriesList();
    }

    /**
     * Handle note created event
     * @param {Object} note - New note
     */
    function handleNoteCreated(note) {
        renderNotesList();
    }

    /**
     * Handle note deleted event
     * @param {string} noteId - Deleted note ID
     */
    function handleNoteDeleted(noteId) {
        renderNotesList();
    }

    /**
     * Handle note saved event
     * @param {Object} note - Saved note
     */
    function handleNoteSaved(note) {
        renderNotesList();
    }

    /**
     * Handle category changed event
     * @param {Object} category - Updated category
     */
    function handleCategoryChanged(category) {
        renderCategoriesList();
    }

    /**
     * Handle category created event
     * @param {Object} category - New category
     */
    function handleCategoryCreated(category) {
        renderCategoriesList();
    }

    /**
     * Handle category deleted event
     * @param {string} categoryId - Deleted category ID
     */
    function handleCategoryDeleted(categoryId) {
        renderCategoriesList();
        renderNotesList();
    }

    /**
     * Open settings modal
     */
    function openSettings() {
        if (!settingsModal) return;

        settingsModal.style.display = 'flex';
        isSettingsOpen = true;
    }

    /**
     * Close settings modal
     */
    function closeSettings() {
        if (!settingsModal) return;

        settingsModal.style.display = 'none';
        isSettingsOpen = false;
    }

    /**
     * Toggle theme between light and dark
     */
    function toggleTheme() {
        const settings = StorageManager.getSettings();
        const newTheme = settings.theme === 'dark' ? 'light' : 'dark';

        StorageManager.saveSettings({
            theme: newTheme
        });

        applyTheme();
    }

    /**
     * Apply theme based on settings
     */
    function applyTheme() {
        const settings = StorageManager.getSettings();
        let theme = settings.theme;

        // If theme is set to system, use system preference
        if (theme === 'system') {
            theme = Utils.getSystemTheme();
        }

        // Apply theme
        document.documentElement.setAttribute('data-theme', theme);
        currentTheme = theme;

        // Update theme toggle text and icon
        if (themeToggle) {
            if (theme === 'dark') {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            }
        }
    }

    /**
     * Fullscreen functionality removed as requested
     */

    /**
     * Export current note
     * @param {string} format - Export format (txt, md, html, pdf)
     */
    function exportCurrentNote(format) {
        const currentNote = NoteManager.getCurrentNote();

        if (!currentNote) return;

        // Generate filename
        const filename = `${currentNote.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;

        // Special handling for PDF
        if (format === 'pdf') {
            // For PDF, we'll use html2pdf.js library
            const content = NoteManager.exportNote(currentNote.id, 'pdf');

            if (!content) {
                alert('Error exporting note as PDF');
                return;
            }

            // Create a hidden iframe to render the HTML with proper size for printing
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            iframe.style.overflow = 'hidden';
            iframe.name = 'pdf-print-frame'; // Name the iframe for targeting
            document.body.appendChild(iframe);

            // Write the HTML content to the iframe
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(content);

            // Add print-specific styles
            const printStyles = document.createElement('style');
            printStyles.textContent = `
                @media print {
                    @page {
                        size: A4;
                        margin: 1cm;
                    }
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    .note-content {
                        page-break-inside: auto;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        page-break-after: avoid;
                    }
                    img, table {
                        page-break-inside: avoid;
                    }
                }
            `;
            iframe.contentWindow.document.head.appendChild(printStyles);
            iframe.contentWindow.document.close();

            // Wait for the content to load
            setTimeout(() => {
                try {
                    // Show a message to the user
                    const notification = document.createElement('div');
                    notification.className = 'notification show';
                    notification.innerHTML = '<p><i class="fas fa-file-pdf"></i> Preparing PDF... Please use your browser\'s save as PDF option in the print dialog.</p>';
                    document.body.appendChild(notification);

                    // Use browser's print functionality to save as PDF
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();

                    // Remove the notification after a delay
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 5000);

                    // Remove the iframe after printing
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                    }, 1000);
                } catch (error) {
                    console.error('Error printing to PDF:', error);
                    alert('Error exporting to PDF. Please try again.');
                    document.body.removeChild(iframe);
                }
            }, 800);

            return;
        }

        // For other formats
        const content = NoteManager.exportNote(currentNote.id, format);

        if (!content) {
            alert('Error exporting note');
            return;
        }

        // Download file
        let contentType = 'text/plain';

        if (format === 'html') {
            contentType = 'text/html';
        } else if (format === 'md') {
            contentType = 'text/markdown';
        }

        Utils.downloadFile(content, filename, contentType);
    }

    /**
     * Show trash
     */
    function showTrash() {
        // TODO: Implement trash view
        alert('Trash functionality coming soon!');
    }

    /**
     * Export all notes
     */
    function exportAllNotes() {
        const exportData = StorageManager.exportAllNotes();

        if (!exportData) {
            alert('Error exporting notes');
            return;
        }

        // Generate filename with date
        const date = new Date().toISOString().split('T')[0];
        const filename = `scribblespace_backup_${date}.json`;

        // Download file
        Utils.downloadFile(exportData, filename, 'application/json');
    }

    /**
     * Import notes
     */
    function importNotes() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';

        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];

            if (!file) return;

            try {
                const content = await Utils.readFileAsText(file);
                const success = StorageManager.importNotes(content);

                if (success) {
                    alert('Notes imported successfully');
                    renderNotesList();
                    renderCategoriesList();
                } else {
                    alert('Error importing notes: Invalid format');
                }
            } catch (error) {
                console.error('Error importing notes:', error);
                alert('Error importing notes: ' + error.message);
            }
        });

        // Trigger file selection
        fileInput.click();
    }

    /**
     * Clear all data
     */
    function clearAllData() {
        localStorage.clear();
        alert('All data has been cleared. The page will now reload.');
        window.location.reload();
    }

    /**
     * Handle mouse move event for sidebar resizing
     * @param {MouseEvent} e - Mouse event
     */
    function handleMouseMove(e) {
        if (!isResizing) return;

        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        const delta = e.clientX - initialX;
        const newWidth = Math.max(180, Math.min(400, initialWidth + delta));

        sidebar.style.width = `${newWidth}px`;
    }

    /**
     * Get a random color for categories
     * @returns {string} Random color hex code
     */
    function getRandomColor() {
        const colors = [
            '#4a6ee0', // Blue
            '#e6704a', // Orange
            '#4ae670', // Green
            '#e64a9d', // Pink
            '#9d4ae6', // Purple
            '#e6e64a', // Yellow
            '#4ae6e6', // Cyan
            '#e64a4a'  // Red
        ];

        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Public API
    return {
        init,
        renderNotesList,
        renderCategoriesList,
        openSettings,
        closeSettings,
        toggleTheme,
        applyTheme
    };
})();
