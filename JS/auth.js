



// Password validation regex
const passwordRegex = {
    uppercase: /[A-Z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*(),.?":{}|<>]/,
    minLength: /.{8,}/  // At least 8 characters
};

// Get users from localStorage or initialize empty array
const getUsers = () =>
{
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users) =>
{
    localStorage.setItem('users', JSON.stringify(users));
};

// Handle signup form
const signupForm = document.getElementById('signupForm');
if (signupForm)
{
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const errorMessage = document.getElementById('signupError');

    // Password requirement indicators
    const requirements = {
        uppercase: document.getElementById('uppercase'),
        number: document.getElementById('number'),
        special: document.getElementById('special'),
        minLength: document.getElementById('minLength')
    };

    // Update password requirements in real-time
    passwordInput.addEventListener('input', () =>
    {
        const password = passwordInput.value;

        for (const [key, regex] of Object.entries(passwordRegex))
        {
            if (regex.test(password))
            {
                requirements[key].classList.add('valid');
            } else
            {
                requirements[key].classList.remove('valid');
            }
        }
    });

    signupForm.addEventListener('submit', (e) =>
    {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Custom form validation
        let isValid = true;
        let errorText = '';
        
        // Check for empty fields
        if (!name.trim()) {
            isValid = false;
            errorText = 'Please enter your name';
        } else if (!email.trim()) {
            isValid = false;
            errorText = 'Please enter your email';
        } else if (!password) {
            isValid = false;
            errorText = 'Please enter a password';
        } else if (!confirmPassword) {
            isValid = false;
            errorText = 'Please confirm your password';
        }

        if (password !== confirmPassword)
        {
            isValid = false;
            errorText = 'Passwords do not match';
        }

        for (const [key, regex] of Object.entries(passwordRegex))
        {
            if (!regex.test(password))
            {
                isValid = false;
                errorText = 'Password does not meet requirements';
            }
        }

        // Check if user already exists
        const users = getUsers();
        if (users.some(user => user.email === email))
        {
            isValid = false;
            errorText = 'Email already exists';
        }

        if (!isValid)
        {
            errorMessage.textContent = errorText;
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(), // u may later use nanoID as express
            name,
            email,
            password,
            wishlist: [],
            cart: []
        };

        users.push(newUser);
        saveUsers(users);

        // Set current user
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        // Redirect to home page
        window.location.href = 'index.html';
    });
}






// Handle login form
const loginForm = document.getElementById('loginForm');
if (loginForm)
{
    loginForm.addEventListener('submit', (e) =>
    {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('loginError');

        // Custom form validation
        let isValid = true;
        let errorText = '';
        
        // Check for empty fields
        if (!email.trim()) {
            isValid = false;
            errorText = 'Please enter your email';
        } else if (!password) {
            isValid = false;
            errorText = 'Please enter your password';
        }
        
        if (!isValid) {
            errorMessage.textContent = errorText;
            return;
        }

        // Find user
        const users = getUsers();
        const user = users.find(user => user.email === email);

        if (!user || user.password !== password)
        {
            errorMessage.textContent = 'Invalid email or password';
            return;
        }

        // Set current user
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Redirect to home page
        window.location.href = 'index.html'; //after login
    });
}

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(toggle =>
{
    toggle.addEventListener('click', (e) =>
    {
        const input = e.target.previousElementSibling;
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        e.target.classList.toggle('fa-eye');
        e.target.classList.toggle('fa-eye-slash');
    });
});
