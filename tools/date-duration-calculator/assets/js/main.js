// ===== DATE DURATION CALCULATOR SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the date duration calculator
    initDateDurationCalculator();

    // Initialize settings
    initSettings();
});

/**
 * Initialize the date duration calculator
 */
function initDateDurationCalculator() {
    // Date Duration Calculator initialization

    // Tab elements
    const tabDuration = document.getElementById('tab-duration');
    const tabAdd = document.getElementById('tab-add');
    const tabSubtract = document.getElementById('tab-subtract');
    const tabWorkdays = document.getElementById('tab-workdays');

    // Calculator sections
    const calculatorDuration = document.getElementById('calculator-duration');
    const calculatorAdd = document.getElementById('calculator-add');
    const calculatorSubtract = document.getElementById('calculator-subtract');
    const calculatorWorkdays = document.getElementById('calculator-workdays');

    // Duration calculator elements
    const startDate = document.getElementById('start-date');
    const startTime = document.getElementById('start-time');
    const endDate = document.getElementById('end-date');
    const endTime = document.getElementById('end-time');
    const includeEndDate = document.getElementById('include-end-date');
    const excludeWeekends = document.getElementById('exclude-weekends');
    const calculateDurationBtn = document.getElementById('calculate-duration');
    const resetDurationBtn = document.getElementById('reset-duration');
    const durationResultSection = document.getElementById('duration-result-section');
    const durationYears = document.getElementById('duration-years');
    const durationMonths = document.getElementById('duration-months');
    const durationDays = document.getElementById('duration-days');
    const totalYears = document.getElementById('total-years');
    const totalMonths = document.getElementById('total-months');
    const totalWeeks = document.getElementById('total-weeks');
    const totalDays = document.getElementById('total-days');
    const totalHours = document.getElementById('total-hours');
    const totalMinutes = document.getElementById('total-minutes');
    const durationText = document.getElementById('duration-text');
    const copyDurationBtn = document.getElementById('copy-duration');

    // Add to date calculator elements
    const baseDate = document.getElementById('base-date');
    const baseTime = document.getElementById('base-time');
    const addYears = document.getElementById('add-years');
    const addMonths = document.getElementById('add-months');
    const addDays = document.getElementById('add-days');
    const addHours = document.getElementById('add-hours');
    const addMinutes = document.getElementById('add-minutes');
    const calculateAddBtn = document.getElementById('calculate-add');
    const resetAddBtn = document.getElementById('reset-add');
    const addResultSection = document.getElementById('add-result-section');
    const newDateValue = document.getElementById('new-date-value');
    const addSummary = document.getElementById('add-summary');
    const copyAddResultBtn = document.getElementById('copy-add-result');

    // Subtract from date calculator elements
    const subtractBaseDate = document.getElementById('subtract-base-date');
    const subtractBaseTime = document.getElementById('subtract-base-time');
    const subtractYears = document.getElementById('subtract-years');
    const subtractMonths = document.getElementById('subtract-months');
    const subtractDays = document.getElementById('subtract-days');
    const subtractHours = document.getElementById('subtract-hours');
    const subtractMinutes = document.getElementById('subtract-minutes');
    const calculateSubtractBtn = document.getElementById('calculate-subtract');
    const resetSubtractBtn = document.getElementById('reset-subtract');
    const subtractResultSection = document.getElementById('subtract-result-section');
    const subtractDateValue = document.getElementById('subtract-date-value');
    const subtractSummary = document.getElementById('subtract-summary');
    const copySubtractResultBtn = document.getElementById('copy-subtract-result');

    // Working days calculator elements
    const workdaysStartDate = document.getElementById('workdays-start-date');
    const workdaysEndDate = document.getElementById('workdays-end-date');
    const includeWorkdaysEndDate = document.getElementById('include-workdays-end-date');
    const excludeHolidays = document.getElementById('exclude-holidays');
    const holidaysList = document.getElementById('holidays-list');
    const holidayDate = document.getElementById('holiday-date');
    const holidayName = document.getElementById('holiday-name');
    const addHolidayBtn = document.getElementById('add-holiday');
    const calculateWorkdaysBtn = document.getElementById('calculate-workdays');
    const resetWorkdaysBtn = document.getElementById('reset-workdays');
    const workdaysResultSection = document.getElementById('workdays-result-section');
    const workdaysCount = document.getElementById('workdays-count');
    const totalCalendarDays = document.getElementById('total-calendar-days');
    const weekendDaysCount = document.getElementById('weekend-days-count');
    const holidaysCount = document.getElementById('holidays-count');
    const workdaysText = document.getElementById('workdays-text');
    const copyWorkdaysResultBtn = document.getElementById('copy-workdays-result');

    // Settings
    const dateFormat = document.getElementById('date-format');
    const timeFormat = document.getElementById('time-format');
    const autoCalculate = document.getElementById('auto-calculate');
    const weekendSunday = document.getElementById('weekend-sunday');
    const weekendSaturday = document.getElementById('weekend-saturday');

    // Initialize with current date
    const today = new Date();
    const todayStr = formatDateForInput(today);

    if (startDate) startDate.value = todayStr;
    if (endDate) endDate.value = todayStr;
    if (baseDate) baseDate.value = todayStr;
    if (subtractBaseDate) subtractBaseDate.value = todayStr;
    if (workdaysStartDate) workdaysStartDate.value = todayStr;
    if (workdaysEndDate) workdaysEndDate.value = todayStr;
    if (holidayDate) holidayDate.value = todayStr;

    // Initialize holidays array
    let holidays = [];

    // Event Listeners - Tabs
    tabDuration.addEventListener('click', () => switchTab('duration'));
    tabAdd.addEventListener('click', () => switchTab('add'));
    tabSubtract.addEventListener('click', () => switchTab('subtract'));
    tabWorkdays.addEventListener('click', () => switchTab('workdays'));

    // Event Listeners - Duration Calculator
    startDate.addEventListener('change', handleDurationInput);
    startTime.addEventListener('input', handleDurationInput);
    endDate.addEventListener('change', handleDurationInput);
    endTime.addEventListener('input', handleDurationInput);
    includeEndDate.addEventListener('change', handleDurationInput);
    excludeWeekends.addEventListener('change', handleDurationInput);
    calculateDurationBtn.addEventListener('click', calculateDuration);
    resetDurationBtn.addEventListener('click', resetDuration);
    copyDurationBtn.addEventListener('click', copyDurationResult);

    // Event Listeners - Add to Date Calculator
    baseDate.addEventListener('change', handleAddInput);
    baseTime.addEventListener('input', handleAddInput);
    addYears.addEventListener('input', handleAddInput);
    addMonths.addEventListener('input', handleAddInput);
    addDays.addEventListener('input', handleAddInput);
    addHours.addEventListener('input', handleAddInput);
    addMinutes.addEventListener('input', handleAddInput);
    calculateAddBtn.addEventListener('click', calculateAdd);
    resetAddBtn.addEventListener('click', resetAdd);
    copyAddResultBtn.addEventListener('click', copyAddResult);

    // Event Listeners - Subtract from Date Calculator
    subtractBaseDate.addEventListener('change', handleSubtractInput);
    subtractBaseTime.addEventListener('input', handleSubtractInput);
    subtractYears.addEventListener('input', handleSubtractInput);
    subtractMonths.addEventListener('input', handleSubtractInput);
    subtractDays.addEventListener('input', handleSubtractInput);
    subtractHours.addEventListener('input', handleSubtractInput);
    subtractMinutes.addEventListener('input', handleSubtractInput);
    calculateSubtractBtn.addEventListener('click', calculateSubtract);
    resetSubtractBtn.addEventListener('click', resetSubtract);
    copySubtractResultBtn.addEventListener('click', copySubtractResult);

    // Event Listeners - Working Days Calculator
    workdaysStartDate.addEventListener('change', handleWorkdaysInput);
    workdaysEndDate.addEventListener('change', handleWorkdaysInput);
    includeWorkdaysEndDate.addEventListener('change', handleWorkdaysInput);
    excludeHolidays.addEventListener('change', handleWorkdaysInput);
    addHolidayBtn.addEventListener('click', addHoliday);
    calculateWorkdaysBtn.addEventListener('click', calculateWorkdays);
    resetWorkdaysBtn.addEventListener('click', resetWorkdays);
    copyWorkdaysResultBtn.addEventListener('click', copyWorkdaysResult);

    // Event Listeners - Settings
    dateFormat.addEventListener('change', updateSettings);
    timeFormat.addEventListener('change', updateSettings);
    autoCalculate.addEventListener('change', updateSettings);
    weekendSunday.addEventListener('change', updateSettings);
    weekendSaturday.addEventListener('change', updateSettings);

    /**
     * Switch between calculator tabs
     * @param {string} tabId - ID of the tab to switch to
     */
    function switchTab(tabId) {
        // Hide all calculator sections
        calculatorDuration.classList.remove('active');
        calculatorAdd.classList.remove('active');
        calculatorSubtract.classList.remove('active');
        calculatorWorkdays.classList.remove('active');

        // Deactivate all tab buttons
        tabDuration.classList.remove('active');
        tabAdd.classList.remove('active');
        tabSubtract.classList.remove('active');
        tabWorkdays.classList.remove('active');

        // Show selected calculator section and activate tab button
        switch (tabId) {
            case 'duration':
                calculatorDuration.classList.add('active');
                tabDuration.classList.add('active');
                break;
            case 'add':
                calculatorAdd.classList.add('active');
                tabAdd.classList.add('active');
                break;
            case 'subtract':
                calculatorSubtract.classList.add('active');
                tabSubtract.classList.add('active');
                break;
            case 'workdays':
                calculatorWorkdays.classList.add('active');
                tabWorkdays.classList.add('active');
                break;
        }
    }

    /**
     * Handle input in the duration calculator
     */
    function handleDurationInput() {
        if (autoCalculate.checked) {
            calculateDuration();
        }
    }

    /**
     * Calculate duration between two dates
     */
    function calculateDuration() {
        const startDateValue = startDate.value;
        const startTimeValue = startTime.value || '00:00';
        const endDateValue = endDate.value;
        const endTimeValue = endTime.value || '00:00';

        if (!startDateValue || !endDateValue) {
            showNotification('Please enter both start and end dates', 'error');
            return;
        }

        // Create date objects
        const startDateTime = new Date(`${startDateValue}T${startTimeValue}`);
        const endDateTime = new Date(`${endDateValue}T${endTimeValue}`);

        // Validate dates
        if (endDateTime < startDateTime) {
            showNotification('End date cannot be before start date', 'error');
            return;
        }

        // Calculate duration
        const duration = calculateDateDuration(startDateTime, endDateTime, includeEndDate.checked, excludeWeekends.checked);

        // Update UI
        durationYears.textContent = duration.years;
        durationMonths.textContent = duration.months;
        durationDays.textContent = duration.days;

        // Calculate total values
        const totalValues = calculateTotalValues(startDateTime, endDateTime, includeEndDate.checked, excludeWeekends.checked);

        // Update total values
        totalYears.textContent = totalValues.years;
        totalMonths.textContent = totalValues.months;
        totalWeeks.textContent = totalValues.weeks;
        totalDays.textContent = totalValues.days;
        totalHours.textContent = totalValues.hours;
        totalMinutes.textContent = totalValues.minutes;

        // Update duration text
        durationText.textContent = `The duration between the dates is ${duration.years} years, ${duration.months} months, and ${duration.days} days.`;

        // Show result section
        durationResultSection.classList.remove('hidden');
    }

    /**
     * Calculate duration between two dates
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @param {boolean} includeEnd - Whether to include end date in calculation
     * @param {boolean} excludeWeekends - Whether to exclude weekends from calculation
     * @returns {Object} - Duration in years, months, and days
     */
    function calculateDateDuration(startDate, endDate, includeEnd, excludeWeekends) {
        // Clone dates to avoid modifying originals
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Include end date if specified
        if (includeEnd) {
            end.setDate(end.getDate() + 1);
        }

        // Calculate years, months, and days
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        // Adjust for negative days
        if (days < 0) {
            months--;
            // Get the last day of the previous month
            const lastDayOfPrevMonth = new Date(
                end.getFullYear(),
                end.getMonth(),
                0
            ).getDate();
            days += lastDayOfPrevMonth;
        }

        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }

        // Exclude weekends if specified
        if (excludeWeekends) {
            // This is a simplified approach - for a more accurate calculation,
            // we would need to count actual weekend days between the dates
            const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
            const weekends = Math.floor(totalDays / 7) * 2;

            // Adjust days
            days -= weekends % 30;
            if (days < 0) {
                months--;
                days += 30;
            }

            // Adjust months
            months -= Math.floor(weekends / 30);
            if (months < 0) {
                years--;
                months += 12;
            }
        }

        return { years, months, days };
    }

    /**
     * Calculate total values (years, months, weeks, days, hours, minutes)
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @param {boolean} includeEnd - Whether to include end date in calculation
     * @param {boolean} excludeWeekends - Whether to exclude weekends from calculation
     * @returns {Object} - Total values
     */
    function calculateTotalValues(startDate, endDate, includeEnd, excludeWeekends) {
        // Clone dates to avoid modifying originals
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Include end date if specified
        if (includeEnd) {
            end.setDate(end.getDate() + 1);
        }

        // Calculate difference in milliseconds
        let diffMs = end - start;

        // Exclude weekends if specified
        if (excludeWeekends) {
            const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const weekends = Math.floor(totalDays / 7) * 2;
            diffMs -= weekends * 24 * 60 * 60 * 1000;
        }

        // Calculate total values
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365.25);
        const months = Math.floor(diffDays / 30.44);
        const weeks = Math.floor(diffDays / 7);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor(diffMs / (1000 * 60));

        return { years, months, weeks, days: diffDays, hours, minutes };
    }

    /**
     * Reset the duration calculator
     */
    function resetDuration() {
        startDate.value = todayStr;
        startTime.value = '';
        endDate.value = todayStr;
        endTime.value = '';
        includeEndDate.checked = false;
        excludeWeekends.checked = false;
        durationResultSection.classList.add('hidden');
    }

    /**
     * Copy duration result to clipboard
     */
    function copyDurationResult() {
        const result = `Duration: ${durationYears.textContent} years, ${durationMonths.textContent} months, ${durationDays.textContent} days
Total Days: ${totalDays.textContent}
Total Hours: ${totalHours.textContent}
Total Minutes: ${totalMinutes.textContent}`;

        copyToClipboard(result);
    }

    /**
     * Handle input in the add to date calculator
     */
    function handleAddInput() {
        if (autoCalculate.checked) {
            calculateAdd();
        }
    }

    /**
     * Calculate new date after adding duration
     */
    function calculateAdd() {
        const baseDateValue = baseDate.value;
        const baseTimeValue = baseTime.value || '00:00';

        if (!baseDateValue) {
            showNotification('Please enter a base date', 'error');
            return;
        }

        // Get duration values
        const years = parseInt(addYears.value) || 0;
        const months = parseInt(addMonths.value) || 0;
        const days = parseInt(addDays.value) || 0;
        const hours = parseInt(addHours.value) || 0;
        const minutes = parseInt(addMinutes.value) || 0;

        // Create date object
        const baseDateTime = new Date(`${baseDateValue}T${baseTimeValue}`);

        // Add duration
        const newDate = addDuration(baseDateTime, years, months, days, hours, minutes);

        // Format new date
        const formattedDate = formatDate(newDate);

        // Update UI
        newDateValue.textContent = formattedDate;

        // Update summary
        addSummary.textContent = `After adding ${years} years, ${months} months, ${days} days, ${hours} hours, and ${minutes} minutes to ${formatDate(baseDateTime)}, the new date is ${formattedDate}.`;

        // Show result section
        addResultSection.classList.remove('hidden');
    }

    /**
     * Add duration to a date
     * @param {Date} date - Base date
     * @param {number} years - Years to add
     * @param {number} months - Months to add
     * @param {number} days - Days to add
     * @param {number} hours - Hours to add
     * @param {number} minutes - Minutes to add
     * @returns {Date} - New date
     */
    function addDuration(date, years, months, days, hours, minutes) {
        // Clone date to avoid modifying original
        const newDate = new Date(date);

        // Add duration
        newDate.setFullYear(newDate.getFullYear() + years);
        newDate.setMonth(newDate.getMonth() + months);
        newDate.setDate(newDate.getDate() + days);
        newDate.setHours(newDate.getHours() + hours);
        newDate.setMinutes(newDate.getMinutes() + minutes);

        return newDate;
    }

    /**
     * Reset the add to date calculator
     */
    function resetAdd() {
        baseDate.value = todayStr;
        baseTime.value = '';
        addYears.value = '0';
        addMonths.value = '0';
        addDays.value = '0';
        addHours.value = '0';
        addMinutes.value = '0';
        addResultSection.classList.add('hidden');
    }

    /**
     * Copy add result to clipboard
     */
    function copyAddResult() {
        copyToClipboard(newDateValue.textContent);
    }

    /**
     * Handle input in the subtract from date calculator
     */
    function handleSubtractInput() {
        if (autoCalculate.checked) {
            calculateSubtract();
        }
    }

    /**
     * Calculate new date after subtracting duration
     */
    function calculateSubtract() {
        const baseDateValue = subtractBaseDate.value;
        const baseTimeValue = subtractBaseTime.value || '00:00';

        if (!baseDateValue) {
            showNotification('Please enter a base date', 'error');
            return;
        }

        // Get duration values
        const years = parseInt(subtractYears.value) || 0;
        const months = parseInt(subtractMonths.value) || 0;
        const days = parseInt(subtractDays.value) || 0;
        const hours = parseInt(subtractHours.value) || 0;
        const minutes = parseInt(subtractMinutes.value) || 0;

        // Create date object
        const baseDateTime = new Date(`${baseDateValue}T${baseTimeValue}`);

        // Subtract duration
        const newDate = subtractDuration(baseDateTime, years, months, days, hours, minutes);

        // Format new date
        const formattedDate = formatDate(newDate);

        // Update UI
        subtractDateValue.textContent = formattedDate;

        // Update summary
        subtractSummary.textContent = `After subtracting ${years} years, ${months} months, ${days} days, ${hours} hours, and ${minutes} minutes from ${formatDate(baseDateTime)}, the new date is ${formattedDate}.`;

        // Show result section
        subtractResultSection.classList.remove('hidden');
    }

    /**
     * Subtract duration from a date
     * @param {Date} date - Base date
     * @param {number} years - Years to subtract
     * @param {number} months - Months to subtract
     * @param {number} days - Days to subtract
     * @param {number} hours - Hours to subtract
     * @param {number} minutes - Minutes to subtract
     * @returns {Date} - New date
     */
    function subtractDuration(date, years, months, days, hours, minutes) {
        // Clone date to avoid modifying original
        const newDate = new Date(date);

        // Subtract duration
        newDate.setFullYear(newDate.getFullYear() - years);
        newDate.setMonth(newDate.getMonth() - months);
        newDate.setDate(newDate.getDate() - days);
        newDate.setHours(newDate.getHours() - hours);
        newDate.setMinutes(newDate.getMinutes() - minutes);

        return newDate;
    }

    /**
     * Reset the subtract from date calculator
     */
    function resetSubtract() {
        subtractBaseDate.value = todayStr;
        subtractBaseTime.value = '';
        subtractYears.value = '0';
        subtractMonths.value = '0';
        subtractDays.value = '0';
        subtractHours.value = '0';
        subtractMinutes.value = '0';
        subtractResultSection.classList.add('hidden');
    }

    /**
     * Copy subtract result to clipboard
     */
    function copySubtractResult() {
        copyToClipboard(subtractDateValue.textContent);
    }

    /**
     * Handle input in the working days calculator
     */
    function handleWorkdaysInput() {
        if (autoCalculate.checked) {
            calculateWorkdays();
        }
    }

    /**
     * Add a holiday to the list
     */
    function addHoliday() {
        const date = holidayDate.value;
        const name = holidayName.value.trim() || 'Holiday';

        if (!date) {
            showNotification('Please select a holiday date', 'error');
            return;
        }

        // Add to holidays array
        const holiday = {
            date: date,
            name: name
        };

        holidays.push(holiday);

        // Update UI
        renderHolidays();

        // Clear inputs
        holidayDate.value = todayStr;
        holidayName.value = '';

        // Recalculate if auto-calculate is enabled
        if (autoCalculate.checked) {
            calculateWorkdays();
        }
    }

    /**
     * Render holidays list
     */
    function renderHolidays() {
        // Sort holidays by date
        holidays.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Clear list
        holidaysList.innerHTML = '';

        // Add holidays to list
        if (holidays.length === 0) {
            holidaysList.innerHTML = '<div class="empty-message">No holidays added yet</div>';
            return;
        }

        holidays.forEach((holiday, index) => {
            const holidayItem = document.createElement('div');
            holidayItem.className = 'holiday-item';

            const formattedDate = formatDate(new Date(holiday.date), 'short');

            holidayItem.innerHTML = `
                <div class="holiday-info">
                    <span class="holiday-date">${formattedDate}</span>
                    <span class="holiday-name">${holiday.name}</span>
                </div>
                <button type="button" class="remove-holiday" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;

            holidaysList.appendChild(holidayItem);
        });

        // Add event listeners to remove buttons
        const removeButtons = holidaysList.querySelectorAll('.remove-holiday');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                removeHoliday(index);
            });
        });
    }

    /**
     * Remove a holiday from the list
     * @param {number} index - Index of the holiday to remove
     */
    function removeHoliday(index) {
        holidays.splice(index, 1);
        renderHolidays();

        // Recalculate if auto-calculate is enabled
        if (autoCalculate.checked) {
            calculateWorkdays();
        }
    }

    /**
     * Calculate working days between two dates
     */
    function calculateWorkdays() {
        const startDateValue = workdaysStartDate.value;
        const endDateValue = workdaysEndDate.value;

        if (!startDateValue || !endDateValue) {
            showNotification('Please enter both start and end dates', 'error');
            return;
        }

        // Create date objects
        const start = new Date(startDateValue);
        const end = new Date(endDateValue);

        // Validate dates
        if (start > end) {
            showNotification('Start date must be before end date', 'error');
            return;
        }

        // Calculate total calendar days
        const totalDays = calculateDaysBetween(start, end, includeWorkdaysEndDate.checked);

        // Calculate weekend days
        const weekendDays = countWeekendDays(start, end, includeWorkdaysEndDate.checked);

        // Calculate holidays (excluding weekends)
        const holidayDays = excludeHolidays.checked ? countHolidayDays(start, end, includeWorkdaysEndDate.checked) : 0;

        // Calculate working days
        const workingDays = totalDays - weekendDays - holidayDays;

        // Update UI
        workdaysCount.textContent = workingDays;
        totalCalendarDays.textContent = totalDays;
        weekendDaysCount.textContent = weekendDays;
        holidaysCount.textContent = holidayDays;

        // Update text
        const startFormatted = formatDate(start, 'short');
        const endFormatted = formatDate(end, 'short');
        workdaysText.textContent = `There are ${workingDays} working days between ${startFormatted} and ${endFormatted}.`;

        // Show result section
        workdaysResultSection.classList.remove('hidden');
    }

    /**
     * Calculate days between two dates
     * @param {Date} start - Start date
     * @param {Date} end - End date
     * @param {boolean} includeEndDate - Whether to include the end date
     * @returns {number} - Number of days
     */
    function calculateDaysBetween(start, end, includeEndDate) {
        // Clone dates to avoid modifying originals
        const startDate = new Date(start);
        const endDate = new Date(end);

        // Set time to midnight to ensure accurate day calculation
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        // Calculate difference in days
        const diffTime = endDate - startDate;
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Include end date if specified
        if (includeEndDate) {
            diffDays += 1;
        }

        return diffDays;
    }

    /**
     * Count weekend days between two dates
     * @param {Date} start - Start date
     * @param {Date} end - End date
     * @param {boolean} includeEndDate - Whether to include the end date
     * @returns {number} - Number of weekend days
     */
    function countWeekendDays(start, end, includeEndDate) {
        // Clone dates to avoid modifying originals
        const startDate = new Date(start);
        const endDate = new Date(end);

        // Set time to midnight to ensure accurate day calculation
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        // If including end date, add one day to end date
        if (includeEndDate) {
            endDate.setDate(endDate.getDate() + 1);
        }

        let count = 0;
        const currentDate = new Date(startDate);

        while (currentDate < endDate) {
            const day = currentDate.getDay();

            // Check if day is a weekend (0 = Sunday, 6 = Saturday)
            if ((day === 0 && weekendSunday.checked) || (day === 6 && weekendSaturday.checked)) {
                count++;
            }

            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return count;
    }

    /**
     * Count holiday days between two dates (excluding weekends)
     * @param {Date} start - Start date
     * @param {Date} end - End date
     * @param {boolean} includeEndDate - Whether to include the end date
     * @returns {number} - Number of holiday days
     */
    function countHolidayDays(start, end, includeEndDate) {
        // Clone dates to avoid modifying originals
        const startDate = new Date(start);
        const endDate = new Date(end);

        // Set time to midnight to ensure accurate day calculation
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        // If including end date, add one day to end date for comparison
        const compareEndDate = new Date(endDate);
        if (includeEndDate) {
            compareEndDate.setDate(compareEndDate.getDate() + 1);
        }

        let count = 0;

        // Check each holiday
        for (const holiday of holidays) {
            const holidayDate = new Date(holiday.date);
            holidayDate.setHours(0, 0, 0, 0);

            // Check if holiday is within range
            if (holidayDate >= startDate && holidayDate < compareEndDate) {
                // Check if holiday is not on a weekend
                const day = holidayDate.getDay();
                if (!((day === 0 && weekendSunday.checked) || (day === 6 && weekendSaturday.checked))) {
                    count++;
                }
            }
        }

        return count;
    }

    /**
     * Reset the working days calculator
     */
    function resetWorkdays() {
        workdaysStartDate.value = todayStr;
        workdaysEndDate.value = todayStr;
        includeWorkdaysEndDate.checked = false;
        excludeHolidays.checked = false;
        holidays = [];
        renderHolidays();
        workdaysResultSection.classList.add('hidden');
    }

    /**
     * Copy working days result to clipboard
     */
    function copyWorkdaysResult() {
        const text = `Working Days: ${workdaysCount.textContent}\nTotal Calendar Days: ${totalCalendarDays.textContent}\nWeekend Days: ${weekendDaysCount.textContent}\nHolidays: ${holidaysCount.textContent}\n\n${workdaysText.textContent}`;

        copyToClipboard(text);
    }

    /**
     * Format date for input fields (YYYY-MM-DD)
     * @param {Date} date - Date to format
     * @returns {string} - Formatted date
     */
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Format date based on selected format
     * @param {Date} date - Date to format
     * @returns {string} - Formatted date
     */
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Format time based on selected format
        let timeStr = '';
        if (timeFormat.value === '12') {
            const hour12 = hours % 12 || 12;
            const ampm = hours < 12 ? 'AM' : 'PM';
            timeStr = ` ${hour12}:${minutes} ${ampm}`;
        } else {
            timeStr = ` ${String(hours).padStart(2, '0')}:${minutes}`;
        }

        // Format date based on selected format
        if (dateFormat.value === 'MM/DD/YYYY') {
            return `${month}/${day}/${year}${timeStr}`;
        } else if (dateFormat.value === 'DD/MM/YYYY') {
            return `${day}/${month}/${year}${timeStr}`;
        } else {
            return `${year}-${month}-${day}${timeStr}`;
        }
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     */
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showNotification('Copied to clipboard', 'success');
            })
            .catch(err => {
                showNotification('Failed to copy', 'error');
                console.error('Could not copy text: ', err);
            });
    }

    /**
     * Update settings
     */
    function updateSettings() {
        // Save settings to localStorage
        localStorage.setItem('dateDurationSettings', JSON.stringify({
            dateFormat: dateFormat.value,
            timeFormat: timeFormat.value,
            autoCalculate: autoCalculate.checked,
            weekendSunday: weekendSunday.checked,
            weekendSaturday: weekendSaturday.checked
        }));

        // Recalculate if needed
        if (calculatorDuration.classList.contains('active') && !durationResultSection.classList.contains('hidden')) {
            calculateDuration();
        } else if (calculatorAdd.classList.contains('active') && !addResultSection.classList.contains('hidden')) {
            calculateAdd();
        } else if (calculatorSubtract.classList.contains('active') && !subtractResultSection.classList.contains('hidden')) {
            calculateSubtract();
        } else if (calculatorWorkdays.classList.contains('active') && !workdaysResultSection.classList.contains('hidden')) {
            calculateWorkdays();
        }
    }

    /**
     * Load settings from localStorage
     */
    function loadSettings() {
        const savedSettings = localStorage.getItem('dateDurationSettings');

        if (savedSettings) {
            const settings = JSON.parse(savedSettings);

            if (settings.dateFormat) {
                dateFormat.value = settings.dateFormat;
            }

            if (settings.timeFormat) {
                timeFormat.value = settings.timeFormat;
            }

            if (settings.autoCalculate !== undefined) {
                autoCalculate.checked = settings.autoCalculate;
            }

            if (settings.weekendSunday !== undefined) {
                weekendSunday.checked = settings.weekendSunday;
            }

            if (settings.weekendSaturday !== undefined) {
                weekendSaturday.checked = settings.weekendSaturday;
            }
        }
    }

    // Load settings on initialization
    loadSettings();
}

/**
 * Initialize settings modal
 */
function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtn = document.querySelector('.close-btn');

    // Open settings modal
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
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
