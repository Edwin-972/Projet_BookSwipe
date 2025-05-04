document.addEventListener('DOMContentLoaded', function () {
    // Initialisation commune
    const authButton = document.getElementById('auth-button');
    const favorisButton = document.getElementById('favoris-button');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Mise à jour du bouton de connexion
    if (authButton) {
        if (currentUser) {
            authButton.textContent = "Mon compte";
            authButton.setAttribute('aria-label', `Profil de ${currentUser.name}`);
        } else {
            authButton.textContent = "Connexion/Inscription";
            authButton.setAttribute('aria-label', "Connexion ou Inscription");
        }

        authButton.addEventListener('click', function () {
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

    // Gestion du bouton favoris
    if (favorisButton) {
        favorisButton.addEventListener('click', function () {
            if (currentUser) {
                window.location.href = "favoris.html";
            } else {
                alert("Vous devez être connecté pour accéder à vos favoris.");
                window.location.href = "login.html";
            }
        });
    }

    // Affichage des livres
    let books = JSON.parse(localStorage.getItem('books')) || [];
    displayBooks(books);

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
        annonceForm.addEventListener("submit", handleAnnonceSubmit);
    }

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
                    card.addEventListener('click', function () {
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

    // Gestion du formulaire d'ajout d'une annonce
    function handleAnnonceSubmit(event) {
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
                    exchangeReader.onload = function (e) {
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
    }
});
// Fonction pour mettre à jour le bouton d'authentification
function updateAuthButton() {
    const authButton = document.getElementById('auth-button');
    if (authButton) {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        
        if (token && email) {
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

// Fonction pour initialiser le header
function initializeHeader() {
    const authButton = document.getElementById('auth-button');
    const favorisButton = document.getElementById('favoris-button');
    const messagesButton = document.getElementById('messages-button');
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');

    if (authButton) {
        if (token && email) {
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

    // Initialiser la barre de recherche
    initSearchBar();
}

// Fonction pour initialiser la barre de recherche
function initSearchBar() {
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', function (e) {
            const query = e.target.value.toLowerCase();
            const books = document.querySelectorAll('.book-card');
            books.forEach(book => {
                const title = book.querySelector('.book-title')?.textContent.toLowerCase() || "";
                const author = book.querySelector('.book-author')?.textContent.toLowerCase() || "";
                const category = book.querySelector('.book-category')?.textContent.toLowerCase() || "";
                
                // Rechercher dans le titre, l'auteur ou la catégorie
                book.style.display = (
                    title.includes(query) || 
                    author.includes(query) || 
                    category.includes(query)
                ) ? '' : 'none';
            });
        });
    }
}

// Charger le header au chargement de la page
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

// Gérer la connexion
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Gérer les onglets de connexion/inscription si présents
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    
    if (loginTab && registerTab) {
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
    }

    // Gérer le formulaire d'inscription
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value.toLowerCase();
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
    }

    // Gérer le formulaire de connexion
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('login-email').value.toLowerCase();
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

                    messageEl.textContent = "Connexion réussie! Redirection...";
                    setTimeout(() => {
                        window.location.href = "BookSwipe.html";
                    }, 1000);
                } else {
                    messageEl.textContent = data.error || "Échec de la connexion";
                }
            } catch (err) {
                console.error(err);
                messageEl.textContent = "Erreur réseau";
            }
        });
    }
});

// Fonction de déconnexion
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = "index.html";
}

// Exposer la fonction logout globalement
window.logout = logout;