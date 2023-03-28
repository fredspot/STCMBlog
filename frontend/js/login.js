// DOM Elements
const loginButton = document.querySelector('#login-button');

// Event Listeners
export function initializeLogin() {
    loginButton.addEventListener('click', login);
}

// Login Function
function login() {
    // Send Login Request to Backend API
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'myusername',
            password: 'mypassword'
        })
    })
    .then(response => response.json())
    .then(data => {
        // Save Login Token to Local Storage
        localStorage.setItem('token', data.token);
    });
}
