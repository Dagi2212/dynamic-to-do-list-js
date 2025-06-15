document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const taskCounter = document.getElementById('task-counter');

    // Load tasks from Local Storage on page load
    loadTasks();
    updateTaskCounter();

    // Add Task function
    function addTask(taskText, save = true, isCompleted = false) {
        if (!taskText || taskText.trim() === '') {
            alert('Please enter a task.');
            return;
        }

        // Check for duplicate tasks
        if (isTaskExists(taskText)) {
            alert('This task already exists!');
            return;
        }

        const li = document.createElement('li');
        li.className = isCompleted ? 'completed' : '';

        // Create checkbox for task completion
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isCompleted;
        checkbox.addEventListener('change', function() {
            li.classList.toggle('completed');
            updateTaskInLocalStorage(taskText, li.classList.contains('completed'));
        });

        // Create task text span (for editing)
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        taskSpan.className = 'task-text';
        
        // Enable editing on double-click
        taskSpan.addEventListener('dblclick', function() {
            const newText = prompt('Edit your task:', taskText);
            if (newText && newText.trim() !== '' && newText !== taskText) {
                if (!isTaskExists(newText)) {
                    taskSpan.textContent = newText;
                    updateTaskTextInLocalStorage(taskText, newText);
                    taskText = newText;
                } else {
                    alert('This task already exists!');
                }
            }
        });

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.addEventListener('click', function() {
            taskList.removeChild(li);
            removeTaskFromLocalStorage(taskText);
            updateTaskCounter();
        });

        // Append all elements
        li.appendChild(checkbox);
        li.appendChild(taskSpan);
        li.appendChild(removeBtn);
        taskList.appendChild(li);

        if (save) {
            saveTaskToLocalStorage(taskText, isCompleted);
        }

        taskInput.value = '';
        updateTaskCounter();
    }

    // Check if task already exists
    function isTaskExists(taskText) {
        const tasks = document.querySelectorAll('.task-text');
        return Array.from(tasks).some(task => task.textContent === taskText);
    }

    // Add Task on button click
    addButton.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        addTask(taskText);
    });

    // Add Task on Enter key press
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const taskText = taskInput.value.trim();
            addTask(taskText);
        }
    });

    // Clear all tasks
    clearAllBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all tasks?')) {
            taskList.innerHTML = '';
            localStorage.removeItem('tasks');
            updateTaskCounter();
        }
    });

    // Update task counter
    function updateTaskCounter() {
        const totalTasks = taskList.children.length;
        const completedTasks = document.querySelectorAll('.completed').length;
        taskCounter.textContent = `${completedTasks} of ${totalTasks} tasks completed`;
    }

    // Load saved tasks
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        storedTasks.forEach(task => {
            addTask(task.text, false, task.completed);
        });
    }

    // Save task to Local Storage
    function saveTaskToLocalStorage(taskText, isCompleted = false) {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        storedTasks.push({ text: taskText, completed: isCompleted });
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

    // Remove task from Local Storage
    function removeTaskFromLocalStorage(taskText) {
        let storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        storedTasks = storedTasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

    // Update task completion status in Local Storage
    function updateTaskInLocalStorage(taskText, isCompleted) {
        let storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const taskIndex = storedTasks.findIndex(task => task.text === taskText);
        if (taskIndex !== -1) {
            storedTasks[taskIndex].completed = isCompleted;
            localStorage.setItem('tasks', JSON.stringify(storedTasks));
        }
        updateTaskCounter();
    }

    // Update task text in Local Storage
    function updateTaskTextInLocalStorage(oldText, newText) {
        let storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const taskIndex = storedTasks.findIndex(task => task.text === oldText);
        if (taskIndex !== -1) {
            storedTasks[taskIndex].text = newText;
            localStorage.setItem('tasks', JSON.stringify(storedTasks));
        }
    }
});
