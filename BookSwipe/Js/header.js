window.addEventListener('DOMContentLoaded', () => {
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (authButton) {
        if (currentUser) {
            authButton.textContent = "Mon compte";
            authButton.setAttribute('aria-label', `Profil de ${currentUser.name}`);
        } else {
            authButton.textContent = "Connexion/Inscription";
            authButton.setAttribute('aria-label', "Connexion ou Inscription");
        }

        authButton.addEventListener('click', function() {
            if (currentUser) {
                window.location.href = "profil.html";
            } else {
                window.location.href = "login.html";
            }
        });
    }

    const favorisButton = document.getElementById('favoris-button');
    const messagesButton = document.getElementById('messages-button');

    if (favorisButton) {
        favorisButton.addEventListener('click', () => {
            window.location.href = "favoris.html"; // Page Favoris
        });
    }

    if (messagesButton) {
        messagesButton.addEventListener('click', () => {
            window.location.href = "messages.html"; // Page Messages
        });
    }

    // === 🔥 Correction pour la barre de recherche ===
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const books = document.querySelectorAll('.book-card'); // Assure-toi que tes livres ont la classe 'book-card'

            books.forEach(book => {
                const title = book.querySelector('.book-title').textContent.toLowerCase();
                if (title.includes(query)) {
                    book.style.display = '';
                } else {
                    book.style.display = 'none';
                }
            });
        });
    }
}