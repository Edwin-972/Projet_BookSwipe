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
            window.location.href = "BookSwipe.html"; // Rediriger après 2 secondes
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
                window.location.href = "BookSwipe.html"; // Rediriger après 1 seconde
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
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des onglets
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutButton = document.getElementById('logout-button');

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
            window.location.href = "BookSwipe.html"; // Rediriger après 2 secondes
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
                window.location.href = "BookSwipe.html"; // Rediriger après 1 seconde
            }, 1000);
        } else {
            document.getElementById('login-message').textContent = "Email ou mot de passe incorrect";
        }
    });
    
    // Fonction pour mettre à jour le bouton de connexion et déconnexion
    function updateAuthButton() {
        const authButton = document.getElementById('auth-button');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (currentUser) {
            authButton.textContent = currentUser.name;
            authButton.setAttribute('aria-label', `Profil de ${currentUser.name}`);
            
            // Afficher le bouton de déconnexion
            logoutButton.style.display = 'inline-block';  // Afficher le bouton de déconnexion
        } else {
            authButton.textContent = 'Se connecter';
            authButton.setAttribute('aria-label', 'Page de connexion');
            
            // Cacher le bouton de déconnexion
            logoutButton.style.display = 'none';
        }
    }

    // Gestion de la déconnexion
    logoutButton.addEventListener('click', function() {
        // Supprimer l'utilisateur actuel du localStorage
        localStorage.removeItem('currentUser');
        
        // Mettre à jour l'interface
        updateAuthButton();
        
        // Rediriger vers la page de connexion ou d'accueil
        window.location.href = "connexion.html"; // Page de connexion après déconnexion
    });

    // Mettre à jour le bouton de connexion dans la navbar
    updateAuthButton();
});

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.querySelector('.logout-button');
    const passwordChangeForm = document.getElementById('password-change-form');
    
    // Afficher les informations de l'utilisateur
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;
    } else {
        // Si aucun utilisateur n'est connecté, rediriger vers la page de connexion
        window.location.href = "connexion.html";
    }

    // Gestion de la déconnexion
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = "login.html"; // Redirection vers la page de connexion
    });

    // Gestion du changement de mot de passe
    passwordChangeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;
        
        // Vérifier si le mot de passe actuel est correct
        if (currentPassword !== currentUser.password) {
            alert("Le mot de passe actuel est incorrect");
            return;
        }

        // Vérifier si les nouveaux mots de passe correspondent
        if (newPassword !== confirmNewPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }

        // Vérifier la longueur du nouveau mot de passe
        if (newPassword.length < 6) {
            alert("Le nouveau mot de passe doit contenir au moins 6 caractères");
            return;
        }

        // Mettre à jour le mot de passe de l'utilisateur dans le localStorage
        currentUser.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert("Mot de passe mis à jour avec succès !");
    });
});