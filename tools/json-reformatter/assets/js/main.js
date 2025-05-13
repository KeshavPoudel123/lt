/**
 * JSON Reformatter - Advanced JSON Tool
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Tabs
    const formatterTab = document.getElementById('formatter-tab');
    const validatorTab = document.getElementById('validator-tab');
    const treeViewTab = document.getElementById('tree-view-tab');
    const converterTab = document.getElementById('converter-tab');

    // DOM Elements - Option Groups
    const formatterOptions = document.getElementById('formatter-options');
    const validatorOptions = document.getElementById('validator-options');
    const treeViewOptions = document.getElementById('tree-view-options');
    const converterOptions = document.getElementById('converter-options');

    // DOM Elements - Output Views
    const formatterOutput = document.getElementById('formatter-output');
    const validatorOutput = document.getElementById('validator-output');
    const treeViewOutput = document.getElementById('tree-view-output');
    const converterOutput = document.getElementById('converter-output');

    // DOM Elements - Input/Output
    const inputJson = document.getElementById('input-json');
    const formattedOutput = document.getElementById('formatted-output');
    const convertedOutput = document.getElementById('converted-output');
    const jsonTree = document.getElementById('json-tree');

    // DOM Elements - Validation
    const validationIcon = document.getElementById('validation-icon');
    const validationMessage = document.getElementById('validation-message');
    const validationDetails = document.getElementById('validation-details');

    // DOM Elements - Buttons
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const uploadBtn = document.getElementById('upload-btn');
    const fileUpload = document.getElementById('file-upload');
    const processBtn = document.getElementById('process-btn');
    const resetBtn = document.getElementById('reset-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');

    // DOM Elements - Settings
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeButtons = document.querySelectorAll('.close-btn');
    const darkModeToggle = document.getElementById('dark-mode');
    const fontSizeSelect = document.getElementById('font-size');
    const wordWrapToggle = document.getElementById('word-wrap');

    // DOM Elements - Formatter Options
    const indentSize = document.getElementById('indent-size');
    const sortKeys = document.getElementById('sort-keys');
    const escapeUnicode = document.getElementById('escape-unicode');

    // DOM Elements - Validator Options
    const showLineNumbers = document.getElementById('show-line-numbers');
    const highlightErrors = document.getElementById('highlight-errors');
    const autoFix = document.getElementById('auto-fix');

    // DOM Elements - Tree View Options
    const expandAll = document.getElementById('expand-all');
    const showDataTypes = document.getElementById('show-data-types');
    const showArrayIndices = document.getElementById('show-array-indices');

    // DOM Elements - Converter Options
    const outputFormat = document.getElementById('output-format');
    const includeHeader = document.getElementById('include-header');
    const prettyOutput = document.getElementById('pretty-output');

    // Current active tab
    let activeTab = 'formatter';

    // Initialize the application
    function init() {
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Tab switching
        formatterTab.addEventListener('click', () => switchTab('formatter'));
        validatorTab.addEventListener('click', () => switchTab('validator'));
        treeViewTab.addEventListener('click', () => switchTab('tree-view'));
        converterTab.addEventListener('click', () => switchTab('converter'));

        // Input actions
        clearBtn.addEventListener('click', clearInput);
        sampleBtn.addEventListener('click', loadSampleJson);
        pasteBtn.addEventListener('click', pasteFromClipboard);
        uploadBtn.addEventListener('click', () => fileUpload.click());
        fileUpload.addEventListener('change', handleFileUpload);

        // Process actions
        processBtn.addEventListener('click', processJson);
        resetBtn.addEventListener('click', resetTool);
        copyBtn.addEventListener('click', copyToClipboard);
        downloadBtn.addEventListener('click', downloadOutput);

        // Settings
        settingsBtn.addEventListener('click', openSettingsModal);
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModals);
        });
        darkModeToggle.addEventListener('change', toggleDarkMode);
        fontSizeSelect.addEventListener('change', updateFontSize);
        wordWrapToggle.addEventListener('change', toggleWordWrap);

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                closeModals();
            }
        });

        // Tree view options
        expandAll.addEventListener('change', updateTreeView);
        showDataTypes.addEventListener('change', updateTreeView);
        showArrayIndices.addEventListener('change', updateTreeView);
    }

    // Switch between tabs
    function switchTab(tab) {
        // Update active tab
        activeTab = tab;

        // Update tab buttons
        formatterTab.classList.toggle('active', tab === 'formatter');
        validatorTab.classList.toggle('active', tab === 'validator');
        treeViewTab.classList.toggle('active', tab === 'tree-view');
        converterTab.classList.toggle('active', tab === 'converter');

        // Update option groups
        formatterOptions.classList.toggle('active', tab === 'formatter');
        validatorOptions.classList.toggle('active', tab === 'validator');
        treeViewOptions.classList.toggle('active', tab === 'tree-view');
        converterOptions.classList.toggle('active', tab === 'converter');

        // Update output views
        formatterOutput.classList.toggle('active', tab === 'formatter');
        validatorOutput.classList.toggle('active', tab === 'validator');
        treeViewOutput.classList.toggle('active', tab === 'tree-view');
        converterOutput.classList.toggle('active', tab === 'converter');
    }

    // Clear input
    function clearInput() {
        inputJson.value = '';
        formattedOutput.value = '';
        convertedOutput.value = '';
        jsonTree.innerHTML = '';
        validationMessage.textContent = 'Enter JSON to validate';
        validationIcon.className = 'validation-icon';
        validationDetails.innerHTML = '';
    }

    // Load sample JSON
    function loadSampleJson() {
        inputJson.value = `{
  "name": "Latest Online Tools",
  "version": "1.0.0",
  "description": "A collection of useful online tools",
  "tools": [
    {
      "id": "json-reformatter",
      "name": "JSON Reformatter",
      "description": "Advanced JSON tool with validation, tree view, and conversion",
      "category": "Developer Tools",
      "isNew": true,
      "features": ["Formatting", "Validation", "Tree View", "Conversion"]
    },
    {
      "id": "word-counter",
      "name": "Word Counter",
      "description": "Count words, characters, and analyze text",
      "category": "Text Tools",
      "isNew": false,
      "features": ["Word Count", "Character Count", "Reading Time"]
    },
    {
      "id": "qr-generator",
      "name": "QR Code Generator",
      "description": "Generate QR codes for URLs, text, and vCards",
      "category": "Generators",
      "isNew": false,
      "features": ["URL Encoding", "vCard Support", "Customization"]
    }
  ],
  "settings": {
    "theme": "dark",
    "language": "en",
    "notifications": true,
    "analytics": {
      "enabled": false,
      "anonymized": true
    }
  },
  "stats": {
    "users": 10000,
    "pageViews": 50000,
    "toolsUsed": 25000
  }
}`;
    }

    // Paste from clipboard
    function pasteFromClipboard() {
        navigator.clipboard.readText()
            .then(text => {
                inputJson.value = text;
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
                showNotification('Error accessing clipboard. Please paste manually.', 'error');
            });
    }

    // Handle file upload
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            inputJson.value = event.target.result;
        };
        reader.readAsText(file);

        // Reset file input
        fileUpload.value = '';
    }

    // Process JSON based on active tab
    function processJson() {
        const input = inputJson.value;

        if (!input) {
            showNotification('Please enter JSON to process.', 'warning');
            return;
        }

        try {
            // Parse JSON
            let jsonObj;
            try {
                jsonObj = JSON.parse(input);
            } catch (error) {
                if (activeTab === 'validator') {
                    showValidationError(error);
                    return;
                } else if (autoFix.checked) {
                    // Try to fix common JSON errors
                    const fixedJson = fixJsonErrors(input);
                    try {
                        jsonObj = JSON.parse(fixedJson);
                        showNotification('JSON was automatically fixed.', 'warning');
                    } catch (fixError) {
                        showNotification('Could not parse JSON. Please check for syntax errors.', 'error');
                        return;
                    }
                } else {
                    showNotification('Could not parse JSON. Please check for syntax errors.', 'error');
                    return;
                }
            }

            // Process based on active tab
            switch(activeTab) {
                case 'formatter':
                    formatJson(jsonObj);
                    break;
                case 'validator':
                    validateJson(jsonObj);
                    break;
                case 'tree-view':
                    generateTreeView(jsonObj);
                    break;
                case 'converter':
                    convertJson(jsonObj);
                    break;
            }

            showNotification('JSON processed successfully!', 'success');
        } catch (error) {
            console.error('Error processing JSON:', error);
            showNotification('Error processing JSON. Please check your input.', 'error');
        }
    }

    // Format JSON
    function formatJson(jsonObj) {
        // Get formatter options
        const indent = indentSize.value === 'tab' ? '\t' : ' '.repeat(parseInt(indentSize.value));
        const shouldSortKeys = sortKeys.checked;
        const shouldEscapeUnicode = escapeUnicode.checked;

        // Sort keys if needed
        if (shouldSortKeys) {
            jsonObj = sortObjectKeys(jsonObj);
        }

        // Format JSON
        const formatted = JSON.stringify(jsonObj, null, indent);

        // Escape Unicode if needed
        const output = shouldEscapeUnicode ? escapeUnicodeCharacters(formatted) : formatted;

        // Update output
        formattedOutput.value = output;
    }

    // Sort object keys recursively
    function sortObjectKeys(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(sortObjectKeys);
        }

        return Object.keys(obj)
            .sort()
            .reduce((result, key) => {
                result[key] = sortObjectKeys(obj[key]);
                return result;
            }, {});
    }

    // Escape Unicode characters
    function escapeUnicodeCharacters(str) {
        return str.replace(/[\u007F-\uFFFF]/g, function(char) {
            return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
        });
    }

    // Validate JSON
    function validateJson(jsonObj) {
        // Clear previous validation results
        validationDetails.innerHTML = '';

        // Show success message
        validationIcon.className = 'validation-icon valid';
        validationIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        validationMessage.textContent = 'JSON is valid';
    }

    // Show validation error
    function showValidationError(error) {
        validationIcon.className = 'validation-icon invalid';
        validationIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
        validationMessage.textContent = 'JSON is invalid';

        // Extract line and column from error message
        const errorMessage = error.message;
        const lineMatch = errorMessage.match(/line (\d+)/);
        const columnMatch = errorMessage.match(/column (\d+)/);

        const line = lineMatch ? lineMatch[1] : 'unknown';
        const column = columnMatch ? columnMatch[1] : 'unknown';

        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'validation-error';
        errorElement.innerHTML = `
            <div>${errorMessage}</div>
            <div class="error-location">at line ${line}, column ${column}</div>
        `;

        validationDetails.appendChild(errorElement);
    }

    // Fix common JSON errors
    function fixJsonErrors(json) {
        // Replace single quotes with double quotes
        let fixed = json.replace(/'/g, '"');

        // Add missing quotes around property names
        fixed = fixed.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

        // Remove trailing commas
        fixed = fixed.replace(/,\s*([}\]])/g, '$1');

        return fixed;
    }

    // Generate tree view
    function generateTreeView(jsonObj) {
        // Clear previous tree
        jsonTree.innerHTML = '';

        // Generate tree
        const tree = createJsonTreeNode(jsonObj, '', true);
        jsonTree.appendChild(tree);
    }

    // Create JSON tree node
    function createJsonTreeNode(value, key, isRoot = false) {
        const container = document.createElement('div');
        container.className = isRoot ? 'tree-root' : 'tree-node';

        const valueType = typeof value;
        const isArray = Array.isArray(value);
        const isObject = valueType === 'object' && value !== null && !isArray;

        // Create node content
        if (isArray || isObject) {
            // Create expandable node
            const toggle = document.createElement('span');
            toggle.className = 'tree-toggle';
            toggle.innerHTML = expandAll.checked ? '&#9660;' : '&#9654;';
            toggle.addEventListener('click', function() {
                const isExpanded = this.innerHTML === '&#9660;';
                this.innerHTML = isExpanded ? '&#9654;' : '&#9660;';
                const children = container.querySelector('.tree-children');
                children.classList.toggle('expanded', !isExpanded);
            });

            container.appendChild(toggle);

            // Add key if not root
            if (!isRoot && key !== '') {
                const keyElement = document.createElement('span');
                keyElement.className = 'tree-key';
                keyElement.textContent = key;
                container.appendChild(keyElement);

                const colon = document.createElement('span');
                colon.className = 'tree-colon';
                colon.textContent = ':';
                container.appendChild(colon);
            }

            // Add type indicator
            const typeText = isArray ? 'Array' : 'Object';
            const length = isArray ? value.length : Object.keys(value).length;

            const valueElement = document.createElement('span');
            valueElement.className = 'tree-value';
            valueElement.textContent = `${isArray ? '[' : '{'} ${length} ${length === 1 ? (isArray ? 'item' : 'property') : (isArray ? 'items' : 'properties')} ${isArray ? ']' : '}'}`;
            container.appendChild(valueElement);

            if (showDataTypes.checked) {
                const typeElement = document.createElement('span');
                typeElement.className = 'tree-type';
                typeElement.textContent = typeText;
                container.appendChild(typeElement);
            }

            // Create children container
            const children = document.createElement('div');
            children.className = 'tree-children';
            if (expandAll.checked) {
                children.classList.add('expanded');
            }

            // Add children
            if (isArray) {
                value.forEach((item, index) => {
                    const childKey = showArrayIndices.checked ? `[${index}]` : '';
                    const childNode = createJsonTreeNode(item, childKey);
                    children.appendChild(childNode);
                });
            } else {
                Object.keys(value).forEach(objKey => {
                    const childNode = createJsonTreeNode(value[objKey], objKey);
                    children.appendChild(childNode);
                });
            }

            container.appendChild(children);
        } else {
            // Create leaf node
            if (!isRoot && key !== '') {
                const keyElement = document.createElement('span');
                keyElement.className = 'tree-key';
                keyElement.textContent = key;
                container.appendChild(keyElement);

                const colon = document.createElement('span');
                colon.className = 'tree-colon';
                colon.textContent = ':';
                container.appendChild(colon);
            }

            const valueElement = document.createElement('span');
            valueElement.className = `tree-value ${valueType}`;

            if (value === null) {
                valueElement.textContent = 'null';
                valueElement.className = 'tree-value null';
            } else if (valueType === 'string') {
                valueElement.textContent = `"${value}"`;
            } else {
                valueElement.textContent = String(value);
            }

            container.appendChild(valueElement);

            if (showDataTypes.checked) {
                const typeElement = document.createElement('span');
                typeElement.className = 'tree-type';
                typeElement.textContent = value === null ? 'null' : valueType;
                container.appendChild(typeElement);
            }
        }

        return container;
    }

    // Update tree view based on options
    function updateTreeView() {
        // Only update if tree view is active and there's data
        if (activeTab === 'tree-view' && jsonTree.innerHTML !== '') {
            const jsonObj = JSON.parse(inputJson.value);
            generateTreeView(jsonObj);
        }
    }

    // Convert JSON to other formats
    function convertJson(jsonObj) {
        const format = outputFormat.value;
        const pretty = prettyOutput.checked;
        let result = '';

        switch(format) {
            case 'xml':
                result = jsonToXml(jsonObj, pretty);
                break;
            case 'yaml':
                result = jsonToYaml(jsonObj);
                break;
            case 'csv':
                result = jsonToCsv(jsonObj, ',', includeHeader.checked);
                break;
            case 'tsv':
                result = jsonToCsv(jsonObj, '\t', includeHeader.checked);
                break;
        }

        convertedOutput.value = result;
    }

    // Convert JSON to XML
    function jsonToXml(jsonObj, pretty) {
        const indent = pretty ? '  ' : '';
        const newline = pretty ? '\n' : '';

        function parseObject(obj, nodeName, level) {
            const currentIndent = indent.repeat(level);
            let xml = `${currentIndent}<${nodeName}>${newline}`;

            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];

                    if (typeof value === 'object' && value !== null) {
                        if (Array.isArray(value)) {
                            xml += `${currentIndent}${indent}<${key}s>${newline}`;
                            for (const item of value) {
                                if (typeof item === 'object' && item !== null) {
                                    xml += parseObject(item, key, level + 2);
                                } else {
                                    xml += `${currentIndent}${indent}${indent}<${key}>${item}</${key}>${newline}`;
                                }
                            }
                            xml += `${currentIndent}${indent}</${key}s>${newline}`;
                        } else {
                            xml += parseObject(value, key, level + 1);
                        }
                    } else {
                        xml += `${currentIndent}${indent}<${key}>${value}</${key}>${newline}`;
                    }
                }
            }

            xml += `${currentIndent}</${nodeName}>${newline}`;
            return xml;
        }

        return `<?xml version="1.0" encoding="UTF-8"?>${newline}${parseObject(jsonObj, 'root', 0)}`;
    }

    // Convert JSON to YAML
    function jsonToYaml(jsonObj) {
        return jsyaml.dump(jsonObj);
    }

    // Convert JSON to CSV/TSV
    function jsonToCsv(jsonObj, delimiter, includeHeader) {
        // Handle array of objects
        if (Array.isArray(jsonObj) && jsonObj.length > 0 && typeof jsonObj[0] === 'object') {
            return Papa.unparse(jsonObj, {
                delimiter: delimiter,
                header: includeHeader
            });
        }

        // Handle single object
        if (typeof jsonObj === 'object' && !Array.isArray(jsonObj)) {
            const rows = [Object.keys(jsonObj)];
            rows.push(Object.values(jsonObj).map(value => {
                if (typeof value === 'object') {
                    return JSON.stringify(value);
                }
                return value;
            }));

            return Papa.unparse({
                fields: includeHeader ? rows[0] : [],
                data: includeHeader ? [rows[1]] : rows
            }, {
                delimiter: delimiter
            });
        }

        // Handle other cases
        return 'Cannot convert this JSON structure to CSV/TSV. Please use an array of objects or a simple object.';
    }

    // Reset tool
    function resetTool() {
        clearInput();

        // Reset to formatter tab
        switchTab('formatter');

        // Reset options to defaults
        indentSize.value = '4';
        sortKeys.checked = true;
        escapeUnicode.checked = false;

        showLineNumbers.checked = true;
        highlightErrors.checked = true;
        autoFix.checked = true;

        expandAll.checked = true;
        showDataTypes.checked = true;
        showArrayIndices.checked = true;

        outputFormat.value = 'xml';
        includeHeader.checked = true;
        prettyOutput.checked = true;
    }

    // Copy to clipboard
    function copyToClipboard() {
        let output = '';

        switch(activeTab) {
            case 'formatter':
                output = formattedOutput.value;
                break;
            case 'converter':
                output = convertedOutput.value;
                break;
            case 'validator':
            case 'tree-view':
                output = inputJson.value;
                break;
        }

        if (!output) {
            showNotification('No output to copy.', 'warning');
            return;
        }

        // Use the modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(output)
                .then(() => {
                    showNotification('Copied to clipboard!', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback to the older method
                    fallbackCopyToClipboard(output);
                });
        } else {
            // Fallback for browsers that don't support the Clipboard API
            fallbackCopyToClipboard(output);
        }
    }

    // Fallback copy to clipboard method
    function fallbackCopyToClipboard(text) {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);

            if (successful) {
                showNotification('Copied to clipboard!', 'success');
            } else {
                showNotification('Failed to copy to clipboard', 'error');
            }
        } catch (err) {
            console.error('Fallback copy method failed:', err);
            showNotification('Failed to copy to clipboard', 'error');
        }
    }

    // Download output
    function downloadOutput() {
        let output = '';
        let filename = '';
        let mimeType = '';

        switch(activeTab) {
            case 'formatter':
                output = formattedOutput.value;
                filename = 'formatted.json';
                mimeType = 'application/json';
                break;
            case 'converter':
                output = convertedOutput.value;
                const format = outputFormat.value;
                switch(format) {
                    case 'xml':
                        filename = 'converted.xml';
                        mimeType = 'application/xml';
                        break;
                    case 'yaml':
                        filename = 'converted.yaml';
                        mimeType = 'application/yaml';
                        break;
                    case 'csv':
                        filename = 'converted.csv';
                        mimeType = 'text/csv';
                        break;
                    case 'tsv':
                        filename = 'converted.tsv';
                        mimeType = 'text/tab-separated-values';
                        break;
                }
                break;
            case 'validator':
            case 'tree-view':
                output = inputJson.value;
                filename = 'data.json';
                mimeType = 'application/json';
                break;
        }

        if (!output) {
            showNotification('No output to download.', 'warning');
            return;
        }

        const blob = new Blob([output], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    // Show notification - Apple-like style
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Clear any existing timeout
        if (window.notificationTimeout) {
            clearTimeout(window.notificationTimeout);
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        // Set icon based on type
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

        // Set notification content
        notification.innerHTML = `
            <div class="notification-content">
                <i class="material-icons">${icon}</i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Hide notification after 3 seconds
        window.notificationTimeout = setTimeout(() => {
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

    // Update font size
    function updateFontSize() {
        const size = fontSizeSelect.value;
        inputJson.style.fontSize = `${size}px`;
        formattedOutput.style.fontSize = `${size}px`;
        convertedOutput.style.fontSize = `${size}px`;
        jsonTree.style.fontSize = `${size}px`;
    }

    // Toggle word wrap
    function toggleWordWrap() {
        const wrap = wordWrapToggle.checked ? 'on' : 'off';
        inputJson.style.whiteSpace = wrap === 'on' ? 'pre-wrap' : 'pre';
        formattedOutput.style.whiteSpace = wrap === 'on' ? 'pre-wrap' : 'pre';
        convertedOutput.style.whiteSpace = wrap === 'on' ? 'pre-wrap' : 'pre';
    }

    // Initialize the application
    init();
});
