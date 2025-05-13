/**
 * GPA Calculator
 * A tool to calculate semester, cumulative, and target GPAs
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the GPA calculator
    initGPACalculator();
});

/**
 * Initialize the GPA calculator
 */
function initGPACalculator() {
    // Initialize tabs
    initTabs();

    // Initialize semester GPA calculator
    initSemesterGPA();

    // Initialize cumulative GPA calculator
    initCumulativeGPA();

    // Initialize target GPA calculator
    initTargetGPA();

    // Initialize settings
    initSettings();

    // Initialize theme toggle
    initThemeToggle();
}

/**
 * Initialize tabs
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
            const sectionId = button.id.replace('tab-', 'calculator-');
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

/**
 * Initialize semester GPA calculator
 */
function initSemesterGPA() {
    // Add initial course row
    addCourseRow();

    // Add course button
    document.getElementById('add-course').addEventListener('click', addCourseRow);

    // Calculate button
    document.getElementById('calculate-semester').addEventListener('click', calculateSemesterGPA);

    // Reset button
    document.getElementById('reset-semester').addEventListener('click', resetSemesterGPA);

    // Copy results button
    document.getElementById('copy-semester-result').addEventListener('click', () => {
        copyResults('semester');
    });

    // Save results button
    document.getElementById('save-semester-result').addEventListener('click', () => {
        saveResults('semester');
    });
}

/**
 * Add a new course row to the semester GPA calculator
 */
function addCourseRow() {
    const container = document.getElementById('semester-inputs');
    const rowCount = container.querySelectorAll('.gpa-input-row').length + 1;

    const row = document.createElement('div');
    row.className = 'gpa-input-row';
    row.innerHTML = `
        <div class="gpa-input-name">
            <input type="text" placeholder="Course ${rowCount}" class="course-name">
        </div>
        <div class="gpa-input-grade">
            <select class="course-grade">
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
            <input type="number" placeholder="3" class="course-credits" min="0" step="0.5" value="3">
        </div>
        <div class="gpa-input-action">
            <button type="button" class="remove-course" aria-label="Remove course">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    container.appendChild(row);

    // Add event listener to remove button
    row.querySelector('.remove-course').addEventListener('click', () => {
        if (container.querySelectorAll('.gpa-input-row').length > 1) {
            container.removeChild(row);
        } else {
            showNotification('You must have at least one course', 'error');
        }
    });

    // Add event listeners for auto-calculate
    if (document.getElementById('auto-calculate').checked) {
        row.querySelector('.course-grade').addEventListener('change', calculateSemesterGPA);
        row.querySelector('.course-credits').addEventListener('input', calculateSemesterGPA);
    }
}

/**
 * Calculate semester GPA
 */
function calculateSemesterGPA() {
    const rows = document.querySelectorAll('#semester-inputs .gpa-input-row');
    let totalCredits = 0;
    let totalGradePoints = 0;
    let coursesIncluded = 0;

    rows.forEach(row => {
        const grade = parseFloat(row.querySelector('.course-grade').value);
        const credits = parseFloat(row.querySelector('.course-credits').value);

        if (!isNaN(grade) && !isNaN(credits) && credits > 0) {
            totalGradePoints += grade * credits;
            totalCredits += credits;
            coursesIncluded++;
        }
    });

    // Calculate GPA
    let gpa = 0;
    if (totalCredits > 0) {
        gpa = totalGradePoints / totalCredits;
    }

    // Update result section
    document.getElementById('semester-gpa-value').textContent = gpa.toFixed(getDecimalPlaces());
    document.getElementById('semester-total-credits').textContent = totalCredits.toFixed(1);
    document.getElementById('semester-total-grade-points').textContent = totalGradePoints.toFixed(1);
    document.getElementById('semester-courses-included').textContent = coursesIncluded;

    // Update GPA meter
    const meterFill = document.getElementById('semester-gpa-meter-fill');
    const fillPercentage = (gpa / 4) * 100;
    meterFill.style.width = `${fillPercentage}%`;

    // Update summary
    const summary = document.getElementById('semester-gpa-summary');
    summary.innerHTML = getSemesterGPASummary(gpa);

    // Show result section
    document.getElementById('semester-result-section').classList.remove('hidden');
}

/**
 * Get semester GPA summary text
 * @param {number} gpa - The calculated GPA
 * @returns {string} - Summary text
 */
function getSemesterGPASummary(gpa) {
    if (gpa >= 3.5) {
        return 'Excellent work! Your GPA is in the top range, which is typically considered Dean\'s List or Honor Roll level.';
    } else if (gpa >= 3.0) {
        return 'Good job! Your GPA is solid and shows consistent academic performance.';
    } else if (gpa >= 2.0) {
        return 'Your GPA is satisfactory. Consider focusing on improving in some courses to raise your GPA.';
    } else {
        return 'Your GPA is below the typical graduation requirement of 2.0. Consider seeking academic support to improve your grades.';
    }
}

/**
 * Reset semester GPA calculator
 */
function resetSemesterGPA() {
    const container = document.getElementById('semester-inputs');
    container.innerHTML = `
        <div class="gpa-input-header">
            <div class="gpa-input-name">Course Name</div>
            <div class="gpa-input-grade">Grade</div>
            <div class="gpa-input-credits">Credits</div>
            <div class="gpa-input-action"></div>
        </div>
    `;

    // Add a new course row
    addCourseRow();

    // Hide result section
    document.getElementById('semester-result-section').classList.add('hidden');
}

/**
 * Initialize cumulative GPA calculator
 */
function initCumulativeGPA() {
    // Calculate button
    document.getElementById('calculate-cumulative').addEventListener('click', calculateCumulativeGPA);

    // Reset button
    document.getElementById('reset-cumulative').addEventListener('click', resetCumulativeGPA);

    // Copy results button
    document.getElementById('copy-cumulative-result').addEventListener('click', () => {
        copyResults('cumulative');
    });
}

/**
 * Calculate cumulative GPA
 */
function calculateCumulativeGPA() {
    const previousGPA = parseFloat(document.getElementById('previous-gpa').value);
    const previousCredits = parseFloat(document.getElementById('previous-credits').value);
    const newGPA = parseFloat(document.getElementById('new-gpa').value);
    const newCredits = parseFloat(document.getElementById('new-credits').value);

    // Validate inputs
    if (isNaN(previousGPA) || isNaN(previousCredits) || isNaN(newGPA) || isNaN(newCredits)) {
        showNotification('Please fill in all fields with valid numbers', 'error');
        return;
    }

    if (previousGPA < 0 || previousGPA > 4 || newGPA < 0 || newGPA > 4) {
        showNotification('GPA must be between 0 and 4', 'error');
        return;
    }

    if (previousCredits < 0 || newCredits < 0) {
        showNotification('Credits cannot be negative', 'error');
        return;
    }

    // Calculate cumulative GPA
    const totalCredits = previousCredits + newCredits;
    const totalGradePoints = (previousGPA * previousCredits) + (newGPA * newCredits);
    const cumulativeGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    const gpaChange = cumulativeGPA - previousGPA;

    // Update result section
    document.getElementById('cumulative-gpa-value').textContent = cumulativeGPA.toFixed(getDecimalPlaces());
    document.getElementById('cumulative-total-credits').textContent = totalCredits.toFixed(1);
    document.getElementById('cumulative-total-grade-points').textContent = totalGradePoints.toFixed(1);
    document.getElementById('cumulative-gpa-change').textContent = (gpaChange >= 0 ? '+' : '') + gpaChange.toFixed(getDecimalPlaces());

    // Update summary
    const summary = document.getElementById('cumulative-gpa-summary');
    summary.innerHTML = getCumulativeGPASummary(cumulativeGPA, gpaChange);

    // Show result section
    document.getElementById('cumulative-result-section').classList.remove('hidden');
}

/**
 * Get cumulative GPA summary text
 * @param {number} gpa - The calculated GPA
 * @param {number} change - The change in GPA
 * @returns {string} - Summary text
 */
function getCumulativeGPASummary(gpa, change) {
    let summary = '';

    if (gpa >= 3.5) {
        summary = 'Your cumulative GPA is excellent and in the top range.';
    } else if (gpa >= 3.0) {
        summary = 'Your cumulative GPA is good and shows consistent academic performance.';
    } else if (gpa >= 2.0) {
        summary = 'Your cumulative GPA is satisfactory but could be improved.';
    } else {
        summary = 'Your cumulative GPA is below the typical graduation requirement of 2.0.';
    }

    if (change > 0.1) {
        summary += ' Your GPA has improved significantly this semester!';
    } else if (change > 0) {
        summary += ' Your GPA has improved slightly this semester.';
    } else if (change < -0.1) {
        summary += ' Your GPA has decreased significantly this semester. Consider seeking academic support.';
    } else if (change < 0) {
        summary += ' Your GPA has decreased slightly this semester.';
    } else {
        summary += ' Your GPA has remained stable this semester.';
    }

    return summary;
}

/**
 * Reset cumulative GPA calculator
 */
function resetCumulativeGPA() {
    document.getElementById('previous-gpa').value = '';
    document.getElementById('previous-credits').value = '';
    document.getElementById('new-gpa').value = '';
    document.getElementById('new-credits').value = '';

    // Hide result section
    document.getElementById('cumulative-result-section').classList.add('hidden');
}

/**
 * Initialize target GPA calculator
 */
function initTargetGPA() {
    // Calculate button
    document.getElementById('calculate-target').addEventListener('click', calculateTargetGPA);

    // Reset button
    document.getElementById('reset-target').addEventListener('click', resetTargetGPA);

    // Copy results button
    document.getElementById('copy-target-result').addEventListener('click', () => {
        copyResults('target');
    });
}

/**
 * Calculate target GPA
 */
function calculateTargetGPA() {
    const currentGPA = parseFloat(document.getElementById('current-gpa').value);
    const currentCredits = parseFloat(document.getElementById('current-credits').value);
    const targetGPA = parseFloat(document.getElementById('target-gpa').value);
    const remainingCredits = parseFloat(document.getElementById('remaining-credits').value);

    // Validate inputs
    if (isNaN(currentGPA) || isNaN(currentCredits) || isNaN(targetGPA) || isNaN(remainingCredits)) {
        showNotification('Please fill in all fields with valid numbers', 'error');
        return;
    }

    if (currentGPA < 0 || currentGPA > 4 || targetGPA < 0 || targetGPA > 4) {
        showNotification('GPA must be between 0 and 4', 'error');
        return;
    }

    if (currentCredits < 0 || remainingCredits < 0) {
        showNotification('Credits cannot be negative', 'error');
        return;
    }

    // Calculate required GPA for remaining credits
    const totalCredits = currentCredits + remainingCredits;
    const targetTotalPoints = targetGPA * totalCredits;
    const currentTotalPoints = currentGPA * currentCredits;
    const requiredPoints = targetTotalPoints - currentTotalPoints;
    const requiredGPA = requiredPoints / remainingCredits;

    // Update result section
    document.getElementById('required-gpa-value').textContent = requiredGPA.toFixed(getDecimalPlaces());

    // Determine feasibility
    const feasibilityElement = document.getElementById('target-feasibility');
    if (requiredGPA > 4.0) {
        feasibilityElement.textContent = 'Not Possible';
        feasibilityElement.style.color = 'var(--danger)';
    } else if (requiredGPA > 3.5) {
        feasibilityElement.textContent = 'Very Challenging';
        feasibilityElement.style.color = 'var(--warning)';
    } else if (requiredGPA > 3.0) {
        feasibilityElement.textContent = 'Challenging';
        feasibilityElement.style.color = 'var(--warning)';
    } else if (requiredGPA > 2.0) {
        feasibilityElement.textContent = 'Achievable';
        feasibilityElement.style.color = 'var(--success)';
    } else if (requiredGPA >= 0) {
        feasibilityElement.textContent = 'Easily Achievable';
        feasibilityElement.style.color = 'var(--success)';
    } else {
        feasibilityElement.textContent = 'Already Achieved';
        feasibilityElement.style.color = 'var(--info)';
    }

    // Update summary
    const summary = document.getElementById('target-gpa-summary');
    summary.innerHTML = getTargetGPASummary(requiredGPA, targetGPA);

    // Show result section
    document.getElementById('target-result-section').classList.remove('hidden');
}

/**
 * Get target GPA summary text
 * @param {number} requiredGPA - The required GPA
 * @param {number} targetGPA - The target GPA
 * @returns {string} - Summary text
 */
function getTargetGPASummary(requiredGPA, targetGPA) {
    if (requiredGPA > 4.0) {
        return `It's not mathematically possible to achieve a ${targetGPA.toFixed(getDecimalPlaces())} GPA with the remaining credits. Consider adjusting your target GPA or taking more credits.`;
    } else if (requiredGPA > 3.5) {
        return `You'll need to earn mostly A's in your remaining courses to achieve your target GPA of ${targetGPA.toFixed(getDecimalPlaces())}.`;
    } else if (requiredGPA > 3.0) {
        return `You'll need to earn mostly A's and B's in your remaining courses to achieve your target GPA of ${targetGPA.toFixed(getDecimalPlaces())}.`;
    } else if (requiredGPA > 2.0) {
        return `You'll need to earn mostly B's and C's in your remaining courses to achieve your target GPA of ${targetGPA.toFixed(getDecimalPlaces())}.`;
    } else if (requiredGPA >= 0) {
        return `You can easily achieve your target GPA of ${targetGPA.toFixed(getDecimalPlaces())} by maintaining passing grades in your remaining courses.`;
    } else {
        return `You've already achieved your target GPA of ${targetGPA.toFixed(getDecimalPlaces())}. Even if you earn all F's in your remaining courses, your GPA would still be above your target.`;
    }
}

/**
 * Reset target GPA calculator
 */
function resetTargetGPA() {
    document.getElementById('current-gpa').value = '';
    document.getElementById('current-credits').value = '';
    document.getElementById('target-gpa').value = '';
    document.getElementById('remaining-credits').value = '';

    // Hide result section
    document.getElementById('target-result-section').classList.add('hidden');
}

/**
 * Initialize settings
 */
function initSettings() {
    // Settings button
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtn = settingsModal.querySelector('.close-btn');

    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Auto-calculate toggle
    document.getElementById('auto-calculate').addEventListener('change', (e) => {
        const inputs = document.querySelectorAll('.course-grade, .course-credits');
        if (e.target.checked) {
            inputs.forEach(input => {
                input.addEventListener('change', calculateSemesterGPA);
                input.addEventListener('input', calculateSemesterGPA);
            });
        } else {
            inputs.forEach(input => {
                input.removeEventListener('change', calculateSemesterGPA);
                input.removeEventListener('input', calculateSemesterGPA);
            });
        }
    });
}

/**
 * Initialize theme toggle
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');

        if (document.body.classList.contains('light-mode')) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        icon.className = 'fas fa-sun';
    }
}

/**
 * Copy results to clipboard
 * @param {string} type - The type of results to copy (semester, cumulative, target)
 */
function copyResults(type) {
    let text = '';

    if (type === 'semester') {
        const gpa = document.getElementById('semester-gpa-value').textContent;
        const credits = document.getElementById('semester-total-credits').textContent;
        const courses = document.getElementById('semester-courses-included').textContent;

        text = `Semester GPA: ${gpa} (${credits} credits, ${courses} courses)`;
    } else if (type === 'cumulative') {
        const gpa = document.getElementById('cumulative-gpa-value').textContent;
        const credits = document.getElementById('cumulative-total-credits').textContent;
        const change = document.getElementById('cumulative-gpa-change').textContent;

        text = `Cumulative GPA: ${gpa} (${credits} total credits, ${change} change)`;
    } else if (type === 'target') {
        const requiredGPA = document.getElementById('required-gpa-value').textContent;
        const feasibility = document.getElementById('target-feasibility').textContent;

        text = `Required GPA for remaining credits: ${requiredGPA} (${feasibility})`;
    }

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
 * Save results to local storage
 * @param {string} type - The type of results to save (semester, cumulative)
 */
function saveResults(type) {
    let savedResults = JSON.parse(localStorage.getItem('gpaResults')) || [];
    const date = new Date().toLocaleDateString();

    if (type === 'semester') {
        const gpa = document.getElementById('semester-gpa-value').textContent;
        const credits = document.getElementById('semester-total-credits').textContent;
        const courses = document.getElementById('semester-courses-included').textContent;

        savedResults.push({
            type: 'Semester GPA',
            gpa,
            credits,
            courses,
            date
        });
    } else if (type === 'cumulative') {
        const gpa = document.getElementById('cumulative-gpa-value').textContent;
        const credits = document.getElementById('cumulative-total-credits').textContent;
        const change = document.getElementById('cumulative-gpa-change').textContent;

        savedResults.push({
            type: 'Cumulative GPA',
            gpa,
            credits,
            change,
            date
        });
    }

    // Limit to 10 most recent results
    if (savedResults.length > 10) {
        savedResults = savedResults.slice(-10);
    }

    localStorage.setItem('gpaResults', JSON.stringify(savedResults));
    showNotification('Results saved successfully', 'success');
}

/**
 * Show notification
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info)
 */
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = document.querySelector('.notification-icon');

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

/**
 * Get decimal places from settings
 * @returns {number} - Number of decimal places
 */
function getDecimalPlaces() {
    const decimalPlaces = document.getElementById('decimal-places');
    return parseInt(decimalPlaces.value) || 2;
}
