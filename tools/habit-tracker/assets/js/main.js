/**
 * Habit Tracker Tool
 *
 * This tool allows users to track and build habits with visual progress indicators.
 * Features include daily, weekly, and monthly views, categories, and statistics.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Habit Tracker
    initHabitTracker();

    // Initialize notification system
    initNotification();

    // Show welcome notification
    showNotification('Welcome to Habit Tracker! Build better habits with ease.', 'info');
});

/**
 * Initialize the Habit Tracker
 */
function initHabitTracker() {
    // DOM elements - Sidebar
    const newHabitBtn = document.getElementById('new-habit-btn');
    const emptyNewHabitBtn = document.getElementById('empty-new-habit-btn');
    const dailyViewBtn = document.getElementById('daily-view-btn');
    const weeklyViewBtn = document.getElementById('weekly-view-btn');
    const monthlyViewBtn = document.getElementById('monthly-view-btn');
    const categoriesList = document.getElementById('categories-list');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const totalHabitsEl = document.getElementById('total-habits');
    const completedTodayEl = document.getElementById('completed-today');
    const currentStreakEl = document.getElementById('current-streak');
    const exportHabitsBtn = document.getElementById('export-habits-btn');
    const importHabitsBtn = document.getElementById('import-habits-btn');
    const importFile = document.getElementById('import-file');

    // DOM elements - Content
    const currentDateEl = document.getElementById('current-date');
    const prevDateBtn = document.getElementById('prev-date-btn');
    const nextDateBtn = document.getElementById('next-date-btn');
    const todayBtn = document.getElementById('today-btn');
    const habitsList = document.getElementById('habits-list');
    const emptyState = document.getElementById('empty-state');

    // DOM elements - Habit Modal
    const habitModal = document.getElementById('habit-modal');
    const habitModalTitle = document.getElementById('habit-modal-title');
    const habitName = document.getElementById('habit-name');
    const habitCategory = document.getElementById('habit-category');
    const habitGoal = document.getElementById('habit-goal');
    const habitGoalType = document.getElementById('habit-goal-type');
    const weekdayCheckboxes = document.querySelectorAll('.weekday-checkbox');
    const habitReminder = document.getElementById('habit-reminder');
    const habitNotes = document.getElementById('habit-notes');
    const saveHabitBtn = document.getElementById('save-habit-btn');
    const deleteHabitBtn = document.getElementById('delete-habit-btn');
    const cancelHabitBtn = document.getElementById('cancel-habit-btn');
    const closeHabitModalBtn = document.getElementById('close-habit-modal-btn');

    // DOM elements - Category Modal
    const categoryModal = document.getElementById('category-modal');
    const categoryName = document.getElementById('category-name');
    const categoryColor = document.getElementById('category-color');
    const saveCategoryBtn = document.getElementById('save-category-btn');
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');
    const closeCategoryModalBtn = document.getElementById('close-category-modal-btn');

    // App state
    let habits = [];
    let categories = [
        { id: 'health', name: 'Health', color: '#34C759' },
        { id: 'productivity', name: 'Productivity', color: '#FF9500' },
        { id: 'learning', name: 'Learning', color: '#5856D6' },
        { id: 'mindfulness', name: 'Mindfulness', color: '#FF2D55' }
    ];
    let currentDate = new Date();
    let currentView = 'daily';
    let currentFilter = 'all';
    let editingHabitId = null;

    // Set current date to start of day
    currentDate.setHours(0, 0, 0, 0);

    // Load habits and categories from localStorage
    loadHabits();
    loadCategories();

    // Initialize UI
    updateCurrentDateDisplay();
    updateHabitsList();
    updateCategoriesList();
    updateStatistics();

    // Event listeners - New Habit
    newHabitBtn.addEventListener('click', () => openHabitModal());
    emptyNewHabitBtn.addEventListener('click', () => openHabitModal());

    // Event listeners - View Buttons
    dailyViewBtn.addEventListener('click', () => setView('daily'));
    weeklyViewBtn.addEventListener('click', () => setView('weekly'));
    monthlyViewBtn.addEventListener('click', () => setView('monthly'));

    // Event listeners - Date Navigation
    prevDateBtn.addEventListener('click', navigateToPreviousDate);
    nextDateBtn.addEventListener('click', navigateToNextDate);
    todayBtn.addEventListener('click', navigateToToday);

    // Event listeners - Categories
    addCategoryBtn.addEventListener('click', openCategoryModal);
    categoriesList.addEventListener('click', (e) => {
        const categoryItem = e.target.closest('.category-item');
        if (categoryItem) {
            const categoryId = categoryItem.dataset.category;
            filterByCategory(categoryId);
        }
    });

    // Event listeners - Habit Modal
    saveHabitBtn.addEventListener('click', saveHabit);
    deleteHabitBtn.addEventListener('click', deleteHabit);
    cancelHabitBtn.addEventListener('click', closeHabitModal);
    closeHabitModalBtn.addEventListener('click', closeHabitModal);

    // Event listeners - Category Modal
    saveCategoryBtn.addEventListener('click', saveCategory);
    cancelCategoryBtn.addEventListener('click', closeCategoryModal);
    closeCategoryModalBtn.addEventListener('click', closeCategoryModal);

    // Event listeners - Import/Export
    exportHabitsBtn.addEventListener('click', exportHabits);
    importHabitsBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', importHabits);

    /**
     * Set the current view (daily, weekly, monthly)
     * @param {string} view - The view to set
     */
    function setView(view) {
        currentView = view;

        // Update active button
        dailyViewBtn.classList.toggle('active', view === 'daily');
        weeklyViewBtn.classList.toggle('active', view === 'weekly');
        monthlyViewBtn.classList.toggle('active', view === 'monthly');

        // Update habits list
        updateHabitsList();

        showNotification(`Switched to ${view} view`, 'info');
    }

    /**
     * Update the current date display
     */
    function updateCurrentDateDisplay() {
        let dateStr = '';

        if (isToday(currentDate)) {
            dateStr = 'Today';
        } else if (isYesterday(currentDate)) {
            dateStr = 'Yesterday';
        } else if (isTomorrow(currentDate)) {
            dateStr = 'Tomorrow';
        } else {
            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            dateStr = currentDate.toLocaleDateString('en-US', options);
        }

        currentDateEl.textContent = dateStr;
    }

    /**
     * Navigate to the previous date
     */
    function navigateToPreviousDate() {
        if (currentView === 'daily') {
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (currentView === 'weekly') {
            currentDate.setDate(currentDate.getDate() - 7);
        } else if (currentView === 'monthly') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        }

        updateCurrentDateDisplay();
        updateHabitsList();
    }

    /**
     * Navigate to the next date
     */
    function navigateToNextDate() {
        if (currentView === 'daily') {
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (currentView === 'weekly') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else if (currentView === 'monthly') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        updateCurrentDateDisplay();
        updateHabitsList();
    }

    /**
     * Navigate to today
     */
    function navigateToToday() {
        currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        updateCurrentDateDisplay();
        updateHabitsList();

        showNotification('Showing today\'s habits', 'info');
    }

    /**
     * Filter habits by category
     * @param {string} categoryId - The category ID to filter by
     */
    function filterByCategory(categoryId) {
        currentFilter = categoryId;

        // Update active category
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.classList.toggle('active', item.dataset.category === categoryId);
        });

        updateHabitsList();
    }

    /**
     * Update the habits list based on current view, date, and filter
     */
    function updateHabitsList() {
        // Clear the list
        habitsList.innerHTML = '';

        // Filter habits based on category
        let filteredHabits = [...habits];
        if (currentFilter !== 'all') {
            filteredHabits = filteredHabits.filter(habit => habit.category === currentFilter);
        }

        // Filter habits based on active days (for daily view)
        if (currentView === 'daily') {
            const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
            filteredHabits = filteredHabits.filter(habit => habit.repeatDays[dayOfWeek]);
        }

        // Show empty state if no habits
        if (filteredHabits.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        // Hide empty state
        emptyState.classList.add('hidden');

        // Render habits based on current view
        if (currentView === 'daily') {
            renderDailyView(filteredHabits);
        } else if (currentView === 'weekly') {
            renderWeeklyView(filteredHabits);
        } else if (currentView === 'monthly') {
            renderMonthlyView(filteredHabits);
        }
    }

    /**
     * Render daily view of habits
     * @param {Array} filteredHabits - The filtered habits to display
     */
    function renderDailyView(filteredHabits) {
        // Get completions for the current date
        const dateStr = formatDateForStorage(currentDate);

        filteredHabits.forEach(habit => {
            const habitItem = document.createElement('div');
            habitItem.className = 'habit-item';
            habitItem.dataset.id = habit.id;

            // Get completion for this habit on this date
            const completion = habit.completions[dateStr] || 0;
            const isCompleted = completion >= habit.goal;

            // Get category
            const category = categories.find(cat => cat.id === habit.category) || { color: '#999' };

            // Create habit header
            const header = document.createElement('div');
            header.className = 'habit-header';

            const titleContainer = document.createElement('div');
            titleContainer.className = 'habit-title-container';

            const categoryIndicator = document.createElement('span');
            categoryIndicator.className = 'habit-category-indicator';
            categoryIndicator.style.backgroundColor = category.color;

            const title = document.createElement('h3');
            title.className = 'habit-title';
            title.textContent = habit.name;

            titleContainer.appendChild(categoryIndicator);
            titleContainer.appendChild(title);

            const actions = document.createElement('div');
            actions.className = 'habit-actions';

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'habit-action-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.addEventListener('click', () => openHabitModal(habit.id));

            actions.appendChild(editBtn);

            header.appendChild(titleContainer);
            header.appendChild(actions);

            // Create habit progress
            const progress = document.createElement('div');
            progress.className = 'habit-progress';

            const progressInfo = document.createElement('div');
            progressInfo.className = 'progress-info';

            const progressText = document.createElement('span');
            progressText.className = 'progress-text';
            progressText.textContent = `${completion} / ${habit.goal} ${habit.goalType}`;

            const progressCounter = document.createElement('div');
            progressCounter.className = 'progress-counter';

            const decrementBtn = document.createElement('button');
            decrementBtn.type = 'button';
            decrementBtn.className = 'counter-btn';
            decrementBtn.innerHTML = '<i class="fas fa-minus"></i>';
            decrementBtn.addEventListener('click', () => {
                updateHabitCompletion(habit.id, Math.max(0, completion - 1));
            });

            const counterValue = document.createElement('span');
            counterValue.className = 'counter-value';
            counterValue.textContent = completion;

            const incrementBtn = document.createElement('button');
            incrementBtn.type = 'button';
            incrementBtn.className = 'counter-btn';
            incrementBtn.innerHTML = '<i class="fas fa-plus"></i>';
            incrementBtn.addEventListener('click', () => {
                updateHabitCompletion(habit.id, completion + 1);
            });

            progressCounter.appendChild(decrementBtn);
            progressCounter.appendChild(counterValue);
            progressCounter.appendChild(incrementBtn);

            progressInfo.appendChild(progressText);
            progressInfo.appendChild(progressCounter);

            const progressBarContainer = document.createElement('div');
            progressBarContainer.className = 'progress-bar-container';

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.style.width = `${Math.min(100, (completion / habit.goal) * 100)}%`;
            progressBar.style.backgroundColor = isCompleted ? '#34C759' : '#007AFF';

            progressBarContainer.appendChild(progressBar);

            progress.appendChild(progressInfo);
            progress.appendChild(progressBarContainer);

            // Create habit streak
            const streak = document.createElement('div');
            streak.className = 'habit-streak';

            const streakIcon = document.createElement('i');
            streakIcon.className = 'fas fa-fire streak-icon';

            const streakText = document.createElement('span');
            streakText.textContent = `Current streak: ${getHabitStreak(habit)} days`;

            streak.appendChild(streakIcon);
            streak.appendChild(streakText);

            // Add notes if available
            let notesEl = null;
            if (habit.notes) {
                notesEl = document.createElement('p');
                notesEl.className = 'habit-notes';
                notesEl.textContent = habit.notes;
            }

            // Assemble habit item
            habitItem.appendChild(header);
            habitItem.appendChild(progress);
            habitItem.appendChild(streak);
            if (notesEl) habitItem.appendChild(notesEl);

            habitsList.appendChild(habitItem);
        });
    }

    /**
     * Render weekly view of habits
     * @param {Array} filteredHabits - The filtered habits to display
     */
    function renderWeeklyView(filteredHabits) {
        // Create weekly grid
        const weeklyGrid = document.createElement('div');
        weeklyGrid.className = 'weekly-grid';

        // Get start of week (Sunday)
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        // Create 7 days
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);

            const dayEl = document.createElement('div');
            dayEl.className = `weekly-day ${isToday(day) ? 'today' : ''}`;

            const dayHeader = document.createElement('div');
            dayHeader.className = 'weekly-day-header';

            const dayName = document.createElement('div');
            dayName.className = 'weekly-day-name';
            dayName.textContent = day.toLocaleDateString('en-US', { weekday: 'short' });

            const dayDate = document.createElement('div');
            dayDate.className = 'weekly-day-date';
            dayDate.textContent = day.getDate();

            dayHeader.appendChild(dayName);
            dayHeader.appendChild(dayDate);

            const dayHabits = document.createElement('div');
            dayHabits.className = 'weekly-habits';

            // Filter habits for this day of week
            const dayOfWeek = day.getDay();
            const dayHabitsList = filteredHabits.filter(habit => habit.repeatDays[dayOfWeek]);

            // Get completions for this date
            const dateStr = formatDateForStorage(day);

            // Add habits for this day
            dayHabitsList.forEach(habit => {
                const completion = habit.completions[dateStr] || 0;
                const isCompleted = completion >= habit.goal;
                const isPartial = completion > 0 && completion < habit.goal;

                const category = categories.find(cat => cat.id === habit.category) || { color: '#999' };

                const habitEl = document.createElement('div');
                habitEl.className = 'weekly-habit';

                const indicator = document.createElement('span');
                indicator.className = 'weekly-habit-indicator';
                indicator.style.backgroundColor = category.color;

                const name = document.createElement('span');
                name.className = 'weekly-habit-name';
                name.textContent = habit.name;

                const status = document.createElement('span');
                status.className = `weekly-habit-status ${isCompleted ? 'completed' : isPartial ? 'partial' : 'missed'}`;

                if (isCompleted) {
                    status.innerHTML = '<i class="fas fa-check"></i>';
                } else if (isPartial) {
                    status.textContent = Math.round((completion / habit.goal) * 100) + '%';
                } else {
                    status.innerHTML = '<i class="fas fa-times"></i>';
                }

                habitEl.appendChild(indicator);
                habitEl.appendChild(name);
                habitEl.appendChild(status);

                dayHabits.appendChild(habitEl);
            });

            dayEl.appendChild(dayHeader);
            dayEl.appendChild(dayHabits);

            weeklyGrid.appendChild(dayEl);
        }

        habitsList.appendChild(weeklyGrid);
    }

    /**
     * Render monthly view of habits
     * @param {Array} filteredHabits - The filtered habits to display
     */
    function renderMonthlyView(filteredHabits) {
        // Create monthly calendar
        const monthlyCalendar = document.createElement('div');
        monthlyCalendar.className = 'monthly-calendar';

        // Get first day of month and total days in month
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();

        // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
        const startDay = firstDay.getDay();

        // Get days from previous month to fill first week
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const prevMonthDays = startDay;

        // Get days from next month to fill last week
        const totalCells = Math.ceil((totalDays + startDay) / 7) * 7;
        const nextMonthDays = totalCells - totalDays - startDay;

        // Add weekday headers
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'monthly-day-header';
            dayHeader.textContent = day;
            monthlyCalendar.appendChild(dayHeader);
        });

        // Render days from previous month
        for (let i = prevMonthDays - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const date = new Date(year, month - 1, day);

            const dayEl = createMonthlyDay(date, filteredHabits, true);
            monthlyCalendar.appendChild(dayEl);
        }

        // Render days from current month
        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(year, month, i);

            const dayEl = createMonthlyDay(date, filteredHabits, false);
            monthlyCalendar.appendChild(dayEl);
        }

        // Render days from next month
        for (let i = 1; i <= nextMonthDays; i++) {
            const date = new Date(year, month + 1, i);

            const dayEl = createMonthlyDay(date, filteredHabits, true);
            monthlyCalendar.appendChild(dayEl);
        }

        habitsList.appendChild(monthlyCalendar);
    }

    /**
     * Create a monthly day element
     * @param {Date} date - The date
     * @param {Array} filteredHabits - The filtered habits
     * @param {boolean} isOtherMonth - Whether the date is in another month
     * @returns {HTMLElement} - The monthly day element
     */
    function createMonthlyDay(date, filteredHabits, isOtherMonth) {
        const dayEl = document.createElement('div');
        dayEl.className = `monthly-day ${isOtherMonth ? 'other-month' : ''} ${isToday(date) ? 'today' : ''}`;

        const dayHeader = document.createElement('div');
        dayHeader.className = 'monthly-day-header';

        const dayDate = document.createElement('div');
        dayDate.className = 'monthly-day-date';
        dayDate.textContent = date.getDate();

        dayHeader.appendChild(dayDate);

        const dayHabits = document.createElement('div');
        dayHabits.className = 'monthly-habits';

        // Filter habits for this day of week
        const dayOfWeek = date.getDay();
        const dayHabitsList = filteredHabits.filter(habit => habit.repeatDays[dayOfWeek]);

        // Get completions for this date
        const dateStr = formatDateForStorage(date);

        // Add habit dots
        dayHabitsList.forEach(habit => {
            const completion = habit.completions[dateStr] || 0;
            const isCompleted = completion >= habit.goal;
            const isPartial = completion > 0 && completion < habit.goal;

            const category = categories.find(cat => cat.id === habit.category) || { color: '#999' };

            const habitDot = document.createElement('span');
            habitDot.className = `monthly-habit-dot ${isCompleted ? 'completed' : isPartial ? 'partial' : 'missed'}`;
            habitDot.style.backgroundColor = isCompleted ? '#34C759' : isPartial ? '#FF9500' : '#FF3B30';
            habitDot.title = `${habit.name}: ${completion}/${habit.goal} ${habit.goalType}`;

            dayHabits.appendChild(habitDot);
        });

        dayEl.appendChild(dayHeader);
        dayEl.appendChild(dayHabits);

        return dayEl;
    }

    /**
     * Update habit completion
     * @param {string} habitId - The habit ID
     * @param {number} value - The new completion value
     */
    function updateHabitCompletion(habitId, value) {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        const dateStr = formatDateForStorage(currentDate);

        // Initialize completions object if it doesn't exist
        if (!habit.completions) {
            habit.completions = {};
        }

        // Update completion value
        habit.completions[dateStr] = value;

        // Save habits
        saveHabits();

        // Update UI
        updateHabitsList();
        updateStatistics();

        // Show notification if habit is completed
        if (value >= habit.goal && habit.completions[dateStr] < habit.goal) {
            showNotification(`Habit "${habit.name}" completed!`, 'success');
        }
    }

    /**
     * Get habit streak
     * @param {Object} habit - The habit object
     * @returns {number} - The current streak
     */
    function getHabitStreak(habit) {
        let streak = 0;
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Go back up to 100 days to find the streak
        for (let i = 0; i < 100; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            // Skip days when the habit is not scheduled
            if (!habit.repeatDays[date.getDay()]) {
                continue;
            }

            const dateStr = formatDateForStorage(date);
            const completion = habit.completions[dateStr] || 0;

            if (completion >= habit.goal) {
                currentStreak++;
            } else {
                break;
            }
        }

        return currentStreak;
    }

    /**
     * Format date for storage (YYYY-MM-DD)
     * @param {Date} date - The date to format
     * @returns {string} - Formatted date
     */
    function formatDateForStorage(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Update categories list
     */
    function updateCategoriesList() {
        // Update category counts
        const counts = {
            all: habits.length
        };

        habits.forEach(habit => {
            if (!counts[habit.category]) {
                counts[habit.category] = 0;
            }
            counts[habit.category]++;
        });

        // Update count elements
        const countElements = document.querySelectorAll('.category-count');
        countElements.forEach(el => {
            const category = el.closest('.category-item').dataset.category;
            el.textContent = counts[category] || 0;
        });

        // Update habit category dropdown
        habitCategory.innerHTML = '';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            habitCategory.appendChild(option);
        });
    }

    /**
     * Update statistics
     */
    function updateStatistics() {
        // Total habits
        totalHabitsEl.textContent = habits.length;

        // Completed today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = formatDateForStorage(today);
        const todayDayOfWeek = today.getDay();

        let completedToday = 0;
        let totalForToday = 0;

        habits.forEach(habit => {
            // Only count habits scheduled for today
            if (habit.repeatDays[todayDayOfWeek]) {
                totalForToday++;
                const completion = habit.completions[todayStr] || 0;
                if (completion >= habit.goal) {
                    completedToday++;
                }
            }
        });

        completedTodayEl.textContent = `${completedToday}/${totalForToday}`;

        // Current streak (longest active streak among all habits)
        let longestStreak = 0;

        habits.forEach(habit => {
            const streak = getHabitStreak(habit);
            if (streak > longestStreak) {
                longestStreak = streak;
            }
        });

        currentStreakEl.textContent = longestStreak;
    }

    /**
     * Open habit modal to add or edit a habit
     * @param {string} habitId - The habit ID to edit (null for new habit)
     */
    function openHabitModal(habitId = null) {
        // Reset form
        habitName.value = '';
        habitCategory.value = 'health';
        habitGoal.value = 1;
        habitGoalType.value = 'times';
        habitReminder.value = '';
        habitNotes.value = '';

        // Reset weekday checkboxes
        weekdayCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });

        if (habitId) {
            // Edit existing habit
            const habit = habits.find(h => h.id === habitId);
            if (habit) {
                editingHabitId = habitId;
                habitModalTitle.textContent = 'Edit Habit';
                deleteHabitBtn.classList.remove('hidden');

                // Populate form with habit data
                habitName.value = habit.name;
                habitCategory.value = habit.category;
                habitGoal.value = habit.goal;
                habitGoalType.value = habit.goalType;
                habitReminder.value = habit.reminder || '';
                habitNotes.value = habit.notes || '';

                // Set weekday checkboxes
                weekdayCheckboxes.forEach((checkbox, index) => {
                    checkbox.checked = habit.repeatDays[index];
                });
            }
        } else {
            // Add new habit
            editingHabitId = null;
            habitModalTitle.textContent = 'Add New Habit';
            deleteHabitBtn.classList.add('hidden');
        }

        // Show modal
        habitModal.classList.add('show');
        habitName.focus();
    }

    /**
     * Close habit modal
     */
    function closeHabitModal() {
        habitModal.classList.remove('show');
        editingHabitId = null;
    }

    /**
     * Save habit from modal
     */
    function saveHabit() {
        const name = habitName.value.trim();

        if (!name) {
            showNotification('Please enter a habit name', 'error');
            return;
        }

        // Get weekday selections
        const repeatDays = [];
        weekdayCheckboxes.forEach((checkbox, index) => {
            repeatDays[index] = checkbox.checked;
        });

        // Check if at least one day is selected
        if (!repeatDays.some(day => day)) {
            showNotification('Please select at least one day of the week', 'error');
            return;
        }

        const habitData = {
            name,
            category: habitCategory.value,
            goal: parseInt(habitGoal.value, 10) || 1,
            goalType: habitGoalType.value,
            repeatDays,
            reminder: habitReminder.value,
            notes: habitNotes.value.trim(),
            completions: {}
        };

        if (editingHabitId) {
            // Update existing habit
            const index = habits.findIndex(h => h.id === editingHabitId);
            if (index !== -1) {
                // Preserve completions
                habitData.completions = habits[index].completions || {};
                habitData.id = editingHabitId;
                habits[index] = habitData;
                showNotification('Habit updated successfully', 'success');
            }
        } else {
            // Add new habit
            habitData.id = Date.now().toString();
            habits.push(habitData);
            showNotification('Habit added successfully', 'success');
        }

        // Save habits and update UI
        saveHabits();
        updateHabitsList();
        updateCategoriesList();
        updateStatistics();

        // Close modal
        closeHabitModal();
    }

    /**
     * Delete habit
     */
    function deleteHabit() {
        if (!editingHabitId) return;

        // Confirm deletion
        if (confirm('Are you sure you want to delete this habit?')) {
            habits = habits.filter(h => h.id !== editingHabitId);

            // Save habits and update UI
            saveHabits();
            updateHabitsList();
            updateCategoriesList();
            updateStatistics();

            // Close modal
            closeHabitModal();

            showNotification('Habit deleted successfully', 'success');
        }
    }

    /**
     * Open category modal
     */
    function openCategoryModal() {
        categoryName.value = '';
        categoryColor.value = '#007AFF';
        categoryModal.classList.add('show');
        categoryName.focus();
    }

    /**
     * Close category modal
     */
    function closeCategoryModal() {
        categoryModal.classList.remove('show');
    }

    /**
     * Save category from modal
     */
    function saveCategory() {
        const name = categoryName.value.trim();

        if (!name) {
            showNotification('Please enter a category name', 'error');
            return;
        }

        const id = name.toLowerCase().replace(/\s+/g, '-');

        // Check if category already exists
        if (categories.some(cat => cat.id === id)) {
            showNotification('A category with this name already exists', 'error');
            return;
        }

        // Add new category
        categories.push({
            id,
            name,
            color: categoryColor.value
        });

        // Save categories and update UI
        saveCategories();

        // Add category to sidebar
        const categoryItem = document.createElement('li');
        categoryItem.className = 'category-item';
        categoryItem.dataset.category = id;

        const categoryColorEl = document.createElement('span');
        categoryColorEl.className = 'category-color';
        categoryColorEl.style.backgroundColor = categoryColor.value;

        const categoryNameEl = document.createElement('span');
        categoryNameEl.className = 'category-name';
        categoryNameEl.textContent = name;

        const categoryCountEl = document.createElement('span');
        categoryCountEl.className = 'category-count';
        categoryCountEl.textContent = '0';

        categoryItem.appendChild(categoryColorEl);
        categoryItem.appendChild(categoryNameEl);
        categoryItem.appendChild(categoryCountEl);

        categoryItem.addEventListener('click', () => {
            filterByCategory(id);
        });

        categoriesList.appendChild(categoryItem);

        // Update habit category dropdown
        updateCategoriesList();

        // Close modal
        closeCategoryModal();

        showNotification('Category added successfully', 'success');
    }

    /**
     * Export habits to JSON file
     */
    function exportHabits() {
        if (habits.length === 0) {
            showNotification('No habits to export', 'info');
            return;
        }

        const exportData = {
            habits,
            categories
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `habits-${formatDateForFilename(new Date())}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        showNotification('Habits exported successfully', 'success');
    }

    /**
     * Import habits from JSON file
     */
    function importHabits() {
        const file = importFile.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);

                if (!importedData.habits || !Array.isArray(importedData.habits)) {
                    throw new Error('Invalid format');
                }

                // Confirm import
                if (habits.length > 0) {
                    if (!confirm('This will replace your current habits. Continue?')) {
                        return;
                    }
                }

                // Import habits
                habits = importedData.habits;

                // Import categories if available
                if (importedData.categories && Array.isArray(importedData.categories)) {
                    categories = importedData.categories;
                }

                // Save and update UI
                saveHabits();
                saveCategories();
                updateHabitsList();
                updateCategoriesList();
                updateStatistics();

                showNotification('Habits imported successfully', 'success');
            } catch (error) {
                showNotification('Error importing habits: Invalid file format', 'error');
            }
        };

        reader.readAsText(file);
        importFile.value = '';
    }

    /**
     * Save habits to localStorage
     */
    function saveHabits() {
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    /**
     * Load habits from localStorage
     */
    function loadHabits() {
        const savedHabits = localStorage.getItem('habits');
        if (savedHabits) {
            habits = JSON.parse(savedHabits);
        }
    }

    /**
     * Save categories to localStorage
     */
    function saveCategories() {
        localStorage.setItem('habitCategories', JSON.stringify(categories));
    }

    /**
     * Load categories from localStorage
     */
    function loadCategories() {
        const savedCategories = localStorage.getItem('habitCategories');
        if (savedCategories) {
            categories = JSON.parse(savedCategories);
        }
    }

    /**
     * Check if a date is today
     * @param {Date} date - The date to check
     * @returns {boolean} - True if the date is today
     */
    function isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    /**
     * Check if a date is yesterday
     * @param {Date} date - The date to check
     * @returns {boolean} - True if the date is yesterday
     */
    function isYesterday(date) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.getDate() === yesterday.getDate() &&
               date.getMonth() === yesterday.getMonth() &&
               date.getFullYear() === yesterday.getFullYear();
    }

    /**
     * Check if a date is tomorrow
     * @param {Date} date - The date to check
     * @returns {boolean} - True if the date is tomorrow
     */
    function isTomorrow(date) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return date.getDate() === tomorrow.getDate() &&
               date.getMonth() === tomorrow.getMonth() &&
               date.getFullYear() === tomorrow.getFullYear();
    }

    /**
     * Format date for display
     * @param {Date} date - The date to format
     * @returns {string} - Formatted date
     */
    function formatDate(date) {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Format date for filename
     * @param {Date} date - The date to format
     * @returns {string} - Formatted date
     */
    function formatDateForFilename(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

/**
 * Initialize notification system
 */
function initNotification() {
    // Show a welcome notification
    showNotification('Welcome to Habit Tracker! Build better habits with ease.', 'info');
}

/**
 * Show notification - Apple-like style
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Get notification elements
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    // Clear any existing timeout
    if (window.notificationTimeout) {
        clearTimeout(window.notificationTimeout);
    }

    // Hide any existing notification first
    notification.classList.remove('show');

    // Set notification message and type after a small delay
    setTimeout(() => {
        notificationMessage.textContent = message;
        notification.className = 'notification';
        notification.classList.add(type);
        notification.classList.add('show');

        // Hide notification after 3 seconds
        window.notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }, 100);
}
