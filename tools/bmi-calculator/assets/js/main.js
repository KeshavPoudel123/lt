// ===== BMI CALCULATOR SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the BMI calculator
    initBmiCalculator();

    // Initialize settings
    initSettings();

    // Add settings button if it doesn't exist
    if (!document.getElementById('settings-btn')) {
        const header = document.querySelector('.tool-header .container');
        if (header) {
            const settingsBtn = document.createElement('button');
            settingsBtn.id = 'settings-btn';
            settingsBtn.className = 'btn btn-secondary';
            settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
            settingsBtn.title = 'Settings';

            // Create a div for tool actions if it doesn't exist
            let toolActions = header.querySelector('.tool-actions');
            if (!toolActions) {
                toolActions = document.createElement('div');
                toolActions.className = 'tool-actions';
                header.appendChild(toolActions);
            }

            toolActions.appendChild(settingsBtn);
        }
    }
});

/**
 * Initialize the BMI calculator
 */
function initBmiCalculator() {


    // Tab elements
    const tabStandard = document.getElementById('tab-standard');
    const tabImperial = document.getElementById('tab-imperial');
    const tabInfo = document.getElementById('tab-info');

    // Calculator sections
    const calculatorStandard = document.getElementById('calculator-standard');
    const calculatorImperial = document.getElementById('calculator-imperial');
    const calculatorInfo = document.getElementById('calculator-info');

    // Standard calculator elements
    const weightKg = document.getElementById('weight-kg');
    const heightCm = document.getElementById('height-cm');
    const age = document.getElementById('age');
    const gender = document.getElementById('gender');
    const calculateStandardBtn = document.getElementById('calculate-standard');
    const resetStandardBtn = document.getElementById('reset-standard');
    const standardResultSection = document.getElementById('standard-result-section');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    const gaugeIndicator = document.getElementById('gauge-indicator');
    const bmiInterpretation = document.getElementById('bmi-interpretation');
    const healthyWeightRange = document.getElementById('healthy-weight-range');
    const copyResultBtn = document.getElementById('copy-result');
    const printResultBtn = document.getElementById('print-result');

    // Settings
    const decimalPlaces = document.getElementById('decimal-places');
    const autoCalculate = document.getElementById('auto-calculate');

    // Initialize
    loadSettings();

    // Event Listeners - Tabs
    tabStandard.addEventListener('click', () => switchTab('standard'));
    tabImperial.addEventListener('click', () => switchTab('imperial'));
    tabInfo.addEventListener('click', () => switchTab('info'));

    // Event Listeners - Standard Calculator
    weightKg.addEventListener('input', handleStandardInput);
    heightCm.addEventListener('input', handleStandardInput);
    age.addEventListener('input', handleStandardInput);
    gender.addEventListener('change', handleStandardInput);
    calculateStandardBtn.addEventListener('click', calculateStandardBmi);
    resetStandardBtn.addEventListener('click', resetStandardBmi);
    copyResultBtn.addEventListener('click', copyResult);
    printResultBtn.addEventListener('click', printResult);

    // Imperial calculator elements
    const weightLb = document.getElementById('weight-lb');
    const heightFt = document.getElementById('height-ft');
    const heightIn = document.getElementById('height-in');
    const ageImperial = document.getElementById('age-imperial');
    const genderImperial = document.getElementById('gender-imperial');
    const calculateImperialBtn = document.getElementById('calculate-imperial');
    const resetImperialBtn = document.getElementById('reset-imperial');
    const imperialResultSection = document.getElementById('imperial-result-section');
    const bmiValueImperial = document.getElementById('bmi-value-imperial');
    const bmiCategoryImperial = document.getElementById('bmi-category-imperial');
    const gaugeIndicatorImperial = document.getElementById('gauge-indicator-imperial');
    const bmiInterpretationImperial = document.getElementById('bmi-interpretation-imperial');
    const healthyWeightRangeImperial = document.getElementById('healthy-weight-range-imperial');
    const copyResultImperialBtn = document.getElementById('copy-result-imperial');
    const printResultImperialBtn = document.getElementById('print-result-imperial');

    // Event Listeners - Imperial Calculator
    if (weightLb) weightLb.addEventListener('input', handleImperialInput);
    if (heightFt) heightFt.addEventListener('input', handleImperialInput);
    if (heightIn) heightIn.addEventListener('input', handleImperialInput);
    if (ageImperial) ageImperial.addEventListener('input', handleImperialInput);
    if (genderImperial) genderImperial.addEventListener('change', handleImperialInput);
    if (calculateImperialBtn) calculateImperialBtn.addEventListener('click', calculateImperialBmi);
    if (resetImperialBtn) resetImperialBtn.addEventListener('click', resetImperialBmi);
    if (copyResultImperialBtn) copyResultImperialBtn.addEventListener('click', copyImperialResult);
    if (printResultImperialBtn) printResultImperialBtn.addEventListener('click', printImperialResult);

    // Event Listeners - Settings
    decimalPlaces.addEventListener('change', updateSettings);
    autoCalculate.addEventListener('change', updateSettings);

    /**
     * Switch between calculator tabs
     * @param {string} tabId - ID of the tab to switch to
     */
    function switchTab(tabId) {
        // Hide all calculator sections
        calculatorStandard.classList.remove('active');
        calculatorImperial.classList.remove('active');
        calculatorInfo.classList.remove('active');

        // Deactivate all tab buttons
        tabStandard.classList.remove('active');
        tabImperial.classList.remove('active');
        tabInfo.classList.remove('active');

        // Show selected calculator section and activate tab button
        switch (tabId) {
            case 'standard':
                calculatorStandard.classList.add('active');
                tabStandard.classList.add('active');
                break;
            case 'imperial':
                calculatorImperial.classList.add('active');
                tabImperial.classList.add('active');
                break;
            case 'info':
                calculatorInfo.classList.add('active');
                tabInfo.classList.add('active');
                break;
        }
    }

    /**
     * Handle input in the standard calculator
     */
    function handleStandardInput() {
        if (autoCalculate.checked) {
            calculateStandardBmi();
        }
    }

    /**
     * Calculate BMI using standard units (kg/cm)
     */
    function calculateStandardBmi() {
        const weight = parseFloat(weightKg.value);
        const height = parseFloat(heightCm.value);

        // Validate inputs
        if (isNaN(weight) || isNaN(height)) {
            showNotification('Please enter valid weight and height', 'warning');
            return;
        }

        if (weight <= 0 || height <= 0) {
            showNotification('Weight and height must be greater than zero', 'warning');
            return;
        }

        // Calculate BMI: weight (kg) / (height (m))^2
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        // Update BMI value
        bmiValue.textContent = formatNumber(bmi);

        // Determine BMI category and update UI
        updateBmiCategory(bmi);

        // Calculate healthy weight range
        calculateHealthyWeightRange(heightInMeters);

        // Show result section
        standardResultSection.classList.remove('hidden');
    }

    /**
     * Update BMI category and related UI elements
     * @param {number} bmi - BMI value
     */
    function updateBmiCategory(bmi) {
        let category, interpretation;

        // Remove all category classes
        bmiCategory.classList.remove('underweight', 'normal', 'overweight', 'obese');

        // Determine category based on BMI
        if (bmi < 18.5) {
            category = 'Underweight';
            bmiCategory.classList.add('underweight');
            interpretation = 'Your BMI is below the healthy range. This may indicate undernourishment or an underlying medical condition. Consider consulting with a healthcare provider.';
            // Position gauge indicator at 12.5% (middle of underweight section)
            gaugeIndicator.style.left = '12.5%';
        } else if (bmi < 25) {
            category = 'Normal weight';
            bmiCategory.classList.add('normal');
            interpretation = 'Your BMI is within the healthy range. Maintaining a healthy weight may reduce the risk of chronic diseases associated with overweight and obesity.';
            // Position gauge indicator between 31.25% and 37.5% based on BMI
            const normalPosition = 25 + ((bmi - 18.5) / 6.5) * 25;
            gaugeIndicator.style.left = `${normalPosition}%`;
        } else if (bmi < 30) {
            category = 'Overweight';
            bmiCategory.classList.add('overweight');
            interpretation = 'Your BMI is above the healthy range. Being overweight may increase your risk of heart disease, type 2 diabetes, and other health conditions. Consider adopting a healthier lifestyle.';
            // Position gauge indicator between 62.5% and 75% based on BMI
            const overweightPosition = 50 + ((bmi - 25) / 5) * 25;
            gaugeIndicator.style.left = `${overweightPosition}%`;
        } else {
            category = 'Obese';
            bmiCategory.classList.add('obese');
            interpretation = 'Your BMI indicates obesity. This significantly increases your risk of serious health conditions including heart disease, stroke, and type 2 diabetes. Consider consulting with a healthcare provider.';
            // Position gauge indicator at 87.5% (middle of obese section)
            gaugeIndicator.style.left = '87.5%';
        }

        // Update UI
        bmiCategory.textContent = category;
        bmiInterpretation.textContent = interpretation;
    }

    /**
     * Calculate healthy weight range based on height
     * @param {number} heightInMeters - Height in meters
     */
    function calculateHealthyWeightRange(heightInMeters) {
        // Healthy BMI range is 18.5-24.9
        const minWeight = 18.5 * (heightInMeters * heightInMeters);
        const maxWeight = 24.9 * (heightInMeters * heightInMeters);

        healthyWeightRange.textContent = `${formatNumber(minWeight)} - ${formatNumber(maxWeight)}`;
    }

    /**
     * Reset the standard BMI calculator
     */
    function resetStandardBmi() {
        weightKg.value = '';
        heightCm.value = '';
        age.value = '';
        gender.value = '';
        standardResultSection.classList.add('hidden');
    }

    /**
     * Copy BMI results to clipboard
     */
    function copyResult() {
        const resultText = `BMI: ${bmiValue.textContent} kg/m² - Category: ${bmiCategory.textContent}\n${bmiInterpretation.textContent}`;

        navigator.clipboard.writeText(resultText)
            .then(() => {
                showNotification('Results copied to clipboard', 'success');
            })
            .catch(err => {
                showNotification('Failed to copy results', 'error');

            });
    }

    /**
     * Print BMI results
     */
    function printResult() {
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <html>
            <head>
                <title>BMI Calculator Results</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 20px;
                    }
                    h1 {
                        color: #5B4CC4;
                        border-bottom: 2px solid #C12E61;
                        padding-bottom: 10px;
                    }
                    .result-value {
                        font-size: 24px;
                        font-weight: bold;
                        margin: 20px 0;
                    }
                    .category {
                        display: inline-block;
                        padding: 5px 15px;
                        border-radius: 20px;
                        color: white;
                        font-weight: bold;
                    }
                    .underweight { background-color: #3498db; }
                    .normal { background-color: #2ecc71; }
                    .overweight { background-color: #f39c12; }
                    .obese { background-color: #e74c3c; }
                    .interpretation {
                        margin: 20px 0;
                        padding: 15px;
                        background-color: #f8f9fa;
                        border-radius: 5px;
                    }
                    .healthy-range {
                        margin: 20px 0;
                    }
                    .footer {
                        margin-top: 40px;
                        font-size: 12px;
                        color: #666;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <h1>BMI Calculator Results</h1>
                <div class="result-value">
                    BMI: ${bmiValue.textContent} kg/m²
                </div>
                <div>
                    Category: <span class="category ${bmiCategory.className}">${bmiCategory.textContent}</span>
                </div>
                <div class="interpretation">
                    <strong>What does this mean?</strong>
                    <p>${bmiInterpretation.textContent}</p>
                </div>
                <div class="healthy-range">
                    <strong>Healthy Weight Range:</strong>
                    <p>For your height, a healthy weight range would be ${healthyWeightRange.textContent} kg.</p>
                </div>
                <div class="footer">
                    Generated by Latest Online Tools - BMI Calculator
                    <br>
                    ${new Date().toLocaleString()}
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        // Print after a short delay to ensure the document is loaded
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    /**
     * Format a number based on settings
     * @param {number} value - Number to format
     * @returns {string} - Formatted number
     */
    function formatNumber(value) {
        const places = parseInt(decimalPlaces.value);
        return value.toFixed(places);
    }

    /**
     * Load settings from localStorage
     */
    function loadSettings() {
        const savedSettings = localStorage.getItem('bmiCalculatorSettings');

        if (savedSettings) {
            const settings = JSON.parse(savedSettings);

            if (settings.decimalPlaces) {
                decimalPlaces.value = settings.decimalPlaces;
            }

            if (settings.autoCalculate !== undefined) {
                autoCalculate.checked = settings.autoCalculate;
            }
        }
    }

    /**
     * Handle input in the imperial calculator
     */
    function handleImperialInput() {
        if (autoCalculate.checked) {
            calculateImperialBmi();
        }
    }

    /**
     * Calculate BMI using imperial units (lb/ft/in)
     */
    function calculateImperialBmi() {
        const weight = parseFloat(weightLb.value);
        const heightFeet = parseFloat(heightFt.value) || 0;
        const heightInches = parseFloat(heightIn.value) || 0;

        // Validate inputs
        if (isNaN(weight) || (heightFeet === 0 && heightInches === 0)) {
            showNotification('Please enter valid weight and height', 'warning');
            return;
        }

        if (weight <= 0 || (heightFeet <= 0 && heightInches <= 0)) {
            showNotification('Weight and height must be greater than zero', 'warning');
            return;
        }

        // Calculate total height in inches
        const totalHeightInches = (heightFeet * 12) + heightInches;

        // Calculate BMI: (weight (lb) / height (in)^2) * 703
        const bmi = (weight / (totalHeightInches * totalHeightInches)) * 703;

        // Update BMI value
        bmiValueImperial.textContent = formatNumber(bmi);

        // Determine BMI category and update UI
        updateImperialBmiCategory(bmi);

        // Calculate healthy weight range
        calculateImperialHealthyWeightRange(totalHeightInches);

        // Show result section
        imperialResultSection.classList.remove('hidden');
    }

    /**
     * Update BMI category and related UI elements for imperial calculator
     * @param {number} bmi - BMI value
     */
    function updateImperialBmiCategory(bmi) {
        let category, interpretation;

        // Remove all category classes
        bmiCategoryImperial.classList.remove('underweight', 'normal', 'overweight', 'obese');

        // Determine category based on BMI
        if (bmi < 18.5) {
            category = 'Underweight';
            bmiCategoryImperial.classList.add('underweight');
            interpretation = 'Your BMI is below the healthy range. This may indicate undernourishment or an underlying medical condition. Consider consulting with a healthcare provider.';
            // Position gauge indicator at 12.5% (middle of underweight section)
            gaugeIndicatorImperial.style.left = '12.5%';
        } else if (bmi < 25) {
            category = 'Normal weight';
            bmiCategoryImperial.classList.add('normal');
            interpretation = 'Your BMI is within the healthy range. Maintaining a healthy weight may reduce the risk of chronic diseases associated with overweight and obesity.';
            // Position gauge indicator between 31.25% and 37.5% based on BMI
            const normalPosition = 25 + ((bmi - 18.5) / 6.5) * 25;
            gaugeIndicatorImperial.style.left = `${normalPosition}%`;
        } else if (bmi < 30) {
            category = 'Overweight';
            bmiCategoryImperial.classList.add('overweight');
            interpretation = 'Your BMI is above the healthy range. Being overweight may increase your risk of heart disease, type 2 diabetes, and other health conditions. Consider adopting a healthier lifestyle.';
            // Position gauge indicator between 62.5% and 75% based on BMI
            const overweightPosition = 50 + ((bmi - 25) / 5) * 25;
            gaugeIndicatorImperial.style.left = `${overweightPosition}%`;
        } else {
            category = 'Obese';
            bmiCategoryImperial.classList.add('obese');
            interpretation = 'Your BMI indicates obesity. This significantly increases your risk of serious health conditions including heart disease, stroke, and type 2 diabetes. Consider consulting with a healthcare provider.';
            // Position gauge indicator at 87.5% (middle of obese section)
            gaugeIndicatorImperial.style.left = '87.5%';
        }

        // Update UI
        bmiCategoryImperial.textContent = category;
        bmiInterpretationImperial.textContent = interpretation;
    }

    /**
     * Calculate healthy weight range based on height in inches
     * @param {number} heightInInches - Height in inches
     */
    function calculateImperialHealthyWeightRange(heightInInches) {
        // Healthy BMI range is 18.5-24.9
        const minWeight = (18.5 * (heightInInches * heightInInches)) / 703;
        const maxWeight = (24.9 * (heightInInches * heightInInches)) / 703;

        healthyWeightRangeImperial.textContent = `${formatNumber(minWeight)} - ${formatNumber(maxWeight)}`;
    }

    /**
     * Reset the imperial BMI calculator
     */
    function resetImperialBmi() {
        weightLb.value = '';
        heightFt.value = '';
        heightIn.value = '';
        ageImperial.value = '';
        genderImperial.value = '';
        imperialResultSection.classList.add('hidden');
    }

    /**
     * Copy imperial BMI results to clipboard
     */
    function copyImperialResult() {
        const resultText = `BMI: ${bmiValueImperial.textContent} kg/m² - Category: ${bmiCategoryImperial.textContent}\n${bmiInterpretationImperial.textContent}`;

        navigator.clipboard.writeText(resultText)
            .then(() => {
                showNotification('Results copied to clipboard', 'success');
            })
            .catch(err => {
                showNotification('Failed to copy results', 'error');

            });
    }

    /**
     * Print imperial BMI results
     */
    function printImperialResult() {
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <html>
            <head>
                <title>BMI Calculator Results</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 20px;
                    }
                    h1 {
                        color: #5B4CC4;
                        border-bottom: 2px solid #C12E61;
                        padding-bottom: 10px;
                    }
                    .result-value {
                        font-size: 24px;
                        font-weight: bold;
                        margin: 20px 0;
                    }
                    .category {
                        display: inline-block;
                        padding: 5px 15px;
                        border-radius: 20px;
                        color: white;
                        font-weight: bold;
                    }
                    .underweight { background-color: #3498db; }
                    .normal { background-color: #2ecc71; }
                    .overweight { background-color: #f39c12; }
                    .obese { background-color: #e74c3c; }
                    .interpretation {
                        margin: 20px 0;
                        padding: 15px;
                        background-color: #f8f9fa;
                        border-radius: 5px;
                    }
                    .healthy-range {
                        margin: 20px 0;
                    }
                    .footer {
                        margin-top: 40px;
                        font-size: 12px;
                        color: #666;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <h1>BMI Calculator Results</h1>
                <div class="result-value">
                    BMI: ${bmiValueImperial.textContent} kg/m²
                </div>
                <div>
                    Category: <span class="category ${bmiCategoryImperial.className}">${bmiCategoryImperial.textContent}</span>
                </div>
                <div class="interpretation">
                    <strong>What does this mean?</strong>
                    <p>${bmiInterpretationImperial.textContent}</p>
                </div>
                <div class="healthy-range">
                    <strong>Healthy Weight Range:</strong>
                    <p>For your height, a healthy weight range would be ${healthyWeightRangeImperial.textContent} lb.</p>
                </div>
                <div class="footer">
                    Generated by Latest Online Tools - BMI Calculator
                    <br>
                    ${new Date().toLocaleString()}
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        // Print after a short delay to ensure the document is loaded
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    /**
     * Update settings and save to localStorage
     */
    function updateSettings() {
        localStorage.setItem('bmiCalculatorSettings', JSON.stringify({
            decimalPlaces: decimalPlaces.value,
            autoCalculate: autoCalculate.checked
        }));

        // Recalculate if needed
        if (!standardResultSection.classList.contains('hidden')) {
            calculateStandardBmi();
        }

        if (imperialResultSection && !imperialResultSection.classList.contains('hidden')) {
            calculateImperialBmi();
        }
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
    const notificationIcon = notification.querySelector('.notification-icon');

    // Set message
    notificationMessage.textContent = message;

    // Set icon based on type
    switch (type) {
        case 'success':
            notificationIcon.className = 'notification-icon fas fa-check-circle';
            break;
        case 'error':
            notificationIcon.className = 'notification-icon fas fa-times-circle';
            break;
        case 'warning':
            notificationIcon.className = 'notification-icon fas fa-exclamation-triangle';
            break;
        case 'info':
        default:
            notificationIcon.className = 'notification-icon fas fa-info-circle';
            break;
    }

    // Add type class
    notification.className = `notification ${type}`;

    // Show notification
    notification.style.display = 'block';

    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}
