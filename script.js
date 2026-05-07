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