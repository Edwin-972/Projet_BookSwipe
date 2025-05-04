document.addEventListener('DOMContentLoaded', function () {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    function updateAuthButton() {
        const authButton = document.getElementById('auth-button');
        if (authButton) {
            if (currentUser) {
                authButton.textContent = "Mon Compte";
                authButton.setAttribute('aria-label', `Profil de ${currentUser.name}`);
                authButton.addEventListener('click', function() {
                    window.location.href = "profil.html";
                });
            } else {
                authButton.textContent = "Connexion/Inscription";
                authButton.setAttribute('aria-label', "Connexion ou Inscription");
                authButton.addEventListener('click', function() {
                    window.location.href = "login.html";
                });
            }
        }
    }

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

                document.querySelectorAll('.book-card').forEach(card => {
                    card.addEventListener('click', function() {
                        const bookId = this.getAttribute('data-id');
                        window.location.href = `detaille_Livre.html?id=${bookId}`;
                    });
                });
            }
        }
    }

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

    function filterBooksBySearch(query) {
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase()) ||
            book.location.toLowerCase().includes(query.toLowerCase())
        );
        displayBooks(filteredBooks);
    }

    const applyFiltersButton = document.getElementById("apply-filters");
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener("click", applyFilters);
    }

    const searchBar = document.querySelector(".search-bar");
    if (searchBar) {
        searchBar.addEventListener("input", (event) => {
            const query = event.target.value;
            filterBooksBySearch(query);
        });
    }

    const annonceForm = document.getElementById("annonce-form");
    if (annonceForm) {
        annonceForm.addEventListener("submit", (event) => {
            event.preventDefault();

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
                    seller: currentUser.name,
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

    displayBooks(books);
    updateAuthButton();

    const favorisButton = document.getElementById('favoris-button');
    if (favorisButton) {
        favorisButton.addEventListener('click', function() {
            if (currentUser) {
                window.location.href = "favoris.html";
            } else {
                alert("Vous devez être connecté pour accéder à vos favoris.");
                window.location.href = "login.html";
            }
        });
    }

    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;
        document.getElementById('user-seller').textContent = currentUser.name;
        document.getElementById('user-location').textContent = currentUser.location;
    }

    const logoutButton = document.querySelector('.logout-button');
    const passwordChangeForm = document.getElementById('password-change-form');

    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = "BookSwipe.html";
        });
    }

    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;

            if (currentPassword !== currentUser.password) {
                alert("Le mot de passe actuel est incorrect");
                return;
            }

            if (newPassword !== confirmNewPassword) {
                alert("Les mots de passe ne correspondent pas");
                return;
            }

            if (newPassword.length < 6) {
                alert("Le nouveau mot de passe doit contenir au moins 6 caractères");
                return;
            }

            currentUser.password = newPassword;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(user => user.email === currentUser.email);

            if (userIndex !== -1) {
                users[userIndex].password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));
            }

            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            alert("Mot de passe mis à jour avec succès !");
        });
    }
});
// Fonction pour charger les livres depuis l'API
async function fetchAndDisplayBooks() {
    try {
        const response = await fetch('http://localhost:3001/api/annonces_livres');
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const books = await response.json();
        
        // Afficher les livres dans le conteneur approprié
        const booksContainer = document.getElementById('books-container');
        
        // S'assurer que le conteneur existe
        if (!booksContainer) {
            console.error('Le conteneur de livres #books-container n\'a pas été trouvé');
            return;
        }
        
        // Vider le conteneur actuel
        booksContainer.innerHTML = '';
        
        // Ajouter chaque livre au conteneur
        if (books.length === 0) {
            booksContainer.innerHTML = '<p>Aucun livre disponible pour le moment.</p>';
        } else {
            books.forEach(book => {
                const bookCard = createBookCard(book);
                booksContainer.appendChild(bookCard);
            });
        }
        
        console.log('Livres chargés avec succès:', books.length);
    } catch (error) {
        console.error('Erreur lors du chargement des livres:', error);
        const booksContainer = document.getElementById('books-container');
        if (booksContainer) {
            booksContainer.innerHTML = '<p>Erreur lors du chargement des livres. Veuillez réessayer.</p>';
        }
    }
}

// Fonction pour créer une carte de livre
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.id = book.id;
    
    // Création du contenu de la carte
    card.innerHTML = `
        <div class="book-image">
            ${book.image_url ? `<img src="${book.image_url}" alt="${book.titre}">` : '<div class="no-image">Pas d\'image</div>'}
        </div>
        <div class="book-info">
            <h3 class="book-title">${book.titre}</h3>
            <p class="book-author">${book.auteur}</p>
            <p class="book-category">${book.categorie}</p>
            <p class="book-status">${book.statut}</p>
            <p class="book-location">${book.ville}</p>
            <p class="book-date">Ajouté le ${new Date(book.date_ajout).toLocaleDateString()}</p>
        </div>
    `;
    
    // Ajouter un gestionnaire d'événements pour afficher les détails du livre
    card.addEventListener('click', () => {
        // Rediriger vers la page de détails du livre ou afficher un modal
        window.location.href = `details-livre.html?id=${book.id}`;
    });
    
    return card;
}

// Appeler cette fonction lorsque la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Chargement initial des livres
    fetchAndDisplayBooks();
    
    // Mettre à jour l'interface en fonction de l'état de connexion
    updateAuthButton();
});

