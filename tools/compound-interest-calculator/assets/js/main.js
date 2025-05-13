// Compound Interest Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the calculator
    initCompoundInterestCalculator();
});

/**
 * Initialize the Compound Interest Calculator
 */
function initCompoundInterestCalculator() {
    // Tab switching
    initTabs();
    
    // Basic Calculator
    initBasicCalculator();
    
    // Settings
    initSettings();
    
    // Initialize Lottie animations
    initAnimations();
}

/**
 * Initialize tab switching functionality
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const calculatorSections = document.querySelectorAll('.calculator-section');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and sections
            tabButtons.forEach(btn => btn.classList.remove('active'));
            calculatorSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked button and corresponding section
            button.classList.add('active');
            const tabId = button.id.replace('tab-', 'calculator-');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Initialize Basic Calculator
 */
function initBasicCalculator() {
    const principalInput = document.getElementById('principal');
    const interestRateInput = document.getElementById('interest-rate');
    const timePeriodInput = document.getElementById('time-period');
    const compoundFrequencySelect = document.getElementById('compound-frequency');
    const additionalContributionInput = document.getElementById('additional-contribution');
    const contributionFrequencySelect = document.getElementById('contribution-frequency');
    const calculateButton = document.getElementById('calculate-basic');
    const resetButton = document.getElementById('reset-basic');
    const resultSection = document.getElementById('basic-result-section');
    const copyButton = document.getElementById('copy-basic-result');
    const viewTableButton = document.getElementById('view-detailed-table');
    
    // Calculate button click event
    calculateButton.addEventListener('click', () => {
        calculateCompoundInterest();
    });
    
    // Reset button click event
    resetButton.addEventListener('click', () => {
        principalInput.value = '10000';
        interestRateInput.value = '7';
        timePeriodInput.value = '10';
        compoundFrequencySelect.value = '12';
        additionalContributionInput.value = '100';
        contributionFrequencySelect.value = '12';
        resultSection.classList.add('hidden');
    });
    
    // Copy results button click event
    copyButton.addEventListener('click', () => {
        copyResults();
    });
    
    // View detailed table button click event
    viewTableButton.addEventListener('click', () => {
        // Switch to advanced tab and show detailed table
        document.getElementById('tab-advanced').click();
    });
    
    // Auto calculate on input change if enabled
    const inputs = [principalInput, interestRateInput, timePeriodInput, additionalContributionInput];
    const selects = [compoundFrequencySelect, contributionFrequencySelect];
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (document.getElementById('auto-calculate').checked) {
                calculateCompoundInterest();
            }
        });
    });
    
    selects.forEach(select => {
        select.addEventListener('change', () => {
            if (document.getElementById('auto-calculate').checked) {
                calculateCompoundInterest();
            }
        });
    });
}

/**
 * Calculate compound interest
 */
function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principal').value);
    const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
    const timePeriod = parseInt(document.getElementById('time-period').value);
    const compoundFrequency = parseInt(document.getElementById('compound-frequency').value);
    const additionalContribution = parseFloat(document.getElementById('additional-contribution').value);
    const contributionFrequency = parseInt(document.getElementById('contribution-frequency').value);
    const resultSection = document.getElementById('basic-result-section');
    
    // Validate inputs
    if (isNaN(principal) || isNaN(interestRate) || isNaN(timePeriod) || 
        isNaN(compoundFrequency) || isNaN(additionalContribution) || isNaN(contributionFrequency)) {
        showNotification('Please enter valid numbers for all fields', 'error');
        return;
    }
    
    if (principal < 0 || interestRate < 0 || timePeriod <= 0 || 
        compoundFrequency <= 0 || additionalContribution < 0 || contributionFrequency <= 0) {
        showNotification('Please enter positive values', 'error');
        return;
    }
    
    // Calculate future value
    const futureValue = calculateFutureValue(
        principal,
        interestRate,
        timePeriod,
        compoundFrequency,
        additionalContribution,
        contributionFrequency
    );
    
    // Calculate total contributions
    const totalContributions = calculateTotalContributions(
        additionalContribution,
        contributionFrequency,
        timePeriod
    );
    
    // Calculate total interest
    const totalInterest = futureValue - principal - totalContributions;
    
    // Get currency symbol
    const currencySymbol = getCurrencySymbol();
    
    // Get decimal places
    const decimalPlaces = parseInt(document.getElementById('decimal-places').value);
    
    // Display results
    document.getElementById('future-value').textContent = formatCurrency(futureValue, currencySymbol, decimalPlaces);
    document.getElementById('initial-investment').textContent = formatCurrency(principal, currencySymbol, decimalPlaces);
    document.getElementById('total-contributions').textContent = formatCurrency(totalContributions, currencySymbol, decimalPlaces);
    document.getElementById('total-interest').textContent = formatCurrency(totalInterest, currencySymbol, decimalPlaces);
    document.getElementById('final-balance').textContent = formatCurrency(futureValue, currencySymbol, decimalPlaces);
    
    // Create growth chart
    createGrowthChart(principal, totalContributions, totalInterest);
    
    // Show result section
    resultSection.classList.remove('hidden');
}

/**
 * Calculate future value with compound interest and additional contributions
 * @param {number} principal - Initial investment
 * @param {number} rate - Annual interest rate (decimal)
 * @param {number} time - Time period in years
 * @param {number} compoundFrequency - Number of times interest is compounded per year
 * @param {number} additionalContribution - Additional contribution amount
 * @param {number} contributionFrequency - Number of contributions per year
 * @returns {number} - Future value
 */
function calculateFutureValue(principal, rate, time, compoundFrequency, additionalContribution, contributionFrequency) {
    // Calculate future value of principal
    const principalFV = principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * time);
    
    // If no additional contributions, return principal future value
    if (additionalContribution === 0) {
        return principalFV;
    }
    
    // Calculate future value of additional contributions
    // Using the formula for future value of a series of regular payments
    const contributionFV = additionalContribution * contributionFrequency / compoundFrequency * 
        ((Math.pow(1 + rate / compoundFrequency, compoundFrequency * time) - 1) / (rate / compoundFrequency));
    
    return principalFV + contributionFV;
}

/**
 * Calculate total contributions over time
 * @param {number} contribution - Contribution amount
 * @param {number} frequency - Contribution frequency per year
 * @param {number} time - Time period in years
 * @returns {number} - Total contributions
 */
function calculateTotalContributions(contribution, frequency, time) {
    return contribution * frequency * time;
}

/**
 * Create growth chart
 * @param {number} principal - Initial investment
 * @param {number} contributions - Total contributions
 * @param {number} interest - Total interest
 */
function createGrowthChart(principal, contributions, interest) {
    const ctx = document.getElementById('growth-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.growthChart) {
        window.growthChart.destroy();
    }
    
    // Create new chart
    window.growthChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Initial Investment', 'Additional Contributions', 'Interest Earned'],
            datasets: [{
                data: [principal, contributions, interest],
                backgroundColor: [
                    getComputedStyle(document.documentElement).getPropertyValue('--chart-principal').trim(),
                    getComputedStyle(document.documentElement).getPropertyValue('--chart-contributions').trim(),
                    getComputedStyle(document.documentElement).getPropertyValue('--chart-interest').trim()
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--dark-text').trim(),
                        font: {
                            size: 12
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const currencySymbol = getCurrencySymbol();
                            const decimalPlaces = parseInt(document.getElementById('decimal-places').value);
                            return `${label}: ${formatCurrency(value, currencySymbol, decimalPlaces)}`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

/**
 * Copy results to clipboard
 */
function copyResults() {
    const futureValue = document.getElementById('future-value').textContent;
    const initialInvestment = document.getElementById('initial-investment').textContent;
    const totalContributions = document.getElementById('total-contributions').textContent;
    const totalInterest = document.getElementById('total-interest').textContent;
    const finalBalance = document.getElementById('final-balance').textContent;
    
    const text = `Compound Interest Calculator Results\n\nFuture Value: ${futureValue}\nInitial Investment: ${initialInvestment}\nTotal Contributions: ${totalContributions}\nTotal Interest Earned: ${totalInterest}\nFinal Balance: ${finalBalance}`;
    
    copyToClipboard(text);
    showNotification('Results copied to clipboard', 'success');
}

/**
 * Initialize settings
 */
function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtn = settingsModal.querySelector('.close-btn');
    
    // Open settings modal
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });
    
    // Close settings modal
    closeBtn.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    
    // Settings change events
    document.getElementById('currency').addEventListener('change', () => {
        if (document.getElementById('auto-calculate').checked) {
            calculateCompoundInterest();
        }
    });
    
    document.getElementById('decimal-places').addEventListener('change', () => {
        if (document.getElementById('auto-calculate').checked) {
            calculateCompoundInterest();
        }
    });
}

/**
 * Initialize Lottie animations
 */
function initAnimations() {
    // Add Lottie animations if needed
}

/**
 * Get currency symbol based on selected currency
 * @returns {string} - Currency symbol
 */
function getCurrencySymbol() {
    const currency = document.getElementById('currency').value;
    
    const symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'CAD': 'C$',
        'AUD': 'A$'
    };
    
    return symbols[currency] || '$';
}

/**
 * Format currency value
 * @param {number} value - Value to format
 * @param {string} symbol - Currency symbol
 * @param {number} decimalPlaces - Number of decimal places
 * @returns {string} - Formatted currency string
 */
function formatCurrency(value, symbol, decimalPlaces) {
    return `${symbol}${value.toFixed(decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = notification.querySelector('.notification-icon');
    
    // Set message
    notificationMessage.textContent = message;
    
    // Set icon based on type
    if (type === 'success') {
        notificationIcon.className = 'notification-icon fas fa-check-circle';
        notification.className = 'notification notification-success';
    } else if (type === 'error') {
        notificationIcon.className = 'notification-icon fas fa-exclamation-circle';
        notification.className = 'notification notification-error';
    } else {
        notificationIcon.className = 'notification-icon fas fa-info-circle';
        notification.className = 'notification notification-info';
    }
    
    // Show notification
    notification.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}
