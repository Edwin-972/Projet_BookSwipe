document.addEventListener('DOMContentLoaded', function () {
    let books = JSON.parse(localStorage.getItem('books')) || [];

    // Fonction pour afficher les livres
    function displayBooks(filteredBooks) {
        const booksSection = document.querySelector(".books-section");
        if (booksSection) {
            booksSection.innerHTML = "";

            if (filteredBooks.length === 0) {
                booksSection.innerHTML = "<p>Aucun livre trouvé.</p>";
            } else {
                filteredBooks.forEach(book => {
                    const bookCard = `
                        <div class="book-card" data-id="${book.id}">
                            ${book.image ? `<img src="${book.image}" alt="Couverture du livre" class="book-cover">` : '<div class="no-image">Pas d\'image</div>'}
                            <h2 class="book-title">${book.title}</h2>
                            <p class="book-author">${book.author}</p>
                            <p class="book-status">État : ${book.condition === "new" ? "Neuf" : "Occasion"}</p>
                            <p class="book-location">Ville : ${book.location}</p>
                            <p class="book-seller">Vendeur : ${book.seller}</p>
                        </div>
                    `;
                    booksSection.insertAdjacentHTML("beforeend", bookCard);
                });

                // Gestion de la redirection vers la page de détail
                document.querySelectorAll('.book-card').forEach(card => {
                    card.addEventListener('click', function() {
                        const bookId = this.getAttribute('data-id');
                        window.location.href = `detaille_Livre.html?id=${bookId}`;
                    });
                });
            }
        }
    }

    // Fonction pour appliquer les filtres
    function applyFilters() {
        const category = document.getElementById("category-filter").value;
        const location = document.getElementById("location-filter").value.toLowerCase();
        const conditionNew = document.querySelector('input[name="condition"][value="new"]').checked;
        const conditionUsed = document.querySelector('input[name="condition"][value="used"]').checked;

        const filteredBooks = books.filter(book => {
            const matchesCategory = category === "all" || book.category === category;
            const matchesLocation = location === "" || book.location.toLowerCase().includes(location);
            const matchesCondition =
                (conditionNew && book.condition === "new") ||
                (conditionUsed && book.condition === "used") ||
                (!conditionNew && !conditionUsed);

            return matchesCategory && matchesLocation && matchesCondition;
        });

        displayBooks(filteredBooks);
    }

    // Fonction pour filtrer les livres par recherche
    function filterBooksBySearch(query) {
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase()) ||
            book.location.toLowerCase().includes(query.toLowerCase())
        );
        displayBooks(filteredBooks);
    }

    // Gestion des filtres
    const applyFiltersButton = document.getElementById("apply-filters");
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener("click", applyFilters);
    }

    // Recherche en temps réel
    const searchBar = document.querySelector(".search-bar");
    if (searchBar) {
        searchBar.addEventListener("input", (event) => {
            const query = event.target.value;
            filterBooksBySearch(query);
        });
    }

    // Gestion du formulaire d'ajout d'une annonce
    const annonceForm = document.getElementById("annonce-form");
    if (annonceForm) {
        annonceForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // Vérifier si l'utilisateur est connecté
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('Veuillez vous connecter pour déposer une annonce');
                window.location.href = 'login.html';
                return;
            }

            const title = document.getElementById("title").value;
            const author = document.getElementById("author").value;
            const category = document.getElementById("category").value;
            const condition = document.getElementById("condition").value;
            const location = document.getElementById("location").value;
            const description = document.getElementById("description").value;
            const exchange = document.getElementById("exchange").value;
            const imageUpload = document.getElementById("image-upload");
            const exchangeImageUpload = document.getElementById("exchange-image-upload");

            const processSubmission = (mainImage, exchangeImage) => {
                const newBook = {
                    id: Date.now(),
                    title,
                    author,
                    category,
                    condition,
                    location,
                    description,
                    exchange,
                    exchangeImage,
                    seller: currentUser.name, // Utiliser le nom de l'utilisateur connecté
                    image: mainImage
                };
                books.push(newBook);
                localStorage.setItem('books', JSON.stringify(books));
                window.location.href = "BookSwipe.html";
            };

            if (imageUpload.files[0]) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const mainImage = event.target.result;

                    if (exchangeImageUpload.files[0]) {
                        const exchangeReader = new FileReader();
                        exchangeReader.onload = function(e) {
                            processSubmission(mainImage, e.target.result);
                        };
                        exchangeReader.readAsDataURL(exchangeImageUpload.files[0]);
                    } else {
                        processSubmission(mainImage, null);
                    }
                };
                reader.readAsDataURL(imageUpload.files[0]);
            } else {
                processSubmission(null, null);
            }
        });
    }

    // Affichage des livres
    displayBooks(books);

    // Mettre à jour le bouton de connexion dans la navbar si l'utilisateur est connecté
    updateAuthButton();

    // Fonction de mise à jour du bouton de connexion
    function updateAuthButton() {
        const authButton = document.getElementById('auth-button');
        if (authButton) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                authButton.textContent = "Mon Compte";
                authButton.setAttribute('aria-label', `Profil de ${currentUser.name}`);

              

                authButton.parentNode.insertBefore(logoutButton, authButton.nextSibling);
            }
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const authButton = document.getElementById('auth-button');
    const favorisButton = document.getElementById('favoris-button');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (authButton) {
        if (currentUser) {
            authButton.textContent = currentUser.name;
            authButton.textContent = "Mon compte"; // Afficher "Mon compte" pour un utilisateur connecté
        } else {
            authButton.textContent = "Connexion/Inscription";
            authButton.setAttribute('aria-label', "Connexion ou Inscription");
        }

        authButton.addEventListener('click', function() {
            if (currentUser) {
                if (confirm(`Déconnecter ${currentUser.name} ?`)) {
                    localStorage.removeItem('currentUser');
                    window.location.reload();
                }
            } else {
                window.location.href = "login.html";
            }
        });
    }

    if (favorisButton) {
        favorisButton.addEventListener('click', function() {
            if (currentUser) {
                window.location.href = "favoris.html"; // Redirection vers favoris si connecté
            } else {
                alert("Vous devez être connecté pour accéder à vos favoris.");
                window.location.href = "login.html"; // Redirection login
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Si un utilisateur est connecté, afficher ses informations
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;
        document.getElementById('user-seller').textContent = currentUser.name; // Nom du vendeur
        document.getElementById('user-location').textContent = currentUser.location; // Ville de l'utilisateur
    }

   
    
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
        window.location.href = "BookSwipe.html";
    }

    // Gestion de la déconnexion
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = "BookSwipe.html"; // Redirection vers la page de connexion
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

        // Mettre à jour tous les utilisateurs dans le localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Mettre à jour le currentUser dans le localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        alert("Mot de passe mis à jour avec succès !");
    });
});