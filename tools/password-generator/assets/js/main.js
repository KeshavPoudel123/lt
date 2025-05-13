// Password Generator Tool JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const passwordOutput = document.getElementById('password-output');
    const lengthSlider = document.getElementById('password-length');
    const lengthValue = document.getElementById('length-value');
    const strengthText = document.getElementById('strength-text');
    const strengthSegments = document.querySelectorAll('.strength-segment');

    const includeUppercase = document.getElementById('include-uppercase');
    const includeLowercase = document.getElementById('include-lowercase');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSymbols = document.getElementById('include-symbols');

    const excludeSimilar = document.getElementById('exclude-similar');
    const excludeAmbiguous = document.getElementById('exclude-ambiguous');
    const requireAllTypes = document.getElementById('require-all-types');

    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const saveBtn = document.getElementById('save-btn');

    const savedPasswordsContainer = document.getElementById('saved-passwords-container');
    const savedPasswordsList = document.getElementById('saved-passwords-list');

    // Settings (hidden but kept for compatibility)
    const autoCopy = document.getElementById('auto-copy');
    const clearClipboard = document.getElementById('clear-clipboard');

    // Character Sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similarChars = 'iIlL1oO0';
    const ambiguousSymbols = '{}[]()\\\'"`~,;:.<>/';

    // Initialize
    updateLengthValue();
    generatePassword();

    // Event Listeners
    lengthSlider.addEventListener('input', updateLengthValue);
    lengthSlider.addEventListener('change', generatePassword);

    includeUppercase.addEventListener('change', validateOptions);
    includeLowercase.addEventListener('change', validateOptions);
    includeNumbers.addEventListener('change', validateOptions);
    includeSymbols.addEventListener('change', validateOptions);

    excludeSimilar.addEventListener('change', generatePassword);
    excludeAmbiguous.addEventListener('change', generatePassword);
    requireAllTypes.addEventListener('change', generatePassword);

    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyPassword);
    refreshBtn.addEventListener('click', generatePassword);
    saveBtn.addEventListener('click', savePassword);

    // Load saved passwords from localStorage
    loadSavedPasswords();

    // Functions
    function updateLengthValue() {
        lengthValue.textContent = lengthSlider.value;
    }

    function validateOptions() {
        // Ensure at least one character type is selected
        if (!includeUppercase.checked && !includeLowercase.checked &&
            !includeNumbers.checked && !includeSymbols.checked) {
            // Default to lowercase if nothing is selected
            includeLowercase.checked = true;
        }
        generatePassword();
    }

    function generatePassword() {
        let charset = '';
        let requiredChars = [];

        // Build character set based on options
        if (includeUppercase.checked) {
            charset += uppercaseChars;
            requiredChars.push(getRandomChar(uppercaseChars));
        }

        if (includeLowercase.checked) {
            charset += lowercaseChars;
            requiredChars.push(getRandomChar(lowercaseChars));
        }

        if (includeNumbers.checked) {
            charset += numberChars;
            requiredChars.push(getRandomChar(numberChars));
        }

        if (includeSymbols.checked) {
            let symbols = symbolChars;
            if (excludeAmbiguous.checked) {
                symbols = symbols.split('').filter(char => !ambiguousSymbols.includes(char)).join('');
            }
            charset += symbols;
            requiredChars.push(getRandomChar(symbols));
        }

        // Remove similar characters if option is selected
        if (excludeSimilar.checked) {
            charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
        }

        // Generate password
        let password = '';
        const length = parseInt(lengthSlider.value);

        if (requireAllTypes.checked && requiredChars.length > 0) {
            // Add one character from each selected type
            password = requiredChars.join('');

            // Fill the rest with random characters
            for (let i = password.length; i < length; i++) {
                password += charset.charAt(Math.floor(Math.random() * charset.length));
            }

            // Shuffle the password to mix the required characters
            password = shuffleString(password);
        } else {
            // Generate completely random password
            for (let i = 0; i < length; i++) {
                password += charset.charAt(Math.floor(Math.random() * charset.length));
            }
        }

        // Update UI
        passwordOutput.value = password;
        updateStrengthMeter(password);

        // Auto-copy if enabled
        if (autoCopy.checked) {
            copyPassword();
        }
    }

    function getRandomChar(charset) {
        return charset.charAt(Math.floor(Math.random() * charset.length));
    }

    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    function updateStrengthMeter(password) {
        // Calculate password strength
        let strength = 0;

        // Length contribution
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        if (password.length >= 16) strength += 1;

        // Character variety contribution
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);

        const varietyCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
        strength += Math.min(varietyCount - 1, 1); // Add 1 point if at least 2 character types

        // Update UI
        strengthSegments.forEach((segment, index) => {
            if (index < strength) {
                segment.setAttribute('data-active', 'true');
            } else {
                segment.setAttribute('data-active', 'false');
            }
        });

        // Update strength text
        const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
        strengthText.textContent = strengthLabels[strength - 1] || 'Very Weak';

        // Update color
        strengthText.style.color = getStrengthColor(strength);
    }

    function getStrengthColor(strength) {
        const colors = [
            'var(--strength-weak)',    // Weak
            'var(--strength-fair)',    // Fair
            'var(--strength-good)',    // Good
            'var(--strength-strong)'   // Strong
        ];
        return colors[strength - 1] || 'var(--medium-text)';
    }

    function copyPassword() {
        if (!passwordOutput.value) {
            showNotification('No password to copy', 'warning');
            return;
        }

        // Use the modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(passwordOutput.value)
                .then(() => {
                    showNotification('Password copied to clipboard!', 'success');

                    // Schedule clipboard clearing if enabled
                    const clearAfter = parseInt(clearClipboard.value);
                    if (clearAfter > 0) {
                        setTimeout(() => {
                            navigator.clipboard.writeText('');
                            showNotification('Clipboard cleared for security', 'info');
                        }, clearAfter * 1000);
                    }
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback to the older method
                    fallbackCopyToClipboard(passwordOutput.value);
                });
        } else {
            // Fallback for browsers that don't support the Clipboard API
            fallbackCopyToClipboard(passwordOutput.value);
        }
    }

    /**
     * Fallback method to copy text to clipboard
     * @param {string} text - Text to copy
     */
    function fallbackCopyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';  // Prevent scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('Password copied to clipboard!', 'success');

                // Schedule clipboard clearing if enabled
                const clearAfter = parseInt(clearClipboard.value);
                if (clearAfter > 0) {
                    setTimeout(() => {
                        // Clear clipboard
                        document.execCommand('copy', false, '');
                        showNotification('Clipboard cleared for security', 'info');
                    }, clearAfter * 1000);
                }
            } else {
                showNotification('Failed to copy password', 'error');
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy password', 'error');
        }

        document.body.removeChild(textarea);
    }

    function savePassword() {
        const password = passwordOutput.value;
        if (!password) return;

        // Get saved passwords from localStorage
        const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');

        // Add new password
        savedPasswords.push({
            value: password,
            date: new Date().toISOString(),
            id: Date.now().toString()
        });

        // Save to localStorage
        localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));

        // Update UI
        loadSavedPasswords();
        showNotification('Password saved successfully', 'success');
    }

    function loadSavedPasswords() {
        const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');

        if (savedPasswords.length > 0) {
            savedPasswordsContainer.classList.remove('hidden');
            savedPasswordsList.innerHTML = '';

            savedPasswords.forEach(password => {
                const date = new Date(password.date);
                const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

                const passwordItem = document.createElement('div');
                passwordItem.className = 'saved-password-item';
                passwordItem.innerHTML = `
                    <div class="saved-password-info">
                        <div class="saved-password-value">${maskPassword(password.value)}</div>
                        <div class="saved-password-date">${formattedDate}</div>
                    </div>
                    <div class="saved-password-actions">
                        <button type="button" class="btn btn-sm btn-icon copy-saved" data-password="${password.value}" title="Copy Password">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-icon delete-saved" data-id="${password.id}" title="Delete Password">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;

                savedPasswordsList.appendChild(passwordItem);
            });

            // Add event listeners to the new buttons
            document.querySelectorAll('.copy-saved').forEach(btn => {
                btn.addEventListener('click', function() {
                    const password = this.getAttribute('data-password');
                    if (!password) {
                        showNotification('No password to copy', 'warning');
                        return;
                    }

                    // Use the modern clipboard API if available
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(password)
                            .then(() => {
                                showNotification('Password copied to clipboard!', 'success');

                                // Schedule clipboard clearing if enabled
                                const clearAfter = parseInt(clearClipboard.value);
                                if (clearAfter > 0) {
                                    setTimeout(() => {
                                        navigator.clipboard.writeText('');
                                        showNotification('Clipboard cleared for security', 'info');
                                    }, clearAfter * 1000);
                                }
                            })
                            .catch(err => {
                                console.error('Failed to copy text: ', err);
                                // Fallback to the older method
                                fallbackCopyToClipboard(password);
                            });
                    } else {
                        // Fallback for browsers that don't support the Clipboard API
                        fallbackCopyToClipboard(password);
                    }
                });
            });

            document.querySelectorAll('.delete-saved').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    deleteSavedPassword(id);
                });
            });
        } else {
            savedPasswordsContainer.classList.add('hidden');
        }
    }

    function maskPassword(password) {
        if (password.length <= 8) {
            return '•'.repeat(password.length);
        }
        return password.substring(0, 3) + '•'.repeat(password.length - 6) + password.substring(password.length - 3);
    }

    function deleteSavedPassword(id) {
        let savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
        savedPasswords = savedPasswords.filter(password => password.id !== id);
        localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
        loadSavedPasswords();
        showNotification('Password deleted', 'info');
    }

    function updateSettings() {
        localStorage.setItem('passwordSettings', JSON.stringify({
            autoCopy: autoCopy.checked,
            clearClipboard: clearClipboard.value
        }));
    }

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('passwordSettings') || '{}');
        if (settings.autoCopy !== undefined) autoCopy.checked = settings.autoCopy;
        if (settings.clearClipboard !== undefined) clearClipboard.value = settings.clearClipboard;
    }

    function showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');

        if (!notification || !notificationMessage) return;

        // Reset classes
        notification.classList.remove('success', 'error', 'info', 'warning');

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

    // Load settings on init
    loadSettings();
});
