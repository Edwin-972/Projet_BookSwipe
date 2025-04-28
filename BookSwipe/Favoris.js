document.addEventListener('DOMContentLoaded', function () {
    const favorisContainer = document.getElementById('favoris-container');
    const favoris = JSON.parse(localStorage.getItem('favorites')) || [];

    // Vérification s'il y a des favoris
    if (favoris.length === 0) {
        favorisContainer.innerHTML = "<p>Vous n'avez aucun favori pour l'instant.</p>";
    } else {
        favoris.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('favori-item');
            bookDiv.innerHTML = `
                <div class="favori-book" style="display: flex; align-items: center; margin-bottom: 20px;">
                    <img src="${book.image}" alt="Couverture de ${book.title}" class="favori-image" style="width: 50px; height: 75px; margin-right: 10px;">
                    <div>
                        <a href="Detaille_Livre.html?id=${book.id}" style="text-decoration: none; color: #333;">${book.title}</a>
                        <p>${book.author}</p>
                    </div>
                </div>
                <button class="remove-favori" data-id="${book.id}" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">Supprimer</button>
            `;
            favorisContainer.appendChild(bookDiv);

            // Écouter le clic sur le bouton "Supprimer"
            document.querySelectorAll('.remove-favori').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation(); // Empêcher la propagation de l'événement pour éviter la redirection
                    const idToRemove = this.getAttribute('data-id');
                    const updatedFavoris = favoris.filter(book => book.id != idToRemove);
                    localStorage.setItem('favorites', JSON.stringify(updatedFavoris));
                    window.location.reload(); // Recharger la page pour mettre à jour la liste des favoris
                });
            });

            // Ajouter un événement de redirection sur le lien vers la page de détail
            bookDiv.querySelector('a').addEventListener('click', function(e) {
                const bookId = this.getAttribute('href').split('=')[1];
                if (bookId) {
                    // Vérifier si le livre existe dans le localStorage avant de rediriger
                    const bookExists = favoris.some(book => book.id == bookId);
                    if (bookExists) {
                        window.location.href = `Detaille_Livre.html?id=${bookId}`;
                    } else {
                        alert("Le livre n'existe plus ou a été supprimé.");
                    }
                }
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const favorisContainer = document.getElementById('favoris-container');
    const favoris = JSON.parse(localStorage.getItem('favorites')) || [];

    // Vérification s'il y a des favoris
    if (favoris.length === 0) {
        favorisContainer.innerHTML = "<p>Vous n'avez aucun favori pour l'instant.</p>";
    } else {
        favoris.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('favori-item');
            bookDiv.innerHTML = `
                <div class="favori-book" style="display: flex; align-items: center; margin-bottom: 20px;">
                    <img src="${book.image}" alt="Couverture de ${book.title}" class="favori-image" style="width: 50px; height: 75px; margin-right: 10px;">
                    <div>
                        <a href="Detaille_Livre.html?id=${book.id}" style="text-decoration: none; color: #333;">${book.title}</a>
                        <p>${book.author}</p>
                    </div>
                </div>
                <button class="remove-favori" data-id="${book.id}" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">Supprimer</button>
            `;
            favorisContainer.appendChild(bookDiv);
        });

        // Suppression d'un favori
        document.querySelectorAll('.remove-favori').forEach(button => {
            button.addEventListener('click', function() {
                const idToRemove = this.getAttribute('data-id');
                const updatedFavoris = favoris.filter(book => book.id != idToRemove);
                localStorage.setItem('favorites', JSON.stringify(updatedFavoris));
                window.location.reload();
            });
        });
    }
});

 
// Mettre à jour le bouton de connexion dans la navbar
document.addEventListener('DOMContentLoaded', function() {
    const authButton = document.getElementById('auth-button');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (authButton) {
        if (currentUser) {
            authButton.textContent = "Mon compte"; // Afficher "Mon compte" pour un utilisateur connecté
            authButton.setAttribute('aria-label', `Profil de ${currentUser.name}`);
        } else {
            authButton.textContent = "Connexion/Inscription"; // Afficher "Connexion/Inscription" si non connecté
            authButton.setAttribute('aria-label', "Connexion ou Inscription");
        }

        authButton.addEventListener('click', function() {
            if (currentUser) {
                // Si l'utilisateur est connecté, redirection vers la page du profil
                window.location.href = "profil.html"; // Page de profil de l'utilisateur
            } else {
                // Sinon, redirection vers la page de login
                window.location.href = "login.html";
            }
        });
    }
});