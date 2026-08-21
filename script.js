/**
 * BloomTask - Daily Task Manager
 * Pure JavaScript Implementation for Dynamic DOM Manipulation & Task Management
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Application State & Storage Keys
    // ----------------------------------------------------------------------
    const STORAGE_KEY = 'bloom_tasks_data_v1';
    
    let tasks = loadTasksFromStorage();
    let currentFilter = 'all'; // 'all', 'pending', 'completed'
    let currentCategory = 'all';
    let searchQuery = '';

    // If initial application load is completely empty, populate friendly starter tasks
    if (tasks.length === 0) {
        tasks = [
            {
                id: 'task-starter-1',
                title: 'Welcome to BloomTask! Try adding a new task above.',
                category: 'Personal',
                priority: 'Low',
                dueDate: getFormattedTodayDate(),
                completed: false,
                createdAt: Date.now()
            },
            {
                id: 'task-starter-2',
                title: 'Mark this task as completed by clicking the checkbox.',
                category: 'Study',
                priority: 'Medium',
                dueDate: getFormattedTodayDate(),
                completed: true,
                createdAt: Date.now() - 1000
            }
        ];
        saveTasksToStorage();
    }

    // ----------------------------------------------------------------------
    // 2. DOM Element Selectors
    // ----------------------------------------------------------------------
    const currentDateDisplay = document.getElementById('current-date-display');
    
    // Stats elements
    const completionStatusText = document.getElementById('completion-status-text');
    const completionPercentage = document.getElementById('completion-percentage');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const countTotal = document.getElementById('count-total');
    const countPending = document.getElementById('count-pending');
    const countCompleted = document.getElementById('count-completed');

    // Form elements
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title-input');
    const taskCategorySelect = document.getElementById('task-category-select');
    const taskPrioritySelect = document.getElementById('task-priority-select');
    const taskDueDateInput = document.getElementById('task-due-date');

    // Filter Toolbar elements
    const searchInput = document.getElementById('search-input');
    const statusFilterTabs = document.getElementById('status-filter-tabs');
    const categoryFilterSelect = document.getElementById('category-filter-select');

    // Task List & Empty State
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const emptyStateTitle = document.getElementById('empty-state-title');
    const emptyStateSubtitle = document.getElementById('empty-state-subtitle');

    // ----------------------------------------------------------------------
    // 3. Initialization
    // ----------------------------------------------------------------------
    initApp();

    function initApp() {
        displayTodayDate();
        setDefaultDueDate();
        attachEventListeners();
        render();
    }

    // ----------------------------------------------------------------------
    // 4. Date Helpers
    // ----------------------------------------------------------------------
    function displayTodayDate() {
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const today = new Date().toLocaleDateString('en-US', options);
        if (currentDateDisplay) {
            currentDateDisplay.textContent = today;
        }
    }

    function getFormattedTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function setDefaultDueDate() {
        if (taskDueDateInput) {
            taskDueDateInput.value = getFormattedTodayDate();
        }
    }

    function formatDateDisplay(dateString) {
        if (!dateString) return '';
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // ----------------------------------------------------------------------
    // 5. Local Storage Operations
    // ----------------------------------------------------------------------
    function saveTasksToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error('Failed to save tasks to localStorage', e);
        }
    }

    function loadTasksFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load tasks from localStorage', e);
            return [];
        }
    }

    // ----------------------------------------------------------------------
    // 6. Event Listeners Setup
    // ----------------------------------------------------------------------
    function attachEventListeners() {
        // Form Submission - Add Task
        taskForm.addEventListener('submit', handleAddTask);

        // Task List Event Delegation (Checkbox Toggle & Delete Button)
        taskList.addEventListener('click', handleTaskListClick);
        taskList.addEventListener('change', handleTaskListChange);

        // Status Filter Tabs
        statusFilterTabs.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.tab-btn');
            if (!targetBtn) return;

            // Update active styling
            const tabButtons = statusFilterTabs.querySelectorAll('.tab-btn');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            targetBtn.classList.add('active');

            currentFilter = targetBtn.dataset.filter;
            render();
        });

        // Category Filter Dropdown
        categoryFilterSelect.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            render();
        });

        // Realtime Search Input
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            render();
        });
    }

    // ----------------------------------------------------------------------
    // 7. Task Management Actions (Add, Toggle, Delete)
    // ----------------------------------------------------------------------
    function handleAddTask(e) {
        e.preventDefault();

        const titleText = taskTitleInput.value.trim();
        if (!titleText) return;

        const newTask = {
            id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            title: titleText,
            category: taskCategorySelect.value,
            priority: taskPrioritySelect.value,
            dueDate: taskDueDateInput.value,
            completed: false,
            createdAt: Date.now()
        };

        tasks.unshift(newTask); // Add to beginning of array
        saveTasksToStorage();

        // Reset title input
        taskTitleInput.value = '';
        setDefaultDueDate();
        taskTitleInput.focus();

        render();
    }

    function handleTaskListChange(e) {
        // Handle Checkbox Toggle
        if (e.target.matches('.task-checkbox')) {
            const taskId = e.target.dataset.id;
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = e.target.checked;
                saveTasksToStorage();
                render();
            }
        }
    }

    function handleTaskListClick(e) {
        // Handle Delete Button Click
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const taskId = deleteBtn.dataset.id;
            const taskItem = deleteBtn.closest('.task-item');

            if (taskItem) {
                // Add smooth removal animation class
                taskItem.classList.add('removing');

                // Wait for animation to finish before removing from array
                setTimeout(() => {
                    tasks = tasks.filter(t => t.id !== taskId);
                    saveTasksToStorage();
                    render();
                }, 300);
            }
        }
    }

    // ----------------------------------------------------------------------
    // 8. Filtering & Data Processing
    // ----------------------------------------------------------------------
    function getFilteredTasks() {
        return tasks.filter(task => {
            // Status filter
            if (currentFilter === 'pending' && task.completed) return false;
            if (currentFilter === 'completed' && !task.completed) return false;

            // Category filter
            if (currentCategory !== 'all' && task.category !== currentCategory) return false;

            // Search query filter
            if (searchQuery && !task.title.toLowerCase().includes(searchQuery)) return false;

            return true;
        });
    }

    // ----------------------------------------------------------------------
    // 9. Rendering DOM Updates
    // ----------------------------------------------------------------------
    function render() {
        renderStats();
        renderTaskList();
    }

    function renderStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        countTotal.textContent = total;
        countPending.textContent = pending;
        countCompleted.textContent = completed;

        completionStatusText.textContent = `${completed} of ${total} tasks completed`;
        completionPercentage.textContent = `${percentage}%`;
        progressBarFill.style.width = `${percentage}%`;
    }

    function renderTaskList() {
        const filteredTasks = getFilteredTasks();

        // Clear existing list items
        taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            emptyState.classList.remove('hidden');

            // Dynamic Empty State Messages
            if (tasks.length === 0) {
                emptyStateTitle.textContent = 'No tasks yet';
                emptyStateSubtitle.textContent = 'Add your first task above to kickstart your day!';
            } else if (currentFilter === 'completed') {
                emptyStateTitle.textContent = 'No completed tasks';
                emptyStateSubtitle.textContent = 'Complete some tasks to see them listed here!';
            } else if (currentFilter === 'pending') {
                emptyStateTitle.textContent = 'All caught up!';
                emptyStateSubtitle.textContent = 'You have no pending tasks right now. Great job!';
            } else {
                emptyStateTitle.textContent = 'No matching tasks';
                emptyStateSubtitle.textContent = 'Try adjusting your search query or filters.';
            }
        } else {
            emptyState.classList.add('hidden');

            filteredTasks.forEach(task => {
                const li = createTaskElement(task);
                taskList.appendChild(li);
            });
        }
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        const formattedDate = formatDateDisplay(task.dueDate);

        li.innerHTML = `
            <div class="task-item-left">
                <label class="checkbox-container" aria-label="Mark task complete">
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        data-id="${task.id}" 
                        ${task.completed ? 'checked' : ''}
                    >
                    <span class="checkmark"></span>
                </label>
                <div class="task-details">
                    <span class="task-title-text">${escapeHtml(task.title)}</span>
                    <div class="task-meta">
                        <span class="badge badge-cat-${task.category}">
                            <i class="fa-solid fa-tag"></i> ${escapeHtml(task.category)}
                        </span>
                        <span class="badge badge-priority-${task.priority}">
                            <i class="fa-solid fa-flag"></i> ${escapeHtml(task.priority)}
                        </span>
                        ${formattedDate ? `
                            <span class="badge badge-date">
                                <i class="fa-regular fa-calendar"></i> ${escapeHtml(formattedDate)}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
            <button 
                type="button" 
                class="delete-btn" 
                data-id="${task.id}" 
                title="Delete Task"
                aria-label="Delete task"
            >
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;

        return li;
    }

    // Helper to sanitize HTML strings
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
