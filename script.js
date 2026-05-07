const loginForm = document.getElementById("loginForm");
const registerBtn = document.getElementById("registerBtn");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username === "admin" && password === "1234") {
        alert("Login Successful!");
    } else {
        alert("Invalid Username or Password");
    }
});

registerBtn.addEventListener("click", function() {
    alert("Redirecting to Register Page...");
});

/* register */
const loginForm = document.getElementById("loginForm");
const registerBtn = document.getElementById("registerBtn");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username === "admin" && password === "1234") {
        alert("Login Successful!");
    } else {
        alert("Invalid Username or Password");
    }
});

registerBtn.addEventListener("click", function() {
    alert("Redirecting to Register Page...");
});

/* dashboard */
const setBtn = document.getElementById("setBtn");
const taskTable = document.getElementById("taskTable");

const selects = document.querySelectorAll("select");

setBtn.addEventListener("click", () => {

    const location = selects[0].value;
    const day = selects[1].value;
    const target = selects[2].value;
    const importance = selects[3].value;

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${location}</td>
        <td>${day}</td>
        <td>${target}</td>
        <td>${importance}</td>
        <td>Pending</td>
    `;

    taskTable.appendChild(row);
});

/* DONE BUTTON */
document.getElementById("doneBtn").addEventListener("click", () => {

    const rows = taskTable.querySelectorAll("tr");

    if(rows.length > 0){
        rows[rows.length - 1].cells[4].innerText = "Done";
    }
});

/* DELETE BUTTON */
document.getElementById("deleteBtn").addEventListener("click", () => {

    const rows = taskTable.querySelectorAll("tr");

    if(rows.length > 0){
        rows[rows.length - 1].remove();
    }
});

/* MOVE BUTTON */
document.getElementById("moveBtn").addEventListener("click", () => {
    alert("Task moved successfully!");
});

/* LOGOUT BUTTON */
document.getElementById("logoutBtn").addEventListener("click", () => {
    alert("Logging out...");
});