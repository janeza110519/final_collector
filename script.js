// AUTHENTICATION FUNCTIONS
function isLoggedIn() {
    // Check via session by making an AJAX call or checking for session cookie
    return localStorage.getItem("isLoggedIn") === "true";
}

function getCurrentUser() {
    const username = localStorage.getItem("loggedInUsername");
    return username;
}

// LOGIN PAGE HANDLER
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    const registerBtn = document.getElementById("registerBtn");
    
    registerBtn?.addEventListener("click", () => {
        window.location.href = "register.php";
    });

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch('process_login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            });
            
            const result = await response.json();
            
            if (result.success) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("loggedInUsername", username);
                window.location.href = "dashboard.php";
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert("Login error: " + error.message);
        }
    });
}

// REGISTER PAGE HANDLER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    const backBtn = document.getElementById("backBtn");
    
    backBtn?.addEventListener("click", () => {
        window.location.href = "login.php";
    });

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fullname = document.getElementById("fullname").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch('process_register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `fullname=${encodeURIComponent(fullname)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert(result.message);
                window.location.href = "login.php";
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert("Registration error: " + error.message);
        }
    });
}