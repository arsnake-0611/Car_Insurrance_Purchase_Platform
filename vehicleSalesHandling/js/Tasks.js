class TaskManager {
    constructor() {
        this.tasks = [];
        this.initializeEventListeners();
        this.loadTasks();
    }

    initializeEventListeners() {
        // Update add task button click handler
        $('.add-task-btn').click((e) => {
            const status = $(e.currentTarget).data('status');
            this.showModal(status);
        });

        // Close modal
        $('.close-modal, .cancel-btn').click(() => this.hideModal());

        // Form submission
        $('#taskForm').submit((e) => {
            e.preventDefault();
            this.saveTask();
        });

        // Add delete button event listener using event delegation
        $(document).on('click', '.delete-task-btn', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            const taskId = parseInt($(e.currentTarget).data('task-id'));
            this.confirmAndDeleteTask(taskId);
        });

        // Initialize drag and drop
        this.initializeDragAndDrop();
    }

    showModal(status = 'pending') {
        $('#taskModal').css('display', 'flex');
        // Store the status for when saving
        $('#taskForm').data('status', status);
    }

    hideModal() {
        $('#taskModal').css('display', 'none');
        $('#taskForm')[0].reset();
    }

    saveTask() {
        const task = {
            id: Date.now(),
            title: $('#taskTitle').val(),
            description: $('#taskDescription').val(),
            dueDate: $('#taskDueDate').val(),
            priority: $('#taskPriority').val(),
            assignee: $('#taskAssignee').val(),
            status: $('#taskForm').data('status') || 'pending', // Use the stored status
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.hideModal();
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        this.tasks = savedTasks ? JSON.parse(savedTasks) : [];
        this.renderTasks();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        const columns = ['pending', 'in-progress', 'completed'];
        
        columns.forEach(status => {
            const filteredTasks = this.tasks.filter(task => task.status === status);
            $(`#${status}-tasks`).empty();
            
            filteredTasks.forEach(task => {
                const taskCard = this.createTaskCard(task);
                $(`#${status}-tasks`).append(taskCard);
            });
        });

        this.updateTaskCounts();
        this.initializeDragAndDrop();
    }

    createTaskCard(task) {
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
        const assignee = task.assignee || 'Unassigned';

        return `
            <div class="task-card" draggable="true" data-task-id="${task.id}">
                <div class="task-header">
                    <h4 class="task-title">${this.escapeHtml(task.title)}</h4>
                    <div class="task-actions">
                        <span class="task-priority priority-${task.priority}">${task.priority}</span>
                        <button class="delete-task-btn" data-task-id="${task.id}">
                            <label>Delete</label>
                        </button>
                    </div>
                </div>
                <p class="task-description">${this.escapeHtml(task.description)}</p>
                <div class="task-meta">
                    <span>${this.escapeHtml(assignee)}</span>
                    <span>${dueDate}</span>
                </div>
            </div>
        `;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    initializeDragAndDrop() {
        const taskCards = document.querySelectorAll('.task-card');
        const taskLists = document.querySelectorAll('.task-list');

        taskCards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                card.classList.add('dragging');
                e.dataTransfer.setData('text/plain', card.dataset.taskId);
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            });
        });

        taskLists.forEach(list => {
            list.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = this.getDragAfterElement(list, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (draggable) {
                    if (afterElement) {
                        list.insertBefore(draggable, afterElement);
                    } else {
                        list.appendChild(draggable);
                    }
                }
            });

            list.addEventListener('drop', (e) => {
                e.preventDefault();
                const taskId = parseInt(e.dataTransfer.getData('text/plain'));
                const newStatus = list.closest('.task-column').dataset.status;
                this.updateTaskStatus(taskId, newStatus);
            });
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    updateTaskStatus(taskId, newStatus) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].status = newStatus;
            this.saveTasks();
            this.renderTasks();
            this.updateTaskCounts();
        }
    }

    updateTaskCounts() {
        const columns = ['pending', 'in-progress', 'completed'];
        
        columns.forEach(status => {
            const count = this.tasks.filter(task => task.status === status).length;
            $(`.task-column[data-status="${status}"] .task-count`).text(count);
        });
    }

    confirmAndDeleteTask(taskId) {
        // Show confirmation dialog
        const confirmDelete = confirm('Are you sure you want to delete this task?');
        if (confirmDelete) {
            this.deleteTask(taskId);
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateTaskCounts();
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            // Populate modal with task data
            $('#taskTitle').val(task.title);
            $('#taskDescription').val(task.description);
            $('#taskDueDate').val(task.dueDate);
            $('#taskPriority').val(task.priority);
            $('#taskAssignee').val(task.assignee);
            
            // Show modal
            this.showModal();
            
            // Update form submission handler for editing
            const originalSubmitHandler = $('#taskForm').off('submit').submit((e) => {
                e.preventDefault();
                
                // Update task
                task.title = $('#taskTitle').val();
                task.description = $('#taskDescription').val();
                task.dueDate = $('#taskDueDate').val();
                task.priority = $('#taskPriority').val();
                task.assignee = $('#taskAssignee').val();
                
                this.saveTasks();
                this.renderTasks();
                this.hideModal();
                
                // Restore original submit handler
                $('#taskForm').off('submit').submit((e) => {
                    e.preventDefault();
                    this.saveTask();
                });
            });
        }
    }
}

// Initialize when document is ready
$(document).ready(function() {
    new TaskManager();
});
