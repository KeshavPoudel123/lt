/**
 * Todo List Tool
 *
 * This tool allows users to create, edit, and manage tasks in a todo list.
 * Features include task prioritization, filtering, sorting, and more.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Todo List
    initTodoList();

    // Initialize notification system
    initNotification();

    // Show welcome notification
    showNotification('Welcome to Todo List! Add tasks to get started.', 'info');
});

/**
 * Initialize the Todo List
 */
function initTodoList() {
    // DOM elements
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    const allFilterBtn = document.getElementById('all-filter');
    const activeFilterBtn = document.getElementById('active-filter');
    const completedFilterBtn = document.getElementById('completed-filter');
    const sortSelect = document.getElementById('sort-select');
    const totalTasksEl = document.getElementById('total-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    const remainingTasksEl = document.getElementById('remaining-tasks');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    const darkModeToggle = document.getElementById('dark-mode');
    const showDateToggle = document.getElementById('show-date');
    const confirmDeleteToggle = document.getElementById('confirm-delete');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');

    // Modal elements
    const editModal = document.getElementById('edit-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const editTaskInput = document.getElementById('edit-task-input');
    const editPrioritySelect = document.getElementById('edit-priority-select');
    const editDueDate = document.getElementById('edit-due-date');
    const editNotes = document.getElementById('edit-notes');
    const saveEditBtn = document.getElementById('save-edit-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    // App state
    let todos = [];
    let currentFilter = 'all';
    let currentSort = 'date-added-desc';
    let editingTodoId = null;

    // Settings
    let settings = {
        darkMode: true,
        showDate: true,
        confirmDelete: true
    };

    // Load todos and settings from localStorage
    loadTodos();
    loadSettings();

    // Event listeners
    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    allFilterBtn.addEventListener('click', () => filterTodos('all'));
    activeFilterBtn.addEventListener('click', () => filterTodos('active'));
    completedFilterBtn.addEventListener('click', () => filterTodos('completed'));

    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        renderTodos();
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);

    darkModeToggle.addEventListener('change', () => {
        settings.darkMode = darkModeToggle.checked;
        saveSettings();
    });

    showDateToggle.addEventListener('change', () => {
        settings.showDate = showDateToggle.checked;
        saveSettings();
        renderTodos();
    });

    confirmDeleteToggle.addEventListener('change', () => {
        settings.confirmDelete = confirmDeleteToggle.checked;
        saveSettings();
    });

    exportBtn.addEventListener('click', exportTodos);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', importTodos);

    // Modal event listeners
    closeModalBtn.addEventListener('click', closeModal);
    saveEditBtn.addEventListener('click', saveEdit);
    cancelEditBtn.addEventListener('click', closeModal);

    /**
     * Add a new todo
     */
    function addTodo() {
        const text = todoInput.value.trim();

        if (!text) {
            showNotification('Please enter a task', 'error');
            return;
        }

        const newTodo = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            dateAdded: new Date().toISOString(),
            priority: 'medium',
            dueDate: '',
            notes: ''
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();
        updateStats();

        todoInput.value = '';
        todoInput.focus();

        showNotification('Task added successfully', 'success');
    }

    /**
     * Toggle todo completion status
     * @param {string} id - The todo ID
     */
    function toggleTodo(id) {
        try {
            const todo = todos.find(todo => todo.id === id);
            if (todo) {
                // Toggle completion status
                todo.completed = !todo.completed;

                // Save changes
                saveTodos();

                // Update UI
                const todoItem = document.querySelector(`.todo-item[data-id="${id}"]`);
                if (todoItem) {
                    if (todo.completed) {
                        todoItem.classList.add('completed');
                    } else {
                        todoItem.classList.remove('completed');
                    }

                    // Update checkbox
                    const checkbox = todoItem.querySelector('.todo-checkbox');
                    if (checkbox) {
                        checkbox.checked = todo.completed;
                    }
                }

                // Update stats without full re-render
                updateStats();

                // Show notification
                if (todo.completed) {
                    showNotification('Task completed!', 'success');
                } else {
                    showNotification('Task marked as active', 'info');
                }
            }
        } catch (error) {
            console.error('Error toggling todo:', error);
            showNotification('Error updating task status', 'error');
        }
    }

    /**
     * Delete a todo
     * @param {string} id - The todo ID
     */
    function deleteTodo(id) {
        try {
            const todo = todos.find(todo => todo.id === id);
            if (!todo) return;

            if (settings.confirmDelete) {
                // Show confirmation notification
                showNotification(`Delete task "${todo.text}"?`, 'error');

                // Create temporary delete confirmation buttons
                const todoItem = document.querySelector(`.todo-item[data-id="${id}"]`);
                if (todoItem) {
                    // Save original actions HTML
                    const actions = todoItem.querySelector('.todo-actions');
                    const originalActionsHTML = actions ? actions.innerHTML : '';

                    // Create confirmation buttons
                    const confirmActions = document.createElement('div');
                    confirmActions.className = 'confirm-actions';

                    const confirmBtn = document.createElement('button');
                    confirmBtn.type = 'button';
                    confirmBtn.className = 'btn btn-sm btn-danger';
                    confirmBtn.innerHTML = '<i class="fas fa-check"></i> Yes';

                    const cancelBtn = document.createElement('button');
                    cancelBtn.type = 'button';
                    cancelBtn.className = 'btn btn-sm btn-secondary';
                    cancelBtn.innerHTML = '<i class="fas fa-times"></i> No';

                    // Add event listeners
                    confirmBtn.onclick = function() {
                        // Remove the task from the array
                        todos = todos.filter(t => t.id !== id);

                        // Save to localStorage
                        saveTodos();

                        // Remove the item from the DOM
                        todoItem.remove();

                        // Update stats
                        updateStats();

                        // Check if list is empty
                        if (todos.length === 0 ||
                            (currentFilter === 'active' && todos.filter(t => !t.completed).length === 0) ||
                            (currentFilter === 'completed' && todos.filter(t => t.completed).length === 0)) {
                            document.getElementById('empty-state').style.display = 'flex';
                        }

                        // Show notification
                        showNotification('Task deleted', 'success');
                    };

                    cancelBtn.onclick = function() {
                        // Restore original actions
                        if (actions) {
                            actions.innerHTML = originalActionsHTML;

                            // Re-attach event listeners
                            const newEditBtn = actions.querySelector('.todo-edit-btn');
                            if (newEditBtn) {
                                newEditBtn.addEventListener('click', () => editTodo(id));
                            }

                            const newDeleteBtn = actions.querySelector('.todo-delete-btn');
                            if (newDeleteBtn) {
                                newDeleteBtn.addEventListener('click', () => deleteTodo(id));
                            }
                        }
                    };

                    // Add buttons to container
                    confirmActions.appendChild(confirmBtn);
                    confirmActions.appendChild(cancelBtn);

                    // Replace the actions with confirmation buttons
                    if (actions) {
                        actions.innerHTML = '';
                        actions.appendChild(confirmActions);
                    }
                }
            } else {
                // No confirmation needed, delete immediately
                todos = todos.filter(t => t.id !== id);
                saveTodos();

                // Remove the item from the DOM
                const todoItem = document.querySelector(`.todo-item[data-id="${id}"]`);
                if (todoItem) {
                    todoItem.remove();
                }

                // Update stats
                updateStats();

                // Check if list is empty
                if (todos.length === 0 ||
                    (currentFilter === 'active' && todos.filter(t => !t.completed).length === 0) ||
                    (currentFilter === 'completed' && todos.filter(t => t.completed).length === 0)) {
                    document.getElementById('empty-state').style.display = 'flex';
                }

                // Show notification
                showNotification('Task deleted', 'success');
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
            showNotification('Error deleting task', 'error');
        }
    }

    /**
     * Open edit modal for a todo
     * @param {string} id - The todo ID
     */
    function editTodo(id) {
        try {
            const todo = todos.find(todo => todo.id === id);
            if (todo) {
                // Store the ID of the todo being edited
                editingTodoId = id;

                // Populate form fields
                editTaskInput.value = todo.text;
                editPrioritySelect.value = todo.priority;
                editDueDate.value = todo.dueDate ? todo.dueDate.split('T')[0] : '';
                editNotes.value = todo.notes;

                // Show the modal
                editModal.classList.add('show');

                // Focus on the task input
                setTimeout(() => {
                    editTaskInput.focus();
                }, 100);
            }
        } catch (error) {
            console.error('Error opening edit modal:', error);
            showNotification('Error opening edit form', 'error');
        }
    }

    /**
     * Save edited todo
     */
    function saveEdit() {
        try {
            if (!editingTodoId) return;

            const todo = todos.find(todo => todo.id === editingTodoId);
            if (todo) {
                const text = editTaskInput.value.trim();

                if (!text) {
                    showNotification('Task text cannot be empty', 'error');
                    return;
                }

                // Update todo properties
                todo.text = text;
                todo.priority = editPrioritySelect.value;
                todo.dueDate = editDueDate.value ? new Date(editDueDate.value).toISOString() : '';
                todo.notes = editNotes.value;

                // Save to localStorage
                saveTodos();

                // Update UI for just this todo item without full re-render
                const todoItem = document.querySelector(`.todo-item[data-id="${editingTodoId}"]`);
                if (todoItem) {
                    // Update text
                    const todoText = todoItem.querySelector('.todo-text');
                    if (todoText) {
                        todoText.textContent = todo.text;
                    }

                    // Update priority
                    const priorityIndicator = todoItem.querySelector('.priority-indicator');
                    if (priorityIndicator) {
                        priorityIndicator.className = `priority-indicator priority-${todo.priority}`;
                    }

                    const priorityText = todoItem.querySelector('.todo-priority span:last-child');
                    if (priorityText) {
                        priorityText.textContent = capitalizeFirstLetter(todo.priority);
                    }

                    // Update due date if shown
                    if (settings.showDate && todo.dueDate) {
                        let dateEl = todoItem.querySelector('.todo-date');
                        if (!dateEl && todo.dueDate) {
                            // Create date element if it doesn't exist
                            const details = todoItem.querySelector('.todo-details');
                            if (details) {
                                dateEl = document.createElement('div');
                                dateEl.className = 'todo-date';
                                dateEl.innerHTML = `
                                    <i class="fas fa-calendar-alt"></i>
                                    <span>${formatDate(todo.dueDate)}</span>
                                `;
                                details.insertBefore(dateEl, details.firstChild);
                            }
                        } else if (dateEl && todo.dueDate) {
                            // Update existing date
                            const dateText = dateEl.querySelector('span');
                            if (dateText) {
                                dateText.textContent = formatDate(todo.dueDate);
                            }
                        }
                    } else {
                        // Remove date if not showing or no date
                        const dateEl = todoItem.querySelector('.todo-date');
                        if (dateEl) {
                            dateEl.remove();
                        }
                    }
                }

                // Close the modal
                closeModal();

                // Show success notification
                showNotification('Task updated successfully', 'success');
            }
        } catch (error) {
            console.error('Error saving edit:', error);
            showNotification('Error updating task', 'error');
        }
    }

    /**
     * Close the edit modal
     */
    function closeModal() {
        editModal.classList.remove('show');

        // Clear the editing ID after a short delay to allow animations to complete
        setTimeout(() => {
            editingTodoId = null;
        }, 300);
    }

    /**
     * Filter todos
     * @param {string} filter - The filter type (all, active, completed)
     */
    function filterTodos(filter) {
        currentFilter = filter;

        // Update active filter button
        allFilterBtn.classList.toggle('active', filter === 'all');
        activeFilterBtn.classList.toggle('active', filter === 'active');
        completedFilterBtn.classList.toggle('active', filter === 'completed');

        renderTodos();
    }

    /**
     * Clear completed todos
     */
    function clearCompleted() {
        try {
            const completedCount = todos.filter(todo => todo.completed).length;

            if (completedCount === 0) {
                showNotification('No completed tasks to clear', 'info');
                return;
            }

            if (settings.confirmDelete) {
                // Show confirmation notification
                showNotification(`Clear ${completedCount} completed task(s)?`, 'info');

                // Create confirmation UI
                const clearCompletedBtn = document.getElementById('clear-completed-btn');
                if (clearCompletedBtn) {
                    // Save original button text
                    const originalText = clearCompletedBtn.innerHTML;
                    const originalOnClick = clearCompletedBtn.onclick;

                    // Change button to confirmation mode
                    clearCompletedBtn.innerHTML = '<i class="fas fa-check"></i> Confirm Clear';
                    clearCompletedBtn.classList.add('btn-danger');

                    // Create cancel button
                    const cancelBtn = document.createElement('button');
                    cancelBtn.type = 'button';
                    cancelBtn.className = 'btn btn-secondary';
                    cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';

                    // Insert cancel button after clear button
                    clearCompletedBtn.parentNode.insertBefore(cancelBtn, clearCompletedBtn.nextSibling);

                    // Set up one-time click handlers
                    const confirmHandler = function() {
                        // Remove completed tasks
                        const completedItems = document.querySelectorAll('.todo-item.completed');
                        completedItems.forEach(item => item.remove());

                        // Update data
                        todos = todos.filter(todo => !todo.completed);
                        saveTodos();
                        updateStats();

                        // Check if list is empty
                        if (todos.length === 0 ||
                            (currentFilter === 'completed')) {
                            document.getElementById('empty-state').style.display = 'flex';
                        }

                        // Restore button
                        clearCompletedBtn.innerHTML = originalText;
                        clearCompletedBtn.classList.remove('btn-danger');
                        clearCompletedBtn.onclick = originalOnClick;

                        // Remove cancel button
                        cancelBtn.remove();

                        // Show notification
                        showNotification('Completed tasks cleared', 'success');
                    };

                    const cancelHandler = function() {
                        // Restore button
                        clearCompletedBtn.innerHTML = originalText;
                        clearCompletedBtn.classList.remove('btn-danger');
                        clearCompletedBtn.onclick = originalOnClick;

                        // Remove cancel button
                        cancelBtn.remove();
                    };

                    // Set up one-time event listeners
                    clearCompletedBtn.onclick = function() {
                        confirmHandler();
                        clearCompletedBtn.onclick = originalOnClick;
                    };

                    cancelBtn.onclick = function() {
                        cancelHandler();
                    };
                }
            } else {
                // No confirmation needed, clear immediately
                // Remove completed tasks from DOM
                const completedItems = document.querySelectorAll('.todo-item.completed');
                completedItems.forEach(item => item.remove());

                // Update data
                todos = todos.filter(todo => !todo.completed);
                saveTodos();
                updateStats();

                // Check if list is empty
                if (todos.length === 0 ||
                    (currentFilter === 'completed')) {
                    document.getElementById('empty-state').style.display = 'flex';
                }

                // Show notification
                showNotification('Completed tasks cleared', 'success');
            }
        } catch (error) {
            console.error('Error clearing completed todos:', error);
            showNotification('Error clearing completed tasks', 'error');
        }
    }

    /**
     * Export todos to JSON file
     */
    function exportTodos() {
        if (todos.length === 0) {
            showNotification('No tasks to export', 'info');
            return;
        }

        const dataStr = JSON.stringify(todos, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `todo-list-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        showNotification('Tasks exported successfully', 'success');
    }

    /**
     * Import todos from JSON file
     */
    function importTodos() {
        try {
            const file = importFile.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const importedTodos = JSON.parse(e.target.result);

                    if (!Array.isArray(importedTodos)) {
                        throw new Error('Invalid format');
                    }

                    if (settings.confirmDelete && todos.length > 0) {
                        // Show confirmation notification
                        showNotification(`Replace ${todos.length} existing tasks with ${importedTodos.length} imported tasks?`, 'info');

                        // Create confirmation UI
                        const importBtn = document.getElementById('import-btn');
                        if (importBtn) {
                            // Save original button text and state
                            const originalText = importBtn.innerHTML;
                            const originalOnClick = importBtn.onclick;

                            // Change button to confirmation mode
                            importBtn.innerHTML = '<i class="fas fa-check"></i> Confirm Import';
                            importBtn.classList.add('btn-primary');

                            // Create cancel button
                            const cancelBtn = document.createElement('button');
                            cancelBtn.type = 'button';
                            cancelBtn.className = 'btn btn-secondary';
                            cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';

                            // Insert cancel button after import button
                            importBtn.parentNode.insertBefore(cancelBtn, importBtn.nextSibling);

                            // Set up one-time click handlers
                            const confirmHandler = function() {
                                // Import tasks
                                todos = importedTodos;
                                saveTodos();
                                renderTodos();
                                updateStats();

                                // Restore button
                                importBtn.innerHTML = originalText;
                                importBtn.classList.remove('btn-primary');
                                importBtn.onclick = originalOnClick;

                                // Remove cancel button
                                cancelBtn.remove();

                                // Show notification
                                showNotification(`Successfully imported ${importedTodos.length} tasks`, 'success');
                            };

                            const cancelHandler = function() {
                                // Restore button
                                importBtn.innerHTML = originalText;
                                importBtn.classList.remove('btn-primary');
                                importBtn.onclick = originalOnClick;

                                // Remove cancel button
                                cancelBtn.remove();
                            };

                            // Set up one-time event listeners
                            importBtn.onclick = function() {
                                confirmHandler();
                                importBtn.onclick = function() {
                                    importFile.click();
                                };
                            };

                            cancelBtn.onclick = function() {
                                cancelHandler();
                            };
                        }
                    } else {
                        // No confirmation needed, import immediately
                        todos = importedTodos;
                        saveTodos();
                        renderTodos();
                        updateStats();

                        showNotification(`Successfully imported ${importedTodos.length} tasks`, 'success');
                    }
                } catch (error) {
                    console.error('Error parsing import file:', error);
                    showNotification('Error importing tasks: Invalid file format', 'error');
                }
            };

            reader.onerror = function() {
                showNotification('Error reading file', 'error');
            };

            reader.readAsText(file);
            importFile.value = '';
        } catch (error) {
            console.error('Error importing todos:', error);
            showNotification('Error importing tasks', 'error');
        }
    }

    /**
     * Render todos based on current filter and sort
     */
    function renderTodos() {
        try {
            // Filter todos
            let filteredTodos = todos;

            if (currentFilter === 'active') {
                filteredTodos = todos.filter(todo => !todo.completed);
            } else if (currentFilter === 'completed') {
                filteredTodos = todos.filter(todo => todo.completed);
            }

            // Sort todos
            filteredTodos = sortTodos(filteredTodos, currentSort);

            // Clear list
            todoList.innerHTML = '';

            // Show empty state if no todos
            if (filteredTodos.length === 0) {
                emptyState.style.display = 'flex';
            } else {
                emptyState.style.display = 'none';

                // Render todos
                filteredTodos.forEach(todo => {
                    const li = document.createElement('li');
                    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                    li.dataset.id = todo.id;

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'todo-checkbox';
                    checkbox.checked = todo.completed;

                    // Use onclick instead of addEventListener to avoid memory leaks
                    checkbox.onclick = function() {
                        toggleTodo(todo.id);
                    };

                    const content = document.createElement('div');
                    content.className = 'todo-content';

                    const text = document.createElement('div');
                    text.className = 'todo-text';
                    text.textContent = todo.text;

                    const details = document.createElement('div');
                    details.className = 'todo-details';

                    if (settings.showDate && todo.dueDate) {
                        const date = document.createElement('div');
                        date.className = 'todo-date';

                        const dateIcon = document.createElement('i');
                        dateIcon.className = 'fas fa-calendar-alt';

                        const dateText = document.createElement('span');
                        dateText.textContent = formatDate(todo.dueDate);

                        date.appendChild(dateIcon);
                        date.appendChild(dateText);
                        details.appendChild(date);
                    }

                    const priority = document.createElement('div');
                    priority.className = 'todo-priority';

                    const priorityIndicator = document.createElement('span');
                    priorityIndicator.className = `priority-indicator priority-${todo.priority}`;

                    const priorityText = document.createElement('span');
                    priorityText.textContent = capitalizeFirstLetter(todo.priority);

                    priority.appendChild(priorityIndicator);
                    priority.appendChild(priorityText);
                    details.appendChild(priority);

                    content.appendChild(text);
                    content.appendChild(details);

                    const actions = document.createElement('div');
                    actions.className = 'todo-actions';

                    const editBtn = document.createElement('button');
                    editBtn.type = 'button';
                    editBtn.className = 'todo-action-btn todo-edit-btn';
                    editBtn.innerHTML = '<i class="fas fa-edit"></i>';

                    // Use onclick instead of addEventListener to avoid memory leaks
                    editBtn.onclick = function() {
                        editTodo(todo.id);
                    };

                    const deleteBtn = document.createElement('button');
                    deleteBtn.type = 'button';
                    deleteBtn.className = 'todo-action-btn todo-delete-btn';
                    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';

                    // Use onclick instead of addEventListener to avoid memory leaks
                    deleteBtn.onclick = function() {
                        deleteTodo(todo.id);
                    };

                    actions.appendChild(editBtn);
                    actions.appendChild(deleteBtn);

                    li.appendChild(checkbox);
                    li.appendChild(content);
                    li.appendChild(actions);

                    todoList.appendChild(li);
                });
            }

            // Update stats
            updateStats();
        } catch (error) {
            console.error('Error rendering todos:', error);
            showNotification('Error displaying tasks', 'error');
        }
    }

    /**
     * Sort todos
     * @param {Array} todos - The todos to sort
     * @param {string} sortBy - The sort method
     * @returns {Array} - Sorted todos
     */
    function sortTodos(todos, sortBy) {
        const sortedTodos = [...todos];

        switch (sortBy) {
            case 'date-added-desc':
                return sortedTodos.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            case 'date-added-asc':
                return sortedTodos.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
            case 'priority-desc':
                return sortedTodos.sort((a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority));
            case 'priority-asc':
                return sortedTodos.sort((a, b) => getPriorityValue(a.priority) - getPriorityValue(b.priority));
            case 'alphabetical-asc':
                return sortedTodos.sort((a, b) => a.text.localeCompare(b.text));
            case 'alphabetical-desc':
                return sortedTodos.sort((a, b) => b.text.localeCompare(a.text));
            default:
                return sortedTodos;
        }
    }

    /**
     * Get priority value for sorting
     * @param {string} priority - The priority (low, medium, high)
     * @returns {number} - Priority value
     */
    function getPriorityValue(priority) {
        switch (priority) {
            case 'high': return 3;
            case 'medium': return 2;
            case 'low': return 1;
            default: return 0;
        }
    }

    /**
     * Update stats
     */
    function updateStats() {
        const totalCount = todos.length;
        const completedCount = todos.filter(todo => todo.completed).length;
        const remainingCount = totalCount - completedCount;

        totalTasksEl.textContent = totalCount;
        completedTasksEl.textContent = completedCount;
        remainingTasksEl.textContent = remainingCount;
    }

    /**
     * Save todos to localStorage
     */
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    /**
     * Load todos from localStorage
     */
    function loadTodos() {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            todos = JSON.parse(savedTodos);
            renderTodos();
            updateStats();
        }
    }

    /**
     * Save settings to localStorage
     */
    function saveSettings() {
        localStorage.setItem('todoSettings', JSON.stringify(settings));
    }

    /**
     * Load settings from localStorage
     */
    function loadSettings() {
        const savedSettings = localStorage.getItem('todoSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);

            darkModeToggle.checked = settings.darkMode;
            showDateToggle.checked = settings.showDate;
            confirmDeleteToggle.checked = settings.confirmDelete;
        }
    }

    /**
     * Format date
     * @param {string} dateString - ISO date string
     * @returns {string} - Formatted date
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    /**
     * Capitalize first letter of a string
     * @param {string} string - The string to capitalize
     * @returns {string} - Capitalized string
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
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
}

/**
 * Show notification - Apple-like style
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
    // Get notification element
    const notification = document.getElementById('notification');

    if (!notification) return;

    // Clear any existing timeout
    if (window.notificationTimeout) {
        clearTimeout(window.notificationTimeout);
    }

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
            <span id="notification-message">${message}</span>
        </div>
    `;

    // Set notification type
    notification.className = `notification ${type}`;

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Hide notification after 3 seconds
    window.notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
