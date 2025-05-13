/**
 * ScribbleSpaceY - Note Manager Module
 * Handles note operations and management
 * Developed by Keshav Poudel
 */

const NoteManager = (function() {
    // Current active note
    let currentNote = null;

    // Event listeners
    const eventListeners = {
        noteChanged: [],
        noteCreated: [],
        noteDeleted: [],
        noteSaved: [],
        categoryChanged: [],
        categoryCreated: [],
        categoryDeleted: []
    };

    /**
     * Initialize the note manager
     */
    function init() {
        // Load last active note if available
        const lastActiveNoteId = StorageManager.getLastActiveNote();

        if (lastActiveNoteId) {
            const note = StorageManager.getNoteById(lastActiveNoteId);
            if (note) {
                setCurrentNote(note);
            } else {
                createNewNote();
            }
        } else {
            // Check if there are any notes
            const notes = StorageManager.getNotes();

            if (notes.length > 0) {
                // Load the most recently modified note
                const sortedNotes = [...notes].sort((a, b) =>
                    new Date(b.modifiedAt) - new Date(a.modifiedAt)
                );

                setCurrentNote(sortedNotes[0]);
            } else {
                // Create a welcome note for first-time users
                createWelcomeNote();
            }
        }
    }

    /**
     * Create a welcome note for first-time users
     */
    function createWelcomeNote() {
        const welcomeNote = {
            id: Utils.generateId(),
            title: 'Welcome to ScribbleSpaceY!',
            content: `# Welcome to ScribbleSpaceY!

Thank you for choosing ScribbleSpaceY, your new favorite online notepad.

## Key Features

* **Rich Text Editing** - Format your text with bold, italic, headers, and more
* **Markdown Support** - Write in markdown and see it rendered beautifully
* **Syntax Highlighting** - Perfect for code snippets
* **Auto-Save** - Never lose your work again
* **Dark Mode** - Easy on the eyes for late-night writing
* **Organization** - Categorize and search your notes with ease

## Getting Started

1. Create a new note using the "New Note" button
2. Organize notes into categories
3. Use the search function to find notes quickly
4. Customize your experience in Settings

## Keyboard Shortcuts

* **Ctrl+N** - New note
* **Ctrl+S** - Save note
* **Ctrl+F** - Find in note
* **Ctrl+B** - Bold text
* **Ctrl+I** - Italic text
* **Ctrl+H** - Toggle heading
* **Ctrl+K** - Insert link
* **Ctrl+/** - Toggle markdown preview

Enjoy writing with ScribbleSpaceY!

*Developed with ❤️ by Keshav Poudel*`,
            categoryId: 'default',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            pinned: false,
            color: null
        };

        StorageManager.saveNote(welcomeNote);
        setCurrentNote(welcomeNote);

        // Trigger note created event
        triggerEvent('noteCreated', welcomeNote);
    }

    /**
     * Create a new empty note
     * @returns {Object} The new note object
     */
    function createNewNote() {
        const newNote = {
            id: Utils.generateId(),
            title: 'Untitled Note',
            content: '',
            categoryId: 'default',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            pinned: false,
            color: null
        };

        StorageManager.saveNote(newNote);
        setCurrentNote(newNote);

        // Trigger note created event
        triggerEvent('noteCreated', newNote);

        return newNote;
    }

    /**
     * Set the current active note
     * @param {Object} note - Note object
     */
    function setCurrentNote(note) {
        const oldNote = currentNote;
        currentNote = note;

        // Save last active note
        if (note) {
            StorageManager.saveLastActiveNote(note.id);
        }

        // Trigger note changed event
        triggerEvent('noteChanged', { oldNote, newNote: note });
    }

    /**
     * Get the current active note
     * @returns {Object} Current note
     */
    function getCurrentNote() {
        return currentNote;
    }

    /**
     * Save the current note
     * @param {Object} updates - Properties to update
     * @returns {boolean} Success status
     */
    function saveCurrentNote(updates = {}) {
        if (!currentNote) return false;

        const updatedNote = {
            ...currentNote,
            ...updates,
            modifiedAt: new Date().toISOString()
        };

        const success = StorageManager.saveNote(updatedNote);

        if (success) {
            currentNote = updatedNote;
            triggerEvent('noteSaved', updatedNote);
        }

        return success;
    }

    /**
     * Delete a note by ID
     * @param {string} noteId - Note ID to delete
     * @returns {boolean} Success status
     */
    function deleteNote(noteId) {
        const success = StorageManager.deleteNote(noteId);

        if (success) {
            // If the deleted note is the current note, load another note
            if (currentNote && currentNote.id === noteId) {
                const notes = StorageManager.getNotes();

                if (notes.length > 0) {
                    // Load the most recently modified note
                    const sortedNotes = [...notes].sort((a, b) =>
                        new Date(b.modifiedAt) - new Date(a.modifiedAt)
                    );

                    setCurrentNote(sortedNotes[0]);
                } else {
                    // No notes left, create a new one
                    createNewNote();
                }
            }

            // Trigger note deleted event
            triggerEvent('noteDeleted', noteId);
        }

        return success;
    }

    /**
     * Get all notes, optionally filtered and sorted
     * @param {Object} options - Filter and sort options
     * @returns {Array} Filtered and sorted notes
     */
    function getNotes(options = {}) {
        const {
            categoryId = null,
            searchQuery = '',
            sortBy = 'modifiedAt',
            sortOrder = 'desc',
            includeTrash = false
        } = options;

        let notes = StorageManager.getNotes();

        // Include trash if requested
        if (includeTrash) {
            const trash = StorageManager.getTrash();
            notes = [...notes, ...trash];
        }

        // Filter by category
        if (categoryId) {
            notes = notes.filter(note => note.categoryId === categoryId);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            notes = notes.filter(note =>
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query)
            );
        }

        // Sort notes
        notes.sort((a, b) => {
            // Always put pinned notes at the top
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;

            // Then sort by the specified field
            let valueA, valueB;

            switch (sortBy) {
                case 'title':
                    valueA = a.title.toLowerCase();
                    valueB = b.title.toLowerCase();
                    break;
                case 'createdAt':
                    valueA = new Date(a.createdAt);
                    valueB = new Date(b.createdAt);
                    break;
                case 'modifiedAt':
                default:
                    valueA = new Date(a.modifiedAt);
                    valueB = new Date(b.modifiedAt);
            }

            // Apply sort order
            if (sortOrder === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });

        return notes;
    }

    /**
     * Create a new category
     * @param {Object} category - Category object
     * @returns {boolean} Success status
     */
    function createCategory(category) {
        const categories = StorageManager.getCategories();

        // Check if category with same ID already exists
        if (categories.some(c => c.id === category.id)) {
            return false;
        }

        // Add new category
        categories.push(category);
        StorageManager.saveCategories(categories);

        // Trigger category created event
        triggerEvent('categoryCreated', category);

        return true;
    }

    /**
     * Update a category
     * @param {string} categoryId - Category ID to update
     * @param {Object} updates - Properties to update
     * @returns {boolean} Success status
     */
    function updateCategory(categoryId, updates) {
        const categories = StorageManager.getCategories();
        const index = categories.findIndex(c => c.id === categoryId);

        if (index === -1) {
            return false;
        }

        // Update category
        categories[index] = { ...categories[index], ...updates };
        StorageManager.saveCategories(categories);

        // Trigger category changed event
        triggerEvent('categoryChanged', categories[index]);

        return true;
    }

    /**
     * Delete a category
     * @param {string} categoryId - Category ID to delete
     * @returns {boolean} Success status
     */
    function deleteCategory(categoryId) {
        // Don't allow deleting the default category
        if (categoryId === 'default') {
            return false;
        }

        const categories = StorageManager.getCategories();
        const updatedCategories = categories.filter(c => c.id !== categoryId);

        if (updatedCategories.length === categories.length) {
            // Category not found
            return false;
        }

        // Move notes in this category to the default category
        const notes = StorageManager.getNotes();
        let notesUpdated = false;

        for (const note of notes) {
            if (note.categoryId === categoryId) {
                note.categoryId = 'default';
                note.modifiedAt = new Date().toISOString();
                notesUpdated = true;
            }
        }

        if (notesUpdated) {
            StorageManager.saveNotes(notes);
        }

        // Save updated categories
        StorageManager.saveCategories(updatedCategories);

        // Trigger category deleted event
        triggerEvent('categoryDeleted', categoryId);

        return true;
    }

    /**
     * Get all categories
     * @returns {Array} Categories
     */
    function getCategories() {
        return StorageManager.getCategories();
    }

    /**
     * Export a note to different formats
     * @param {string} noteId - Note ID to export
     * @param {string} format - Export format (txt, md, html, pdf)
     * @returns {string|null} Exported content or null on error
     */
    function exportNote(noteId, format) {
        const note = StorageManager.getNoteById(noteId);

        if (!note) {
            return null;
        }

        switch (format) {
            case 'txt':
                // Plain text (strip HTML but preserve line breaks)
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = note.content
                    .replace(/<div>/gi, '\n')
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<p>/gi, '\n')
                    .replace(/<h[1-6]>/gi, '\n\n')
                    .replace(/<\/h[1-6]>/gi, '\n');

                // Get text content and preserve line breaks
                let plainText = tempDiv.textContent || tempDiv.innerText || '';

                // Remove extra line breaks
                plainText = plainText.replace(/\n{3,}/g, '\n\n');

                return plainText;

            case 'md':
                // Markdown
                return MarkdownManager.htmlToMarkdown(note.content);

            case 'html':
                // HTML
                return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${note.title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }
        code {
            font-family: monospace;
        }
    </style>
</head>
<body>
    <h1>${note.title}</h1>
    <div class="note-content">
        ${note.content}
    </div>
    <footer>
        <p><small>Created with ScribbleSpaceY</small></p>
    </footer>
</body>
</html>`;

            case 'pdf':
                // Return HTML content that will be converted to PDF
                return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${note.title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        h1 { font-size: 2em; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.3em; }
        p {
            margin-bottom: 1em;
        }
        pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
            white-space: pre-wrap;
        }
        code {
            font-family: monospace;
            background-color: #f5f5f5;
            padding: 2px 4px;
            border-radius: 3px;
        }
        ul, ol {
            margin-bottom: 1em;
            padding-left: 2em;
        }
        img {
            max-width: 100%;
            height: auto;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        blockquote {
            border-left: 4px solid #ddd;
            padding-left: 1em;
            margin-left: 0;
            color: #666;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 1em;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .note-title {
            text-align: center;
            margin-bottom: 1.5em;
            padding-bottom: 0.5em;
            border-bottom: 1px solid #eee;
        }
        .note-content {
            min-height: 500px;
        }
        .note-footer {
            margin-top: 2em;
            padding-top: 1em;
            border-top: 1px solid #eee;
            font-size: 0.8em;
            color: #999;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1 class="note-title">${note.title}</h1>
    <div class="note-content">
        ${note.content}
    </div>
    <div class="note-footer">
        <p>Created with SwiftNote</p>
    </div>
</body>
</html>`;

            default:
                return null;
        }
    }

    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    function addEventListener(event, callback) {
        if (eventListeners[event]) {
            eventListeners[event].push(callback);
        }
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    function removeEventListener(event, callback) {
        if (eventListeners[event]) {
            eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
        }
    }

    /**
     * Trigger an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    function triggerEvent(event, data) {
        if (eventListeners[event]) {
            for (const callback of eventListeners[event]) {
                callback(data);
            }
        }
    }

    // Public API
    return {
        init,
        createNewNote,
        setCurrentNote,
        getCurrentNote,
        saveCurrentNote,
        deleteNote,
        getNotes,
        createCategory,
        updateCategory,
        deleteCategory,
        getCategories,
        exportNote,
        addEventListener,
        removeEventListener
    };
})();
