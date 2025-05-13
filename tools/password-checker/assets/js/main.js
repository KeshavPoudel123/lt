// ===== PASSWORD CHECKER SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the password checker
    initPasswordChecker();

    // Initialize settings
    initSettings();
});

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info', 'warning')
 */
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

/**
 * Initialize the password checker
 */
function initPasswordChecker() {
    // DOM elements
    const passwordInput = document.getElementById('password-input');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const checkBtn = document.getElementById('check-btn');
    const generateBtn = document.getElementById('generate-btn');
    const strengthBar = document.getElementById('strength-bar');
    const strengthLabel = document.getElementById('strength-label');
    const lengthStat = document.getElementById('length-stat');
    const timeStat = document.getElementById('time-stat');
    const entropyStat = document.getElementById('entropy-stat');
    const breachStat = document.getElementById('breach-stat');
    const checkLength = document.getElementById('check-length');
    const checkUppercase = document.getElementById('check-uppercase');
    const checkLowercase = document.getElementById('check-lowercase');
    const checkNumbers = document.getElementById('check-numbers');
    const checkSymbols = document.getElementById('check-symbols');
    const checkCommon = document.getElementById('check-common');
    const checkPattern = document.getElementById('check-pattern');
    const checkPersonal = document.getElementById('check-personal');
    const suggestionsContainer = document.getElementById('suggestions-container');

    // Toggle password visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePasswordBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Check password button
    if (checkBtn && passwordInput) {
        checkBtn.addEventListener('click', () => {
            const password = passwordInput.value;
            if (!password) {
                showNotification('Please enter a password to check', 'error');
                return;
            }

            checkPassword(password);
        });
    }

    // Generate password button
    if (generateBtn && passwordInput) {
        generateBtn.addEventListener('click', () => {
            const password = generateStrongPassword();
            passwordInput.value = password;
            checkPassword(password);

            // Show notification with copy option
            showNotification('Strong password generated! Click to copy', 'success');

            // Add click event to notification to copy password
            const notification = document.getElementById('notification');
            if (notification) {
                notification.style.cursor = 'pointer';
                const copyHandler = () => {
                    copyToClipboard(password);
                    notification.removeEventListener('click', copyHandler);
                    notification.style.cursor = 'default';
                };
                notification.addEventListener('click', copyHandler);
            }
        });
    }

    // Check password on input (with debounce)
    if (passwordInput) {
        let debounceTimer;
        passwordInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const password = passwordInput.value;
                if (password) {
                    checkPassword(password);
                } else {
                    resetPasswordCheck();
                }
            }, 500);
        });
    }

    /**
     * Check password strength and security
     * @param {string} password - Password to check
     */
    function checkPassword(password) {
        // Basic checks
        const length = password.length;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[^A-Za-z0-9]/.test(password);
        const isCommon = commonPasswords.includes(password.toLowerCase());

        // Pattern checks
        const hasPattern = commonPatterns.some(pattern => pattern.test(password));

        // Personal info checks
        const hasPersonalInfo = personalInfoPatterns.some(pattern => pattern.test(password));

        // Calculate entropy
        const entropy = calculateEntropy(password);

        // Calculate crack time
        const crackTime = calculateCrackTime(entropy);

        // Calculate strength score (0-100)
        let strengthScore = 0;

        // Length contributes up to 30 points
        strengthScore += Math.min(length * 2.5, 30);

        // Character types contribute up to 40 points
        if (hasUppercase) strengthScore += 10;
        if (hasLowercase) strengthScore += 10;
        if (hasNumbers) strengthScore += 10;
        if (hasSymbols) strengthScore += 10;

        // Deduct points for common patterns and passwords
        if (isCommon) strengthScore -= 30;
        if (hasPattern) strengthScore -= 20;
        if (hasPersonalInfo) strengthScore -= 10;

        // Ensure score is between 0 and 100
        strengthScore = Math.max(0, Math.min(100, strengthScore));

        // Determine strength category
        let strengthCategory;
        if (strengthScore < 20) {
            strengthCategory = 'very-weak';
        } else if (strengthScore < 40) {
            strengthCategory = 'weak';
        } else if (strengthScore < 60) {
            strengthCategory = 'medium';
        } else if (strengthScore < 80) {
            strengthCategory = 'strong';
        } else {
            strengthCategory = 'very-strong';
        }

        // Update UI
        updateStrengthMeter(strengthCategory);
        updateStats(length, crackTime, entropy);
        updateChecks(length, hasUppercase, hasLowercase, hasNumbers, hasSymbols, isCommon, hasPattern, hasPersonalInfo);
        updateSuggestions(length, hasUppercase, hasLowercase, hasNumbers, hasSymbols, isCommon, hasPattern, hasPersonalInfo);

        // Check for data breaches
        if (document.getElementById('enable-breach-check').checked) {
            checkDataBreach(password);
        } else {
            if (breachStat) breachStat.textContent = 'Check disabled';
        }
    }

    /**
     * Reset password check UI
     */
    function resetPasswordCheck() {
        // Reset strength meter
        if (strengthBar) {
            strengthBar.className = 'meter-fill';
            strengthBar.style.width = '0';
        }
        if (strengthLabel) {
            strengthLabel.className = 'meter-label';
            strengthLabel.textContent = 'Not Checked';
        }

        // Reset stats
        if (lengthStat) lengthStat.textContent = '0 characters';
        if (timeStat) timeStat.textContent = 'Not calculated';
        if (entropyStat) entropyStat.textContent = '0 bits';
        if (breachStat) breachStat.textContent = 'Not checked';

        // Reset checks
        const checkItems = document.querySelectorAll('.check-item');
        checkItems.forEach(item => {
            item.className = 'check-item';
        });

        // Reset suggestions
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = '<p class="empty-state">Enter a password to get suggestions</p>';
        }
    }

    /**
     * Update strength meter
     * @param {string} category - Strength category
     */
    function updateStrengthMeter(category) {
        if (strengthBar) {
            strengthBar.className = `meter-fill ${category}`;
        }

        if (strengthLabel) {
            strengthLabel.className = `meter-label ${category}`;

            switch (category) {
                case 'very-weak':
                    strengthLabel.textContent = 'Very Weak';
                    break;
                case 'weak':
                    strengthLabel.textContent = 'Weak';
                    break;
                case 'medium':
                    strengthLabel.textContent = 'Medium';
                    break;
                case 'strong':
                    strengthLabel.textContent = 'Strong';
                    break;
                case 'very-strong':
                    strengthLabel.textContent = 'Very Strong';
                    break;
            }
        }
    }

    /**
     * Update password stats
     * @param {number} length - Password length
     * @param {string} crackTime - Estimated crack time
     * @param {number} entropy - Password entropy
     */
    function updateStats(length, crackTime, entropy) {
        if (lengthStat) lengthStat.textContent = `${length} characters`;
        if (timeStat) timeStat.textContent = crackTime;
        if (entropyStat) entropyStat.textContent = `${entropy.toFixed(1)} bits`;
    }

    /**
     * Update security checks
     * @param {number} length - Password length
     * @param {boolean} hasUppercase - Has uppercase letters
     * @param {boolean} hasLowercase - Has lowercase letters
     * @param {boolean} hasNumbers - Has numbers
     * @param {boolean} hasSymbols - Has special characters
     * @param {boolean} isCommon - Is a common password
     * @param {boolean} hasPattern - Has obvious patterns
     * @param {boolean} hasPersonalInfo - Has personal information
     */
    function updateChecks(length, hasUppercase, hasLowercase, hasNumbers, hasSymbols, isCommon, hasPattern, hasPersonalInfo) {
        // Length check
        if (checkLength) {
            checkLength.className = `check-item ${length >= 12 ? 'pass' : 'fail'}`;
            checkLength.querySelector('i').className = `fas ${length >= 12 ? 'fa-check-circle' : 'fa-times-circle'}`;
        }

        // Uppercase check
        if (checkUppercase) {
            checkUppercase.className = `check-item ${hasUppercase ? 'pass' : 'fail'}`;
            checkUppercase.querySelector('i').className = `fas ${hasUppercase ? 'fa-check-circle' : 'fa-times-circle'}`;
        }

        // Lowercase check
        if (checkLowercase) {
            checkLowercase.className = `check-item ${hasLowercase ? 'pass' : 'fail'}`;
            checkLowercase.querySelector('i').className = `fas ${hasLowercase ? 'fa-check-circle' : 'fa-times-circle'}`;
        }

        // Numbers check
        if (checkNumbers) {
            checkNumbers.className = `check-item ${hasNumbers ? 'pass' : 'fail'}`;
            checkNumbers.querySelector('i').className = `fas ${hasNumbers ? 'fa-check-circle' : 'fa-times-circle'}`;
        }

        // Symbols check
        if (checkSymbols) {
            checkSymbols.className = `check-item ${hasSymbols ? 'pass' : 'fail'}`;
            checkSymbols.querySelector('i').className = `fas ${hasSymbols ? 'fa-check-circle' : 'fa-times-circle'}`;
        }

        // Common password check
        if (checkCommon) {
            checkCommon.className = `check-item ${!isCommon ? 'pass' : 'fail'}`;
            checkCommon.querySelector('i').className = `fas ${!isCommon ? 'fa-check-circle' : 'fa-times-circle'}`;
        }

        // Pattern check
        if (checkPattern) {
            checkPattern.className = `check-item ${!hasPattern ? 'pass' : 'fail'}`;
            checkPattern.querySelector('i').className = `fas ${!hasPattern ? 'fa-check-circle' : 'fa-times-circle'}`;
        }

        // Personal info check
        if (checkPersonal) {
            checkPersonal.className = `check-item ${!hasPersonalInfo ? 'pass' : 'fail'}`;
            checkPersonal.querySelector('i').className = `fas ${!hasPersonalInfo ? 'fa-check-circle' : 'fa-times-circle'}`;
        }
    }

    /**
     * Update password suggestions
     * @param {number} length - Password length
     * @param {boolean} hasUppercase - Has uppercase letters
     * @param {boolean} hasLowercase - Has lowercase letters
     * @param {boolean} hasNumbers - Has numbers
     * @param {boolean} hasSymbols - Has special characters
     * @param {boolean} isCommon - Is a common password
     * @param {boolean} hasPattern - Has obvious patterns
     * @param {boolean} hasPersonalInfo - Has personal information
     */
    function updateSuggestions(length, hasUppercase, hasLowercase, hasNumbers, hasSymbols, isCommon, hasPattern, hasPersonalInfo) {
        if (!suggestionsContainer) return;

        const suggestions = [];

        if (length < 12) {
            suggestions.push('Use at least 12 characters');
        }

        if (!hasUppercase) {
            suggestions.push('Include uppercase letters (A-Z)');
        }

        if (!hasLowercase) {
            suggestions.push('Include lowercase letters (a-z)');
        }

        if (!hasNumbers) {
            suggestions.push('Include numbers (0-9)');
        }

        if (!hasSymbols) {
            suggestions.push('Include special characters (!@#$%^&*)');
        }

        if (isCommon) {
            suggestions.push('Avoid common passwords like "password" or "123456"');
        }

        if (hasPattern) {
            suggestions.push('Avoid obvious patterns like "qwerty" or "12345"');
        }

        if (hasPersonalInfo) {
            suggestions.push('Avoid using personal information or common words');
        }

        if (suggestions.length === 0) {
            suggestionsContainer.innerHTML = '<p>Great job! Your password meets all security criteria.</p>';
        } else {
            suggestionsContainer.innerHTML = `
                <p>Consider the following improvements:</p>
                <ul>
                    ${suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                </ul>
            `;
        }
    }

    /**
     * Check if password has been exposed in data breaches
     * @param {string} password - Password to check
     */
    function checkDataBreach(password) {
        if (!breachStat) return;

        breachStat.textContent = 'Checking...';

        // Hash the password with SHA-1
        const sha1Hash = CryptoJS.SHA1(password).toString().toUpperCase();
        const prefix = sha1Hash.substring(0, 5);
        const suffix = sha1Hash.substring(5);

        // Check the Have I Been Pwned API
        fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\\n');
                const breached = lines.some(line => {
                    const [hashSuffix, count] = line.split(':');
                    return hashSuffix === suffix;
                });

                if (breached) {
                    breachStat.textContent = 'Found in data breaches!';
                    breachStat.style.color = '#ff4d4d';
                } else {
                    breachStat.textContent = 'Not found in data breaches';
                    breachStat.style.color = '#4dff4d';
                }
            })
            .catch(error => {
                console.error('Error checking data breach:', error);
                breachStat.textContent = 'Error checking data breaches';
            });
    }

    /**
     * Calculate password entropy
     * @param {string} password - Password to calculate entropy for
     * @returns {number} - Entropy in bits
     */
    function calculateEntropy(password) {
        let poolSize = 0;

        if (/[a-z]/.test(password)) poolSize += 26;
        if (/[A-Z]/.test(password)) poolSize += 26;
        if (/[0-9]/.test(password)) poolSize += 10;
        if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;

        return Math.log2(Math.pow(poolSize, password.length));
    }

    /**
     * Calculate estimated crack time based on entropy
     * @param {number} entropy - Password entropy in bits
     * @returns {string} - Human-readable crack time
     */
    function calculateCrackTime(entropy) {
        // Assume 10 billion guesses per second (modern hardware)
        const guessesPerSecond = 10000000000;
        const possibleCombinations = Math.pow(2, entropy);
        const seconds = possibleCombinations / guessesPerSecond / 2; // Average case is half the total

        return formatTimeSpan(seconds);
    }

    /**
     * Format time span in human-readable format
     * @param {number} seconds - Time in seconds
     * @returns {string} - Formatted time span
     */
    function formatTimeSpan(seconds) {
        if (seconds < 1) {
            return 'Instantly';
        } else if (seconds < 60) {
            return `${Math.round(seconds)} seconds`;
        } else if (seconds < 3600) {
            return `${Math.round(seconds / 60)} minutes`;
        } else if (seconds < 86400) {
            return `${Math.round(seconds / 3600)} hours`;
        } else if (seconds < 31536000) {
            return `${Math.round(seconds / 86400)} days`;
        } else if (seconds < 315360000) {
            return `${Math.round(seconds / 31536000)} years`;
        } else if (seconds < 3153600000) {
            return `${Math.round(seconds / 315360000)} decades`;
        } else if (seconds < 31536000000) {
            return `${Math.round(seconds / 3153600000)} centuries`;
        } else {
            return 'Millions of years';
        }
    }

    /**
     * Generate a strong random password
     * @returns {string} - Generated password
     */
    function generateStrongPassword() {
        const length = Math.floor(Math.random() * 8) + 16; // 16-24 characters
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

        const allChars = uppercaseChars + lowercaseChars + numberChars + symbolChars;

        // Ensure at least one of each character type
        let password = '';
        password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
        password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
        password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
        password += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));

        // Fill the rest with random characters
        for (let i = 4; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        // Shuffle the password
        return shuffleString(password);
    }

    /**
     * Shuffle a string
     * @param {string} string - String to shuffle
     * @returns {string} - Shuffled string
     */
    function shuffleString(string) {
        const array = string.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     */
    function copyToClipboard(text) {
        // Use the modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showNotification('Copied to clipboard!', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback to the older method
                    fallbackCopyToClipboard(text);
                });
        } else {
            // Fallback for browsers that don't support the Clipboard API
            fallbackCopyToClipboard(text);
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
                showNotification('Copied to clipboard!', 'success');
            } else {
                showNotification('Failed to copy text', 'error');
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy text', 'error');
        }

        document.body.removeChild(textarea);
    }
}
