/**
 * ScribbleSpaceY - Storage Module
 * Handles all data storage operations using localStorage
 * Developed by Keshav Poudel
 */

const StorageManager = (function() {
    // Storage keys
    const STORAGE_KEYS = {
        NOTES: 'scribblespace_notes',
        CATEGORIES: 'scribblespace_categories',
        SETTINGS: 'scribblespace_settings',
        TRASH: 'scribblespace_trash',
        LAST_ACTIVE_NOTE: 'scribblespace_last_active_note'
    };

    // Default settings
    const DEFAULT_SETTINGS = {
        theme: 'system', // 'light', 'dark', 'system'
        fontFamily: "'Roboto Mono', monospace",
        fontSize: 16,
        lineHeight: 1.5,
        showLineNumbers: false,
        autoSave: true,
        spellCheck: true,
        editorTheme: 'default' // 'default', 'paper', 'focus'
    };

    /**
     * Initialize storage with default values if not already set
     */
    function initStorage() {
        if (!localStorage.getItem(STORAGE_KEYS.NOTES)) {
            localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify([]));
        }
        
        if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([
                { id: 'default', name: 'Default', color: '#4a6ee0' }
            ]));
        }
        
        if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        }
        
        if (!localStorage.getItem(STORAGE_KEYS.TRASH)) {
            localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify([]));
        }
    }

    /**
     * Get all notes from storage
     * @returns {Array} Array of note objects
     */
    function getNotes() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES)) || [];
        } catch (error) {
            console.error('Error getting notes from storage:', error);
            return [];
        }
    }

    /**
     * Save notes to storage
     * @param {Array} notes - Array of note objects
     */
    function saveNotes(notes) {
        try {
            localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
        } catch (error) {
            console.error('Error saving notes to storage:', error);
            // Handle storage quota exceeded
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                alert('Storage quota exceeded. Please delete some notes or clear browser data.');
            }
        }
    }

    /**
     * Get a single note by ID
     * @param {string} noteId - The ID of the note to retrieve
     * @returns {Object|null} The note object or null if not found
     */
    function getNoteById(noteId) {
        const notes = getNotes();
        return notes.find(note => note.id === noteId) || null;
    }

    /**
     * Save a single note
     * @param {Object} note - The note object to save
     * @returns {boolean} Success status
     */
    function saveNote(note) {
        try {
            const notes = getNotes();
            const index = notes.findIndex(n => n.id === note.id);
            
            if (index !== -1) {
                // Update existing note
                notes[index] = { ...notes[index], ...note, modifiedAt: new Date().toISOString() };
            } else {
                // Add new note
                notes.push({
                    ...note,
                    createdAt: new Date().toISOString(),
                    modifiedAt: new Date().toISOString()
                });
            }
            
            saveNotes(notes);
            return true;
        } catch (error) {
            console.error('Error saving note:', error);
            return false;
        }
    }

    /**
     * Delete a note by ID
     * @param {string} noteId - The ID of the note to delete
     * @returns {boolean} Success status
     */
    function deleteNote(noteId) {
        try {
            const notes = getNotes();
            const noteToDelete = notes.find(note => note.id === noteId);
            
            if (noteToDelete) {
                // Move to trash
                const trash = getTrash();
                trash.push({
                    ...noteToDelete,
                    deletedAt: new Date().toISOString()
                });
                saveTrash(trash);
                
                // Remove from notes
                const updatedNotes = notes.filter(note => note.id !== noteId);
                saveNotes(updatedNotes);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error deleting note:', error);
            return false;
        }
    }

    /**
     * Get all categories from storage
     * @returns {Array} Array of category objects
     */
    function getCategories() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
        } catch (error) {
            console.error('Error getting categories from storage:', error);
            return [];
        }
    }

    /**
     * Save categories to storage
     * @param {Array} categories - Array of category objects
     */
    function saveCategories(categories) {
        try {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
        } catch (error) {
            console.error('Error saving categories to storage:', error);
        }
    }

    /**
     * Get application settings
     * @returns {Object} Settings object
     */
    function getSettings() {
        try {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) };
        } catch (error) {
            console.error('Error getting settings from storage:', error);
            return DEFAULT_SETTINGS;
        }
    }

    /**
     * Save application settings
     * @param {Object} settings - Settings object
     */
    function saveSettings(settings) {
        try {
            const currentSettings = getSettings();
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
                ...currentSettings,
                ...settings
            }));
        } catch (error) {
            console.error('Error saving settings to storage:', error);
        }
    }

    /**
     * Get trash items
     * @returns {Array} Array of deleted note objects
     */
    function getTrash() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRASH)) || [];
        } catch (error) {
            console.error('Error getting trash from storage:', error);
            return [];
        }
    }

    /**
     * Save trash items
     * @param {Array} trash - Array of deleted note objects
     */
    function saveTrash(trash) {
        try {
            localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify(trash));
        } catch (error) {
            console.error('Error saving trash to storage:', error);
        }
    }

    /**
     * Restore a note from trash
     * @param {string} noteId - The ID of the note to restore
     * @returns {boolean} Success status
     */
    function restoreFromTrash(noteId) {
        try {
            const trash = getTrash();
            const noteToRestore = trash.find(note => note.id === noteId);
            
            if (noteToRestore) {
                // Remove deletedAt property
                const { deletedAt, ...restoredNote } = noteToRestore;
                
                // Add back to notes
                const notes = getNotes();
                notes.push({
                    ...restoredNote,
                    modifiedAt: new Date().toISOString()
                });
                saveNotes(notes);
                
                // Remove from trash
                const updatedTrash = trash.filter(note => note.id !== noteId);
                saveTrash(updatedTrash);
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error restoring note from trash:', error);
            return false;
        }
    }

    /**
     * Permanently delete a note from trash
     * @param {string} noteId - The ID of the note to permanently delete
     * @returns {boolean} Success status
     */
    function permanentlyDeleteNote(noteId) {
        try {
            const trash = getTrash();
            const updatedTrash = trash.filter(note => note.id !== noteId);
            saveTrash(updatedTrash);
            return true;
        } catch (error) {
            console.error('Error permanently deleting note:', error);
            return false;
        }
    }

    /**
     * Empty the trash
     * @returns {boolean} Success status
     */
    function emptyTrash() {
        try {
            saveTrash([]);
            return true;
        } catch (error) {
            console.error('Error emptying trash:', error);
            return false;
        }
    }

    /**
     * Save the last active note ID
     * @param {string} noteId - The ID of the last active note
     */
    function saveLastActiveNote(noteId) {
        try {
            localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_NOTE, noteId);
        } catch (error) {
            console.error('Error saving last active note:', error);
        }
    }

    /**
     * Get the last active note ID
     * @returns {string|null} The ID of the last active note or null
     */
    function getLastActiveNote() {
        try {
            return localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_NOTE);
        } catch (error) {
            console.error('Error getting last active note:', error);
            return null;
        }
    }

    /**
     * Export all notes as JSON
     * @returns {string} JSON string of all notes
     */
    function exportAllNotes() {
        try {
            const exportData = {
                notes: getNotes(),
                categories: getCategories(),
                version: '1.0.0',
                exportDate: new Date().toISOString()
            };
            
            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            console.error('Error exporting notes:', error);
            return null;
        }
    }

    /**
     * Import notes from JSON
     * @param {string} jsonData - JSON string of notes to import
     * @returns {boolean} Success status
     */
    function importNotes(jsonData) {
        try {
            const importData = JSON.parse(jsonData);
            
            if (importData.notes && Array.isArray(importData.notes)) {
                // Merge with existing notes
                const currentNotes = getNotes();
                const newNotes = importData.notes.filter(newNote => 
                    !currentNotes.some(note => note.id === newNote.id)
                );
                
                saveNotes([...currentNotes, ...newNotes]);
                
                // Import categories if available
                if (importData.categories && Array.isArray(importData.categories)) {
                    const currentCategories = getCategories();
                    const newCategories = importData.categories.filter(newCat => 
                        !currentCategories.some(cat => cat.id === newCat.id)
                    );
                    
                    saveCategories([...currentCategories, ...newCategories]);
                }
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error importing notes:', error);
            return false;
        }
    }

    /**
     * Calculate storage usage
     * @returns {Object} Storage usage information
     */
    function getStorageUsage() {
        try {
            const notes = getNotes();
            const trash = getTrash();
            const categories = getCategories();
            const settings = getSettings();
            
            const notesSize = new Blob([JSON.stringify(notes)]).size;
            const trashSize = new Blob([JSON.stringify(trash)]).size;
            const categoriesSize = new Blob([JSON.stringify(categories)]).size;
            const settingsSize = new Blob([JSON.stringify(settings)]).size;
            
            const totalSize = notesSize + trashSize + categoriesSize + settingsSize;
            
            return {
                notes: {
                    count: notes.length,
                    size: notesSize
                },
                trash: {
                    count: trash.length,
                    size: trashSize
                },
                categories: {
                    count: categories.length,
                    size: categoriesSize
                },
                settings: {
                    size: settingsSize
                },
                total: {
                    size: totalSize
                }
            };
        } catch (error) {
            console.error('Error calculating storage usage:', error);
            return null;
        }
    }

    // Public API
    return {
        initStorage,
        getNotes,
        saveNotes,
        getNoteById,
        saveNote,
        deleteNote,
        getCategories,
        saveCategories,
        getSettings,
        saveSettings,
        getTrash,
        saveTrash,
        restoreFromTrash,
        permanentlyDeleteNote,
        emptyTrash,
        saveLastActiveNote,
        getLastActiveNote,
        exportAllNotes,
        importNotes,
        getStorageUsage,
        STORAGE_KEYS
    };
})();
