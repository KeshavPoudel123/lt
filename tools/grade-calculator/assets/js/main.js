// Grade Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the calculator
    initGradeCalculator();
});

/**
 * Initialize the Grade Calculator
 */
function initGradeCalculator() {
    // Tab switching
    initTabs();

    // Weighted Grade Calculator
    initWeightedGradeCalculator();

    // Final Grade Calculator
    initFinalGradeCalculator();

    // GPA Calculator
    initGPACalculator();

    // Settings
    initSettings();
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
 * Initialize Weighted Grade Calculator
 */
function initWeightedGradeCalculator() {
    const gradeInputs = document.getElementById('grade-inputs');
    const addGradeButton = document.getElementById('add-grade');
    const calculateButton = document.getElementById('calculate-weighted');
    const resetButton = document.getElementById('reset-weighted');
    const resultSection = document.getElementById('weighted-result-section');
    const copyButton = document.getElementById('copy-weighted-result');
    const saveButton = document.getElementById('save-weighted-result');

    // Add initial grade inputs
    addGradeInput();
    addGradeInput();

    // Add grade button click event
    addGradeButton.addEventListener('click', () => {
        addGradeInput();
    });

    // Calculate button click event
    calculateButton.addEventListener('click', () => {
        calculateWeightedGrade();
    });

    // Reset button click event
    resetButton.addEventListener('click', () => {
        resetWeightedGradeCalculator();
    });

    // Copy results button click event
    copyButton.addEventListener('click', () => {
        copyWeightedResults();
    });

    // Save results button click event
    saveButton.addEventListener('click', () => {
        saveWeightedResults();
    });

    // Event delegation for remove grade buttons
    gradeInputs.addEventListener('click', (e) => {
        if (e.target.closest('.remove-grade-btn')) {
            const row = e.target.closest('.grade-input-row');

            // Don't remove if it's the only row
            if (gradeInputs.querySelectorAll('.grade-input-row').length > 1) {
                row.remove();

                // Auto calculate if enabled
                if (document.getElementById('auto-calculate').checked) {
                    calculateWeightedGrade();
                }
            }
        }
    });

    // Auto calculate on input change if enabled
    gradeInputs.addEventListener('input', () => {
        if (document.getElementById('auto-calculate').checked) {
            calculateWeightedGrade();
        }
    });
}

/**
 * Add a new grade input row
 */
function addGradeInput() {
    const gradeInputs = document.getElementById('grade-inputs');

    const row = document.createElement('div');
    row.className = 'grade-input-row';
    row.innerHTML = `
        <div class="grade-input-name">
            <input type="text" class="form-control grade-name" placeholder="Assignment Name">
        </div>
        <div class="grade-input-grade">
            <input type="number" class="form-control grade-value" placeholder="Grade" min="0" max="100">
        </div>
        <div class="grade-input-weight">
            <input type="number" class="form-control grade-weight" placeholder="Weight" min="0" max="100">
        </div>
        <div class="grade-input-action">
            <button type="button" class="remove-grade-btn" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    gradeInputs.appendChild(row);
}

/**
 * Calculate weighted grade
 */
function calculateWeightedGrade() {
    const gradeInputs = document.getElementById('grade-inputs');
    const rows = gradeInputs.querySelectorAll('.grade-input-row');
    const resultSection = document.getElementById('weighted-result-section');

    let totalPoints = 0;
    let totalWeight = 0;
    let validInputs = 0;

    rows.forEach(row => {
        const gradeInput = row.querySelector('.grade-value');
        const weightInput = row.querySelector('.grade-weight');

        const grade = parseFloat(gradeInput.value);
        const weight = parseFloat(weightInput.value);

        if (!isNaN(grade) && !isNaN(weight)) {
            totalPoints += grade * weight;
            totalWeight += weight;
            validInputs++;
        }
    });

    if (validInputs === 0) {
        showNotification('Please enter at least one valid grade and weight', 'error');
        return;
    }

    const weightedAverage = totalWeight > 0 ? totalPoints / totalWeight : 0;

    // Get decimal places setting
    const decimalPlaces = parseInt(document.getElementById('decimal-places').value);

    // Display results
    document.getElementById('grade-percentage').textContent = weightedAverage.toFixed(decimalPlaces) + '%';
    document.getElementById('total-points').textContent = totalPoints.toFixed(decimalPlaces);
    document.getElementById('total-weight').textContent = totalWeight.toFixed(decimalPlaces) + '%';
    document.getElementById('weighted-average').textContent = weightedAverage.toFixed(decimalPlaces) + '%';

    // Set letter grade
    const letterGrade = getLetterGrade(weightedAverage);
    document.getElementById('grade-letter').textContent = letterGrade;

    // Set grade summary
    const gradeSummary = document.getElementById('grade-summary');
    gradeSummary.textContent = getGradeSummary(weightedAverage, letterGrade);

    // Update grade meter
    const gradeMeterFill = document.getElementById('grade-meter-fill');
    gradeMeterFill.style.width = `${Math.min(100, Math.max(0, weightedAverage))}%`;

    // Set grade color
    setGradeColor(weightedAverage);

    // Show result section
    resultSection.classList.remove('hidden');
}

/**
 * Reset weighted grade calculator
 */
function resetWeightedGradeCalculator() {
    const gradeInputs = document.getElementById('grade-inputs');
    const resultSection = document.getElementById('weighted-result-section');

    // Clear all rows except the first one
    while (gradeInputs.querySelectorAll('.grade-input-row').length > 0) {
        gradeInputs.querySelector('.grade-input-row').remove();
    }

    // Add two empty rows
    addGradeInput();
    addGradeInput();

    // Hide result section
    resultSection.classList.add('hidden');
}

/**
 * Copy weighted grade results to clipboard
 */
function copyWeightedResults() {
    const percentage = document.getElementById('grade-percentage').textContent;
    const letterGrade = document.getElementById('grade-letter').textContent;
    const totalPoints = document.getElementById('total-points').textContent;
    const totalWeight = document.getElementById('total-weight').textContent;
    const weightedAverage = document.getElementById('weighted-average').textContent;

    const text = `Grade: ${percentage} (${letterGrade})\nTotal Points: ${totalPoints}\nTotal Weight: ${totalWeight}\nWeighted Average: ${weightedAverage}`;

    copyToClipboard(text);
}

/**
 * Save weighted grade results
 */
function saveWeightedResults() {
    // This would typically save to localStorage or a database
    // For now, just show a notification
    showNotification('Results saved successfully', 'success');
}

/**
 * Initialize Final Grade Calculator
 */
function initFinalGradeCalculator() {
    const calculateButton = document.getElementById('calculate-final');
    const resetButton = document.getElementById('reset-final');
    const resultSection = document.getElementById('final-result-section');
    const copyButton = document.getElementById('copy-final-result');

    // Calculate button click event
    calculateButton.addEventListener('click', () => {
        calculateFinalGrade();
    });

    // Reset button click event
    resetButton.addEventListener('click', () => {
        document.getElementById('current-grade').value = '';
        document.getElementById('current-weight').value = '';
        document.getElementById('final-weight').value = '';
        document.getElementById('desired-grade').value = '';
        resultSection.classList.add('hidden');
    });

    // Copy results button click event
    copyButton.addEventListener('click', () => {
        copyFinalResults();
    });

    // Auto calculate on input change if enabled
    const inputs = document.querySelectorAll('#calculator-final input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (document.getElementById('auto-calculate').checked) {
                calculateFinalGrade();
            }
        });
    });
}

/**
 * Calculate final grade
 */
function calculateFinalGrade() {
    const currentGrade = parseFloat(document.getElementById('current-grade').value);
    const currentWeight = parseFloat(document.getElementById('current-weight').value);
    const finalWeight = parseFloat(document.getElementById('final-weight').value);
    const desiredGrade = parseFloat(document.getElementById('desired-grade').value);
    const resultSection = document.getElementById('final-result-section');

    if (isNaN(currentGrade) || isNaN(currentWeight) || isNaN(finalWeight) || isNaN(desiredGrade)) {
        showNotification('Please fill in all fields with valid numbers', 'error');
        return;
    }

    if (currentWeight + finalWeight !== 100) {
        showNotification('Current weight and final weight must sum to 100%', 'error');
        return;
    }

    // Calculate required final exam grade
    const requiredGrade = (desiredGrade - (currentGrade * (currentWeight / 100))) / (finalWeight / 100);

    // Get decimal places setting
    const decimalPlaces = parseInt(document.getElementById('decimal-places').value);

    // Display results
    document.getElementById('final-percentage').textContent = requiredGrade.toFixed(decimalPlaces) + '%';

    // Set letter grade
    const letterGrade = getLetterGrade(requiredGrade);
    document.getElementById('final-letter').textContent = letterGrade;

    // Set feasibility
    const feasibility = document.getElementById('final-feasibility');
    if (requiredGrade > 100) {
        feasibility.textContent = 'Not Possible';
        feasibility.style.color = 'var(--grade-f)';
    } else if (requiredGrade > 90) {
        feasibility.textContent = 'Challenging';
        feasibility.style.color = 'var(--grade-c)';
    } else if (requiredGrade > 70) {
        feasibility.textContent = 'Achievable';
        feasibility.style.color = 'var(--grade-b)';
    } else {
        feasibility.textContent = 'Very Achievable';
        feasibility.style.color = 'var(--grade-a)';
    }

    // Set final summary
    const finalSummary = document.getElementById('final-summary');
    if (requiredGrade > 100) {
        finalSummary.textContent = `You need ${requiredGrade.toFixed(decimalPlaces)}% on your final exam to achieve a ${desiredGrade.toFixed(decimalPlaces)}% overall grade. This is not mathematically possible. Consider adjusting your desired grade or improving your current grade through extra credit opportunities if available.`;
    } else {
        finalSummary.textContent = `You need ${requiredGrade.toFixed(decimalPlaces)}% on your final exam to achieve a ${desiredGrade.toFixed(decimalPlaces)}% overall grade. This corresponds to a letter grade of ${letterGrade}.`;
    }

    // Show result section
    resultSection.classList.remove('hidden');
}

/**
 * Copy final grade results to clipboard
 */
function copyFinalResults() {
    const percentage = document.getElementById('final-percentage').textContent;
    const letterGrade = document.getElementById('final-letter').textContent;
    const feasibility = document.getElementById('final-feasibility').textContent;
    const summary = document.getElementById('final-summary').textContent;

    const text = `Required Final Exam Grade: ${percentage} (${letterGrade})\nFeasibility: ${feasibility}\n\n${summary}`;

    copyToClipboard(text);
}

/**
 * Get letter grade based on percentage
 * @param {number} percentage - Grade percentage
 * @returns {string} - Letter grade
 */
function getLetterGrade(percentage) {
    const scale = document.getElementById('grading-scale').value;

    if (scale === 'standard') {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    } else if (scale === 'plus-minus') {
        if (percentage >= 97) return 'A+';
        if (percentage >= 93) return 'A';
        if (percentage >= 90) return 'A-';
        if (percentage >= 87) return 'B+';
        if (percentage >= 83) return 'B';
        if (percentage >= 80) return 'B-';
        if (percentage >= 77) return 'C+';
        if (percentage >= 73) return 'C';
        if (percentage >= 70) return 'C-';
        if (percentage >= 67) return 'D+';
        if (percentage >= 63) return 'D';
        if (percentage >= 60) return 'D-';
        return 'F';
    }

    // Custom scale (not implemented yet)
    return 'N/A';
}

/**
 * Get grade summary based on percentage and letter grade
 * @param {number} percentage - Grade percentage
 * @param {string} letterGrade - Letter grade
 * @returns {string} - Grade summary
 */
function getGradeSummary(percentage, letterGrade) {
    if (percentage >= 90) {
        return `Excellent! Your grade of ${percentage.toFixed(2)}% (${letterGrade}) demonstrates outstanding achievement.`;
    } else if (percentage >= 80) {
        return `Good job! Your grade of ${percentage.toFixed(2)}% (${letterGrade}) shows solid understanding of the material.`;
    } else if (percentage >= 70) {
        return `Your grade of ${percentage.toFixed(2)}% (${letterGrade}) indicates satisfactory performance.`;
    } else if (percentage >= 60) {
        return `Your grade of ${percentage.toFixed(2)}% (${letterGrade}) suggests you may need additional study to improve your understanding.`;
    } else {
        return `Your grade of ${percentage.toFixed(2)}% (${letterGrade}) indicates significant challenges with the material. Consider seeking additional help.`;
    }
}

/**
 * Set grade color based on percentage
 * @param {number} percentage - Grade percentage
 */
function setGradeColor(percentage) {
    const letterGradeElement = document.getElementById('grade-letter');

    if (percentage >= 90) {
        letterGradeElement.style.background = 'var(--grade-a)';
    } else if (percentage >= 80) {
        letterGradeElement.style.background = 'var(--grade-b)';
    } else if (percentage >= 70) {
        letterGradeElement.style.background = 'var(--grade-c)';
    } else if (percentage >= 60) {
        letterGradeElement.style.background = 'var(--grade-d)';
    } else {
        letterGradeElement.style.background = 'var(--grade-f)';
    }
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
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    // Use modern clipboard API with fallback
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showNotification('Results copied to clipboard', 'success');
                })
                .catch(() => {
                    fallbackCopyToClipboard(text);
                });
        } else {
            fallbackCopyToClipboard(text);
        }
    } catch (err) {
        fallbackCopyToClipboard(text);
    }
}

/**
 * Fallback method to copy text to clipboard
 * @param {string} text - Text to copy
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);

    // Save current focus and selection
    const focused = document.activeElement;
    const selection = document.getSelection();

    // Select the text
    textArea.focus();
    textArea.select();

    // Copy the text
    let success = false;
    try {
        success = document.execCommand('copy');
    } catch (err) {
        console.error('Unable to copy to clipboard', err);
    }

    // Remove the textarea
    document.body.removeChild(textArea);

    // Restore previous selection and focus
    if (selection) {
        selection.removeAllRanges();
        if (selection.rangeCount > 0) {
            selection.addRange(selection.getRangeAt(0));
        }
    }
    if (focused && typeof focused.focus === 'function') {
        focused.focus();
    }

    if (success) {
        showNotification('Results copied to clipboard', 'success');
    } else {
        showNotification('Failed to copy results', 'error');
    }
}

/**
 * Initialize GPA Calculator
 */
function initGPACalculator() {
    const gpaInputs = document.getElementById('gpa-inputs');
    const addCourseButton = document.getElementById('add-course');
    const calculateButton = document.getElementById('calculate-gpa');
    const resetButton = document.getElementById('reset-gpa');
    const resultSection = document.getElementById('gpa-result-section');
    const copyButton = document.getElementById('copy-gpa-result');
    const saveButton = document.getElementById('save-gpa-result');

    // Add initial course inputs
    addCourseInput();
    addCourseInput();

    // Add course button click event
    addCourseButton.addEventListener('click', () => {
        addCourseInput();
    });

    // Calculate button click event
    calculateButton.addEventListener('click', () => {
        calculateGPA();
    });

    // Reset button click event
    resetButton.addEventListener('click', () => {
        resetGPACalculator();
    });

    // Copy results button click event
    copyButton.addEventListener('click', () => {
        copyGPAResults();
    });

    // Save results button click event
    saveButton.addEventListener('click', () => {
        saveGPAResults();
    });

    // Event delegation for remove course buttons
    gpaInputs.addEventListener('click', (e) => {
        if (e.target.closest('.remove-course-btn')) {
            const row = e.target.closest('.gpa-input-row');

            // Don't remove if it's the only row
            if (gpaInputs.querySelectorAll('.gpa-input-row').length > 1) {
                row.remove();

                // Auto calculate if enabled
                if (document.getElementById('auto-calculate').checked) {
                    calculateGPA();
                }
            }
        }
    });

    // Auto calculate on input change if enabled
    gpaInputs.addEventListener('input', () => {
        if (document.getElementById('auto-calculate').checked) {
            calculateGPA();
        }
    });
}

/**
 * Add a new course input row
 */
function addCourseInput() {
    const gpaInputs = document.getElementById('gpa-inputs');

    const row = document.createElement('div');
    row.className = 'gpa-input-row';
    row.innerHTML = `
        <div class="gpa-input-name">
            <input type="text" class="form-control course-name" placeholder="Course Name">
        </div>
        <div class="gpa-input-grade">
            <select class="form-control course-grade">
                <option value="">Select Grade</option>
                <option value="4.0">A (4.0)</option>
                <option value="3.7">A- (3.7)</option>
                <option value="3.3">B+ (3.3)</option>
                <option value="3.0">B (3.0)</option>
                <option value="2.7">B- (2.7)</option>
                <option value="2.3">C+ (2.3)</option>
                <option value="2.0">C (2.0)</option>
                <option value="1.7">C- (1.7)</option>
                <option value="1.3">D+ (1.3)</option>
                <option value="1.0">D (1.0)</option>
                <option value="0.7">D- (0.7)</option>
                <option value="0.0">F (0.0)</option>
            </select>
        </div>
        <div class="gpa-input-credits">
            <input type="number" class="form-control course-credits" placeholder="Credits" min="0" step="0.5">
        </div>
        <div class="gpa-input-action">
            <button type="button" class="remove-course-btn" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    gpaInputs.appendChild(row);
}

/**
 * Calculate GPA
 */
function calculateGPA() {
    const gpaInputs = document.getElementById('gpa-inputs');
    const rows = gpaInputs.querySelectorAll('.gpa-input-row');
    const resultSection = document.getElementById('gpa-result-section');

    let totalCredits = 0;
    let totalGradePoints = 0;
    let validCourses = 0;

    rows.forEach(row => {
        const gradeSelect = row.querySelector('.course-grade');
        const creditsInput = row.querySelector('.course-credits');

        const gradeValue = parseFloat(gradeSelect.value);
        const credits = parseFloat(creditsInput.value);

        if (!isNaN(gradeValue) && !isNaN(credits) && credits > 0) {
            totalGradePoints += gradeValue * credits;
            totalCredits += credits;
            validCourses++;
        }
    });

    if (validCourses === 0) {
        showNotification('Please enter at least one valid course with grade and credits', 'error');
        return;
    }

    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    // Get decimal places setting
    const decimalPlaces = parseInt(document.getElementById('decimal-places').value);

    // Display results
    document.getElementById('gpa-value').textContent = gpa.toFixed(decimalPlaces);
    document.getElementById('total-credits').textContent = totalCredits.toFixed(decimalPlaces);
    document.getElementById('total-grade-points').textContent = totalGradePoints.toFixed(decimalPlaces);
    document.getElementById('courses-included').textContent = validCourses;

    // Set GPA summary
    const gpaSummary = document.getElementById('gpa-summary');
    gpaSummary.textContent = getGPASummary(gpa);

    // Update GPA meter
    const gpaMeterFill = document.getElementById('gpa-meter-fill');
    gpaMeterFill.style.width = `${Math.min(100, Math.max(0, gpa / 4 * 100))}%`;

    // Set GPA color
    setGPAColor(gpa);

    // Show result section
    resultSection.classList.remove('hidden');
}

/**
 * Reset GPA calculator
 */
function resetGPACalculator() {
    const gpaInputs = document.getElementById('gpa-inputs');
    const resultSection = document.getElementById('gpa-result-section');

    // Clear all rows except the first one
    while (gpaInputs.querySelectorAll('.gpa-input-row').length > 0) {
        gpaInputs.querySelector('.gpa-input-row').remove();
    }

    // Add two empty rows
    addCourseInput();
    addCourseInput();

    // Hide result section
    resultSection.classList.add('hidden');
}

/**
 * Copy GPA results to clipboard
 */
function copyGPAResults() {
    const gpa = document.getElementById('gpa-value').textContent;
    const totalCredits = document.getElementById('total-credits').textContent;
    const totalGradePoints = document.getElementById('total-grade-points').textContent;
    const coursesIncluded = document.getElementById('courses-included').textContent;

    const text = `GPA: ${gpa} (4.0 Scale)\nTotal Credits: ${totalCredits}\nTotal Grade Points: ${totalGradePoints}\nCourses Included: ${coursesIncluded}`;

    copyToClipboard(text);
}

/**
 * Save GPA results
 */
function saveGPAResults() {
    // This would typically save to localStorage or a database
    // For now, just show a notification
    showNotification('Results saved successfully', 'success');
}

/**
 * Get GPA summary based on GPA value
 * @param {number} gpa - GPA value
 * @returns {string} - GPA summary
 */
function getGPASummary(gpa) {
    if (gpa >= 3.7) {
        return `Excellent! Your GPA of ${gpa.toFixed(2)} is in the A range, demonstrating outstanding academic achievement.`;
    } else if (gpa >= 3.0) {
        return `Good job! Your GPA of ${gpa.toFixed(2)} is in the B range, showing solid academic performance.`;
    } else if (gpa >= 2.0) {
        return `Your GPA of ${gpa.toFixed(2)} is in the C range, indicating satisfactory academic performance.`;
    } else if (gpa >= 1.0) {
        return `Your GPA of ${gpa.toFixed(2)} is in the D range, suggesting you may need to improve your academic performance.`;
    } else {
        return `Your GPA of ${gpa.toFixed(2)} is in the F range, indicating significant academic challenges. Consider seeking additional help.`;
    }
}

/**
 * Set GPA color based on GPA value
 * @param {number} gpa - GPA value
 */
function setGPAColor(gpa) {
    const gpaValueElement = document.getElementById('gpa-value');

    if (gpa >= 3.7) {
        gpaValueElement.style.color = 'var(--grade-a)';
    } else if (gpa >= 3.0) {
        gpaValueElement.style.color = 'var(--grade-b)';
    } else if (gpa >= 2.0) {
        gpaValueElement.style.color = 'var(--grade-c)';
    } else if (gpa >= 1.0) {
        gpaValueElement.style.color = 'var(--grade-d)';
    } else {
        gpaValueElement.style.color = 'var(--grade-f)';
    }
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

    // Clear any existing timeout
    if (window.notificationTimeout) {
        clearTimeout(window.notificationTimeout);
    }

    // Hide any visible notification first with a quick fade
    if (notification.classList.contains('show')) {
        notification.classList.remove('show');

        // Small delay to allow fade out before showing new notification
        setTimeout(() => {
            updateAndShowNotification();
        }, 200);
    } else {
        updateAndShowNotification();
    }

    function updateAndShowNotification() {
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

        // Show notification with animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Hide notification after 3 seconds
        window.notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}
