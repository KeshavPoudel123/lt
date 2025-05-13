/**
 * Pomodoro Timer Tool
 *
 * This tool implements the Pomodoro Technique, a time management method that uses a timer to break
 * work into intervals, traditionally 25 minutes in length, separated by short breaks.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Pomodoro Timer
    initPomodoroTimer();

    // Initialize notification system
    initNotification();
});

/**
 * Initialize the Pomodoro Timer
 */
function initPomodoroTimer() {
    // DOM elements
    const timerDisplay = document.querySelector('.timer-display');
    const timerCircle = document.querySelector('.timer-circle');
    const timerProgress = document.querySelector('.timer-progress');
    const timerTime = document.getElementById('timer-time');
    const timerLabel = document.getElementById('timer-label');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const applySettingsBtn = document.getElementById('apply-settings');

    // Settings inputs
    const focusTimeInput = document.getElementById('focus-time');
    const shortBreakInput = document.getElementById('short-break');
    const longBreakInput = document.getElementById('long-break');
    const pomodoroCountInput = document.getElementById('pomodoro-count');
    const autoStartInput = document.getElementById('auto-start');
    const notificationsInput = document.getElementById('notifications');

    // Stats elements
    const completedCount = document.getElementById('completed-count');
    const currentStreak = document.getElementById('current-streak');
    const totalFocusTime = document.getElementById('total-focus-time');

    // Timer variables
    let timer;
    let timerMode = 'focus'; // 'focus', 'shortBreak', 'longBreak'
    let timerRunning = false;
    let timeLeft = 25 * 60; // in seconds
    let totalTime = 25 * 60; // in seconds
    let completedPomodoros = 0;
    let streak = 0;
    let totalFocusMinutes = 0;

    // Settings
    let settings = {
        focusTime: 25,
        shortBreak: 5,
        longBreak: 15,
        pomodoroCount: 4,
        autoStart: true,
        notifications: true
    };

    // Load settings from localStorage
    loadSettings();

    // Set initial timer display
    updateTimerDisplay();

    // Set circle circumference
    const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
    timerProgress.style.strokeDasharray = `${circumference}`;

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    applySettingsBtn.addEventListener('click', applySettings);

    /**
     * Start the timer
     */
    function startTimer() {
        if (timerRunning) return;

        timerRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;

        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                clearInterval(timer);
                timerComplete();
            }
        }, 1000);
    }

    /**
     * Pause the timer
     */
    function pauseTimer() {
        if (!timerRunning) return;

        timerRunning = false;
        clearInterval(timer);
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    /**
     * Reset the timer
     */
    function resetTimer() {
        pauseTimer();
        setTimerMode(timerMode);
        updateTimerDisplay();
    }

    /**
     * Timer completed
     */
    function timerComplete() {
        timerRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;

        // Play sound
        playSound();

        // Show notification
        if (settings.notifications) {
            showTimerNotification();
        }

        // Update stats if focus session completed
        if (timerMode === 'focus') {
            completedPomodoros++;
            streak++;
            totalFocusMinutes += settings.focusTime;

            updateStats();

            // Determine next timer mode
            if (completedPomodoros % settings.pomodoroCount === 0) {
                setTimerMode('longBreak');
            } else {
                setTimerMode('shortBreak');
            }
        } else {
            // After break, go back to focus mode
            setTimerMode('focus');
        }

        // Auto-start next session if enabled
        if (settings.autoStart) {
            startTimer();
        }
    }

    /**
     * Set timer mode (focus, short break, long break)
     * @param {string} mode - The timer mode
     */
    function setTimerMode(mode) {
        timerMode = mode;

        // Remove all mode classes
        timerCircle.classList.remove('focus-mode', 'short-break-mode', 'long-break-mode');

        // Set time based on mode
        switch (mode) {
            case 'focus':
                totalTime = settings.focusTime * 60;
                timerLabel.textContent = 'FOCUS';
                timerCircle.classList.add('focus-mode');
                timerProgress.style.stroke = 'var(--focus-color)';
                break;
            case 'shortBreak':
                totalTime = settings.shortBreak * 60;
                timerLabel.textContent = 'SHORT BREAK';
                timerCircle.classList.add('short-break-mode');
                timerProgress.style.stroke = 'var(--short-break-color)';
                break;
            case 'longBreak':
                totalTime = settings.longBreak * 60;
                timerLabel.textContent = 'LONG BREAK';
                timerCircle.classList.add('long-break-mode');
                timerProgress.style.stroke = 'var(--long-break-color)';
                break;
        }

        timeLeft = totalTime;
    }

    /**
     * Update timer display
     */
    function updateTimerDisplay() {
        // Format time as MM:SS
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Update progress circle
        const progress = timeLeft / totalTime;
        const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
        const offset = circumference * (1 - progress);
        timerProgress.style.strokeDashoffset = offset;

        // Update document title
        document.title = `${timerTime.textContent} - ${timerLabel.textContent} - Pomodoro Timer`;
    }

    /**
     * Update stats display
     */
    function updateStats() {
        completedCount.textContent = completedPomodoros;
        currentStreak.textContent = streak;
        totalFocusTime.textContent = `${totalFocusMinutes} min`;

        // Save stats to localStorage
        localStorage.setItem('pomodoroStats', JSON.stringify({
            completedPomodoros,
            streak,
            totalFocusMinutes
        }));
    }

    /**
     * Apply settings
     */
    function applySettings() {
        // Get values from inputs
        settings.focusTime = parseInt(focusTimeInput.value) || 25;
        settings.shortBreak = parseInt(shortBreakInput.value) || 5;
        settings.longBreak = parseInt(longBreakInput.value) || 15;
        settings.pomodoroCount = parseInt(pomodoroCountInput.value) || 4;
        settings.autoStart = autoStartInput.checked;
        settings.notifications = notificationsInput.checked;

        // Validate settings
        settings.focusTime = Math.max(1, Math.min(60, settings.focusTime));
        settings.shortBreak = Math.max(1, Math.min(30, settings.shortBreak));
        settings.longBreak = Math.max(1, Math.min(60, settings.longBreak));
        settings.pomodoroCount = Math.max(1, Math.min(10, settings.pomodoroCount));

        // Update inputs with validated values
        focusTimeInput.value = settings.focusTime;
        shortBreakInput.value = settings.shortBreak;
        longBreakInput.value = settings.longBreak;
        pomodoroCountInput.value = settings.pomodoroCount;

        // Save settings to localStorage
        saveSettings();

        // Reset timer with new settings
        resetTimer();

        // Show notification
        showNotification('Settings applied successfully', 'success');
    }

    /**
     * Save settings to localStorage
     */
    function saveSettings() {
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    }

    /**
     * Load settings from localStorage
     */
    function loadSettings() {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);

            // Update inputs with saved values
            focusTimeInput.value = settings.focusTime;
            shortBreakInput.value = settings.shortBreak;
            longBreakInput.value = settings.longBreak;
            pomodoroCountInput.value = settings.pomodoroCount;
            autoStartInput.checked = settings.autoStart;
            notificationsInput.checked = settings.notifications;
        }

        // Load saved stats
        const savedStats = localStorage.getItem('pomodoroStats');
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            completedPomodoros = stats.completedPomodoros || 0;
            streak = stats.streak || 0;
            totalFocusMinutes = stats.totalFocusMinutes || 0;

            updateStats();
        }

        // Set initial timer mode
        setTimerMode('focus');
    }

    /**
     * Play sound when timer completes
     */
    function playSound() {
        try {
            // Create a simple beep sound using the Web Audio API if the sound file is not available
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.5;

            oscillator.start();

            // Play for 0.3 seconds
            setTimeout(() => {
                oscillator.stop();

                // Play a second beep after a short pause
                setTimeout(() => {
                    const oscillator2 = audioContext.createOscillator();
                    oscillator2.connect(gainNode);
                    oscillator2.type = 'sine';
                    oscillator2.frequency.value = 1000;
                    oscillator2.start();

                    // Stop after 0.3 seconds
                    setTimeout(() => {
                        oscillator2.stop();
                    }, 300);
                }, 200);
            }, 300);
        } catch (error) {
            console.error('Error playing sound:', error);

            // Fallback to alert if Web Audio API is not supported
            if (timerMode === 'focus') {
                showNotification('Focus session completed! Time for a break.', 'success');
            } else {
                showNotification('Break time is over! Ready to focus again?', 'info');
            }
        }
    }

    /**
     * Show browser notification when timer completes
     */
    function showTimerNotification() {
        // Check if browser supports notifications
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notifications");
            return;
        }

        // Check if permission is granted
        if (Notification.permission === "granted") {
            createNotification();
        }
        // Otherwise, request permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    createNotification();
                }
            });
        }

        function createNotification() {
            let message = '';
            let icon = '';

            if (timerMode === 'focus') {
                message = 'Focus session completed! Time for a break.';
                icon = '../../assets/images/focus-icon.png';
            } else {
                message = 'Break time is over! Ready to focus again?';
                icon = '../../assets/images/break-icon.png';
            }

            const notification = new Notification('Pomodoro Timer', {
                body: message,
                icon: icon
            });

            // Close notification after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);
        }
    }
}

/**
 * Initialize notification system
 */
function initNotification() {
    // Get notification elements
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = document.querySelector('.notification-icon');

    // Show a welcome notification
    showNotification('Welcome to Pomodoro Timer! Set your timer and boost productivity.', 'info');
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
