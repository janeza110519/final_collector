// ================= GLOBAL DATABASE SIMULATION =================
// Simulates SQL tables with relationships for demo purposes
// In production, replace with actual backend API calls

class Database {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.usersTable = 'users';
        this.tasksTable = 'tasks';
        this.taskUsersTable = 'task_users'; // Junction table for many-to-many
    }

    // CREATE - Insert new user
    createUser(fullname, username, password) {
        const user = {
            id: Date.now(),
            fullname,
            username,
            password,
            created_at: new Date().toISOString()
        };
        this.users.push(user);
        localStorage.setItem('users', JSON.stringify(this.users));
        return user;
    }

    // READ - Simulate SQL JOIN queries
    getTasksWithUserInfo() {
        // Simulate: SELECT t.*, u.fullname FROM tasks t LEFT JOIN users u ON t.created_by = u.id
        return this.tasks.map(task => {
            const creator = this.users.find(u => u.id == task.created_by);
            return {
                ...task,
                creator_name: creator ? creator.fullname : 'Unknown'
            };
        });
    }

    // Simulate INNER JOIN: Only tasks with valid user
    getTasksInnerJoin() {
        return this.tasks.filter(task => this.users.find(u => u.id == task.created_by));
    }

    // Simulate LEFT JOIN: All tasks, users optional
    getTasksLeftJoin() {
        return this.getTasksWithUserInfo();
    }

    createTask(taskData, userId) {
        const task = {
            id: Date.now(),
            ...taskData,
            created_by: userId,
            created_at: new Date().toISOString()
        };
        this.tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        return task;
    }

    updateTask(id, updates) {
        const taskIndex = this.tasks.findIndex(t => t.id == id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates, updated_at: new Date().toISOString() };
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            return this.tasks[taskIndex];
        }
        return null;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id != id);
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    getStats() {
        const tasks = this.getTasksWithUserInfo();
        const statusCount = {};
        const wasteTypeCount = {};
        
        tasks.forEach(task => {
            statusCount[task.status] = (statusCount[task.status] || 0) + 1;
            wasteTypeCount[task.target] = (wasteTypeCount[task.target] || 0) + 1;
        });
        
        return { statusCount, wasteTypeCount };
    }
}

const db = new Database();

// ================= AUTHENTICATION =================
function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}

function getCurrentUser() {
    const username = localStorage.getItem("loggedInUsername");
    return db.users.find(u => u.username === username);
}

// ================= PAGE-SPECIFIC LOGIC =================

// Login Page
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    const registerBtn = document.getElementById("registerBtn");
    
    registerBtn?.addEventListener("click", () => {
        window.location.href = "register.html";
    });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        const user = db.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("loggedInUsername", username);
            localStorage.setItem("loggedInFullName", user.fullname);
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid credentials!");
        }
    });
}

// Register Page
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    const backBtn = document.getElementById("backBtn");
    
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const fullname = document.getElementById("fullname").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (db.users.find(u => u.username === username)) {
            alert("Username already exists!");
            return;
        }

        db.createUser(fullname, username, password);
        alert("Registration successful! Please login.");
        window.location.href = "login.html";
    });

    backBtn?.addEventListener("click", () => {
        window.location.href = "login.html";
    });
}

// Dashboard Page
if (document.getElementById("taskTable")) {
    // Protect access
    if (!isLoggedIn()) {
        window.location.href = "login.html";
        throw new Error("Unauthorized access");
    }

    let tasks = [];
    let filteredTasks = [];
    let dragTaskId = null;
    let statusChart, wasteTypeChart;

    // DOM Elements
    const taskTable = document.getElementById("taskTable");
    const taskCount = document.getElementById("taskCount");
    const searchInput = document.getElementById("searchInput");
    const filterStatus = document.getElementById("filterStatus");
    const modal = document.getElementById("crudModal");
    const crudForm = document.getElementById("crudForm");
    const modalTitle = document.getElementById("modalTitle");

    // Initialize
    function init() {
        loadTasks();
        setupCharts();
        setupEventListeners();
        updateWelcomeMessage();
        renderTasks();
    }

    function loadTasks() {
        // Simulate SQL: SELECT * FROM tasks t LEFT JOIN users u ON t.created_by = u.id
        tasks = db.getTasksLeftJoin();
        filteredTasks = [...tasks];
    }

    function setupCharts() {
        const stats = db.getStats();
        
        // Status Chart
        const statusCtx = document.getElementById('statusChart').getContext('2d');
        statusChart = new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(stats.statusCount),
                datasets: [{
                    data: Object.values(stats.statusCount),
                    backgroundColor: ['#ff9800', '#4caf50']
                }]
            },
            options: { responsive: true, plugins: { title: { display: true, text: 'Task Status' } } }
        });

        // Waste Type Chart
        const wasteCtx = document.getElementById('wasteTypeChart').getContext('2d');
        wasteTypeChart = new Chart(wasteCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(stats.wasteTypeCount),
                datasets: [{
                    label: 'Tasks',
                    data: Object.values(stats.wasteTypeCount),
                    backgroundColor: ['#2196f3', '#4caf50', '#f44336']
                }]
            },
            options: { responsive: true, plugins: { title: { display: true, text: 'Waste Types' } } }
        });
    }

    function renderTasks() {
        taskTable.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            const row = document.createElement('tr');
            row.draggable = true;
            row.dataset.taskId = task.id;
            row.className = `task-row ${task.status.toLowerCase().replace(' ', '-')}`;
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${task.location}</td>
                <td>${task.day}</td>
                <td>${task.target}</td>
                <td class="${task.importance.toLowerCase()}">${task.importance}</td>
                <td class="status-${task.status.toLowerCase().replace(' ', '-')}">${task.status}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editTask(${task.id})">✏️ Edit</button>
                    <button class="action-btn btn-done" onclick="toggleStatus(${task.id})">${task.status === 'Pending' ? '✅ Done' : '🔄 Reopen'}</button>
                    <button class="action-btn btn-delete" onclick="deleteTask(${task.id})">🗑️ Delete</button>
                </td>
            `;
            taskTable.appendChild(row);
        });
        taskCount.textContent = `(${filteredTasks.length})`;
        updateCharts();
    }

    function setupEventListeners() {
        // Set Task
        document.getElementById("setBtn").addEventListener("click", addTaskFromSidebar);

        // Search & Filter
        searchInput.addEventListener("input", filterTasks);
        filterStatus.addEventListener("change", filterTasks);

        // CRUD Modal
        document.getElementById("addTaskBtn").addEventListener("click", () => openModal('create'));
        document.querySelector(".close").addEventListener("click", closeModal);
        document.getElementById("cancelBtn").addEventListener("click", closeModal);
        crudForm.addEventListener("submit", handleCrudSubmit);

        // Logout
        document.getElementById("logoutBtn").addEventListener("click", logout);

        // Drag & Drop
        taskTable.addEventListener('dragstart', handleDragStart);
        taskTable.addEventListener('dragover', handleDragOver);
        taskTable.addEventListener('drop', handleDrop);
        taskTable.addEventListener('dragend', handleDragEnd);

        // Clear Filters
        document.getElementById("clearFiltersBtn").addEventListener("click", () => {
            searchInput.value = '';
            filterStatus.value = '';
            filterTasks();
        });
    }

    function updateWelcomeMessage() {
        const user = getCurrentUser();
        document.getElementById("welcomeUser").textContent = `Welcome, ${user?.fullname || 'User'}!`;
    }

    // CRUD Operations
    window.addTaskFromSidebar = function() {
        const taskData = {
            location: document.getElementById("locationSelect").value,
            day: document.getElementById("daySelect").value,
            target: document.getElementById("targetSelect").value,
            importance: document.getElementById("importanceSelect").value,
            status: document.getElementById("statusSelect").value
        };
        const user = getCurrentUser();
        db.createTask(taskData, user.id);
        loadTasks();
        renderTasks();
    };

    window.editTask = function(id) {
        const task = tasks.find(t => t.id == id);
        if (task) {
            openModal('edit', task);
        }
    };

    window.toggleStatus = function(id) {
        const task = tasks.find(t => t.id == id);
        if (task) {
            const newStatus = task.status === 'Pending' ? 'Accomplished' : 'Pending';
            db.updateTask(id, { status: newStatus });
            loadTasks();
            renderTasks();
        }
    };

    window.deleteTask = function(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            db.deleteTask(id);
            loadTasks();
            renderTasks();
        }
    };

    function openModal(mode, task = null) {
        modal.style.display = 'block';
        modalTitle.textContent = mode === 'create' ? 'Add New Task' : 'Edit Task';
        
        if (mode === 'edit' && task) {
            document.getElementById('taskId').value = task.id;
            document.getElementById('editLocation').value = task.location;
            document.getElementById('editDay').value = task.day;
            document.getElementById('editTarget').value = task.target;
            document.getElementById('editImportance').value = task.importance;
            document.getElementById('editStatus').value = task.status;
        } else {
            document.getElementById('taskId').value = '';
            document.getElementById('editLocation').value = '';
            // Reset other fields...
        }
    }

    function closeModal() {
        modal.style.display = 'none';
        crudForm.reset();
    }

    function handleCrudSubmit(e) {
        e.preventDefault();
        const taskId = document.getElementById('taskId').value;
        const taskData = {
            location: document.getElementById('editLocation').value,
            day: document.getElementById('editDay').value,
            target: document.getElementById('editTarget').value,
            importance: document.getElementById('editImportance').value,
            status: document.getElementById('editStatus').value
        };

        const user = getCurrentUser();
        
        if (taskId) {
            // UPDATE
            db.updateTask(taskId, taskData);
        } else {
            // CREATE
            db.createTask(taskData, user.id);
        }
        
        closeModal();
        loadTasks();
        renderTasks();
    }

    function filterTasks() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusFilter = filterStatus.value;

        filteredTasks = tasks.filter(task => {
            const matchesSearch = task.location.toLowerCase().includes(searchTerm) ||
                                task.day.toLowerCase().includes(searchTerm) ||
                                task.target.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || task.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        renderTasks();
    }

    function updateCharts() {
        const stats = db.getStats();
        statusChart.data.datasets[0].data = Object.values(stats.statusCount);
        statusChart.data.labels = Object.keys(stats.statusCount);
        statusChart.update();

        wasteTypeChart.data.labels = Object.keys(stats.wasteTypeCount);
        wasteTypeChart.data.datasets[0].data = Object.values(stats.wasteTypeCount);
        wasteTypeChart.update();
    }

    // Drag & Drop
    function handleDragStart(e) {
        dragTaskId = e.target.dataset.taskId;
        e.target.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        const dropTaskId = e.target.closest('tr')?.dataset.taskId;
        
        if (dropTaskId && dragTaskId) {
            // Reorder tasks in local storage
            const dragIndex = tasks.findIndex(t => t.id == dragTaskId);
            const dropIndex = tasks.findIndex(t => t.id == dropTaskId);
            
            [tasks[dragIndex], tasks[dropIndex]] = [tasks[dropIndex], tasks[dragIndex]];
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            loadTasks();
            renderTasks();
        }
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        taskTable.querySelectorAll('.drag-over').forEach(row => {
            row.classList.remove('drag-over');
        });
    }

    function logout() {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInUsername");
        localStorage.removeItem("loggedInFullName");
        window.location.href = "login.html";
    }

    // Modal close on outside click
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    // Initialize dashboard
    init();
}