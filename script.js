alert("NEW SCRIPT LOADED");

class Database {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.usersTable = 'users';
        this.tasksTable = 'tasks';
        this.taskUsersTable = 'task_users';
    }

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

    getTasksLeftJoin() {
        return this.tasks.map(task => {
            const creator = this.users.find(u => u.id == task.created_by);
            return {
                ...task,
                creator_name: creator ? creator.fullname : 'Unknown'
            };
        });
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
        const tasks = this.getTasksLeftJoin();
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

// ================= LOGIN PAGE =================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    const registerBtn = document.getElementById("registerBtn");
    
    // USAB: Gikan sa register.html ngadto sa register.php
    registerBtn?.addEventListener("click", () => {
        window.location.href = "register.php";
    });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        const user = db.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("loggedInUsername", username);
            window.location.href = "dashboard.php";
        } else {
            alert("Invalid credentials!");
        }
    });
}

// ================= REGISTER PAGE =================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    const backBtn = document.getElementById("backBtn");
    
    // USAB: Siguraduhon nga mobalik sa login.php
    backBtn?.addEventListener("click", () => {
        window.location.href = "login.php";
    });

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
        window.location.href = "login.php"; // USAB: Kinahanglan .php
    });
}

// ================= DASHBOARD PAGE =================
if (document.getElementById("taskTable")) {
    if (!isLoggedIn()) {
        window.location.href = "login.php"; // USAB: Kinahanglan .php
        throw new Error("Unauthorized access");
    }

    // ... (The rest of your dashboard code is correct as is)
    // Siguraduha lang nga ang logout function naggamit og .php:
    
    function logout() {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInUsername");
        window.location.href = "login.php"; 
    }
    
    // I-connect ang logout button if naa
    document.getElementById("logoutBtn")?.addEventListener("click", logout);

    // I-initialize ang dashboard
    init(); 
}