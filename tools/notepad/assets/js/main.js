/**
 * Apple Notes-Style Notepad Tool
 * A full-featured notes application with folders, tags, and rich text editing
 */

document.addEventListener('DOMContentLoaded', () => {
    // ======== DOM ELEMENTS ========
    // Main UI Elements
    const notesSidebar = document.querySelector('.notes-sidebar');
    const notesListColumn = document.querySelector('.notes-list-column');
    const notesContent = document.querySelector('.notes-content');
    const notesList = document.getElementById('notes-list');
    const emptyState = document.getElementById('empty-state');
    const noteEditorContainer = document.querySelector('.note-editor-container');

    // Sidebar Elements
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    const newNoteBtn = document.getElementById('new-note-btn');
    const foldersList = document.getElementById('folders-list');
    const tagsList = document.getElementById('tags-list');
    const addFolderBtn = document.getElementById('add-folder-btn');
    const addTagBtn = document.getElementById('add-tag-btn');
    const sidebarSearch = document.getElementById('sidebar-search');

    // Notes List Elements
    const notesListTitle = document.querySelector('.notes-list-title h3');
    const notesCount = document.getElementById('notes-count');
    const sortNotesBtn = document.getElementById('sort-notes-btn');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');

    // Note Editor Elements
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    const lastEdited = document.getElementById('last-edited');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');

    // Action Buttons
    const shareBtn = document.getElementById('share-btn');
    const downloadBtn = document.getElementById('download-btn');
    const deleteNoteBtn = document.getElementById('delete-note-btn');
    const emptyNewNoteBtn = document.getElementById('empty-new-note-btn');

    // Format Buttons
    const formatButtons = document.querySelectorAll('.format-btn');

    // Modals
    const linkModal = document.getElementById('link-modal');
    const imageModal = document.getElementById('image-modal');
    const tableModal = document.getElementById('table-modal');
    const folderModal = document.getElementById('folder-modal');
    const tagModal = document.getElementById('tag-modal');
    const sortModal = document.getElementById('sort-modal');

    // Notification
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    // ======== LOCAL STORAGE KEYS ========
    const STORAGE_KEY_NOTES = 'apple_notes_data';
    const STORAGE_KEY_FOLDERS = 'apple_notes_folders';
    const STORAGE_KEY_TAGS = 'apple_notes_tags';
    const STORAGE_KEY_SETTINGS = 'apple_notes_settings';

    // ======== DATA STRUCTURES ========
    // Notes data structure
    let notes = [];

    // Default folders
    let folders = [
        { id: 'notes', name: 'Notes', system: true },
        { id: 'personal', name: 'Personal', system: false },
        { id: 'work', name: 'Work', system: false }
    ];

    // Default tags
    let tags = [
        { id: 'important', name: 'Important', color: '#ff6b6b' },
        { id: 'work', name: 'Work', color: '#4dabf7' },
        { id: 'personal', name: 'Personal', color: '#51cf66' }
    ];

    // Settings
    let settings = {
        viewMode: 'grid', // 'grid' or 'list'
        sortBy: 'date',   // 'date', 'title', 'created'
        sortOrder: 'desc', // 'asc' or 'desc'
        lastFolder: 'all',
        lastTag: null,
        sidebarCollapsed: false
    };

    // Currently selected note, folder, and tag
    let currentNote = null;
    let currentFolder = 'all';
    let currentTag = null;

    /**
     * Initialize the notepad application
     */
    function initNotepad() {
        // Load data from local storage
        loadFromLocalStorage();

        // Create sample notes if none exist
        if (notes.length === 0) {
            createSampleNotes();
        }

        // Render the UI
        renderFolders();
        renderTags();
        renderNotesList();

        // Apply settings
        applySettings();

        // Set up event listeners
        setupEventListeners();

        // Show the first note or empty state
        if (notes.length > 0) {
            selectNote(notes[0].id);
        } else {
            showEmptyState();
        }
    }

    /**
     * Load data from local storage
     */
    function loadFromLocalStorage() {
        // Load notes
        const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
        if (savedNotes) {
            notes = JSON.parse(savedNotes);
        }

        // Load folders
        const savedFolders = localStorage.getItem(STORAGE_KEY_FOLDERS);
        if (savedFolders) {
            folders = JSON.parse(savedFolders);
        }

        // Load tags
        const savedTags = localStorage.getItem(STORAGE_KEY_TAGS);
        if (savedTags) {
            tags = JSON.parse(savedTags);
        }

        // Load settings
        const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
            currentFolder = settings.lastFolder;
            currentTag = settings.lastTag;
        }
    }

    /**
     * Save data to local storage
     */
    function saveToLocalStorage() {
        // Save notes
        localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));

        // Save folders
        localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));

        // Save tags
        localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(tags));

        // Save settings
        settings.lastFolder = currentFolder;
        settings.lastTag = currentTag;
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    }

    /**
     * Create sample notes if none exist
     */
    function createSampleNotes() {
        notes = [
            {
                id: generateId(),
                title: 'Welcome to Notes',
                content: '<h1>Welcome to Notes!</h1><p>This is a full-featured notes application with folders, tags, and rich text editing.</p><p>You can:</p><ul><li>Create and organize notes in folders</li><li>Tag notes for easy filtering</li><li>Format text with rich editing tools</li><li>Search across all your notes</li><li>Export notes in different formats</li></ul>',
                folder: 'notes',
                tags: ['important'],
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            },
            {
                id: generateId(),
                title: 'Meeting Notes',
                content: '<h2>Project Kickoff Meeting</h2><p>Date: ' + new Date().toLocaleDateString() + '</p><p>Attendees:</p><ul><li>John Smith</li><li>Jane Doe</li><li>Bob Johnson</li></ul><p>Action Items:</p><ol><li>Create project timeline</li><li>Assign tasks to team members</li><li>Schedule follow-up meeting</li></ol>',
                folder: 'work',
                tags: ['work'],
                created: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                updated: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: generateId(),
                title: 'Shopping List',
                content: '<h3>Grocery Shopping</h3><ul><li>Milk</li><li>Eggs</li><li>Bread</li><li>Fruits<ul><li>Apples</li><li>Bananas</li></ul></li><li>Vegetables</li></ul>',
                folder: 'personal',
                tags: ['personal'],
                created: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                updated: new Date(Date.now() - 172800000).toISOString()
            }
        ];

        saveToLocalStorage();
    }

    /**
     * Apply settings to the UI
     */
    function applySettings() {
        // Apply view mode
        if (settings.viewMode === 'list') {
            notesList.classList.remove('grid-view');
            notesList.classList.add('list-view');
            gridViewBtn.classList.remove('active');
            listViewBtn.classList.add('active');
        } else {
            notesList.classList.add('grid-view');
            notesList.classList.remove('list-view');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        }

        // Apply sidebar collapsed state
        if (settings.sidebarCollapsed) {
            notesSidebar.classList.add('collapsed');
            toggleSidebarBtn.innerHTML = '<i class="fas fa-bars"></i>';
            toggleSidebarBtn.title = 'Show Sidebar';
        } else {
            notesSidebar.classList.remove('collapsed');
            toggleSidebarBtn.innerHTML = '<i class="fas fa-times"></i>';
            toggleSidebarBtn.title = 'Hide Sidebar';
        }
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // UI Interaction Listeners
        setupUIListeners();

        // Note Management Listeners
        setupNoteListeners();

        // Folder and Tag Listeners
        setupFolderAndTagListeners();

        // Text Formatting Listeners
        setupFormattingListeners();

        // Modal Listeners
        setupModalListeners();
    }

    /**
     * Set up UI interaction listeners
     */
    function setupUIListeners() {
        // Toggle sidebar
        toggleSidebarBtn.addEventListener('click', toggleSidebar);

        // View mode switching
        gridViewBtn.addEventListener('click', () => setViewMode('grid'));
        listViewBtn.addEventListener('click', () => setViewMode('list'));

        // Sort notes button
        sortNotesBtn.addEventListener('click', () => showModal(sortModal));

        // Section headers collapse/expand
        document.querySelectorAll('.section-header.collapsible').forEach(header => {
            header.addEventListener('click', (e) => {
                // Don't toggle if clicking on a button inside the header
                if (e.target.closest('button')) return;

                header.classList.toggle('collapsed');
                const section = header.closest('.sidebar-section');
                const list = section.querySelector('.section-list');

                if (header.classList.contains('collapsed')) {
                    list.style.display = 'none';
                } else {
                    list.style.display = 'block';
                }
            });
        });

        // Search functionality
        sidebarSearch.addEventListener('input', debounce(() => {
            const searchTerm = sidebarSearch.value.toLowerCase().trim();
            filterNotes(searchTerm);
        }, 300));
    }

    /**
     * Set up note management listeners
     */
    function setupNoteListeners() {
        // New note button
        newNoteBtn.addEventListener('click', () => createNote());

        // Empty state new note button
        emptyNewNoteBtn.addEventListener('click', () => createNote());

        // Note title input
        noteTitle.addEventListener('input', debounce(() => {
            if (!currentNote) return;

            // Update the note title
            const note = notes.find(n => n.id === currentNote);
            if (note) {
                note.title = noteTitle.value;
                note.updated = new Date().toISOString();
                updateLastEdited(note.updated);
                saveToLocalStorage();
                renderNotesList();
            }
        }, 500));

        // Note content input
        noteContent.addEventListener('input', debounce(() => {
            if (!currentNote) return;

            // Update the note content
            const note = notes.find(n => n.id === currentNote);
            if (note) {
                note.content = noteContent.innerHTML;
                note.updated = new Date().toISOString();
                updateLastEdited(note.updated);
                updateCounters();
                saveToLocalStorage();
            }
        }, 500));

        // Delete note button
        deleteNoteBtn.addEventListener('click', () => {
            if (!currentNote) return;

            showNotification('Are you sure you want to delete this note?', true, () => {
                deleteNote(currentNote);
            });
        });

        // Download button
        downloadBtn.addEventListener('click', () => {
            if (!currentNote) return;

            const note = notes.find(n => n.id === currentNote);
            if (note) {
                downloadNoteAsFile(note);
            }
        });

        // Share button
        shareBtn.addEventListener('click', () => {
            if (!currentNote) return;

            const note = notes.find(n => n.id === currentNote);
            if (note) {
                shareNote(note);
            }
        });
    }

    /**
     * Set up folder and tag listeners
     */
    function setupFolderAndTagListeners() {
        // Add folder button
        addFolderBtn.addEventListener('click', () => {
            // Reset the form for new folder
            document.getElementById('folder-modal-title').textContent = 'New Folder';
            document.getElementById('folder-save-text').textContent = 'Save Folder';
            document.getElementById('folder-name').value = '';
            document.getElementById('folder-id').value = '';
            showModal(folderModal);
        });

        // Add tag button
        addTagBtn.addEventListener('click', () => {
            // Reset the form for new tag
            document.getElementById('tag-modal-title').textContent = 'New Tag';
            document.getElementById('tag-save-text').textContent = 'Save Tag';
            document.getElementById('tag-name').value = '';
            document.getElementById('tag-id').value = '';
            document.getElementById('tag-color').value = '#4dabf7';
            showModal(tagModal);
        });

        // Folder selection
        foldersList.addEventListener('click', (e) => {
            // If clicking on edit or delete button, don't select the folder
            if (e.target.closest('.edit-folder-btn') || e.target.closest('.delete-folder-btn')) {
                return;
            }

            const item = e.target.closest('.section-item');
            if (!item) return;

            const folderId = item.dataset.folder;
            selectFolder(folderId);
        });

        // Edit folder button
        document.querySelectorAll('.edit-folder-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = e.target.closest('.section-item');
                const folderId = item.dataset.folder;
                const folder = folders.find(f => f.id === folderId);

                if (folder && !folder.system) {
                    document.getElementById('folder-modal-title').textContent = 'Edit Folder';
                    document.getElementById('folder-save-text').textContent = 'Update Folder';
                    document.getElementById('folder-name').value = folder.name;
                    document.getElementById('folder-id').value = folder.id;
                    showModal(folderModal);
                } else {
                    showNotification('System folders cannot be edited', true);
                }
            });
        });

        // Delete folder button
        document.querySelectorAll('.delete-folder-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = e.target.closest('.section-item');
                const folderId = item.dataset.folder;
                const folder = folders.find(f => f.id === folderId);

                if (folder && !folder.system) {
                    document.getElementById('delete-confirmation-message').textContent = `Are you sure you want to delete the folder "${folder.name}"?`;
                    document.getElementById('delete-item-id').value = folder.id;
                    document.getElementById('delete-item-type').value = 'folder';
                    showModal(document.getElementById('delete-confirmation-modal'));
                } else {
                    showNotification('System folders cannot be deleted', true);
                }
            });
        });

        // Tag selection
        tagsList.addEventListener('click', (e) => {
            // If clicking on edit or delete button, don't select the tag
            if (e.target.closest('.edit-tag-btn') || e.target.closest('.delete-tag-btn')) {
                return;
            }

            const item = e.target.closest('.section-item');
            if (!item) return;

            const tagId = item.dataset.tag;
            selectTag(tagId);
        });

        // Edit tag button
        document.querySelectorAll('.edit-tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = e.target.closest('.section-item');
                const tagId = item.dataset.tag;
                const tag = tags.find(t => t.id === tagId);

                if (tag) {
                    document.getElementById('tag-modal-title').textContent = 'Edit Tag';
                    document.getElementById('tag-save-text').textContent = 'Update Tag';
                    document.getElementById('tag-name').value = tag.name;
                    document.getElementById('tag-id').value = tag.id;
                    document.getElementById('tag-color').value = tag.color;
                    showModal(tagModal);
                }
            });
        });

        // Delete tag button
        document.querySelectorAll('.delete-tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = e.target.closest('.section-item');
                const tagId = item.dataset.tag;
                const tag = tags.find(t => t.id === tagId);

                if (tag) {
                    document.getElementById('delete-confirmation-message').textContent = `Are you sure you want to delete the tag "${tag.name}"?`;
                    document.getElementById('delete-item-id').value = tag.id;
                    document.getElementById('delete-item-type').value = 'tag';
                    showModal(document.getElementById('delete-confirmation-modal'));
                }
            });
        });

        // Library section items
        document.querySelectorAll('.section-item[data-folder="all"], .section-item[data-folder="recently-deleted"]').forEach(item => {
            item.addEventListener('click', () => {
                const folderId = item.dataset.folder;
                if (folderId === 'all') {
                    selectFolder('all');
                } else if (folderId === 'recently-deleted') {
                    // Handle recently deleted
                    showNotification('Recently deleted notes feature coming soon');
                }
            });
        });

        // Save folder button
        document.getElementById('save-folder-btn').addEventListener('click', () => {
            const folderName = document.getElementById('folder-name').value.trim();
            const folderId = document.getElementById('folder-id').value;

            if (folderName) {
                if (folderId) {
                    // Update existing folder
                    updateFolder(folderId, folderName);
                } else {
                    // Create new folder
                    createFolder(folderName);
                }
                hideModal(folderModal);
                document.getElementById('folder-name').value = '';
                document.getElementById('folder-id').value = '';
            }
        });

        // Save tag button
        document.getElementById('save-tag-btn').addEventListener('click', () => {
            const tagName = document.getElementById('tag-name').value.trim();
            const tagColor = document.getElementById('tag-color').value;
            const tagId = document.getElementById('tag-id').value;

            if (tagName) {
                if (tagId) {
                    // Update existing tag
                    updateTag(tagId, tagName, tagColor);
                } else {
                    // Create new tag
                    createTag(tagName, tagColor);
                }
                hideModal(tagModal);
                document.getElementById('tag-name').value = '';
                document.getElementById('tag-id').value = '';
            }
        });

        // Confirm delete button
        document.getElementById('confirm-delete-btn').addEventListener('click', () => {
            const itemId = document.getElementById('delete-item-id').value;
            const itemType = document.getElementById('delete-item-type').value;

            if (itemType === 'folder') {
                deleteFolder(itemId);
            } else if (itemType === 'tag') {
                deleteTag(itemId);
            }

            hideModal(document.getElementById('delete-confirmation-modal'));
        });

        // Cancel delete button
        document.getElementById('cancel-delete-btn').addEventListener('click', () => {
            hideModal(document.getElementById('delete-confirmation-modal'));
        });
    }

    /**
     * Set up text formatting listeners
     */
    function setupFormattingListeners() {
        // Format buttons
        formatButtons.forEach(button => {
            button.addEventListener('click', () => {
                const command = button.dataset.command;
                const value = button.dataset.value || null;

                if (command === 'createLink') {
                    showModal(linkModal);
                } else if (command === 'insertImage') {
                    showModal(imageModal);
                } else if (command === 'insertTable') {
                    showModal(tableModal);
                } else if (command === 'insertCheckbox') {
                    insertCheckbox();
                } else {
                    document.execCommand(command, false, value);
                    updateNoteContent();
                }
            });
        });

        // Insert link button
        document.getElementById('insert-link-btn').addEventListener('click', () => {
            const linkText = document.getElementById('link-text').value.trim();
            const linkUrl = document.getElementById('link-url').value.trim();

            if (linkUrl) {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);

                if (linkText) {
                    range.deleteContents();
                    const linkNode = document.createElement('a');
                    linkNode.href = linkUrl;
                    linkNode.textContent = linkText;
                    linkNode.target = '_blank';
                    range.insertNode(linkNode);
                } else {
                    document.execCommand('createLink', false, linkUrl);
                    const links = noteContent.querySelectorAll('a');
                    links.forEach(link => {
                        link.target = '_blank';
                    });
                }

                updateNoteContent();
                hideModal(linkModal);
                document.getElementById('link-text').value = '';
                document.getElementById('link-url').value = '';
            }
        });

        // Insert image button
        document.getElementById('insert-image-btn').addEventListener('click', () => {
            const imageUrl = document.getElementById('image-url').value.trim();
            const imageAlt = document.getElementById('image-alt').value.trim();
            const imageFile = document.getElementById('image-file').files[0];

            if (imageUrl) {
                insertImage(imageUrl, imageAlt);
                hideModal(imageModal);
                document.getElementById('image-url').value = '';
                document.getElementById('image-alt').value = '';
            } else if (imageFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    insertImage(e.target.result, imageAlt);
                    hideModal(imageModal);
                    document.getElementById('image-file').value = '';
                    document.getElementById('image-alt').value = '';
                };
                reader.readAsDataURL(imageFile);
            }
        });

        // Insert table button
        document.getElementById('insert-table-btn').addEventListener('click', () => {
            const rows = parseInt(document.getElementById('table-rows').value);
            const cols = parseInt(document.getElementById('table-cols').value);
            const includeHeader = document.getElementById('table-header').checked;

            insertTable(rows, cols, includeHeader);
            hideModal(tableModal);
        });
    }

    /**
     * Set up modal listeners
     */
    function setupModalListeners() {
        // Close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                hideModal(modal);
            });
        });

        // Cancel buttons
        document.querySelectorAll('[id$="-cancel-btn"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                hideModal(modal);
            });
        });

        // Apply sort button
        document.getElementById('apply-sort-btn').addEventListener('click', () => {
            const sortBy = document.getElementById('sort-by').value;
            const sortOrder = document.getElementById('sort-order').value;

            settings.sortBy = sortBy;
            settings.sortOrder = sortOrder;
            saveToLocalStorage();
            renderNotesList();
            hideModal(sortModal);
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    hideModal(modal);
                }
            });
        });
    }

    /**
     * Update character and word counters
     */
    function updateCounters() {
        if (!currentNote) return;

        const content = noteContent.textContent || '';

        // Update character count
        const charCount = content.length;
        charCount.textContent = `${charCount} character${charCount !== 1 ? 's' : ''}`;

        // Update word count
        const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
        wordCount.textContent = `${wordCount} word${wordCount !== 1 ? 's' : ''}`;
    }

    /**
     * Note Management Functions
     */

    /**
     * Create a new note
     */
    function createNote() {
        const newNote = {
            id: generateId(),
            title: 'Untitled Note',
            content: '',
            folder: currentFolder === 'all' ? 'notes' : currentFolder,
            tags: [],
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };

        notes.unshift(newNote);
        saveToLocalStorage();
        renderNotesList();
        selectNote(newNote.id);
        showNotification('New note created');
    }

    /**
     * Select a note to display
     * @param {string} noteId - The ID of the note to select
     */
    function selectNote(noteId) {
        currentNote = noteId;

        // Update UI
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('active');
        });

        const noteItem = document.querySelector(`.note-item[data-id="${noteId}"]`);
        if (noteItem) {
            noteItem.classList.add('active');
        }

        // Display note content
        const note = notes.find(n => n.id === noteId);
        if (note) {
            hideEmptyState();
            showNoteEditor();

            noteTitle.value = note.title;
            noteContent.innerHTML = note.content;
            updateLastEdited(note.updated);
            updateCounters();
        }
    }

    /**
     * Delete a note
     * @param {string} noteId - The ID of the note to delete
     */
    function deleteNote(noteId) {
        const noteIndex = notes.findIndex(n => n.id === noteId);
        if (noteIndex !== -1) {
            notes.splice(noteIndex, 1);
            saveToLocalStorage();
            renderNotesList();

            if (notes.length > 0) {
                selectNote(notes[0].id);
            } else {
                showEmptyState();
            }

            showNotification('Note deleted');
        }
    }

    /**
     * Select a folder to filter notes
     * @param {string} folderId - The ID of the folder to select
     */
    function selectFolder(folderId) {
        currentFolder = folderId;
        currentTag = null;

        // Update UI
        document.querySelectorAll('.section-item').forEach(item => {
            item.classList.remove('active');
        });

        const folderItem = document.querySelector(`.section-item[data-folder="${folderId}"]`);
        if (folderItem) {
            folderItem.classList.add('active');
        }

        // Update notes list title
        if (folderId === 'all') {
            notesListTitle.textContent = 'All Notes';
        } else {
            const folder = folders.find(f => f.id === folderId);
            if (folder) {
                notesListTitle.textContent = folder.name;
            }
        }

        renderNotesList();

        // Select first note or show empty state
        const filteredNotes = getFilteredNotes();
        if (filteredNotes.length > 0) {
            selectNote(filteredNotes[0].id);
        } else {
            showEmptyState();
        }
    }

    /**
     * Select a tag to filter notes
     * @param {string} tagId - The ID of the tag to select
     */
    function selectTag(tagId) {
        currentTag = tagId;
        currentFolder = 'all';

        // Update UI
        document.querySelectorAll('.section-item').forEach(item => {
            item.classList.remove('active');
        });

        const tagItem = document.querySelector(`.section-item[data-tag="${tagId}"]`);
        if (tagItem) {
            tagItem.classList.add('active');
        }

        // Update notes list title
        const tag = tags.find(t => t.id === tagId);
        if (tag) {
            notesListTitle.textContent = `Tag: ${tag.name}`;
        }

        renderNotesList();

        // Select first note or show empty state
        const filteredNotes = getFilteredNotes();
        if (filteredNotes.length > 0) {
            selectNote(filteredNotes[0].id);
        } else {
            showEmptyState();
        }
    }

    /**
     * Create a new folder
     * @param {string} name - The name of the folder
     */
    function createFolder(name) {
        const newFolder = {
            id: generateId(),
            name: name,
            system: false
        };

        folders.push(newFolder);
        saveToLocalStorage();
        renderFolders();
        showNotification(`Folder "${name}" created`);
    }

    /**
     * Update an existing folder
     * @param {string} id - The ID of the folder to update
     * @param {string} name - The new name for the folder
     */
    function updateFolder(id, name) {
        const folder = folders.find(f => f.id === id);
        if (folder && !folder.system) {
            folder.name = name;
            saveToLocalStorage();
            renderFolders();
            showNotification(`Folder updated to "${name}"`);
        }
    }

    /**
     * Delete a folder
     * @param {string} id - The ID of the folder to delete
     */
    function deleteFolder(id) {
        const folderIndex = folders.findIndex(f => f.id === id);
        if (folderIndex !== -1 && !folders[folderIndex].system) {
            // Move notes in this folder to the default folder
            notes.forEach(note => {
                if (note.folder === id) {
                    note.folder = 'notes';
                }
            });

            // Remove the folder
            folders.splice(folderIndex, 1);

            // Update current folder if it was the deleted one
            if (currentFolder === id) {
                currentFolder = 'all';
            }

            saveToLocalStorage();
            renderFolders();
            renderNotesList();
            showNotification('Folder deleted');
        }
    }

    /**
     * Create a new tag
     * @param {string} name - The name of the tag
     * @param {string} color - The color of the tag
     */
    function createTag(name, color) {
        const newTag = {
            id: generateId(),
            name: name,
            color: color
        };

        tags.push(newTag);
        saveToLocalStorage();
        renderTags();
        showNotification(`Tag "${name}" created`);
    }

    /**
     * Update an existing tag
     * @param {string} id - The ID of the tag to update
     * @param {string} name - The new name for the tag
     * @param {string} color - The new color for the tag
     */
    function updateTag(id, name, color) {
        const tag = tags.find(t => t.id === id);
        if (tag) {
            tag.name = name;
            tag.color = color;
            saveToLocalStorage();
            renderTags();
            showNotification(`Tag updated to "${name}"`);
        }
    }

    /**
     * Delete a tag
     * @param {string} id - The ID of the tag to delete
     */
    function deleteTag(id) {
        const tagIndex = tags.findIndex(t => t.id === id);
        if (tagIndex !== -1) {
            // Remove tag from all notes
            notes.forEach(note => {
                const tagIdx = note.tags.indexOf(id);
                if (tagIdx !== -1) {
                    note.tags.splice(tagIdx, 1);
                }
            });

            // Remove the tag
            tags.splice(tagIndex, 1);

            // Update current tag if it was the deleted one
            if (currentTag === id) {
                currentTag = null;
                currentFolder = 'all';
            }

            saveToLocalStorage();
            renderTags();
            renderNotesList();
            showNotification('Tag deleted');
        }
    }

    /**
     * Download a note as a file
     * @param {Object} note - The note to download
     */
    function downloadNoteAsFile(note) {
        // Create a blob with the content
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${note.title}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; }
        p { margin-bottom: 1em; }
        ul, ol { margin-bottom: 1em; padding-left: 2em; }
    </style>
</head>
<body>
    <h1>${note.title}</h1>
    ${note.content}
    <p><small>Created: ${new Date(note.created).toLocaleString()}<br>
    Last updated: ${new Date(note.updated).toLocaleString()}</small></p>
</body>
</html>`;

        const textContent = `${note.title}\n\n${noteContent.textContent}\n\nCreated: ${new Date(note.created).toLocaleString()}\nLast updated: ${new Date(note.updated).toLocaleString()}`;

        // Create a blob with the content
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const textBlob = new Blob([textContent], { type: 'text/plain' });

        // Create a temporary link element for HTML
        const htmlLink = document.createElement('a');
        htmlLink.href = URL.createObjectURL(htmlBlob);
        htmlLink.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;

        // Create a temporary link element for text
        const textLink = document.createElement('a');
        textLink.href = URL.createObjectURL(textBlob);
        textLink.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;

        // Ask user which format they want
        showNotification('Download as:', false, null, [
            {
                text: 'HTML',
                action: () => {
                    document.body.appendChild(htmlLink);
                    htmlLink.click();
                    document.body.removeChild(htmlLink);
                    showNotification('Note downloaded as HTML');
                }
            },
            {
                text: 'Text',
                action: () => {
                    document.body.appendChild(textLink);
                    textLink.click();
                    document.body.removeChild(textLink);
                    showNotification('Note downloaded as Text');
                }
            },
            {
                text: 'PDF',
                action: () => {
                    generatePDF(note);
                }
            }
        ]);
    }

    /**
     * Generate a PDF from a note
     * @param {Object} note - The note to convert to PDF
     */
    function generatePDF(note) {
        // Create a hidden iframe to render the note content
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.top = '-9999px';
        document.body.appendChild(iframe);

        // Write the note content to the iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${note.title}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; }
        p { margin-bottom: 1em; }
        ul, ol { margin-bottom: 1em; padding-left: 2em; }
        @media print {
            body { max-width: 100%; }
        }
    </style>
</head>
<body>
    <h1>${note.title}</h1>
    ${note.content}
    <p><small>Created: ${new Date(note.created).toLocaleString()}<br>
    Last updated: ${new Date(note.updated).toLocaleString()}</small></p>
</body>
</html>`);
        iframeDoc.close();

        // Wait for the iframe to load
        setTimeout(() => {
            try {
                // Print the iframe content to PDF
                iframe.contentWindow.focus();
                iframe.contentWindow.print();

                // Remove the iframe after printing
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    showNotification('Note prepared for PDF download');
                }, 1000);
            } catch (err) {
                console.error('Error generating PDF:', err);
                document.body.removeChild(iframe);
                showNotification('Failed to generate PDF', true);
            }
        }, 500);
    }

    /**
     * Share a note
     * @param {Object} note - The note to share
     */
    function shareNote(note) {
        showNotification('Preparing to share...');

        if (navigator.share) {
            navigator.share({
                title: note.title,
                text: noteContent.textContent
            })
            .then(() => showNotification('Note shared successfully'))
            .catch(err => {
                console.error('Error sharing:', err);
                showNotification('Failed to share note', true);
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(`${note.title}\n\n${noteContent.textContent}`)
                .then(() => showNotification('Note copied to clipboard'))
                .catch(err => {
                    console.error('Failed to copy:', err);
                    showNotification('Failed to copy to clipboard', true);
                });
        }
    }

    /**
     * UI Helper Functions
     */

    /**
     * Toggle sidebar visibility
     */
    function toggleSidebar() {
        notesSidebar.classList.toggle('collapsed');
        settings.sidebarCollapsed = notesSidebar.classList.contains('collapsed');
        saveToLocalStorage();

        // Update the toggle button icon
        if (notesSidebar.classList.contains('collapsed')) {
            toggleSidebarBtn.innerHTML = '<i class="fas fa-bars"></i>';
            toggleSidebarBtn.title = 'Show Sidebar';
        } else {
            toggleSidebarBtn.innerHTML = '<i class="fas fa-times"></i>';
            toggleSidebarBtn.title = 'Hide Sidebar';
        }
    }

    /**
     * Set view mode (grid or list)
     * @param {string} mode - The view mode ('grid' or 'list')
     */
    function setViewMode(mode) {
        settings.viewMode = mode;

        if (mode === 'list') {
            notesList.classList.remove('grid-view');
            notesList.classList.add('list-view');
            gridViewBtn.classList.remove('active');
            listViewBtn.classList.add('active');
        } else {
            notesList.classList.add('grid-view');
            notesList.classList.remove('list-view');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        }

        saveToLocalStorage();
    }

    /**
     * Show a modal
     * @param {HTMLElement} modal - The modal to show
     */
    function showModal(modal) {
        modal.classList.add('show');
    }

    /**
     * Hide a modal
     * @param {HTMLElement} modal - The modal to hide
     */
    function hideModal(modal) {
        modal.classList.remove('show');
    }

    /**
     * Show the empty state
     */
    function showEmptyState() {
        noteEditorContainer.style.display = 'none';
        emptyState.style.display = 'flex';
    }

    /**
     * Hide the empty state
     */
    function hideEmptyState() {
        emptyState.style.display = 'none';
    }

    /**
     * Show the note editor
     */
    function showNoteEditor() {
        noteEditorContainer.style.display = 'flex';
    }

    /**
     * Update the last edited timestamp
     * @param {string} timestamp - ISO timestamp string
     */
    function updateLastEdited(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();

        // Format the date based on how recent it is
        let formattedDate;

        if (date.toDateString() === now.toDateString()) {
            // Today
            formattedDate = `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (date.getTime() > now.getTime() - 86400000) {
            // Yesterday
            formattedDate = `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            // Older
            formattedDate = date.toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        lastEdited.textContent = `Last edited: ${formattedDate}`;
    }

    /**
     * Update note content after editing
     */
    function updateNoteContent() {
        if (!currentNote) return;

        const note = notes.find(n => n.id === currentNote);
        if (note) {
            note.content = noteContent.innerHTML;
            note.updated = new Date().toISOString();
            updateLastEdited(note.updated);
            updateCounters();
            saveToLocalStorage();
        }
    }

    /**
     * Insert an image into the note
     * @param {string} url - The image URL
     * @param {string} alt - The alt text
     */
    function insertImage(url, alt) {
        const img = document.createElement('img');
        img.src = url;
        img.alt = alt || '';
        img.style.maxWidth = '100%';

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);

        updateNoteContent();
    }

    /**
     * Insert a table into the note
     * @param {number} rows - Number of rows
     * @param {number} cols - Number of columns
     * @param {boolean} includeHeader - Whether to include a header row
     */
    function insertTable(rows, cols, includeHeader) {
        let tableHTML = '<table style="width:100%; border-collapse:collapse; margin:1rem 0;">';

        if (includeHeader) {
            tableHTML += '<thead><tr>';
            for (let j = 0; j < cols; j++) {
                tableHTML += `<th style="border:1px solid #ccc; padding:8px; text-align:left;">Header ${j + 1}</th>`;
            }
            tableHTML += '</tr></thead>';
            rows--; // Reduce rows by 1 since we added a header
        }

        tableHTML += '<tbody>';
        for (let i = 0; i < rows; i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < cols; j++) {
                tableHTML += `<td style="border:1px solid #ccc; padding:8px;">Cell ${i + 1}-${j + 1}</td>`;
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</tbody></table>';

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        // Create a temporary div to hold the table
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tableHTML;
        const table = tempDiv.firstChild;

        range.deleteContents();
        range.insertNode(table);

        updateNoteContent();
    }

    /**
     * Insert a checkbox into the note
     */
    function insertCheckbox() {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '8px';

        const span = document.createElement('span');
        span.textContent = 'Checkbox item';
        span.contentEditable = true;

        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.style.margin = '0.5rem 0';
        div.appendChild(checkbox);
        div.appendChild(span);

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(div);

        // Add event listener to toggle the checkbox
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                span.style.textDecoration = 'line-through';
                span.style.color = '#888';
            } else {
                span.style.textDecoration = 'none';
                span.style.color = '';
            }
            updateNoteContent();
        });

        updateNoteContent();
    }

    /**
     * Filter notes based on search term
     * @param {string} searchTerm - The search term
     */
    function filterNotes(searchTerm) {
        if (!searchTerm) {
            renderNotesList();
            return;
        }

        const filteredNotes = notes.filter(note => {
            return (
                note.title.toLowerCase().includes(searchTerm) ||
                (noteContent.textContent || '').toLowerCase().includes(searchTerm)
            );
        });

        renderNotesListWithNotes(filteredNotes);

        if (filteredNotes.length > 0) {
            selectNote(filteredNotes[0].id);
        } else {
            showEmptyState();
        }
    }

    /**
     * Get filtered notes based on current folder and tag
     * @returns {Array} Filtered notes
     */
    function getFilteredNotes() {
        let filteredNotes = [...notes];

        // Filter by folder
        if (currentFolder !== 'all') {
            filteredNotes = filteredNotes.filter(note => note.folder === currentFolder);
        }

        // Filter by tag
        if (currentTag) {
            filteredNotes = filteredNotes.filter(note => note.tags.includes(currentTag));
        }

        // Sort notes
        filteredNotes.sort((a, b) => {
            if (settings.sortBy === 'title') {
                return settings.sortOrder === 'asc'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            } else if (settings.sortBy === 'created') {
                return settings.sortOrder === 'asc'
                    ? new Date(a.created) - new Date(b.created)
                    : new Date(b.created) - new Date(a.created);
            } else {
                // Default: sort by date updated
                return settings.sortOrder === 'asc'
                    ? new Date(a.updated) - new Date(b.updated)
                    : new Date(b.updated) - new Date(a.updated);
            }
        });

        return filteredNotes;
    }

    /**
     * Render the notes list
     */
    function renderNotesList() {
        const filteredNotes = getFilteredNotes();
        renderNotesListWithNotes(filteredNotes);
    }

    /**
     * Render the notes list with specific notes
     * @param {Array} notesToRender - The notes to render
     */
    function renderNotesListWithNotes(notesToRender) {
        // Update notes count
        notesCount.textContent = `${notesToRender.length} note${notesToRender.length !== 1 ? 's' : ''}`;

        // Clear the list
        notesList.innerHTML = '';

        // Add notes to the list
        notesToRender.forEach(note => {
            const noteItem = document.createElement('li');
            noteItem.className = 'note-item';
            noteItem.dataset.id = note.id;

            if (note.id === currentNote) {
                noteItem.classList.add('active');
            }

            // Format the date
            const date = new Date(note.updated);
            const now = new Date();
            let formattedDate;

            if (date.toDateString() === now.toDateString()) {
                // Today
                formattedDate = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (date.getTime() > now.getTime() - 604800000) {
                // Within the last week
                const options = { weekday: 'short' };
                formattedDate = date.toLocaleDateString([], options);
            } else {
                // Older
                const options = { month: 'short', day: 'numeric' };
                formattedDate = date.toLocaleDateString([], options);
            }

            // Create note preview (strip HTML tags)
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = note.content;
            const textContent = tempDiv.textContent || '';
            const preview = textContent.substring(0, 100) + (textContent.length > 100 ? '...' : '');

            noteItem.innerHTML = `
                <div class="note-title">${note.title}</div>
                <div class="note-preview">${preview}</div>
                <div class="note-meta">${formattedDate}</div>
            `;

            noteItem.addEventListener('click', () => {
                selectNote(note.id);
            });

            notesList.appendChild(noteItem);
        });
    }

    /**
     * Render the folders list
     */
    function renderFolders() {
        // Clear the list
        foldersList.innerHTML = '';

        // Add folders to the list
        folders.forEach(folder => {
            const folderItem = document.createElement('li');
            folderItem.className = 'section-item';
            folderItem.dataset.folder = folder.id;

            if (folder.id === currentFolder) {
                folderItem.classList.add('active');
            }

            // Count notes in this folder
            const count = notes.filter(note => note.folder === folder.id).length;

            // Create folder item content
            const folderIcon = document.createElement('i');
            folderIcon.className = 'fas fa-folder';

            const folderName = document.createElement('span');
            folderName.textContent = folder.name;

            const noteCount = document.createElement('span');
            noteCount.className = 'note-count';
            noteCount.textContent = count;

            // Add edit/delete buttons if not a system folder
            const itemActions = document.createElement('div');
            itemActions.className = 'item-actions';

            if (!folder.system) {
                const editBtn = document.createElement('button');
                editBtn.type = 'button';
                editBtn.className = 'edit-folder-btn icon-btn-small';
                editBtn.title = 'Edit Folder';
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.getElementById('folder-modal-title').textContent = 'Edit Folder';
                    document.getElementById('folder-save-text').textContent = 'Update Folder';
                    document.getElementById('folder-name').value = folder.name;
                    document.getElementById('folder-id').value = folder.id;
                    showModal(folderModal);
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.className = 'delete-folder-btn icon-btn-small';
                deleteBtn.title = 'Delete Folder';
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.getElementById('delete-confirmation-message').textContent = `Are you sure you want to delete the folder "${folder.name}"?`;
                    document.getElementById('delete-item-id').value = folder.id;
                    document.getElementById('delete-item-type').value = 'folder';
                    showModal(document.getElementById('delete-confirmation-modal'));
                });

                itemActions.appendChild(editBtn);
                itemActions.appendChild(deleteBtn);
            }

            // Append all elements to the folder item
            folderItem.appendChild(folderIcon);
            folderItem.appendChild(folderName);
            folderItem.appendChild(noteCount);
            folderItem.appendChild(itemActions);

            // Add click event to select the folder
            folderItem.addEventListener('click', () => {
                selectFolder(folder.id);
            });

            foldersList.appendChild(folderItem);
        });
    }

    /**
     * Render the tags list
     */
    function renderTags() {
        // Clear the list
        tagsList.innerHTML = '';

        // Add tags to the list
        tags.forEach(tag => {
            const tagItem = document.createElement('li');
            tagItem.className = 'section-item';
            tagItem.dataset.tag = tag.id;

            if (tag.id === currentTag) {
                tagItem.classList.add('active');
            }

            // Count notes with this tag
            const count = notes.filter(note => note.tags.includes(tag.id)).length;

            // Create tag item content
            const tagIcon = document.createElement('i');
            tagIcon.className = 'fas fa-tag';
            tagIcon.style.color = tag.color;

            const tagName = document.createElement('span');
            tagName.textContent = tag.name;

            const noteCount = document.createElement('span');
            noteCount.className = 'note-count';
            noteCount.textContent = count;

            // Add edit/delete buttons
            const itemActions = document.createElement('div');
            itemActions.className = 'item-actions';

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'edit-tag-btn icon-btn-small';
            editBtn.title = 'Edit Tag';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('tag-modal-title').textContent = 'Edit Tag';
                document.getElementById('tag-save-text').textContent = 'Update Tag';
                document.getElementById('tag-name').value = tag.name;
                document.getElementById('tag-id').value = tag.id;
                document.getElementById('tag-color').value = tag.color;
                showModal(tagModal);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'delete-tag-btn icon-btn-small';
            deleteBtn.title = 'Delete Tag';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('delete-confirmation-message').textContent = `Are you sure you want to delete the tag "${tag.name}"?`;
                document.getElementById('delete-item-id').value = tag.id;
                document.getElementById('delete-item-type').value = 'tag';
                showModal(document.getElementById('delete-confirmation-modal'));
            });

            itemActions.appendChild(editBtn);
            itemActions.appendChild(deleteBtn);

            // Append all elements to the tag item
            tagItem.appendChild(tagIcon);
            tagItem.appendChild(tagName);
            tagItem.appendChild(noteCount);
            tagItem.appendChild(itemActions);

            // Add click event to select the tag
            tagItem.addEventListener('click', () => {
                selectTag(tag.id);
            });

            tagsList.appendChild(tagItem);
        });
    }

    /**
     * Utility Functions
     */

    /**
     * Generate a unique ID
     * @returns {string} A unique ID
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    /**
     * Debounce function to limit how often a function is called
     * @param {Function} func - The function to debounce
     * @param {number} wait - The debounce wait time in milliseconds
     * @returns {Function} The debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    /**
     * Show a notification
     * @param {string} message - The message to display
     * @param {boolean} isError - Whether this is an error notification
     * @param {Function} [callback] - Optional callback for confirmation
     * @param {Array} [actions] - Optional array of action buttons
     */
    function showNotification(message, isError = false, callback = null, actions = null) {
        // Set the message
        notificationMessage.textContent = message;

        // Set the notification type
        notification.className = 'notification';
        if (isError) {
            notification.classList.add('error');
        }

        // Remove any existing buttons
        while (notification.querySelector('.notification-btn')) {
            notification.querySelector('.notification-btn').remove();
        }

        // Add confirmation buttons if callback is provided
        if (callback) {
            // Create confirm button
            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'notification-btn confirm-btn';
            confirmBtn.textContent = 'Yes';
            confirmBtn.addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => {
                    // Remove buttons
                    while (notification.querySelector('.notification-btn')) {
                        notification.querySelector('.notification-btn').remove();
                    }
                    callback();
                }, 300);
            });

            // Create cancel button
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'notification-btn cancel-btn';
            cancelBtn.textContent = 'No';
            cancelBtn.addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => {
                    // Remove buttons
                    while (notification.querySelector('.notification-btn')) {
                        notification.querySelector('.notification-btn').remove();
                    }
                }, 300);
            });

            // Add buttons to notification
            notification.appendChild(confirmBtn);
            notification.appendChild(cancelBtn);
        }

        // Add action buttons if provided
        if (actions && Array.isArray(actions)) {
            actions.forEach(action => {
                const actionBtn = document.createElement('button');
                actionBtn.className = 'notification-btn confirm-btn';
                actionBtn.textContent = action.text;
                actionBtn.addEventListener('click', () => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        // Remove buttons
                        while (notification.querySelector('.notification-btn')) {
                            notification.querySelector('.notification-btn').remove();
                        }
                        if (typeof action.action === 'function') {
                            action.action();
                        }
                    }, 300);
                });

                notification.appendChild(actionBtn);
            });
        }

        // Show the notification
        notification.classList.add('show');

        // Hide the notification after 3 seconds if no callback or actions (not a confirmation)
        if (!callback && (!actions || actions.length === 0)) {
            setTimeout(() => {
                notification.classList.remove('show');

                // Remove any buttons after animation completes
                setTimeout(() => {
                    while (notification.querySelector('.notification-btn')) {
                        notification.querySelector('.notification-btn').remove();
                    }
                }, 300);
            }, 3000);
        }
    }

    // Initialize the notepad
    initNotepad();
});
