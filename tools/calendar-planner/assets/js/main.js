/**
 * Calendar Planner Tool
 *
 * This tool allows users to plan and manage their schedule with an intuitive calendar interface.
 * Features include adding events, viewing in different modes (month, week, day), and more.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Calendar Planner
    initCalendarPlanner();

    // Initialize notification system
    initNotification();

    // Show welcome notification
    showNotification('Welcome to Calendar Planner! Organize your schedule with ease.', 'info');
});

/**
 * Initialize the Calendar Planner
 */
function initCalendarPlanner() {
    // DOM elements - Calendar navigation
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const currentMonthEl = document.getElementById('current-month');
    const todayBtn = document.getElementById('today-btn');

    // DOM elements - Calendar views
    const monthViewBtn = document.getElementById('month-view-btn');
    const weekViewBtn = document.getElementById('week-view-btn');
    const dayViewBtn = document.getElementById('day-view-btn');
    const monthView = document.getElementById('month-view');
    const weekView = document.getElementById('week-view');
    const dayView = document.getElementById('day-view');
    const calendarDays = document.getElementById('calendar-days');
    const weekDays = document.getElementById('week-days');
    const currentDayEl = document.getElementById('current-day');

    // DOM elements - Events
    const addEventBtn = document.getElementById('add-event-btn');
    const upcomingEvents = document.getElementById('upcoming-events');

    // DOM elements - Event modal
    const eventModal = document.getElementById('event-modal');
    const eventModalTitle = document.getElementById('event-modal-title');
    const eventTitle = document.getElementById('event-title');
    const eventStartDate = document.getElementById('event-start-date');
    const eventStartTime = document.getElementById('event-start-time');
    const eventEndDate = document.getElementById('event-end-date');
    const eventEndTime = document.getElementById('event-end-time');
    const eventCategory = document.getElementById('event-category');
    const eventLocation = document.getElementById('event-location');
    const eventDescription = document.getElementById('event-description');
    const eventReminder = document.getElementById('event-reminder');
    const saveEventBtn = document.getElementById('save-event-btn');
    const deleteEventBtn = document.getElementById('delete-event-btn');
    const cancelEventBtn = document.getElementById('cancel-event-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // DOM elements - Category modal
    const addCategoryBtn = document.getElementById('add-category-btn');
    const categoryModal = document.getElementById('category-modal');
    const categoryName = document.getElementById('category-name');
    const categoryColor = document.getElementById('category-color');
    const saveCategoryBtn = document.getElementById('save-category-btn');
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');
    const closeCategoryModalBtn = document.getElementById('close-category-modal-btn');

    // DOM elements - Settings
    const darkModeToggle = document.getElementById('dark-mode');
    const showWeekendsToggle = document.getElementById('show-weekends');
    const weekStartsMondayToggle = document.getElementById('week-starts-monday');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');

    // App state
    let currentDate = new Date();
    let currentView = 'month';
    let events = [];
    let categories = [
        { id: 'work', name: 'Work', color: '#FF3B30' },
        { id: 'personal', name: 'Personal', color: '#34C759' },
        { id: 'family', name: 'Family', color: '#007AFF' },
        { id: 'health', name: 'Health', color: '#FF9500' }
    ];
    let editingEventId = null;

    // Settings
    let settings = {
        darkMode: true,
        showWeekends: true,
        weekStartsMonday: false
    };

    // Load events, categories, and settings from localStorage
    loadEvents();
    loadCategories();
    loadSettings();

    // Initialize calendar
    renderCalendar();
    updateUpcomingEvents();

    // Event listeners - Calendar navigation
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    todayBtn.addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar();
        showNotification('Showing today\'s date', 'info');
    });

    // Event listeners - Calendar views
    monthViewBtn.addEventListener('click', () => {
        setActiveView('month');
    });

    weekViewBtn.addEventListener('click', () => {
        setActiveView('week');
    });

    dayViewBtn.addEventListener('click', () => {
        setActiveView('day');
    });

    // Event listeners - Events
    addEventBtn.addEventListener('click', () => {
        openEventModal();
    });

    // Event listeners - Event modal
    saveEventBtn.addEventListener('click', saveEvent);
    deleteEventBtn.addEventListener('click', deleteEvent);
    cancelEventBtn.addEventListener('click', closeEventModal);
    closeModalBtn.addEventListener('click', closeEventModal);

    // Event listeners - Category modal
    addCategoryBtn.addEventListener('click', openCategoryModal);
    saveCategoryBtn.addEventListener('click', saveCategory);
    cancelCategoryBtn.addEventListener('click', closeCategoryModal);
    closeCategoryModalBtn.addEventListener('click', closeCategoryModal);

    // Event listeners - Settings
    darkModeToggle.addEventListener('change', () => {
        settings.darkMode = darkModeToggle.checked;
        saveSettings();
    });

    showWeekendsToggle.addEventListener('change', () => {
        settings.showWeekends = showWeekendsToggle.checked;
        saveSettings();
        renderCalendar();
    });

    weekStartsMondayToggle.addEventListener('change', () => {
        settings.weekStartsMonday = weekStartsMondayToggle.checked;
        saveSettings();
        renderCalendar();
    });

    exportBtn.addEventListener('click', exportCalendar);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', importCalendar);

    /**
     * Set active view (month, week, day)
     * @param {string} view - The view to set active
     */
    function setActiveView(view) {
        currentView = view;

        // Update active button
        monthViewBtn.classList.toggle('active', view === 'month');
        weekViewBtn.classList.toggle('active', view === 'week');
        dayViewBtn.classList.toggle('active', view === 'day');

        // Update active view
        monthView.classList.toggle('active', view === 'month');
        weekView.classList.toggle('active', view === 'week');
        dayView.classList.toggle('active', view === 'day');

        // Render the appropriate view
        renderCalendar();

        showNotification(`Switched to ${view} view`, 'info');
    }

    /**
     * Render the calendar based on current view
     */
    function renderCalendar() {
        updateCalendarHeader();

        if (currentView === 'month') {
            renderMonthView();
        } else if (currentView === 'week') {
            renderWeekView();
        } else if (currentView === 'day') {
            renderDayView();
        }
    }

    /**
     * Update calendar header with current month/year
     */
    function updateCalendarHeader() {
        const options = { month: 'long', year: 'numeric' };
        currentMonthEl.textContent = currentDate.toLocaleDateString('en-US', options);

        if (currentView === 'day') {
            const dayOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
            currentDayEl.textContent = currentDate.toLocaleDateString('en-US', dayOptions);
        }
    }

    /**
     * Render month view
     */
    function renderMonthView() {
        calendarDays.innerHTML = '';

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Get first day of month and total days in month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();

        // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
        let startDay = firstDay.getDay();

        // Adjust for week starting on Monday if setting is enabled
        if (settings.weekStartsMonday) {
            startDay = startDay === 0 ? 6 : startDay - 1;
        }

        // Get days from previous month to fill first week
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const prevMonthDays = startDay;

        // Get days from next month to fill last week
        const totalCells = Math.ceil((totalDays + startDay) / 7) * 7;
        const nextMonthDays = totalCells - totalDays - startDay;

        // Render days from previous month
        for (let i = prevMonthDays - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const date = new Date(year, month - 1, day);
            addDayToCalendar(date, 'other-month');
        }

        // Render days from current month
        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(year, month, i);
            const isToday = isSameDay(date, new Date());
            addDayToCalendar(date, isToday ? 'today' : '');
        }

        // Render days from next month
        for (let i = 1; i <= nextMonthDays; i++) {
            const date = new Date(year, month + 1, i);
            addDayToCalendar(date, 'other-month');
        }
    }

    /**
     * Add a day to the month view calendar
     * @param {Date} date - The date to add
     * @param {string} className - Additional class name for the day
     */
    function addDayToCalendar(date, className) {
        const day = document.createElement('div');
        day.className = `day ${className}`;
        day.dataset.date = formatDate(date);

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();

        const dayEvents = document.createElement('div');
        dayEvents.className = 'day-events';

        // Add events for this day
        const dayEventsData = events.filter(event => {
            const eventDate = new Date(event.startDate);
            return isSameDay(eventDate, date);
        });

        dayEventsData.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = `event ${event.category}`;
            eventEl.textContent = event.title;
            eventEl.dataset.id = event.id;
            eventEl.addEventListener('click', (e) => {
                e.stopPropagation();
                openEventModal(event.id);
            });
            dayEvents.appendChild(eventEl);
        });

        day.appendChild(dayNumber);
        day.appendChild(dayEvents);

        // Add click event to add new event on this day
        day.addEventListener('click', () => {
            openEventModal(null, date);
        });

        calendarDays.appendChild(day);
    }

    /**
     * Render week view
     */
    function renderWeekView() {
        // Clear previous content
        const weekDaysEl = document.getElementById('week-days');
        const timeSlots = document.querySelector('#week-view .time-slots');
        const weekEventsContainer = document.getElementById('week-events');

        weekDaysEl.innerHTML = '';
        timeSlots.innerHTML = '';
        weekEventsContainer.innerHTML = '';

        // Get the start of the week (Sunday or Monday based on settings)
        const weekStart = getStartOfWeek(currentDate, settings.weekStartsMonday);

        // Create week days header
        for (let i = 0; i < 7; i++) {
            // Skip weekends if setting is disabled
            if (!settings.showWeekends && (i === 0 || i === 6) && !settings.weekStartsMonday) continue;
            if (!settings.showWeekends && (i === 5 || i === 6) && settings.weekStartsMonday) continue;

            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);

            const dayEl = document.createElement('div');
            dayEl.className = `week-day ${isSameDay(day, new Date()) ? 'today' : ''}`;

            const dayName = document.createElement('div');
            dayName.className = 'week-day-name';
            dayName.textContent = day.toLocaleDateString('en-US', { weekday: 'short' });

            const dayNumber = document.createElement('div');
            dayNumber.className = 'week-day-number';
            dayNumber.textContent = day.getDate();

            dayEl.appendChild(dayName);
            dayEl.appendChild(dayNumber);
            weekDaysEl.appendChild(dayEl);
        }

        // Create time slots (24 hours)
        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = formatHour(hour);
            timeSlots.appendChild(timeSlot);
        }

        // Add events to week view
        const weekEventsData = getEventsForWeek(weekStart);

        weekEventsData.forEach(event => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);

            // Calculate position and size
            const dayIndex = getDayIndex(startDate, settings.weekStartsMonday);
            const startHour = startDate.getHours() + startDate.getMinutes() / 60;
            const endHour = endDate.getHours() + endDate.getMinutes() / 60;
            const duration = endHour - startHour;

            // Skip if day is not visible (weekends setting)
            if (!settings.showWeekends && (dayIndex === 0 || dayIndex === 6)) return;

            // Create event element
            const eventEl = document.createElement('div');
            eventEl.className = `week-event ${event.category}`;
            eventEl.dataset.id = event.id;
            eventEl.style.top = `${startHour * 60}px`;
            eventEl.style.height = `${duration * 60}px`;
            eventEl.style.left = `${(dayIndex / 7) * 100}%`;
            eventEl.style.width = `${(1 / 7) * 100}%`;

            const title = document.createElement('div');
            title.className = 'event-title';
            title.textContent = event.title;

            const time = document.createElement('div');
            time.className = 'event-time';
            time.textContent = `${formatTime(startDate)} - ${formatTime(endDate)}`;

            eventEl.appendChild(title);
            eventEl.appendChild(time);

            eventEl.addEventListener('click', () => {
                openEventModal(event.id);
            });

            weekEventsContainer.appendChild(eventEl);
        });
    }

    /**
     * Render day view
     */
    function renderDayView() {
        // Clear previous content
        const timeSlots = document.querySelector('#day-view .time-slots');
        const dayEventsContainer = document.getElementById('day-events');

        timeSlots.innerHTML = '';
        dayEventsContainer.innerHTML = '';

        // Create time slots (24 hours)
        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = formatHour(hour);
            timeSlots.appendChild(timeSlot);
        }

        // Add events to day view
        const dayEventsData = getEventsForDay(currentDate);

        dayEventsData.forEach(event => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);

            // Calculate position and size
            const startHour = startDate.getHours() + startDate.getMinutes() / 60;
            const endHour = endDate.getHours() + endDate.getMinutes() / 60;
            const duration = endHour - startHour;

            // Create event element
            const eventEl = document.createElement('div');
            eventEl.className = `day-event ${event.category}`;
            eventEl.dataset.id = event.id;
            eventEl.style.top = `${startHour * 60}px`;
            eventEl.style.height = `${duration * 60}px`;

            const title = document.createElement('div');
            title.className = 'event-title';
            title.textContent = event.title;

            const time = document.createElement('div');
            time.className = 'event-time';
            time.textContent = `${formatTime(startDate)} - ${formatTime(endDate)}`;

            const location = document.createElement('div');
            location.className = 'event-location';
            location.textContent = event.location || '';

            eventEl.appendChild(title);
            eventEl.appendChild(time);

            if (event.location) {
                eventEl.appendChild(location);
            }

            eventEl.addEventListener('click', () => {
                openEventModal(event.id);
            });

            dayEventsContainer.appendChild(eventEl);
        });
    }

    /**
     * Get events for a specific week
     * @param {Date} weekStart - The start date of the week
     * @returns {Array} - Events for the week
     */
    function getEventsForWeek(weekStart) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);

        return events.filter(event => {
            const eventStart = new Date(event.startDate);
            return eventStart >= weekStart && eventStart < weekEnd;
        });
    }

    /**
     * Get events for a specific day
     * @param {Date} date - The date
     * @returns {Array} - Events for the day
     */
    function getEventsForDay(date) {
        return events.filter(event => {
            const eventStart = new Date(event.startDate);
            return isSameDay(eventStart, date);
        });
    }

    /**
     * Get the start of the week for a given date
     * @param {Date} date - The date
     * @param {boolean} startOnMonday - Whether the week starts on Monday
     * @returns {Date} - The start of the week
     */
    function getStartOfWeek(date, startOnMonday) {
        const result = new Date(date);
        const day = result.getDay();

        if (startOnMonday) {
            result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));
        } else {
            result.setDate(result.getDate() - day);
        }

        result.setHours(0, 0, 0, 0);
        return result;
    }

    /**
     * Get the day index in a week
     * @param {Date} date - The date
     * @param {boolean} startOnMonday - Whether the week starts on Monday
     * @returns {number} - The day index (0-6)
     */
    function getDayIndex(date, startOnMonday) {
        const day = date.getDay();
        return startOnMonday ? (day === 0 ? 6 : day - 1) : day;
    }

    /**
     * Format hour for display (12-hour format)
     * @param {number} hour - The hour (0-23)
     * @returns {string} - Formatted hour
     */
    function formatHour(hour) {
        if (hour === 0) return '12 AM';
        if (hour === 12) return '12 PM';
        return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
    }

    /**
     * Format time for display (12-hour format)
     * @param {Date} date - The date
     * @returns {string} - Formatted time
     */
    function formatTime(date) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    /**
     * Update upcoming events in sidebar
     */
    function updateUpcomingEvents() {
        upcomingEvents.innerHTML = '';

        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter and sort upcoming events (next 7 days)
        const upcoming = events
            .filter(event => {
                const eventDate = new Date(event.startDate);
                const diffTime = eventDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays >= 0 && diffDays < 7;
            })
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        if (upcoming.length === 0) {
            const noEvents = document.createElement('div');
            noEvents.className = 'no-events';
            noEvents.textContent = 'No upcoming events in the next 7 days';
            upcomingEvents.appendChild(noEvents);
            return;
        }

        // Add upcoming events to sidebar
        upcoming.forEach(event => {
            const eventEl = createUpcomingEventElement(event);
            upcomingEvents.appendChild(eventEl);
        });
    }

    /**
     * Create an upcoming event element for the sidebar
     * @param {Object} event - The event object
     * @returns {HTMLElement} - The event element
     */
    function createUpcomingEventElement(event) {
        const eventEl = document.createElement('div');
        eventEl.className = 'upcoming-event';
        eventEl.dataset.id = event.id;

        const category = categories.find(cat => cat.id === event.category);

        const header = document.createElement('div');
        header.className = 'upcoming-event-header';

        const title = document.createElement('h4');
        title.className = 'upcoming-event-title';
        title.textContent = event.title;

        const categoryEl = document.createElement('span');
        categoryEl.className = 'upcoming-event-category';
        categoryEl.textContent = category ? category.name : event.category;
        categoryEl.style.backgroundColor = category ? category.color : '#999';

        header.appendChild(title);
        header.appendChild(categoryEl);

        const details = document.createElement('div');
        details.className = 'upcoming-event-details';

        const time = document.createElement('div');
        time.className = 'upcoming-event-time';

        const timeIcon = document.createElement('i');
        timeIcon.className = 'fas fa-clock';

        const timeText = document.createElement('span');
        timeText.textContent = formatEventDateTime(event);

        time.appendChild(timeIcon);
        time.appendChild(timeText);
        details.appendChild(time);

        if (event.location) {
            const location = document.createElement('div');
            location.className = 'upcoming-event-location';

            const locationIcon = document.createElement('i');
            locationIcon.className = 'fas fa-map-marker-alt';

            const locationText = document.createElement('span');
            locationText.textContent = event.location;

            location.appendChild(locationIcon);
            location.appendChild(locationText);
            details.appendChild(location);
        }

        eventEl.appendChild(header);
        eventEl.appendChild(details);

        eventEl.addEventListener('click', () => {
            openEventModal(event.id);
        });

        return eventEl;
    }

    /**
     * Open event modal to add or edit an event
     * @param {string} eventId - The event ID to edit (null for new event)
     * @param {Date} date - The date to set for new event (optional)
     */
    function openEventModal(eventId = null, date = null) {
        // Reset form
        eventTitle.value = '';
        eventLocation.value = '';
        eventDescription.value = '';
        eventReminder.value = 'none';

        // Set default dates and times
        const now = new Date();
        const defaultDate = date || now;
        const formattedDate = formatDateForInput(defaultDate);

        eventStartDate.value = formattedDate;
        eventEndDate.value = formattedDate;

        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = Math.ceil(now.getMinutes() / 15) * 15;
        const formattedMinutes = (minutes % 60).toString().padStart(2, '0');

        eventStartTime.value = `${hours}:${formattedMinutes}`;
        eventEndTime.value = `${hours}:${formattedMinutes === '45' ? '00' : (minutes + 15) % 60}:${formattedMinutes === '45' ? (parseInt(hours) + 1).toString().padStart(2, '0') : hours}`;

        // Set default category
        eventCategory.value = 'work';

        if (eventId) {
            // Edit existing event
            const event = events.find(e => e.id === eventId);
            if (event) {
                editingEventId = eventId;
                eventModalTitle.textContent = 'Edit Event';
                deleteEventBtn.classList.remove('hidden');

                // Populate form with event data
                eventTitle.value = event.title;

                const startDate = new Date(event.startDate);
                const endDate = new Date(event.endDate);

                eventStartDate.value = formatDateForInput(startDate);
                eventStartTime.value = formatTimeForInput(startDate);
                eventEndDate.value = formatDateForInput(endDate);
                eventEndTime.value = formatTimeForInput(endDate);

                eventCategory.value = event.category;
                eventLocation.value = event.location || '';
                eventDescription.value = event.description || '';
                eventReminder.value = event.reminder || 'none';
            }
        } else {
            // Add new event
            editingEventId = null;
            eventModalTitle.textContent = 'Add Event';
            deleteEventBtn.classList.add('hidden');
        }

        // Show modal
        eventModal.classList.add('show');
    }

    /**
     * Close event modal
     */
    function closeEventModal() {
        eventModal.classList.remove('show');
        editingEventId = null;
    }

    /**
     * Save event from modal
     */
    function saveEvent() {
        const title = eventTitle.value.trim();

        if (!title) {
            showNotification('Please enter an event title', 'error');
            return;
        }

        const startDate = new Date(`${eventStartDate.value}T${eventStartTime.value}`);
        const endDate = new Date(`${eventEndDate.value}T${eventEndTime.value}`);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            showNotification('Please enter valid dates and times', 'error');
            return;
        }

        if (endDate < startDate) {
            showNotification('End date cannot be before start date', 'error');
            return;
        }

        const eventData = {
            title,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            category: eventCategory.value,
            location: eventLocation.value.trim(),
            description: eventDescription.value.trim(),
            reminder: eventReminder.value
        };

        if (editingEventId) {
            // Update existing event
            const index = events.findIndex(e => e.id === editingEventId);
            if (index !== -1) {
                eventData.id = editingEventId;
                events[index] = eventData;
                showNotification('Event updated successfully', 'success');
            }
        } else {
            // Add new event
            eventData.id = Date.now().toString();
            events.push(eventData);
            showNotification('Event added successfully', 'success');
        }

        // Save events and update calendar
        saveEvents();
        renderCalendar();
        updateUpcomingEvents();

        // Close modal
        closeEventModal();
    }

    /**
     * Delete event
     */
    function deleteEvent() {
        if (!editingEventId) return;

        // Confirm deletion
        if (confirm('Are you sure you want to delete this event?')) {
            events = events.filter(e => e.id !== editingEventId);

            // Save events and update calendar
            saveEvents();
            renderCalendar();
            updateUpcomingEvents();

            // Close modal
            closeEventModal();

            showNotification('Event deleted successfully', 'success');
        }
    }

    /**
     * Open category modal to add a new category
     */
    function openCategoryModal() {
        // Reset form
        categoryName.value = '';
        categoryColor.value = '#4CAF50';

        // Show modal
        categoryModal.classList.add('show');
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
        if (categories.some(c => c.id === id)) {
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
        updateCategorySelect();

        // Close modal
        closeCategoryModal();

        showNotification('Category added successfully', 'success');
    }

    /**
     * Update category select in event modal
     */
    function updateCategorySelect() {
        eventCategory.innerHTML = '';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            eventCategory.appendChild(option);
        });
    }

    /**
     * Export calendar events to JSON file
     */
    function exportCalendar() {
        if (events.length === 0) {
            showNotification('No events to export', 'info');
            return;
        }

        const exportData = {
            events,
            categories
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `calendar-${formatDate(new Date())}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        showNotification('Calendar exported successfully', 'success');
    }

    /**
     * Import calendar events from JSON file
     */
    function importCalendar() {
        const file = importFile.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);

                if (!importedData.events || !Array.isArray(importedData.events)) {
                    throw new Error('Invalid format');
                }

                // Confirm import
                if (events.length > 0) {
                    if (!confirm('This will replace your current events. Continue?')) {
                        return;
                    }
                }

                // Import events
                events = importedData.events;

                // Import categories if available
                if (importedData.categories && Array.isArray(importedData.categories)) {
                    categories = importedData.categories;
                    updateCategorySelect();
                }

                // Save and update UI
                saveEvents();
                saveCategories();
                renderCalendar();
                updateUpcomingEvents();

                showNotification('Calendar imported successfully', 'success');
            } catch (error) {
                showNotification('Error importing calendar: Invalid file format', 'error');
            }
        };

        reader.readAsText(file);
        importFile.value = '';
    }

    /**
     * Save events to localStorage
     */
    function saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }

    /**
     * Load events from localStorage
     */
    function loadEvents() {
        const savedEvents = localStorage.getItem('calendarEvents');
        if (savedEvents) {
            events = JSON.parse(savedEvents);
        }
    }

    /**
     * Save categories to localStorage
     */
    function saveCategories() {
        localStorage.setItem('calendarCategories', JSON.stringify(categories));
    }

    /**
     * Load categories from localStorage
     */
    function loadCategories() {
        const savedCategories = localStorage.getItem('calendarCategories');
        if (savedCategories) {
            categories = JSON.parse(savedCategories);
            updateCategorySelect();
        }
    }

    /**
     * Save settings to localStorage
     */
    function saveSettings() {
        localStorage.setItem('calendarSettings', JSON.stringify(settings));
    }

    /**
     * Load settings from localStorage
     */
    function loadSettings() {
        const savedSettings = localStorage.getItem('calendarSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);

            darkModeToggle.checked = settings.darkMode;
            showWeekendsToggle.checked = settings.showWeekends;
            weekStartsMondayToggle.checked = settings.weekStartsMonday;
        }
    }

    /**
     * Check if two dates are the same day
     * @param {Date} date1 - First date
     * @param {Date} date2 - Second date
     * @returns {boolean} - True if same day
     */
    function isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    /**
     * Format date as YYYY-MM-DD
     * @param {Date} date - The date to format
     * @returns {string} - Formatted date
     */
    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Format date for input fields (YYYY-MM-DD)
     * @param {Date} date - The date to format
     * @returns {string} - Formatted date
     */
    function formatDateForInput(date) {
        return formatDate(date);
    }

    /**
     * Format time for input fields (HH:MM)
     * @param {Date} date - The date to format
     * @returns {string} - Formatted time
     */
    function formatTimeForInput(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    /**
     * Format event date and time for display
     * @param {Object} event - The event object
     * @returns {string} - Formatted date and time
     */
    function formatEventDateTime(event) {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        const dateStr = startDate.toLocaleDateString('en-US', options);

        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        const startTimeStr = startDate.toLocaleTimeString('en-US', timeOptions);
        const endTimeStr = endDate.toLocaleTimeString('en-US', timeOptions);

        return `${dateStr}, ${startTimeStr} - ${endTimeStr}`;
    }
}

/**
 * Initialize notification system
 */
function initNotification() {
    // Show a welcome notification
    showNotification('Welcome to Calendar Planner! Organize your schedule with ease.', 'info');
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
