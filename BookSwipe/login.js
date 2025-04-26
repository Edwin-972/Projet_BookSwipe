document.addEventListener('DOMContentLoaded', function() {
    // Gestion des onglets
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    registerTab.addEventListener('click', function() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    // Gestion de l'inscription
    const registerFormElement = document.getElementById('register-form');
    registerFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        
        // Validation
        if (password !== confirmPassword) {
            document.getElementById('register-message').textContent = "Les mots de passe ne correspondent pas";
            return;
        }
        
        if (password.length < 6) {
            document.getElementById('register-message').textContent = "Le mot de passe doit contenir au moins 6 caractères";
            return;
        }
        
        // Vérifier si l'utilisateur existe déjà
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);
        
        if (userExists) {
            document.getElementById('register-message').textContent = "Un compte avec cet email existe déjà";
            return;
        }
        
        // Créer le nouvel utilisateur
        const newUser = {
            id: Date.now(),
            name,
            email,
            password // Note: En production, il faudrait hasher le mot de passe
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Connecter l'utilisateur directement après l'inscription
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        document.getElementById('register-message').textContent = "Inscription réussie! Redirection...";
        
        // Redirection vers la page d'accueil après 2 secondes
        setTimeout(() => {
            window.location.href = "BookSwipe.html";
        }, 2000);
    });
    
    // Gestion de la connexion
    const loginFormElement = document.getElementById('login-form');
    loginFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            document.getElementById('login-message').textContent = "Connexion réussie! Redirection...";
            
            // Redirection vers la page d'accueil après 1 seconde
            setTimeout(() => {
                window.location.href = "BookSwipe.html";
            }, 1000);
        } else {
            document.getElementById('login-message').textContent = "Email ou mot de passe incorrect";
        }
    });
    
    // Mettre à jour le bouton de connexion dans la navbar si l'utilisateur est connecté
    updateAuthButton();
});

function updateAuthButton() {
    const authButton = document.getElementById('auth-button');
    if (authButton) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            authButton.textContent = currentUser.name;
            authButton.setAttribute('aria-label', `Profil de ${currentUser.name}`);
        }
    }
}