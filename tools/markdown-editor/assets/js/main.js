// Markdown Editor

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const markdownInput = document.getElementById('markdown-input');
    const previewContent = document.getElementById('preview-content');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');
    const toolbarButtons = document.querySelectorAll('.toolbar-btn');
    const clearEditorBtn = document.getElementById('clear-editor');
    const copyMarkdownBtn = document.getElementById('copy-markdown');
    const copyHtmlBtn = document.getElementById('copy-html');
    const togglePreviewBtn = document.getElementById('toggle-preview');
    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');
    const exportDropdown = document.getElementById('export-dropdown');
    const exportOptions = document.querySelectorAll('.dropdown-item');
    const importModal = document.getElementById('import-modal');
    const importFile = document.getElementById('import-file');
    const importText = document.getElementById('import-text');
    const importSubmitBtn = document.getElementById('import-submit');
    const importCancelBtn = document.getElementById('import-cancel');
    const syncScrollCheckbox = document.getElementById('sync-scroll');
    const autoPreviewCheckbox = document.getElementById('auto-preview');
    const fontSizeSelect = document.getElementById('font-size');
    const tabSizeSelect = document.getElementById('tab-size');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    // Default Markdown content
    const defaultMarkdown = `# Welcome to Markdown Editor

## Basic Syntax

### Headings
# Heading 1
## Heading 2
### Heading 3

### Emphasis
*Italic text* or _Italic text_
**Bold text** or __Bold text__
***Bold and italic text***

### Lists
#### Unordered List
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

#### Ordered List
1. First item
2. Second item
3. Third item

### Links
[Latest Online Tools](https://latestonlinetools.com)

### Images
![Alt text](https://via.placeholder.com/150)

### Blockquotes
> This is a blockquote
>
> It can span multiple lines

### Code
Inline \`code\` has backticks around it.

\`\`\`javascript
// Code blocks can be syntax highlighted
function helloWorld() {
  console.log("Hello, world!");
}
\`\`\`

### Tables
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

### Task Lists
- [x] Completed task
- [ ] Incomplete task

### Horizontal Rule
---

## Have fun writing in Markdown!
`;

    // State
    let state = {
        syncScroll: true,
        autoPreview: true,
        fontSize: '14',
        tabSize: '4',
        isPreviewToggled: false
    };

    // Initialize
    function init() {
        // Set default content
        markdownInput.value = defaultMarkdown;

        // Initial render
        renderMarkdown();
        updateWordCount();

        // Setup event listeners
        setupEventListeners();

        // Load settings
        loadSettings();
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Markdown input events
        markdownInput.addEventListener('input', () => {
            if (state.autoPreview) {
                renderMarkdown();
            }
            updateWordCount();
        });

        markdownInput.addEventListener('scroll', () => {
            if (state.syncScroll) {
                syncScroll();
            }
        });

        // Toolbar buttons
        toolbarButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                handleToolbarAction(action);
            });
        });

        // Editor actions
        clearEditorBtn.addEventListener('click', clearEditor);
        copyMarkdownBtn.addEventListener('click', copyMarkdown);
        copyHtmlBtn.addEventListener('click', copyHtml);
        togglePreviewBtn.addEventListener('click', togglePreview);

        // Import/Export
        // Import button temporarily disabled
        // importBtn.addEventListener('click', () => importModal.style.display = 'block');
        exportBtn.addEventListener('click', exportMarkdown);

        if (exportDropdown) {
            exportDropdown.addEventListener('click', () => {
                const dropdownMenu = document.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.classList.toggle('show');
                }
            });
        }

        exportOptions.forEach(option => {
            option.addEventListener('click', () => {
                const format = option.getAttribute('data-format');
                exportAs(format);
                const dropdownMenu = document.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.classList.remove('show');
                }
            });
        });

        // Import modal (temporarily disabled)
        /*
        importFile.addEventListener('change', handleFileImport);
        importSubmitBtn.addEventListener('click', submitImport);
        importCancelBtn.addEventListener('click', () => importModal.style.display = 'none');

        // Close button in import modal
        document.querySelector('#import-modal .close-btn').addEventListener('click', () => {
            importModal.style.display = 'none';
        });
        */

        // Settings
        syncScrollCheckbox.addEventListener('change', () => {
            state.syncScroll = syncScrollCheckbox.checked;
            saveSettings();
        });

        autoPreviewCheckbox.addEventListener('change', () => {
            state.autoPreview = autoPreviewCheckbox.checked;
            if (state.autoPreview) {
                renderMarkdown();
            }
            saveSettings();
        });

        fontSizeSelect.addEventListener('change', () => {
            state.fontSize = fontSizeSelect.value;
            markdownInput.style.fontSize = `${state.fontSize}px`;
            saveSettings();
        });

        tabSizeSelect.addEventListener('change', () => {
            state.tabSize = tabSizeSelect.value;
            markdownInput.style.tabSize = state.tabSize;
            saveSettings();
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === importModal) {
                importModal.style.display = 'none';
            }

            // Only handle dropdown closing if not clicking on a dropdown toggle
            if (!e.target.matches('.dropdown-toggle')) {
                const dropdowns = document.getElementsByClassName('dropdown-menu');
                if (dropdowns && dropdowns.length > 0) {
                    for (let i = 0; i < dropdowns.length; i++) {
                        const openDropdown = dropdowns[i];
                        if (openDropdown && openDropdown.classList && openDropdown.classList.contains('show')) {
                            openDropdown.classList.remove('show');
                        }
                    }
                }
            }
        });

        // Tab key in textarea
        markdownInput.addEventListener('keydown', handleTabKey);
    }

    // Render Markdown
    function renderMarkdown() {
        const markdown = markdownInput.value;

        // Configure marked options
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true
        });

        // Convert markdown to HTML and sanitize
        const html = DOMPurify.sanitize(marked.parse(markdown));

        // Update preview
        previewContent.innerHTML = html;

        // Apply syntax highlighting to code blocks
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        // Convert task lists
        document.querySelectorAll('li').forEach((li) => {
            const text = li.textContent;
            if (text.startsWith('[ ] ') || text.startsWith('[x] ')) {
                li.classList.add('task-list-item');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('task-list-item-checkbox');
                checkbox.disabled = true;

                if (text.startsWith('[x] ')) {
                    checkbox.checked = true;
                }

                li.textContent = li.textContent.substring(4);
                li.insertBefore(checkbox, li.firstChild);
            }
        });
    }

    // Update Word Count
    function updateWordCount() {
        const text = markdownInput.value;
        const words = text.match(/\S+/g) || [];
        const characters = text.length;

        wordCount.textContent = `${words.length} words`;
        charCount.textContent = `${characters} characters`;
    }

    // Sync Scroll
    function syncScroll() {
        const percentage = markdownInput.scrollTop / (markdownInput.scrollHeight - markdownInput.clientHeight);
        previewContent.scrollTop = percentage * (previewContent.scrollHeight - previewContent.clientHeight);
    }

    // Handle Toolbar Action
    function handleToolbarAction(action) {
        const textarea = markdownInput;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        let replacement = '';
        let cursorOffset = 0;

        switch (action) {
            case 'bold':
                replacement = `**${selectedText}**`;
                cursorOffset = selectedText ? 0 : -2;
                break;

            case 'italic':
                replacement = `*${selectedText}*`;
                cursorOffset = selectedText ? 0 : -1;
                break;

            case 'heading':
                replacement = `## ${selectedText}`;
                cursorOffset = selectedText ? 0 : 0;
                break;

            case 'strikethrough':
                replacement = `~~${selectedText}~~`;
                cursorOffset = selectedText ? 0 : -2;
                break;

            case 'link':
                replacement = `[${selectedText}](url)`;
                cursorOffset = selectedText ? -1 : -5;
                break;

            case 'code':
                if (selectedText.includes('\n')) {
                    replacement = `\`\`\`\n${selectedText}\n\`\`\``;
                } else {
                    replacement = `\`${selectedText}\``;
                    cursorOffset = selectedText ? 0 : -1;
                }
                break;

            case 'quote':
                replacement = selectedText.split('\n').map(line => `> ${line}`).join('\n');
                break;

            case 'ul':
                replacement = selectedText.split('\n').map(line => `- ${line}`).join('\n');
                break;

            case 'ol':
                replacement = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
                break;

            case 'task':
                replacement = selectedText.split('\n').map(line => `- [ ] ${line}`).join('\n');
                break;

            case 'table':
                replacement = `| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |`;
                break;

            case 'undo':
                document.execCommand('undo');
                return;

            case 'redo':
                document.execCommand('redo');
                return;
        }

        // Insert the replacement text
        textarea.focus();
        document.execCommand('insertText', false, replacement);

        // Adjust cursor position if needed
        if (cursorOffset !== 0 && !selectedText) {
            textarea.selectionStart = textarea.selectionEnd + cursorOffset;
            textarea.selectionEnd = textarea.selectionStart;
        }

        // Update preview
        if (state.autoPreview) {
            renderMarkdown();
        }

        updateWordCount();
    }

    // Handle Tab Key
    function handleTabKey(e) {
        if (e.key === 'Tab') {
            e.preventDefault();

            const textarea = markdownInput;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            // Insert tab or spaces
            const spaces = ' '.repeat(parseInt(state.tabSize));
            textarea.value = textarea.value.substring(0, start) + spaces + textarea.value.substring(end);

            // Move cursor after the inserted tab
            textarea.selectionStart = textarea.selectionEnd = start + parseInt(state.tabSize);

            // Update preview
            if (state.autoPreview) {
                renderMarkdown();
            }
        }
    }

    // Clear Editor
    function clearEditor() {
        markdownInput.value = '';
        renderMarkdown();
        updateWordCount();
        showNotification('Editor content cleared!', 'error');
    }

    // Copy Markdown
    function copyMarkdown() {
        copyToClipboard(markdownInput.value);
        showNotification('Markdown copied to clipboard!', 'success');
    }

    // Copy HTML
    function copyHtml() {
        copyToClipboard(previewContent.innerHTML);
        showNotification('HTML copied to clipboard!', 'success');
    }

    // Toggle Preview
    function togglePreview() {
        const editorPane = document.querySelector('.editor-pane');
        const previewPane = document.querySelector('.preview-pane');

        state.isPreviewToggled = !state.isPreviewToggled;

        if (state.isPreviewToggled) {
            editorPane.style.display = 'none';
            previewPane.style.flex = '1';
            togglePreviewBtn.innerHTML = '<i class="fas fa-edit"></i>';
            togglePreviewBtn.title = 'Show Editor';
        } else {
            editorPane.style.display = 'flex';
            previewPane.style.flex = '1';
            togglePreviewBtn.innerHTML = '<i class="fas fa-columns"></i>';
            togglePreviewBtn.title = 'Toggle Preview Mode';
        }
    }

    // Handle File Import (temporarily disabled)
    /*
    function handleFileImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const validExtensions = ['md', 'markdown', 'txt'];

        if (!validExtensions.includes(fileExtension)) {
            showNotification('Invalid file type. Please select a Markdown (.md, .markdown) or text (.txt) file.', 'error');
            importFile.value = '';
            return;
        }

        // Check file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            showNotification('File is too large. Maximum size is 5MB.', 'error');
            importFile.value = '';
            return;
        }

        // Show loading indicator
        importText.value = 'Loading file...';

        const reader = new FileReader();
        reader.onload = function(e) {
            importText.value = e.target.result;
            // Preview the content in the textarea
            importText.style.height = 'auto';
            importText.style.height = (importText.scrollHeight) + 'px';

            // Show success message
            showNotification('File loaded successfully. Click Import to apply changes.', 'success');
        };
        reader.onerror = function() {
            showNotification('Error reading file. Please try again.', 'error');
            importText.value = '';
        };
        reader.readAsText(file);
    }

    // Submit Import
    function submitImport() {
        const text = importText.value.trim();
        if (text) {
            // Import the content without confirmation
            markdownInput.value = text;
            renderMarkdown();
            updateWordCount();
            showNotification('Markdown imported successfully!', 'success');

            // Close modal and reset fields
            importModal.style.display = 'none';
            importFile.value = '';
            importText.value = '';
        } else {
            showNotification('No content to import. Please enter text or select a file.', 'error');
        }
    }
    */

    // Export Markdown
    function exportMarkdown() {
        exportAs('md');
    }

    // Export As
    function exportAs(format) {
        const markdown = markdownInput.value;
        let content, mimeType, extension, filename;

        switch (format) {
            case 'md':
                content = markdown;
                mimeType = 'text/markdown';
                extension = 'md';
                filename = 'document.md';
                break;

            case 'html':
                // Create a full HTML document
                const html = DOMPurify.sanitize(marked.parse(markdown));
                content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Export</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        pre {
            background-color: #f5f5f5;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }
        code {
            font-family: 'Courier New', monospace;
            background-color: #f5f5f5;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
        }
        pre code {
            padding: 0;
            background-color: transparent;
        }
        blockquote {
            border-left: 4px solid #ccc;
            margin: 1rem 0;
            padding: 0.5rem 1rem;
            background-color: #f9f9f9;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        img {
            max-width: 100%;
        }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
                mimeType = 'text/html';
                extension = 'html';
                filename = 'document.html';
                break;

            case 'pdf':
                // For PDF, we'll use the browser's print functionality
                // This is a simplified approach; a more robust solution would use a PDF library
                window.open().document.write(`
                    <html>
                        <head>
                            <title>Markdown Export</title>
                            <style>
                                body {
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                                    line-height: 1.6;
                                    max-width: 800px;
                                    margin: 0 auto;
                                    padding: 20px;
                                }
                                pre {
                                    background-color: #f5f5f5;
                                    padding: 1rem;
                                    border-radius: 4px;
                                    overflow-x: auto;
                                }
                                code {
                                    font-family: 'Courier New', monospace;
                                    background-color: #f5f5f5;
                                    padding: 0.2rem 0.4rem;
                                    border-radius: 3px;
                                }
                                pre code {
                                    padding: 0;
                                    background-color: transparent;
                                }
                                blockquote {
                                    border-left: 4px solid #ccc;
                                    margin: 1rem 0;
                                    padding: 0.5rem 1rem;
                                    background-color: #f9f9f9;
                                }
                                table {
                                    border-collapse: collapse;
                                    width: 100%;
                                }
                                th, td {
                                    border: 1px solid #ddd;
                                    padding: 8px;
                                    text-align: left;
                                }
                                th {
                                    background-color: #f2f2f2;
                                }
                                img {
                                    max-width: 100%;
                                }
                            </style>
                        </head>
                        <body>
                            ${DOMPurify.sanitize(marked.parse(markdown))}
                            <script>
                                window.onload = function() {
                                    window.print();
                                    window.setTimeout(function() {
                                        window.close();
                                    }, 500);
                                };
                            </script>
                        </body>
                    </html>
                `);
                return;
        }

        // Create and download the file
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification(`Exported as ${extension.toUpperCase()} successfully!`, 'success');
    }

    // Copy to Clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // Show Notification
    function showNotification(message, type = 'success') {
        // Reset classes
        notification.classList.remove('success', 'error');

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

    // Save Settings
    function saveSettings() {
        const settings = {
            syncScroll: state.syncScroll,
            autoPreview: state.autoPreview,
            fontSize: state.fontSize,
            tabSize: state.tabSize
        };

        localStorage.setItem('markdownEditorSettings', JSON.stringify(settings));
    }

    // Load Settings
    function loadSettings() {
        const savedSettings = localStorage.getItem('markdownEditorSettings');

        if (savedSettings) {
            const settings = JSON.parse(savedSettings);

            state.syncScroll = settings.syncScroll !== undefined ? settings.syncScroll : true;
            state.autoPreview = settings.autoPreview !== undefined ? settings.autoPreview : true;
            state.fontSize = settings.fontSize || '14';
            state.tabSize = settings.tabSize || '4';

            syncScrollCheckbox.checked = state.syncScroll;
            autoPreviewCheckbox.checked = state.autoPreview;
            fontSizeSelect.value = state.fontSize;
            tabSizeSelect.value = state.tabSize;

            markdownInput.style.fontSize = `${state.fontSize}px`;
            markdownInput.style.tabSize = state.tabSize;
        }
    }

    // Initialize the app
    init();
});
