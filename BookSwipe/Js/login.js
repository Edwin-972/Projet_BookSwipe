document.addEventListener('DOMContentLoaded', function () {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginTab.addEventListener('click', function () {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    registerTab.addEventListener('click', function () {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    // === INSCRIPTION ===
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value.toLowerCase(); // minuscule
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        const messageEl = document.getElementById('register-message');
        messageEl.textContent = '';

        if (password !== confirmPassword) {
            messageEl.textContent = "Les mots de passe ne correspondent pas";
            return;
        }

        if (password.length < 6) {
            messageEl.textContent = "Le mot de passe doit contenir au moins 6 caractères";
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nom: name, email, mot_de_passe: password })
            });

            const data = await response.json();

            if (response.ok) {
                messageEl.textContent = "Inscription réussie! Redirection...";
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else {
                messageEl.textContent = data.error || "Erreur lors de l'inscription";
            }
        } catch (err) {
            console.error(err);
            messageEl.textContent = "Erreur réseau";
        }
    });

    // === CONNEXION ===
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value.toLowerCase(); // minuscule
        const password = document.getElementById('login-password').value;
        const messageEl = document.getElementById('login-message');
        messageEl.textContent = '';

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, mot_de_passe: password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('currentUser', JSON.stringify(data.utilisateur));

                messageEl.textContent = "Connexion réussie! Redirection...";
                setTimeout(() => {
                    window.location.href = "BookSwipe.html";
                }, 1000);

                updateAuthButton();
            } else {
                messageEl.textContent = data.error || "Échec de la connexion";
            }
        } catch (err) {
            console.error(err);
            messageEl.textContent = "Erreur réseau";
        }
    });

    updateAuthButton();
});

function updateAuthButton() {
    const authButton = document.getElementById('auth-button');
    if (authButton) {
        const email = localStorage.getItem('userEmail');
        if (email) {
            authButton.textContent = "Mon Compte";
            authButton.setAttribute('aria-label', `Profil de ${email}`);
            authButton.addEventListener('click', () => {
                window.location.href = "profil.html";
            });
        } else {
            authButton.textContent = "Connexion / Inscription";
            authButton.setAttribute('aria-label', "Connexion ou Inscription");
            authButton.addEventListener('click', () => {
                window.location.href = "login.html";
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    fetch('../Contenu/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initializeHeader();
        })
        .catch(error => {
            console.error('Erreur lors du chargement du header :', error);
        });
});

function initializeHeader() {
    const authButton = document.getElementById('auth-button');
    const favorisButton = document.getElementById('favoris-button');
    const messagesButton = document.getElementById('messages-button');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (authButton) {
        if (currentUser) {
            authButton.textContent = "Mon Compte";
            authButton.setAttribute('aria-label', `Profil de ${currentUser.nom}`);
            authButton.addEventListener('click', () => {
                window.location.href = "profil.html";
            });
        } else {
            authButton.textContent = "Connexion / Inscription";
            authButton.setAttribute('aria-label', "Connexion ou Inscription");
            authButton.addEventListener('click', () => {
                window.location.href = "login.html";
            });
        }
    }

    if (favorisButton) {
        favorisButton.addEventListener('click', () => {
            window.location.href = "favoris.html";
        });
    }

    if (messagesButton) {
        messagesButton.addEventListener('click', () => {
            window.location.href = "messages.html";
        });
    }

    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', function (e) {
            const query = e.target.value.toLowerCase();
            const books = document.querySelectorAll('.book-card');
            books.forEach(book => {
                const title = book.querySelector('.book-title')?.textContent.toLowerCase() || "";
                book.style.display = title.includes(query) ? '' : 'none';
            });
        });
    }
}