/**
 * Convert Case - Text Case Converter Tool
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const inputText = document.getElementById('input-text');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const characterCount = document.getElementById('character-count');
    const wordCount = document.getElementById('word-count');
    const lineCount = document.getElementById('line-count');
    const optionCards = document.querySelectorAll('.option-card');
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    // Settings Elements
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeButtons = document.querySelectorAll('.close-btn');
    const darkModeToggle = document.getElementById('dark-mode');
    const autoConvertToggle = document.getElementById('auto-convert');
    const autoCopyToggle = document.getElementById('auto-copy');
    
    // Initialize the application
    function init() {
        setupEventListeners();
        updateTextStats();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Input events
        inputText.addEventListener('input', handleTextInput);
        clearBtn.addEventListener('click', clearText);
        sampleBtn.addEventListener('click', loadSampleText);
        pasteBtn.addEventListener('click', pasteFromClipboard);
        
        // Option card events
        optionCards.forEach(card => {
            card.addEventListener('click', handleCardClick);
        });
        
        // Copy button events
        copyButtons.forEach(button => {
            button.addEventListener('click', handleCopyClick);
        });
        
        // Settings events
        settingsBtn.addEventListener('click', openSettingsModal);
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModals);
        });
        darkModeToggle.addEventListener('change', toggleDarkMode);
        autoConvertToggle.addEventListener('change', () => {
            if (autoConvertToggle.checked) {
                convertAllCases();
            }
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                closeModals();
            }
        });
    }
    
    // Handle text input
    function handleTextInput() {
        updateTextStats();
        
        if (autoConvertToggle.checked) {
            convertAllCases();
        }
    }
    
    // Update text statistics
    function updateTextStats() {
        const text = inputText.value;
        
        // Character count
        const chars = text.length;
        characterCount.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
        
        // Word count
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
        
        // Line count
        const lines = text.split('\n').length;
        lineCount.textContent = `${lines} line${lines !== 1 ? 's' : ''}`;
    }
    
    // Convert all cases
    function convertAllCases() {
        const text = inputText.value;
        
        if (!text) {
            optionCards.forEach(card => {
                const preview = card.querySelector('.option-preview');
                preview.textContent = '';
            });
            return;
        }
        
        optionCards.forEach(card => {
            const caseType = card.dataset.case;
            const preview = card.querySelector('.option-preview');
            
            preview.textContent = convertCase(text, caseType);
        });
    }
    
    // Convert text to specified case
    function convertCase(text, caseType) {
        switch(caseType) {
            case 'lowercase':
                return text.toLowerCase();
                
            case 'uppercase':
                return text.toUpperCase();
                
            case 'titlecase':
                return text.replace(/\w\S*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
                
            case 'sentencecase':
                return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, function(c) {
                    return c.toUpperCase();
                });
                
            case 'camelcase':
                return text.trim().toLowerCase()
                    .replace(/[\s_.-]+(\w|$)/g, (_, p) => p.toUpperCase())
                    .replace(/\s+/g, '');
                
            case 'pascalcase':
                return text.trim().toLowerCase()
                    .replace(/(^|\s+)(\w)/g, (_, space, char) => char.toUpperCase())
                    .replace(/\s+/g, '');
                
            case 'snakecase':
                return text.trim().toLowerCase()
                    .replace(/\s+/g, '_')
                    .replace(/[^\w_]/g, '');
                
            case 'kebabcase':
                return text.trim().toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '');
                
            case 'constantcase':
                return text.trim().toUpperCase()
                    .replace(/\s+/g, '_')
                    .replace(/[^\w_]/g, '');
                
            case 'dotcase':
                return text.trim().toLowerCase()
                    .replace(/\s+/g, '.')
                    .replace(/[^\w.]/g, '');
                
            case 'alternatingcase':
                return text.split('').map((char, i) => 
                    i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
                ).join('');
                
            case 'togglecase':
                return text.split('').map(char => {
                    if (char === char.toUpperCase()) {
                        return char.toLowerCase();
                    } else {
                        return char.toUpperCase();
                    }
                }).join('');
                
            case 'reversedtext':
                return text.split('').reverse().join('');
                
            case 'nospacestext':
                return text.replace(/\s+/g, '');
                
            case 'randomcase':
                return text.split('').map(char => {
                    return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
                }).join('');
                
            default:
                return text;
        }
    }
    
    // Clear text
    function clearText() {
        inputText.value = '';
        updateTextStats();
        
        if (autoConvertToggle.checked) {
            convertAllCases();
        }
    }
    
    // Load sample text
    function loadSampleText() {
        inputText.value = `The quick brown fox jumps over the lazy dog.
This is a sample text to demonstrate the case converter tool.
It includes MULTIPLE sentences with different capitalization.
You can convert this text to various case formats like camelCase, PascalCase, snake_case, and more.`;
        
        updateTextStats();
        
        if (autoConvertToggle.checked) {
            convertAllCases();
        }
    }
    
    // Paste from clipboard
    function pasteFromClipboard() {
        navigator.clipboard.readText()
            .then(text => {
                inputText.value = text;
                updateTextStats();
                
                if (autoConvertToggle.checked) {
                    convertAllCases();
                }
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
                showNotification('Error accessing clipboard. Please paste manually.', 'error');
            });
    }
    
    // Handle option card click
    function handleCardClick(e) {
        if (e.target.classList.contains('copy-btn') || e.target.closest('.copy-btn')) {
            return; // Don't handle if copy button was clicked
        }
        
        const card = e.currentTarget;
        const caseType = card.dataset.case;
        const preview = card.querySelector('.option-preview');
        
        if (autoCopyToggle.checked) {
            copyToClipboard(preview.textContent);
        }
    }
    
    // Handle copy button click
    function handleCopyClick(e) {
        e.stopPropagation();
        
        const card = e.target.closest('.option-card');
        const preview = card.querySelector('.option-preview');
        
        copyToClipboard(preview.textContent);
    }
    
    // Copy text to clipboard
    function copyToClipboard(text) {
        if (!text) {
            showNotification('Nothing to copy. Please enter some text first.', 'warning');
            return;
        }
        
        navigator.clipboard.writeText(text)
            .then(() => {
                showNotification('Copied to clipboard!', 'success');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                showNotification('Failed to copy text.', 'error');
            });
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon;
        switch(type) {
            case 'success':
                icon = 'check_circle';
                break;
            case 'warning':
                icon = 'warning';
                break;
            case 'error':
                icon = 'error';
                break;
            default:
                icon = 'info';
        }
        
        notification.innerHTML = `
            <i class="material-icons">${icon}</i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Open settings modal
    function openSettingsModal() {
        settingsModal.style.display = 'block';
    }
    
    // Close all modals
    function closeModals() {
        settingsModal.style.display = 'none';
    }
    
    // Toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode', darkModeToggle.checked);
    }
    
    // Initialize the application
    init();
});
