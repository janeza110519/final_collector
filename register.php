<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoWise - Register</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="auth-container">
        <div class="left-panel">
            <img src="logo.png" alt="EcoWise Logo">
            <h1>EcoWise</h1>
            <p>Join the Clean Community</p>
        </div>

        <div class="right-panel">
            <form id="registerForm">
                <h2>Register</h2>
                <label>Full Name</label>
                <input type="text" id="fullname" required>

                <label>Username</label>
                <input type="text" id="username" required>

                <label>Password</label>
                <input type="password" id="password" required>

                <div class="buttons">
                    <button type="submit" id="registerBtn">Register</button>
                    <button type="button" id="backBtn">Back to Login</button>
                </div>

            </form>
        </div>

    </div>

    <script src="script.js"></script>
</body>
</html>