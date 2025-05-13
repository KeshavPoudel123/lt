// CSS Grid Generator

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const gridPreview = document.getElementById('grid-preview');
    const cssOutput = document.getElementById('css-output');
    const rowsInput = document.getElementById('grid-rows');
    const columnsInput = document.getElementById('grid-columns');
    const rowGapInput = document.getElementById('row-gap');
    const rowGapUnitSelect = document.getElementById('row-gap-unit');
    const columnGapInput = document.getElementById('column-gap');
    const columnGapUnitSelect = document.getElementById('column-gap-unit');
    const containerWidthInput = document.getElementById('container-width');
    const containerWidthUnitSelect = document.getElementById('container-width-unit');
    const containerHeightInput = document.getElementById('container-height');
    const containerHeightUnitSelect = document.getElementById('container-height-unit');
    const decreaseRowsBtn = document.getElementById('decrease-rows');
    const increaseRowsBtn = document.getElementById('increase-rows');
    const decreaseColumnsBtn = document.getElementById('decrease-columns');
    const increaseColumnsBtn = document.getElementById('increase-columns');
    const toggleNumbersBtn = document.getElementById('toggle-numbers');
    const toggleLinesBtn = document.getElementById('toggle-lines');
    const exportGridBtn = document.getElementById('export-grid');
    const copyCssBtn = document.getElementById('copy-css');
    const templateButtons = document.querySelectorAll('.template-buttons .btn');
    const showGridLinesCheckbox = document.getElementById('show-grid-lines');
    const includePrefixesCheckbox = document.getElementById('include-prefixes');
    const minifyCssCheckbox = document.getElementById('minify-css');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    // State
    let state = {
        rows: 3,
        columns: 3,
        rowGap: 10,
        rowGapUnit: 'px',
        columnGap: 10,
        columnGapUnit: 'px',
        containerWidth: 500,
        containerWidthUnit: 'px',
        containerHeight: 300,
        containerHeightUnit: 'px',
        showNumbers: true,
        showGridLines: true,
        includePrefixes: true,
        minifyCss: false,
        selectedCells: []
    };

    // Initialize
    function init() {
        updateGridPreview();
        generateCssCode();
        setupEventListeners();
        loadSettings();
    }

    // Update Grid Preview
    function updateGridPreview() {
        // Clear existing grid
        gridPreview.innerHTML = '';

        // Update grid styles
        gridPreview.style.gridTemplateRows = `repeat(${state.rows}, 1fr)`;
        gridPreview.style.gridTemplateColumns = `repeat(${state.columns}, 1fr)`;
        gridPreview.style.gap = `${state.rowGap}${state.rowGapUnit} ${state.columnGap}${state.columnGapUnit}`;
        gridPreview.style.width = `${state.containerWidth}${state.containerWidthUnit}`;
        gridPreview.style.height = `${state.containerHeight}${state.containerHeightUnit}`;

        // Create grid cells
        const totalCells = state.rows * state.columns;
        for (let i = 1; i <= totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.index = i;

            if (state.showNumbers) {
                cell.textContent = i;
            }

            cell.addEventListener('click', () => toggleCellSelection(cell));
            gridPreview.appendChild(cell);
        }

        // Update grid lines visibility
        if (state.showGridLines) {
            gridPreview.classList.add('grid-lines-visible');
        } else {
            gridPreview.classList.remove('grid-lines-visible');
        }
    }

    // Toggle Cell Selection
    function toggleCellSelection(cell) {
        cell.classList.toggle('selected');
        const index = cell.dataset.index;

        if (cell.classList.contains('selected')) {
            if (!state.selectedCells.includes(index)) {
                state.selectedCells.push(index);
            }
        } else {
            state.selectedCells = state.selectedCells.filter(i => i !== index);
        }

        generateCssCode();
    }

    // Generate CSS Code
    function generateCssCode() {
        let css = '';
        const indent = state.minifyCss ? '' : '    ';
        const newLine = state.minifyCss ? '' : '\n';

        // Container CSS
        css += '.grid-container {' + newLine;
        css += indent + 'display: grid;' + newLine;
        css += indent + `grid-template-rows: repeat(${state.rows}, 1fr);` + newLine;
        css += indent + `grid-template-columns: repeat(${state.columns}, 1fr);` + newLine;
        css += indent + `gap: ${state.rowGap}${state.rowGapUnit} ${state.columnGap}${state.columnGapUnit};` + newLine;
        css += indent + `width: ${state.containerWidth}${state.containerWidthUnit};` + newLine;
        css += indent + `height: ${state.containerHeight}${state.containerHeightUnit};` + newLine;

        if (state.includePrefixes) {
            css += indent + '-ms-grid-rows: ' + ('1fr '.repeat(state.rows)).trim() + ';' + newLine;
            css += indent + '-ms-grid-columns: ' + ('1fr '.repeat(state.columns)).trim() + ';' + newLine;
        }

        css += '}' + newLine + newLine;

        // Selected cells CSS
        if (state.selectedCells.length > 0) {
            css += '/* Grid Items */' + newLine;
            state.selectedCells.forEach(index => {
                const cellNumber = parseInt(index);
                const row = Math.ceil(cellNumber / state.columns);
                const column = ((cellNumber - 1) % state.columns) + 1;

                css += `.grid-item-${cellNumber} {` + newLine;
                css += indent + `grid-row: ${row};` + newLine;
                css += indent + `grid-column: ${column};` + newLine;

                if (state.includePrefixes) {
                    css += indent + `-ms-grid-row: ${row};` + newLine;
                    css += indent + `-ms-grid-column: ${column};` + newLine;
                }

                css += '}' + newLine + newLine;
            });
        }

        cssOutput.textContent = css;
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Dimension controls
        rowsInput.addEventListener('change', () => {
            state.rows = clamp(parseInt(rowsInput.value) || 1, 1, 12);
            rowsInput.value = state.rows;
            updateGridPreview();
            generateCssCode();
        });

        columnsInput.addEventListener('change', () => {
            state.columns = clamp(parseInt(columnsInput.value) || 1, 1, 12);
            columnsInput.value = state.columns;
            updateGridPreview();
            generateCssCode();
        });

        decreaseRowsBtn.addEventListener('click', () => {
            if (state.rows > 1) {
                state.rows--;
                rowsInput.value = state.rows;
                updateGridPreview();
                generateCssCode();
            }
        });

        increaseRowsBtn.addEventListener('click', () => {
            if (state.rows < 12) {
                state.rows++;
                rowsInput.value = state.rows;
                updateGridPreview();
                generateCssCode();
            }
        });

        decreaseColumnsBtn.addEventListener('click', () => {
            if (state.columns > 1) {
                state.columns--;
                columnsInput.value = state.columns;
                updateGridPreview();
                generateCssCode();
            }
        });

        increaseColumnsBtn.addEventListener('click', () => {
            if (state.columns < 12) {
                state.columns++;
                columnsInput.value = state.columns;
                updateGridPreview();
                generateCssCode();
            }
        });

        // Gap controls
        rowGapInput.addEventListener('change', () => {
            state.rowGap = clamp(parseInt(rowGapInput.value) || 0, 0, 100);
            rowGapInput.value = state.rowGap;
            updateGridPreview();
            generateCssCode();
        });

        rowGapUnitSelect.addEventListener('change', () => {
            state.rowGapUnit = rowGapUnitSelect.value;
            updateGridPreview();
            generateCssCode();
        });

        columnGapInput.addEventListener('change', () => {
            state.columnGap = clamp(parseInt(columnGapInput.value) || 0, 0, 100);
            columnGapInput.value = state.columnGap;
            updateGridPreview();
            generateCssCode();
        });

        columnGapUnitSelect.addEventListener('change', () => {
            state.columnGapUnit = columnGapUnitSelect.value;
            updateGridPreview();
            generateCssCode();
        });

        // Container controls
        containerWidthInput.addEventListener('change', () => {
            state.containerWidth = clamp(parseInt(containerWidthInput.value) || 100, 100, 2000);
            containerWidthInput.value = state.containerWidth;
            updateGridPreview();
            generateCssCode();
        });

        containerWidthUnitSelect.addEventListener('change', () => {
            state.containerWidthUnit = containerWidthUnitSelect.value;
            updateGridPreview();
            generateCssCode();
        });

        containerHeightInput.addEventListener('change', () => {
            state.containerHeight = clamp(parseInt(containerHeightInput.value) || 100, 100, 2000);
            containerHeightInput.value = state.containerHeight;
            updateGridPreview();
            generateCssCode();
        });

        containerHeightUnitSelect.addEventListener('change', () => {
            state.containerHeightUnit = containerHeightUnitSelect.value;
            updateGridPreview();
            generateCssCode();
        });

        // Toggle buttons
        toggleNumbersBtn.addEventListener('click', () => {
            state.showNumbers = !state.showNumbers;
            updateGridPreview();
        });

        toggleLinesBtn.addEventListener('click', () => {
            state.showGridLines = !state.showGridLines;
            showGridLinesCheckbox.checked = state.showGridLines;
            saveSettings();
            updateGridPreview();
        });

        // Export grid as image
        exportGridBtn.addEventListener('click', exportGridAsImage);

        // Copy CSS button
        copyCssBtn.addEventListener('click', () => {
            const css = cssOutput.textContent;

            // Use the modern clipboard API if available
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(css)
                    .then(() => {
                        showNotification('CSS copied to clipboard!', 'success');
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                        // Fallback to the older method
                        fallbackCopyToClipboard(css);
                    });
            } else {
                // Fallback for browsers that don't support the Clipboard API
                fallbackCopyToClipboard(css);
            }
        });

    // Fallback method to copy text to clipboard
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
                showNotification('CSS copied to clipboard!', 'success');
            } else {
                showNotification('Failed to copy text', 'error');
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy text', 'error');
        }

        document.body.removeChild(textArea);
    }

        // Template buttons
        templateButtons.forEach(button => {
            button.addEventListener('click', () => {
                const template = button.dataset.template;
                applyTemplate(template);
            });
        });

        // Settings
        showGridLinesCheckbox.addEventListener('change', () => {
            state.showGridLines = showGridLinesCheckbox.checked;
            saveSettings();
            updateGridPreview();
        });

        includePrefixesCheckbox.addEventListener('change', () => {
            state.includePrefixes = includePrefixesCheckbox.checked;
            saveSettings();
            generateCssCode();
        });

        minifyCssCheckbox.addEventListener('change', () => {
            state.minifyCss = minifyCssCheckbox.checked;
            saveSettings();
            generateCssCode();
        });
    }

    // Apply Template
    function applyTemplate(template) {
        state.selectedCells = [];

        switch (template) {
            case 'basic':
                state.rows = 3;
                state.columns = 3;
                break;

            case 'holy-grail':
                state.rows = 3;
                state.columns = 3;
                state.selectedCells = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
                break;

            case 'dashboard':
                state.rows = 4;
                state.columns = 4;
                state.selectedCells = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
                break;

            case 'gallery':
                state.rows = 3;
                state.columns = 4;
                state.selectedCells = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
                break;

            case 'responsive':
                state.rows = 3;
                state.columns = 6;
                state.containerWidth = 100;
                state.containerWidthUnit = '%';
                state.rowGap = 1;
                state.rowGapUnit = 'rem';
                state.columnGap = 1;
                state.columnGapUnit = 'rem';
                state.selectedCells = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];

                // Update input values
                containerWidthInput.value = state.containerWidth;
                containerWidthUnitSelect.value = state.containerWidthUnit;
                rowGapInput.value = state.rowGap;
                rowGapUnitSelect.value = state.rowGapUnit;
                columnGapInput.value = state.columnGap;
                columnGapUnitSelect.value = state.columnGapUnit;
                break;

            case 'masonry':
                state.rows = 6;
                state.columns = 4;
                state.rowGap = 10;
                state.rowGapUnit = 'px';
                state.columnGap = 10;
                state.columnGapUnit = 'px';

                // Create a masonry-like layout with different cell sizes
                state.selectedCells = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];

                // Update input values
                rowGapInput.value = state.rowGap;
                rowGapUnitSelect.value = state.rowGapUnit;
                columnGapInput.value = state.columnGap;
                columnGapUnitSelect.value = state.columnGapUnit;
                break;
        }

        rowsInput.value = state.rows;
        columnsInput.value = state.columns;

        updateGridPreview();
        generateCssCode();

        // Select cells in the UI
        setTimeout(() => {
            state.selectedCells.forEach(index => {
                const cell = document.querySelector(`.grid-cell[data-index="${index}"]`);
                if (cell) {
                    cell.classList.add('selected');
                }
            });

            // For masonry template, add special styling to some cells
            if (template === 'masonry') {
                // Make some cells span multiple rows or columns
                const specialCells = {
                    '1': { gridRow: '1 / span 2', gridColumn: '1 / span 2' },
                    '4': { gridRow: '1 / span 2', gridColumn: '4 / span 1' },
                    '7': { gridRow: '3 / span 1', gridColumn: '3 / span 2' },
                    '13': { gridRow: '4 / span 2', gridColumn: '1 / span 1' },
                    '18': { gridRow: '5 / span 2', gridColumn: '2 / span 2' }
                };

                for (const [index, styles] of Object.entries(specialCells)) {
                    const cell = document.querySelector(`.grid-cell[data-index="${index}"]`);
                    if (cell) {
                        for (const [property, value] of Object.entries(styles)) {
                            cell.style[property] = value;
                        }
                    }
                }
            }
        }, 100);

        showNotification(`Applied ${template} template`, 'info');
    }

    // Show Notification
    function showNotification(message, type = 'success') {
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

    // Save Settings
    function saveSettings() {
        const settings = {
            showGridLines: state.showGridLines,
            includePrefixes: state.includePrefixes,
            minifyCss: state.minifyCss
        };

        localStorage.setItem('cssGridGeneratorSettings', JSON.stringify(settings));
    }

    // Load Settings
    function loadSettings() {
        const savedSettings = localStorage.getItem('cssGridGeneratorSettings');

        if (savedSettings) {
            const settings = JSON.parse(savedSettings);

            state.showGridLines = settings.showGridLines !== undefined ? settings.showGridLines : true;
            state.includePrefixes = settings.includePrefixes !== undefined ? settings.includePrefixes : true;
            state.minifyCss = settings.minifyCss !== undefined ? settings.minifyCss : false;

            showGridLinesCheckbox.checked = state.showGridLines;
            includePrefixesCheckbox.checked = state.includePrefixes;
            minifyCssCheckbox.checked = state.minifyCss;

            updateGridPreview();
            generateCssCode();
        }
    }

    // Helper function to clamp a value between min and max
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Export grid as image
    function exportGridAsImage() {
        // Check if html2canvas is available
        if (typeof html2canvas === 'undefined') {
            showNotification('html2canvas library not available', 'error');
            return;
        }

        try {
            // Create a clone of the grid preview to avoid modifying the original
            const gridClone = gridPreview.cloneNode(true);

            // Apply some styling to make it look better in the image
            gridClone.style.backgroundColor = 'white';
            gridClone.style.color = 'black';
            gridClone.style.border = '1px solid #ccc';

            // Temporarily append to document to capture
            gridClone.style.position = 'absolute';
            gridClone.style.left = '-9999px';
            document.body.appendChild(gridClone);

            // Use html2canvas to capture the grid
            html2canvas(gridClone).then(canvas => {
                // Remove the clone
                document.body.removeChild(gridClone);

                // Convert canvas to image and download
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `css-grid-${state.rows}x${state.columns}-${new Date().getTime()}.png`;
                link.click();

                showNotification('Grid exported as image', 'success');
            }).catch(error => {
                console.error('Error exporting grid:', error);
                showNotification('Error exporting grid: ' + error.message, 'error');

                // Remove the clone if there was an error
                if (document.body.contains(gridClone)) {
                    document.body.removeChild(gridClone);
                }
            });
        } catch (error) {
            console.error('Error exporting grid:', error);
            showNotification('Error exporting grid: ' + error.message, 'error');
        }
    }

    // Initialize the app
    init();
});
