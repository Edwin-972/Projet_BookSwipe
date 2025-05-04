document.addEventListener('DOMContentLoaded', () => {
    fetch('../Contenu/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;

            // Après avoir injecté le header, on ajoute les événements
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
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');

    // === Auth Button ===
    if (authButton) {
        if (token && userEmail) {
            // Changer le texte et l'action du bouton si l'utilisateur est connecté
            authButton.textContent = "Mon Compte";
            authButton.setAttribute('aria-label', `Profil de ${userEmail}`);
            authButton.addEventListener('click', () => {
                window.location.href = "profil.html"; // Rediriger vers le profil
            });
        } else {
            // Si l'utilisateur n'est pas connecté, garder l'option de se connecter
            authButton.textContent = "Connexion / Inscription";
            authButton.setAttribute('aria-label', "Connexion ou Inscription");
            authButton.addEventListener('click', () => {
                window.location.href = "login.html"; // Rediriger vers la page de connexion
            });
        }
    }

    // === Favoris Button ===
    if (favorisButton) {
        favorisButton.addEventListener('click', () => {
            if (token && userEmail) {
                window.location.href = "favoris.html"; // Rediriger vers la page des favoris
            } else {
                alert("Vous devez être connecté pour accéder à vos favoris.");
                window.location.href = "login.html"; // Rediriger vers la page de connexion
            }
        });
    }

    // === Messages Button ===
    if (messagesButton) {
        messagesButton.addEventListener('click', () => {
            if (token && userEmail) {
                window.location.href = "messages.html"; // Rediriger vers la page des messages
            } else {
                alert("Vous devez être connecté pour accéder à vos messages.");
                window.location.href = "login.html"; // Rediriger vers la page de connexion
            }
        });
    }

    // === Recherche de livres ===
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
