/**
 * ScribbleSpaceY - Editor Module
 * Handles the text editor functionality
 * Developed by Keshav Poudel
 */

const Editor = (function() {
    // DOM elements
    let editorElement;
    let titleElement;
    let wordCountElement;
    let charCountElement;
    let readingTimeElement;
    let saveStatusElement;

    // Editor state
    let isEditing = false;
    let lastSavedContent = '';
    let lastSavedTitle = '';
    let autoSaveTimer = null;
    let autoSaveInterval = 2000; // 2 seconds

    // Settings
    let settings = {};

    /**
     * Initialize the editor
     */
    function init() {
        // Get DOM elements
        editorElement = document.getElementById('editor');
        titleElement = document.getElementById('note-title');
        wordCountElement = document.getElementById('word-count');
        charCountElement = document.getElementById('char-count');
        readingTimeElement = document.getElementById('reading-time');
        saveStatusElement = document.getElementById('save-status');

        // Load settings
        settings = StorageManager.getSettings();

        // Apply editor settings
        applyEditorSettings();

        // Set up event listeners
        setupEventListeners();

        // Listen for note changes
        NoteManager.addEventListener('noteChanged', handleNoteChanged);

        // Initialize toolbar
        initToolbar();
    }

    /**
     * Apply editor settings
     */
    function applyEditorSettings() {
        if (!editorElement) return;

        // Apply font family
        editorElement.style.fontFamily = settings.fontFamily;

        // Apply font size
        editorElement.style.fontSize = `${settings.fontSize}px`;

        // Apply line height
        editorElement.style.lineHeight = settings.lineHeight;

        // Apply spell check
        editorElement.spellcheck = settings.spellCheck;

        // Apply line numbers if enabled
        if (settings.showLineNumbers) {
            editorElement.classList.add('show-line-numbers');
        } else {
            editorElement.classList.remove('show-line-numbers');
        }
    }

    /**
     * Set up event listeners for the editor
     */
    function setupEventListeners() {
        if (!editorElement || !titleElement) return;

        // Ensure editor is editable
        editorElement.setAttribute('contenteditable', 'true');

        // Editor content change
        editorElement.addEventListener('input', handleEditorInput);

        // Title change
        titleElement.addEventListener('input', handleTitleInput);

        // Title focus event - clear the title if it's "Untitled Note"
        titleElement.addEventListener('focus', () => {
            if (titleElement.value === 'Untitled Note') {
                titleElement.value = '';
            }
        });

        // Focus and blur events
        editorElement.addEventListener('focus', () => {
            isEditing = true;
        });

        editorElement.addEventListener('blur', () => {
            isEditing = false;
            saveCurrentNote();
        });

        titleElement.addEventListener('blur', () => {
            // If title is empty after blur, set it back to "Untitled Note"
            if (titleElement.value.trim() === '') {
                titleElement.value = 'Untitled Note';
            }
            saveCurrentNote();
        });

        // Add a mutation observer to ensure the editor remains editable
        // This helps in fullscreen mode where the attribute might be lost
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'contenteditable') {
                    const editable = editorElement.getAttribute('contenteditable');
                    if (editable !== 'true') {
                        editorElement.setAttribute('contenteditable', 'true');
                    }
                }
            });
        });

        observer.observe(editorElement, { attributes: true });

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);

        // Paste event to handle formatted text
        editorElement.addEventListener('paste', handlePaste);
    }

    /**
     * Initialize the editor toolbar
     */
    function initToolbar() {
        const toolbarButtons = document.querySelectorAll('.editor-toolbar button');

        toolbarButtons.forEach(button => {
            button.addEventListener('click', () => {
                const command = button.getAttribute('data-command');

                if (!command) return;

                executeCommand(command);

                // Focus back on editor
                editorElement.focus();
            });
        });
    }

    /**
     * Execute a document command
     * @param {string} command - Command to execute
     * @param {string} [value] - Value for the command
     */
    function executeCommand(command, value = null) {
        // Save selection
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        // Handle special commands
        switch (command) {
            case 'h1':
            case 'h2':
            case 'h3':
                document.execCommand('formatBlock', false, `<${command}>`);
                break;

            case 'p':
                document.execCommand('formatBlock', false, '<p>');
                break;

            case 'createLink':
                const url = prompt('Enter the URL:', 'https://');
                if (url) {
                    document.execCommand(command, false, url);
                }
                break;

            // Image insertion removed as requested
            case 'insertImage':
                // Functionality removed
                break;

            case 'code':
                // Check if selection is inside a code block already
                const parentPre = getParentWithTag(selection.anchorNode, 'PRE');

                if (parentPre) {
                    // Remove code block
                    const textContent = parentPre.textContent;
                    const textNode = document.createTextNode(textContent);
                    parentPre.parentNode.replaceChild(textNode, parentPre);
                } else {
                    // Create code block
                    const selectedText = range.toString();

                    if (selectedText) {
                        // Wrap selected text in code block
                        const pre = document.createElement('pre');
                        const code = document.createElement('code');
                        code.textContent = selectedText;
                        pre.appendChild(code);

                        range.deleteContents();
                        range.insertNode(pre);
                    } else {
                        // Insert empty code block
                        const pre = document.createElement('pre');
                        const code = document.createElement('code');
                        code.textContent = '';
                        pre.appendChild(code);

                        range.insertNode(pre);

                        // Place cursor inside code block
                        range.selectNodeContents(code);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
                break;

            default:
                // Execute standard command
                document.execCommand(command, false, value);
        }

        // Update word count and save status
        updateWordCount();
        updateSaveStatus('Editing...');
    }

    /**
     * Get parent element with specific tag
     * @param {Node} node - Starting node
     * @param {string} tagName - Tag name to find
     * @returns {Element|null} Parent element or null
     */
    function getParentWithTag(node, tagName) {
        while (node && node !== document) {
            if (node.nodeType === Node.ELEMENT_NODE &&
                node.tagName === tagName) {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    }

    /**
     * Handle editor input event
     */
    function handleEditorInput() {
        updateWordCount();
        updateSaveStatus('Editing...');

        // Auto save
        if (settings.autoSave) {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                saveCurrentNote();
            }, autoSaveInterval);
        }
    }

    /**
     * Handle title input event
     */
    function handleTitleInput() {
        updateSaveStatus('Editing...');

        // Auto save
        if (settings.autoSave) {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                saveCurrentNote();
            }, autoSaveInterval);
        }
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} event - Keyboard event
     */
    function handleKeyboardShortcuts(event) {
        // Only handle shortcuts when editor is focused
        if (!isEditing && event.target !== titleElement) return;

        // Ctrl/Cmd + S: Save
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            saveCurrentNote();
        }

        // Ctrl/Cmd + B: Bold
        if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
            event.preventDefault();
            executeCommand('bold');
        }

        // Ctrl/Cmd + I: Italic
        if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
            event.preventDefault();
            executeCommand('italic');
        }

        // Ctrl/Cmd + K: Link
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            executeCommand('createLink');
        }

        // Ctrl/Cmd + H: Heading cycle
        if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
            event.preventDefault();

            const selection = window.getSelection();
            const parentH1 = getParentWithTag(selection.anchorNode, 'H1');
            const parentH2 = getParentWithTag(selection.anchorNode, 'H2');
            const parentH3 = getParentWithTag(selection.anchorNode, 'H3');

            if (parentH1) {
                executeCommand('h2');
            } else if (parentH2) {
                executeCommand('h3');
            } else if (parentH3) {
                executeCommand('p');
            } else {
                executeCommand('h1');
            }
        }
    }

    /**
     * Handle paste event to clean up formatted text
     * @param {ClipboardEvent} event - Paste event
     */
    function handlePaste(event) {
        // Get clipboard data
        const clipboardData = event.clipboardData || window.clipboardData;

        // Try to get plain text
        const plainText = clipboardData.getData('text/plain');
        const html = clipboardData.getData('text/html');

        // If we have HTML, use it with sanitization
        if (html) {
            event.preventDefault();

            // Create temporary element to sanitize HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Clean up the HTML
            sanitizeNode(tempDiv);

            // Insert the cleaned HTML
            document.execCommand('insertHTML', false, tempDiv.innerHTML);
        } else if (plainText) {
            // If we only have plain text, let the browser handle it
            // The browser will automatically escape HTML characters
        }

        // Update word count and save status
        updateWordCount();
        updateSaveStatus('Editing...');
    }

    /**
     * Sanitize a DOM node by removing unwanted elements and attributes
     * @param {Node} node - DOM node to sanitize
     */
    function sanitizeNode(node) {
        // List of allowed tags
        const allowedTags = [
            'P', 'DIV', 'SPAN', 'BR', 'A', 'UL', 'OL', 'LI',
            'STRONG', 'B', 'EM', 'I', 'U', 'S', 'CODE', 'PRE',
            'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE',
            'IMG', 'TABLE', 'TR', 'TD', 'TH', 'THEAD', 'TBODY'
        ];

        // List of allowed attributes
        const allowedAttrs = ['href', 'src', 'alt', 'title'];

        // Process child nodes
        const childNodes = Array.from(node.childNodes);

        for (const child of childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                // Check if tag is allowed
                if (!allowedTags.includes(child.tagName)) {
                    // Replace with its content
                    const fragment = document.createDocumentFragment();
                    while (child.firstChild) {
                        fragment.appendChild(child.firstChild);
                    }
                    child.parentNode.replaceChild(fragment, child);
                } else {
                    // Remove all attributes except allowed ones
                    const attrs = Array.from(child.attributes);
                    for (const attr of attrs) {
                        if (!allowedAttrs.includes(attr.name)) {
                            child.removeAttribute(attr.name);
                        }
                    }

                    // Recursively sanitize child nodes
                    sanitizeNode(child);
                }
            }
        }
    }

    /**
     * Update word count, character count, and reading time
     */
    function updateWordCount() {
        if (!editorElement || !wordCountElement || !charCountElement || !readingTimeElement) return;

        const content = editorElement.innerHTML;

        // Count words
        const wordCount = Utils.countWords(content);
        wordCountElement.textContent = `${wordCount} ${wordCount === 1 ? 'word' : 'words'}`;

        // Count characters
        const charCount = Utils.countCharacters(content);
        charCountElement.textContent = `${charCount} ${charCount === 1 ? 'character' : 'characters'}`;

        // Calculate reading time
        const readingTime = Utils.calculateReadingTime(content);
        readingTimeElement.textContent = `${readingTime} min read`;
    }

    /**
     * Update save status message
     * @param {string} message - Status message
     */
    function updateSaveStatus(message) {
        if (!saveStatusElement) return;

        saveStatusElement.textContent = message;

        if (message === 'All changes saved') {
            saveStatusElement.classList.remove('saving');
            saveStatusElement.classList.add('saved');
        } else {
            saveStatusElement.classList.add('saving');
            saveStatusElement.classList.remove('saved');
        }
    }

    /**
     * Handle note changed event
     * @param {Object} data - Event data with oldNote and newNote
     */
    function handleNoteChanged(data) {
        const { newNote } = data;

        if (!newNote) return;

        // Update editor content
        if (editorElement) {
            editorElement.innerHTML = newNote.content;
            lastSavedContent = newNote.content;
        }

        // Update title
        if (titleElement) {
            titleElement.value = newNote.title;
            lastSavedTitle = newNote.title;
        }

        // Update word count
        updateWordCount();

        // Update save status
        updateSaveStatus('All changes saved');
    }

    /**
     * Save the current note
     */
    function saveCurrentNote() {
        const currentNote = NoteManager.getCurrentNote();

        if (!currentNote || !editorElement || !titleElement) return;

        const content = editorElement.innerHTML;
        const title = titleElement.value.trim() || 'Untitled Note';

        // Only save if content or title has changed
        if (content !== lastSavedContent || title !== lastSavedTitle) {
            updateSaveStatus('Saving...');

            const success = NoteManager.saveCurrentNote({
                content,
                title
            });

            if (success) {
                lastSavedContent = content;
                lastSavedTitle = title;
                updateSaveStatus('All changes saved');
            } else {
                updateSaveStatus('Error saving');
            }
        }
    }

    /**
     * Get the current editor content
     * @returns {string} Editor content
     */
    function getContent() {
        return editorElement ? editorElement.innerHTML : '';
    }

    /**
     * Set the editor content
     * @param {string} content - Content to set
     */
    function setContent(content) {
        if (editorElement) {
            editorElement.innerHTML = content;
            updateWordCount();
        }
    }

    /**
     * Get the current title
     * @returns {string} Current title
     */
    function getTitle() {
        return titleElement ? titleElement.value : '';
    }

    /**
     * Set the title
     * @param {string} title - Title to set
     */
    function setTitle(title) {
        if (titleElement) {
            titleElement.value = title;
        }
    }

    /**
     * Update editor settings
     * @param {Object} newSettings - New settings
     */
    function updateSettings(newSettings) {
        settings = { ...settings, ...newSettings };
        applyEditorSettings();
    }

    /**
     * Image resize functionality removed as requested
     */
    function addImageResizeHandlers() {
        // Functionality removed
        return;
    }

    // Public API
    return {
        init,
        saveCurrentNote,
        getContent,
        setContent,
        getTitle,
        setTitle,
        updateSettings,
        executeCommand,
        addImageResizeHandlers
    };
})();
