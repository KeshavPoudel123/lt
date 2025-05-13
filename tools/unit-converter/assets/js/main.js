// ===== UNIT CONVERTER SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the unit converter
    initUnitConverter();

    // Initialize settings
    initSettings();
});

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info')
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    if (!notification || !notificationMessage) return;

    // Reset classes
    notification.classList.remove('success', 'error', 'info');

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
 * Initialize the unit converter
 */
function initUnitConverter() {
    // Get DOM elements
    const categorySelect = document.getElementById('category');
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    const fromValueInput = document.getElementById('from-value');
    const resultElement = document.getElementById('result');
    const formulaElement = document.getElementById('formula');
    const swapBtn = document.getElementById('swap-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const historyContainer = document.getElementById('history-container');
    const decimalPlacesSelect = document.getElementById('decimal-places');
    const copyResultBtn = document.getElementById('copy-result-btn');

    // Initialize history from localStorage
    let conversionHistory = JSON.parse(localStorage.getItem('unitConverterHistory')) || [];
    updateHistoryDisplay();

    // Initialize decimal places from localStorage
    const savedDecimalPlaces = localStorage.getItem('unitConverterDecimalPlaces');
    if (savedDecimalPlaces && decimalPlacesSelect) {
        decimalPlacesSelect.value = savedDecimalPlaces;
    }

    // Populate category select
    if (categorySelect) {
        // Categories are already populated in HTML

        // Initialize units for the default category
        populateUnitSelects(categorySelect.value);

        // Category change event
        categorySelect.addEventListener('change', () => {
            populateUnitSelects(categorySelect.value);
            convert();
        });
    }

    // Unit change events
    if (fromUnitSelect) {
        fromUnitSelect.addEventListener('change', () => {
            convert();
        });
    }

    if (toUnitSelect) {
        toUnitSelect.addEventListener('change', () => {
            convert();
        });
    }

    // Value change event
    if (fromValueInput) {
        fromValueInput.addEventListener('input', () => {
            convert();
        });

        // Select all text on focus
        fromValueInput.addEventListener('focus', () => {
            fromValueInput.select();
        });
    }

    // Swap button click event
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            const fromUnit = fromUnitSelect.value;
            const toUnit = toUnitSelect.value;

            fromUnitSelect.value = toUnit;
            toUnitSelect.value = fromUnit;

            convert();

            // Get unit names for notification
            const categoryData = unitDefinitions[categorySelect.value];
            if (categoryData) {
                const fromUnitName = categoryData.units[toUnit].name;
                const toUnitName = categoryData.units[fromUnit].name;
                showNotification(`Swapped ${fromUnitName} and ${toUnitName}`, 'info');
            }
        });
    }

    // Clear history button click event
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            if (conversionHistory.length === 0) {
                showNotification('History is already empty', 'info');
                return;
            }

            conversionHistory = [];
            localStorage.removeItem('unitConverterHistory');
            updateHistoryDisplay();
            showNotification('Conversion history cleared', 'info');
        });
    }

    // Decimal places change event
    if (decimalPlacesSelect) {
        decimalPlacesSelect.addEventListener('change', () => {
            localStorage.setItem('unitConverterDecimalPlaces', decimalPlacesSelect.value);
            convert();
        });
    }

    // Copy result button click event
    if (copyResultBtn) {
        copyResultBtn.addEventListener('click', () => {
            if (!resultElement) return;

            const resultText = resultElement.textContent;

            // Use the modern clipboard API if available
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(resultText)
                    .then(() => {
                        showNotification('Result copied to clipboard', 'success');
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                        // Fallback to the older method
                        fallbackCopyToClipboard(resultText);
                    });
            } else {
                // Fallback for browsers that don't support the Clipboard API
                fallbackCopyToClipboard(resultText);
            }
        });
    }

    // Initial conversion
    convert();

    /**
     * Fallback method to copy text to clipboard
     * @param {string} text - Text to copy
     */
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';  // Prevent scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('Result copied to clipboard', 'success');
            } else {
                showNotification('Failed to copy result', 'error');
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy result', 'error');
        }

        document.body.removeChild(textArea);
    }

    /**
     * Populate unit select elements based on category
     * @param {string} category - The category to populate units for
     */
    function populateUnitSelects(category) {
        if (!fromUnitSelect || !toUnitSelect) return;

        // Clear existing options
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';

        // Get units for the selected category
        const categoryData = unitDefinitions[category];

        if (!categoryData) return;

        // Add options for each unit
        for (const [unitKey, unitData] of Object.entries(categoryData.units)) {
            const option = document.createElement('option');
            option.value = unitKey;
            option.textContent = `${unitData.name} (${unitData.symbol})`;

            fromUnitSelect.appendChild(option.cloneNode(true));
            toUnitSelect.appendChild(option);
        }

        // Set default selections
        if (fromUnitSelect.options.length > 0) {
            fromUnitSelect.selectedIndex = 0;
        }

        if (toUnitSelect.options.length > 1) {
            toUnitSelect.selectedIndex = 1;
        }
    }

    /**
     * Convert between units
     */
    function convert() {
        if (!categorySelect || !fromUnitSelect || !toUnitSelect || !fromValueInput || !resultElement) return;

        const category = categorySelect.value;
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        const fromValue = parseFloat(fromValueInput.value);

        if (isNaN(fromValue)) {
            resultElement.textContent = '0';
            formulaElement.textContent = '';
            return;
        }

        // Get category data
        const categoryData = unitDefinitions[category];

        if (!categoryData) return;

        // Calculate result
        let result;

        // Special case for temperature
        if (category === 'temperature' && categoryData.convert) {
            result = categoryData.convert(fromValue, fromUnit, toUnit);

            // Display formula
            if (categoryData.formula) {
                formulaElement.textContent = categoryData.formula(fromUnit, toUnit);
            }
        } else {
            // Standard conversion using factors
            const fromFactor = categoryData.units[fromUnit].factor;
            const toFactor = categoryData.units[toUnit].factor;

            result = (fromValue * fromFactor) / toFactor;

            // Display formula
            const fromSymbol = categoryData.units[fromUnit].symbol;
            const toSymbol = categoryData.units[toUnit].symbol;
            formulaElement.textContent = `${toSymbol} = ${fromSymbol} × ${fromFactor} ÷ ${toFactor}`;
        }

        // Get decimal places
        const decimalPlaces = parseInt(decimalPlacesSelect ? decimalPlacesSelect.value : 2);

        // Format result
        const formattedResult = result.toLocaleString(undefined, {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
        });

        // Display result
        resultElement.textContent = formattedResult;

        // Add to history
        addToHistory(category, fromUnit, toUnit, fromValue, result);
    }

    /**
     * Add conversion to history
     * @param {string} category - Conversion category
     * @param {string} fromUnit - From unit
     * @param {string} toUnit - To unit
     * @param {number} fromValue - From value
     * @param {number} result - Result value
     */
    function addToHistory(category, fromUnit, toUnit, fromValue, result) {
        // Get category and unit data
        const categoryData = unitDefinitions[category];

        if (!categoryData) return;

        const fromUnitData = categoryData.units[fromUnit];
        const toUnitData = categoryData.units[toUnit];

        if (!fromUnitData || !toUnitData) return;

        // Create history item
        const historyItem = {
            category,
            categoryName: categoryData.name,
            fromUnit,
            fromUnitName: fromUnitData.name,
            fromUnitSymbol: fromUnitData.symbol,
            toUnit,
            toUnitName: toUnitData.name,
            toUnitSymbol: toUnitData.symbol,
            fromValue,
            result,
            timestamp: new Date().toISOString()
        };

        // Check if this conversion is already in history
        const existingIndex = conversionHistory.findIndex(item =>
            item.category === category &&
            item.fromUnit === fromUnit &&
            item.toUnit === toUnit &&
            item.fromValue === fromValue
        );

        if (existingIndex !== -1) {
            // Remove existing item
            conversionHistory.splice(existingIndex, 1);
        }

        // Add to history
        conversionHistory.unshift(historyItem);

        // Limit history to 10 items
        if (conversionHistory.length > 10) {
            conversionHistory.pop();
        }

        // Save to localStorage
        localStorage.setItem('unitConverterHistory', JSON.stringify(conversionHistory));

        // Update display
        updateHistoryDisplay();
    }

    /**
     * Update history display
     */
    function updateHistoryDisplay() {
        if (!historyContainer) return;

        if (conversionHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <p>No recent conversions</p>
                </div>
            `;
            return;
        }

        let html = '';

        conversionHistory.forEach(item => {
            // Get decimal places
            const decimalPlaces = parseInt(decimalPlacesSelect ? decimalPlacesSelect.value : 2);

            // Format values
            const fromValueFormatted = item.fromValue.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: decimalPlaces
            });

            const resultFormatted = item.result.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: decimalPlaces
            });

            html += `
                <div class="history-item" data-category="${item.category}" data-from-unit="${item.fromUnit}" data-to-unit="${item.toUnit}" data-from-value="${item.fromValue}">
                    <div class="history-conversion">
                        <span class="history-from">${fromValueFormatted} ${item.fromUnitSymbol}</span>
                        <span class="history-arrow">→</span>
                        <span class="history-to">${resultFormatted} ${item.toUnitSymbol}</span>
                    </div>
                    <div class="history-category">${item.categoryName}</div>
                </div>
            `;
        });

        historyContainer.innerHTML = html;

        // Add click event to history items
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const category = item.getAttribute('data-category');
                const fromUnit = item.getAttribute('data-from-unit');
                const toUnit = item.getAttribute('data-to-unit');
                const fromValue = parseFloat(item.getAttribute('data-from-value'));

                // Set values
                categorySelect.value = category;
                populateUnitSelects(category);
                fromUnitSelect.value = fromUnit;
                toUnitSelect.value = toUnit;
                fromValueInput.value = fromValue;

                // Convert
                convert();

                // Show notification
                const categoryData = unitDefinitions[category];
                if (categoryData) {
                    const categoryName = categoryData.name;
                    showNotification(`Loaded ${categoryName} conversion from history`, 'info');
                }
            });
        });
    }
}
