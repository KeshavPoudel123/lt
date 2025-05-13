// ===== MORTGAGE CALCULATOR SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the mortgage calculator
    initMortgageCalculator();

    // Initialize settings
    initSettings();
});

/**
 * Initialize the mortgage calculator
 */
function initMortgageCalculator() {
    // Mortgage Calculator initialization

    // Tab elements
    const tabPayment = document.getElementById('tab-payment');
    const tabAmortization = document.getElementById('tab-amortization');
    const tabComparison = document.getElementById('tab-comparison');
    const tabAffordability = document.getElementById('tab-affordability');

    // Calculator sections
    const calculatorPayment = document.getElementById('calculator-payment');
    const calculatorAmortization = document.getElementById('calculator-amortization');
    const calculatorComparison = document.getElementById('calculator-comparison');
    const calculatorAffordability = document.getElementById('calculator-affordability');

    // Payment calculator elements
    const loanAmount = document.getElementById('loan-amount');
    const interestRate = document.getElementById('interest-rate');
    const loanTerm = document.getElementById('loan-term');
    const paymentFrequency = document.getElementById('payment-frequency');
    const downPayment = document.getElementById('down-payment');
    const propertyTax = document.getElementById('property-tax');
    const homeInsurance = document.getElementById('home-insurance');
    const pmi = document.getElementById('pmi');
    const calculatePaymentBtn = document.getElementById('calculate-payment');
    const resetPaymentBtn = document.getElementById('reset-payment');
    const paymentResultSection = document.getElementById('payment-result-section');
    const totalPayment = document.getElementById('total-payment');
    const principalInterest = document.getElementById('principal-interest');
    const monthlyTax = document.getElementById('monthly-tax');
    const monthlyInsurance = document.getElementById('monthly-insurance');
    const monthlyPmi = document.getElementById('monthly-pmi');
    const totalLoan = document.getElementById('total-loan');
    const totalInterest = document.getElementById('total-interest');
    const totalCost = document.getElementById('total-cost');
    const viewAmortizationBtn = document.getElementById('view-amortization');
    const exportResultsBtn = document.getElementById('export-results');

    // Chart elements
    const paymentChartCanvas = document.getElementById('payment-chart');
    let paymentChart = null;

    // Settings
    const currencySymbol = document.getElementById('currency-symbol');
    const decimalPlaces = document.getElementById('decimal-places');
    const autoCalculate = document.getElementById('auto-calculate');

    // Initialize
    loadSettings();

    // Event Listeners - Tabs
    tabPayment.addEventListener('click', () => switchTab('payment'));
    tabAmortization.addEventListener('click', () => switchTab('amortization'));
    tabComparison.addEventListener('click', () => switchTab('comparison'));
    tabAffordability.addEventListener('click', () => switchTab('affordability'));

    // Event Listeners - Payment Calculator
    loanAmount.addEventListener('input', handlePaymentInput);
    interestRate.addEventListener('input', handlePaymentInput);
    loanTerm.addEventListener('change', handlePaymentInput);
    paymentFrequency.addEventListener('change', handlePaymentInput);
    downPayment.addEventListener('input', handlePaymentInput);
    propertyTax.addEventListener('input', handlePaymentInput);
    homeInsurance.addEventListener('input', handlePaymentInput);
    pmi.addEventListener('input', handlePaymentInput);
    calculatePaymentBtn.addEventListener('click', calculatePayment);
    resetPaymentBtn.addEventListener('click', resetPayment);
    viewAmortizationBtn.addEventListener('click', () => switchTab('amortization'));
    exportResultsBtn.addEventListener('click', exportResults);

    // Event Listeners - Settings
    currencySymbol.addEventListener('change', updateSettings);
    decimalPlaces.addEventListener('change', updateSettings);
    autoCalculate.addEventListener('change', updateSettings);

    /**
     * Switch between calculator tabs
     * @param {string} tabId - ID of the tab to switch to
     */
    function switchTab(tabId) {
        // Hide all calculator sections
        calculatorPayment.classList.remove('active');
        calculatorAmortization.classList.remove('active');
        calculatorComparison.classList.remove('active');
        calculatorAffordability.classList.remove('active');

        // Deactivate all tab buttons
        tabPayment.classList.remove('active');
        tabAmortization.classList.remove('active');
        tabComparison.classList.remove('active');
        tabAffordability.classList.remove('active');

        // Show selected calculator section and activate tab button
        switch (tabId) {
            case 'payment':
                calculatorPayment.classList.add('active');
                tabPayment.classList.add('active');
                break;
            case 'amortization':
                calculatorAmortization.classList.add('active');
                tabAmortization.classList.add('active');
                // Generate amortization schedule if needed
                if (paymentResultSection.classList.contains('hidden')) {
                    showNotification('Please calculate payment first', 'warning');
                    switchTab('payment');
                } else {
                    // TODO: Generate amortization schedule
                }
                break;
            case 'comparison':
                calculatorComparison.classList.add('active');
                tabComparison.classList.add('active');
                break;
            case 'affordability':
                calculatorAffordability.classList.add('active');
                tabAffordability.classList.add('active');
                break;
        }
    }

    /**
     * Handle input in the payment calculator
     */
    function handlePaymentInput() {
        if (autoCalculate.checked) {
            calculatePayment();
        }
    }

    /**
     * Calculate the mortgage payment
     */
    function calculatePayment() {
        // Get input values
        const loan = parseFloat(loanAmount.value) || 0;
        const down = parseFloat(downPayment.value) || 0;
        const rate = parseFloat(interestRate.value) || 0;
        const term = parseInt(loanTerm.value) || 30;
        const tax = parseFloat(propertyTax.value) || 0;
        const insurance = parseFloat(homeInsurance.value) || 0;
        const pmiRate = parseFloat(pmi.value) || 0;
        const frequency = paymentFrequency.value;

        // Validate inputs
        if (loan <= 0) {
            showNotification('Please enter a valid loan amount', 'warning');
            return;
        }

        if (rate <= 0) {
            showNotification('Please enter a valid interest rate', 'warning');
            return;
        }

        // Calculate principal loan amount (loan - down payment)
        const principal = loan - down;

        if (principal <= 0) {
            showNotification('Down payment cannot exceed loan amount', 'warning');
            return;
        }

        // Calculate monthly interest rate
        const monthlyRate = rate / 100 / 12;

        // Calculate number of payments
        const numberOfPayments = term * 12;

        // Calculate monthly principal and interest payment
        const monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        // Calculate monthly property tax
        const monthlyPropertyTax = tax / 12;

        // Calculate monthly home insurance
        const monthlyHomeInsurance = insurance / 12;

        // Calculate PMI (if down payment is less than 20% of loan amount)
        const loanToValue = principal / loan;
        const monthlyPMI = loanToValue > 0.8 ? (principal * pmiRate / 100 / 12) : 0;

        // Calculate total monthly payment
        const monthlyPayment = monthlyPI + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI;

        // Calculate total interest paid
        const totalInterestPaid = (monthlyPI * numberOfPayments) - principal;

        // Calculate total cost
        const totalPaymentAmount = monthlyPayment * numberOfPayments;

        // Update result display
        totalPayment.textContent = formatCurrency(monthlyPayment);
        principalInterest.textContent = formatCurrency(monthlyPI);
        monthlyTax.textContent = formatCurrency(monthlyPropertyTax);
        monthlyInsurance.textContent = formatCurrency(monthlyHomeInsurance);
        monthlyPmi.textContent = formatCurrency(monthlyPMI);
        totalLoan.textContent = formatCurrency(principal);
        totalInterest.textContent = formatCurrency(totalInterestPaid);
        totalCost.textContent = formatCurrency(totalPaymentAmount);

        // Update payment chart
        updatePaymentChart(monthlyPI, monthlyPropertyTax, monthlyHomeInsurance, monthlyPMI);

        // Show result section
        paymentResultSection.classList.remove('hidden');
    }

    /**
     * Reset the payment calculator
     */
    function resetPayment() {
        loanAmount.value = '';
        interestRate.value = '';
        loanTerm.value = '30';
        paymentFrequency.value = 'monthly';
        downPayment.value = '';
        propertyTax.value = '';
        homeInsurance.value = '';
        pmi.value = '';
        paymentResultSection.classList.add('hidden');

        // Destroy chart if it exists
        if (paymentChart) {
            paymentChart.destroy();
            paymentChart = null;
        }
    }

    /**
     * Update the payment breakdown chart
     * @param {number} pi - Principal and interest amount
     * @param {number} tax - Property tax amount
     * @param {number} insurance - Home insurance amount
     * @param {number} pmiAmount - PMI amount
     */
    function updatePaymentChart(pi, tax, insurance, pmiAmount) {
        // Destroy existing chart if it exists
        if (paymentChart) {
            paymentChart.destroy();
        }

        // Create new chart
        paymentChart = new Chart(paymentChartCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Principal & Interest', 'Property Tax', 'Home Insurance', 'PMI'],
                datasets: [{
                    data: [pi, tax, insurance, pmiAmount],
                    backgroundColor: [
                        '#5B4CC4',
                        '#C12E61',
                        '#4CAF50',
                        '#FFC107'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#f5f5f5',
                            font: {
                                family: 'Poppins, sans-serif'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Export results to CSV
     */
    function exportResults() {
        // Get values
        const loan = parseFloat(loanAmount.value) || 0;
        const down = parseFloat(downPayment.value) || 0;
        const rate = parseFloat(interestRate.value) || 0;
        const term = parseInt(loanTerm.value) || 30;
        const tax = parseFloat(propertyTax.value) || 0;
        const insurance = parseFloat(homeInsurance.value) || 0;
        const pmiRate = parseFloat(pmi.value) || 0;

        // Create CSV content
        const csvContent = [
            'Mortgage Calculator Results',
            '',
            'Input Parameters',
            `Loan Amount,${formatCurrency(loan)}`,
            `Down Payment,${formatCurrency(down)}`,
            `Interest Rate,${rate}%`,
            `Loan Term,${term} years`,
            `Property Tax,${formatCurrency(tax)}/year`,
            `Home Insurance,${formatCurrency(insurance)}/year`,
            `PMI Rate,${pmiRate}%`,
            '',
            'Payment Breakdown',
            `Total Monthly Payment,${totalPayment.textContent}`,
            `Principal & Interest,${principalInterest.textContent}`,
            `Property Tax,${monthlyTax.textContent}`,
            `Home Insurance,${monthlyInsurance.textContent}`,
            `PMI,${monthlyPmi.textContent}`,
            '',
            'Loan Summary',
            `Total Loan Amount,${totalLoan.textContent}`,
            `Total Interest Paid,${totalInterest.textContent}`,
            `Total Cost,${totalCost.textContent}`
        ].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'mortgage_calculator_results.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('Results exported successfully', 'success');
    }

    /**
     * Format a number as currency
     * @param {number} value - Number to format
     * @returns {string} - Formatted currency string
     */
    function formatCurrency(value) {
        const symbol = currencySymbol.value;
        const places = parseInt(decimalPlaces.value);
        return `${symbol}${value.toFixed(places).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }

    /**
     * Load settings from localStorage
     */
    function loadSettings() {
        const savedSettings = localStorage.getItem('mortgageCalculatorSettings');

        if (savedSettings) {
            const settings = JSON.parse(savedSettings);

            if (settings.currencySymbol) {
                currencySymbol.value = settings.currencySymbol;
            }

            if (settings.decimalPlaces) {
                decimalPlaces.value = settings.decimalPlaces;
            }

            if (settings.autoCalculate !== undefined) {
                autoCalculate.checked = settings.autoCalculate;
            }
        }
    }

    /**
     * Update settings and save to localStorage
     */
    function updateSettings() {
        localStorage.setItem('mortgageCalculatorSettings', JSON.stringify({
            currencySymbol: currencySymbol.value,
            decimalPlaces: decimalPlaces.value,
            autoCalculate: autoCalculate.checked
        }));

        // Recalculate if needed
        if (!paymentResultSection.classList.contains('hidden')) {
            calculatePayment();
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
