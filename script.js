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
 function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    // Create the <li> element
    const li = document.createElement('li');
    li.textContent = taskText;

    // Create the remove <button>
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-btn';

    // Assign the onclick event to remove the task
    removeBtn.onclick = function () {
        taskList.removeChild(li);
    };

    // Append the remove button to the li
    li.appendChild(removeBtn);

    // Append the li to the task list
    taskList.appendChild(li);

    // Clear the input field
    taskInput.value = '';
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
