// ===== ASCII TABLE SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the ASCII table tool
    initAsciiTable();

    // Initialize settings
    initSettings();
});

/**
 * Initialize the ASCII table tool
 */
function initAsciiTable() {


    // Tab elements
    const tabTable = document.getElementById('tab-table');
    const tabSearch = document.getElementById('tab-search');
    const tabConverter = document.getElementById('tab-converter');
    const tabInfo = document.getElementById('tab-info');

    // Calculator sections
    const calculatorTable = document.getElementById('calculator-table');
    const calculatorSearch = document.getElementById('calculator-search');
    const calculatorConverter = document.getElementById('calculator-converter');
    const calculatorInfo = document.getElementById('calculator-info');

    // Table elements
    const categoryFilter = document.getElementById('category-filter');
    const displayFormat = document.getElementById('display-format');
    const asciiTable = document.getElementById('ascii-table');
    const characterDetails = document.getElementById('character-details');

    // Search elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchDecimal = document.getElementById('search-decimal');
    const searchHex = document.getElementById('search-hex');
    const searchChar = document.getElementById('search-char');
    const searchDesc = document.getElementById('search-desc');
    const searchResults = document.getElementById('search-results');

    // Converter elements
    const converterInput = document.getElementById('converter-input');
    const convertToDecimal = document.getElementById('convert-to-decimal');
    const convertToHex = document.getElementById('convert-to-hex');
    const convertToBinary = document.getElementById('convert-to-binary');
    const convertFromCodes = document.getElementById('convert-from-codes');
    const convertBtn = document.getElementById('convert-btn');
    const clearConverterBtn = document.getElementById('clear-converter');
    const converterResults = document.getElementById('converter-results');
    const copyResultBtn = document.getElementById('copy-result');

    // Settings
    const showControlChars = document.getElementById('show-control-chars');
    const showExtendedAscii = document.getElementById('show-extended-ascii');
    const hexUppercase = document.getElementById('hex-uppercase');

    // ASCII character data
    const asciiData = generateAsciiData();

    // Currently selected character
    let selectedCharacter = null;

    // Initialize
    loadSettings();
    generateAsciiTable();

    // Event Listeners - Tabs
    tabTable.addEventListener('click', () => switchTab('table'));
    tabSearch.addEventListener('click', () => switchTab('search'));
    tabConverter.addEventListener('click', () => switchTab('converter'));
    tabInfo.addEventListener('click', () => switchTab('info'));

    // Event Listeners - Table
    categoryFilter.addEventListener('change', generateAsciiTable);
    displayFormat.addEventListener('change', generateAsciiTable);

    // Event Listeners - Search
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Event Listeners - Converter
    convertBtn.addEventListener('click', performConversion);
    clearConverterBtn.addEventListener('click', () => {
        converterInput.value = '';
        converterResults.innerHTML = '<p class="empty-results">Enter text and click Convert to see results.</p>';
    });
    copyResultBtn.addEventListener('click', () => {
        const text = converterResults.textContent;
        if (text && !text.includes('Enter text')) {
            copyToClipboard(text);
        }
    });

    // Event Listeners - Settings
    showControlChars.addEventListener('change', generateAsciiTable);
    showExtendedAscii.addEventListener('change', generateAsciiTable);
    hexUppercase.addEventListener('change', generateAsciiTable);

    /**
     * Switch between calculator tabs
     * @param {string} tabId - ID of the tab to switch to
     */
    function switchTab(tabId) {
        // Hide all calculator sections
        calculatorTable.classList.remove('active');
        calculatorSearch.classList.remove('active');
        calculatorConverter.classList.remove('active');
        calculatorInfo.classList.remove('active');

        // Deactivate all tab buttons
        tabTable.classList.remove('active');
        tabSearch.classList.remove('active');
        tabConverter.classList.remove('active');
        tabInfo.classList.remove('active');

        // Show selected calculator section and activate tab button
        switch (tabId) {
            case 'table':
                calculatorTable.classList.add('active');
                tabTable.classList.add('active');
                break;
            case 'search':
                calculatorSearch.classList.add('active');
                tabSearch.classList.add('active');
                break;
            case 'converter':
                calculatorConverter.classList.add('active');
                tabConverter.classList.add('active');
                break;
            case 'info':
                calculatorInfo.classList.add('active');
                tabInfo.classList.add('active');
                break;
        }
    }

    /**
     * Generate ASCII character data
     * @returns {Array} - Array of ASCII character objects
     */
    function generateAsciiData() {
        const data = [];

        // Control characters (0-31)
        const controlChars = [
            'NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL',
            'BS', 'HT', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI',
            'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB',
            'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US'
        ];

        const controlDescriptions = [
            'Null character', 'Start of Heading', 'Start of Text', 'End of Text',
            'End of Transmission', 'Enquiry', 'Acknowledgment', 'Bell',
            'Backspace', 'Horizontal Tab', 'Line Feed', 'Vertical Tab',
            'Form Feed', 'Carriage Return', 'Shift Out', 'Shift In',
            'Data Link Escape', 'Device Control 1', 'Device Control 2', 'Device Control 3',
            'Device Control 4', 'Negative Acknowledgment', 'Synchronous Idle', 'End of Transmission Block',
            'Cancel', 'End of Medium', 'Substitute', 'Escape',
            'File Separator', 'Group Separator', 'Record Separator', 'Unit Separator'
        ];

        // Add control characters
        for (let i = 0; i < 32; i++) {
            data.push({
                decimal: i,
                hex: i.toString(16).padStart(2, '0'),
                binary: i.toString(2).padStart(8, '0'),
                character: controlChars[i],
                description: controlDescriptions[i],
                category: 'control'
            });
        }

        // Add printable characters (32-126)
        for (let i = 32; i < 127; i++) {
            let description = '';

            // Special descriptions for some characters
            if (i === 32) description = 'Space';
            else if (i >= 48 && i <= 57) description = 'Digit ' + String.fromCharCode(i);
            else if (i >= 65 && i <= 90) description = 'Uppercase letter ' + String.fromCharCode(i);
            else if (i >= 97 && i <= 122) description = 'Lowercase letter ' + String.fromCharCode(i);
            else description = 'Printable character';

            data.push({
                decimal: i,
                hex: i.toString(16).padStart(2, '0'),
                binary: i.toString(2).padStart(8, '0'),
                character: String.fromCharCode(i),
                description: description,
                category: 'printable'
            });
        }

        // Add DEL character (127)
        data.push({
            decimal: 127,
            hex: '7f',
            binary: '01111111',
            character: 'DEL',
            description: 'Delete',
            category: 'control'
        });

        // Add extended ASCII characters (128-255)
        for (let i = 128; i < 256; i++) {
            data.push({
                decimal: i,
                hex: i.toString(16).padStart(2, '0'),
                binary: i.toString(2).padStart(8, '0'),
                character: String.fromCharCode(i),
                description: 'Extended ASCII character',
                category: 'extended'
            });
        }

        return data;
    }

    /**
     * Generate the ASCII table
     */
    function generateAsciiTable() {
        // Clear the table
        asciiTable.innerHTML = '';

        // Get filter and display settings
        const category = categoryFilter.value;
        const display = displayFormat.value;

        // Apply class for display format
        asciiTable.className = `ascii-table ${display}-view`;

        // Filter characters based on category and settings
        let filteredData = asciiData.filter(char => {
            if (category !== 'all' && char.category !== category) return false;
            if (!showControlChars.checked && char.category === 'control') return false;
            if (!showExtendedAscii.checked && char.category === 'extended') return false;
            return true;
        });

        // Generate table based on display format
        if (display === 'grid') {
            generateGridView(filteredData);
        } else {
            generateListView(filteredData);
        }
    }

    /**
     * Generate grid view of ASCII table
     * @param {Array} data - Filtered ASCII character data
     */
    function generateGridView(data) {
        data.forEach(char => {
            const charElement = document.createElement('div');
            charElement.className = `ascii-char ${char.category}`;
            charElement.dataset.decimal = char.decimal;

            const charValue = document.createElement('div');
            charValue.className = 'ascii-char-value';

            // Display character or symbol for control characters
            if (char.category === 'control') {
                charValue.textContent = char.character;
            } else {
                charValue.textContent = char.character;
            }

            const charCode = document.createElement('div');
            charCode.className = 'ascii-char-code';

            // Format hex based on settings
            const hexValue = hexUppercase.checked ? char.hex.toUpperCase() : char.hex;
            charCode.textContent = char.decimal;

            charElement.appendChild(charValue);
            charElement.appendChild(charCode);

            // Add click event to show character details
            charElement.addEventListener('click', () => {
                showCharacterDetails(char);

                // Remove selected class from all characters
                document.querySelectorAll('.ascii-char').forEach(el => {
                    el.classList.remove('selected');
                });

                // Add selected class to clicked character
                charElement.classList.add('selected');
            });

            asciiTable.appendChild(charElement);
        });
    }

    /**
     * Generate list view of ASCII table
     * @param {Array} data - Filtered ASCII character data
     */
    function generateListView(data) {
        // Create table header
        const header = document.createElement('div');
        header.className = 'table-header';

        const decimalHeader = document.createElement('div');
        decimalHeader.className = 'table-header-cell';
        decimalHeader.textContent = 'Decimal';

        const hexHeader = document.createElement('div');
        hexHeader.className = 'table-header-cell';
        hexHeader.textContent = 'Hex';

        const binaryHeader = document.createElement('div');
        binaryHeader.className = 'table-header-cell';
        binaryHeader.textContent = 'Binary';

        const charHeader = document.createElement('div');
        charHeader.className = 'table-header-cell';
        charHeader.textContent = 'Character';

        const descHeader = document.createElement('div');
        descHeader.className = 'table-header-cell';
        descHeader.textContent = 'Description';

        header.appendChild(decimalHeader);
        header.appendChild(hexHeader);
        header.appendChild(binaryHeader);
        header.appendChild(charHeader);
        header.appendChild(descHeader);

        asciiTable.appendChild(header);

        // Add character rows
        data.forEach(char => {
            const charElement = document.createElement('div');
            charElement.className = `ascii-char ${char.category}`;
            charElement.dataset.decimal = char.decimal;

            const decimalCell = document.createElement('div');
            decimalCell.className = 'ascii-char-cell';
            decimalCell.textContent = char.decimal;

            const hexCell = document.createElement('div');
            hexCell.className = 'ascii-char-cell';
            // Format hex based on settings
            const hexValue = hexUppercase.checked ? char.hex.toUpperCase() : char.hex;
            hexCell.textContent = hexValue;

            const binaryCell = document.createElement('div');
            binaryCell.className = 'ascii-char-cell';
            binaryCell.textContent = char.binary;

            const charCell = document.createElement('div');
            charCell.className = 'ascii-char-cell';

            // Display character or symbol for control characters
            if (char.category === 'control') {
                charCell.textContent = char.character;
            } else {
                charCell.textContent = char.character;
            }

            const descCell = document.createElement('div');
            descCell.className = 'ascii-char-cell';
            descCell.textContent = char.description;

            charElement.appendChild(decimalCell);
            charElement.appendChild(hexCell);
            charElement.appendChild(binaryCell);
            charElement.appendChild(charCell);
            charElement.appendChild(descCell);

            // Add click event to show character details
            charElement.addEventListener('click', () => {
                showCharacterDetails(char);

                // Remove selected class from all characters
                document.querySelectorAll('.ascii-char').forEach(el => {
                    el.classList.remove('selected');
                });

                // Add selected class to clicked character
                charElement.classList.add('selected');
            });

            asciiTable.appendChild(charElement);
        });
    }

    /**
     * Show character details
     * @param {Object} char - ASCII character object
     */
    function showCharacterDetails(char) {
        selectedCharacter = char;

        // Format hex based on settings
        const hexValue = hexUppercase.checked ? char.hex.toUpperCase() : char.hex;

        // Create details HTML
        let detailsHtml = `
            <h3>Character Details</h3>
            <div class="character-preview">${char.category === 'control' ? char.character : char.character}</div>
            <div class="character-details-grid">
                <div class="character-detail-item">
                    <span class="detail-label">Decimal</span>
                    <span class="detail-value">${char.decimal}</span>
                </div>
                <div class="character-detail-item">
                    <span class="detail-label">Hexadecimal</span>
                    <span class="detail-value">0x${hexValue}</span>
                </div>
                <div class="character-detail-item">
                    <span class="detail-label">Binary</span>
                    <span class="detail-value">${char.binary}</span>
                </div>
                <div class="character-detail-item">
                    <span class="detail-label">Character</span>
                    <span class="detail-value">${char.category === 'control' ? char.character : char.character}</span>
                </div>
                <div class="character-detail-item">
                    <span class="detail-label">Category</span>
                    <span class="detail-value">${char.category.charAt(0).toUpperCase() + char.category.slice(1)}</span>
                </div>
                <div class="character-detail-item">
                    <span class="detail-label">Description</span>
                    <span class="detail-value">${char.description}</span>
                </div>
                <div class="character-detail-item">
                    <span class="detail-label">HTML Entity</span>
                    <span class="detail-value">&amp;#${char.decimal};</span>
                </div>
                <div class="character-detail-item">
                    <span class="detail-label">JavaScript</span>
                    <span class="detail-value">String.fromCharCode(${char.decimal})</span>
                </div>
            </div>
        `;

        characterDetails.innerHTML = detailsHtml;
    }

    /**
     * Perform search for ASCII characters
     */
    function performSearch() {
        const query = searchInput.value.trim();

        if (!query) {
            searchResults.innerHTML = '<p class="empty-results">Enter a search term to find ASCII characters.</p>';
            return;
        }

        // Get search options
        const searchInDecimal = searchDecimal.checked;
        const searchInHex = searchHex.checked;
        const searchInChar = searchChar.checked;
        const searchInDesc = searchDesc.checked;

        // Filter characters based on search query and options
        const results = asciiData.filter(char => {
            if (searchInDecimal && char.decimal.toString().includes(query)) return true;
            if (searchInHex && char.hex.includes(query.toLowerCase())) return true;
            if (searchInChar && char.character.toLowerCase().includes(query.toLowerCase())) return true;
            if (searchInDesc && char.description.toLowerCase().includes(query.toLowerCase())) return true;
            return false;
        });

        // Display results
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="empty-results">No characters found matching your search.</p>';
        } else {
            searchResults.innerHTML = '';

            results.forEach(char => {
                const charElement = document.createElement('div');
                charElement.className = `ascii-char ${char.category}`;

                const charValue = document.createElement('div');
                charValue.className = 'ascii-char-value';

                // Display character or symbol for control characters
                if (char.category === 'control') {
                    charValue.textContent = char.character;
                } else {
                    charValue.textContent = char.character;
                }

                const charCode = document.createElement('div');
                charCode.className = 'ascii-char-code';

                // Format hex based on settings
                const hexValue = hexUppercase.checked ? char.hex.toUpperCase() : char.hex;
                charCode.textContent = char.decimal;

                charElement.appendChild(charValue);
                charElement.appendChild(charCode);

                // Add click event to show character details
                charElement.addEventListener('click', () => {
                    // Switch to table tab
                    switchTab('table');

                    // Find and click the character in the table
                    setTimeout(() => {
                        const tableChar = document.querySelector(`.ascii-char[data-decimal="${char.decimal}"]`);
                        if (tableChar) {
                            tableChar.click();
                            tableChar.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 100);
                });

                searchResults.appendChild(charElement);
            });
        }
    }

    /**
     * Perform conversion
     */
    function performConversion() {
        const input = converterInput.value;

        if (!input) {
            converterResults.innerHTML = '<p class="empty-results">Enter text and click Convert to see results.</p>';
            return;
        }

        let result = '';

        // Get conversion type
        if (convertToDecimal.checked) {
            // Convert text to decimal
            result = Array.from(input).map(char => char.charCodeAt(0)).join(' ');
        } else if (convertToHex.checked) {
            // Convert text to hexadecimal
            result = Array.from(input).map(char => {
                const hex = char.charCodeAt(0).toString(16).padStart(2, '0');
                return hexUppercase.checked ? hex.toUpperCase() : hex;
            }).join(' ');
        } else if (convertToBinary.checked) {
            // Convert text to binary
            result = Array.from(input).map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        } else if (convertFromCodes.checked) {
            // Convert codes to text
            try {
                // Try to parse as decimal
                const codes = input.split(/\s+/).map(code => parseInt(code.trim()));
                result = codes.map(code => String.fromCharCode(code)).join('');
            } catch (error) {
                result = 'Error: Invalid input format. Please enter space-separated decimal codes.';
            }
        }

        converterResults.textContent = result;
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

            showNotification('Failed to copy text', 'error');
        }

        document.body.removeChild(textarea);
    }

    /**
     * Load settings from localStorage
     */
    function loadSettings() {
        const savedSettings = localStorage.getItem('asciiTableSettings');

        if (savedSettings) {
            const settings = JSON.parse(savedSettings);

            if (settings.showControlChars !== undefined) {
                showControlChars.checked = settings.showControlChars;
            }

            if (settings.showExtendedAscii !== undefined) {
                showExtendedAscii.checked = settings.showExtendedAscii;
            }

            if (settings.hexUppercase !== undefined) {
                hexUppercase.checked = settings.hexUppercase;
            }
        }
    }

    /**
     * Update settings and save to localStorage
     */
    function updateSettings() {
        localStorage.setItem('asciiTableSettings', JSON.stringify({
            showControlChars: showControlChars.checked,
            showExtendedAscii: showExtendedAscii.checked,
            hexUppercase: hexUppercase.checked
        }));
    }
}

/**
 * Initialize settings modal
 */
function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeButtons = document.querySelectorAll('.close-btn');

    // Open settings modal
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });

    // Close settings modal
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
}

/**
 * Show a notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, warning, info)
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
