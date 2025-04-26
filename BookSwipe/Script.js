document.addEventListener('DOMContentLoaded', function () {
    let books = JSON.parse(localStorage.getItem('books')) || [];

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

            // Vérifier si l'utilisateur est connecté
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('Veuillez vous connecter pour déposer une annonce');
                window.location.href = 'Login.html';
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

    displayBooks(books);

    document.addEventListener('click', function(e) {
        if (e.target.closest('.book-card')) {
            const bookCard = e.target.closest('.book-card');
            const bookId = bookCard.getAttribute('data-id');
            window.location.href = `detaille_Livre.html?id=${bookId}`;
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
            authButton.textContent = "Mon Compte";
            authButton.setAttribute('aria-label', `Profil de ${currentUser.name}`);

            // Ajouter un bouton de déconnexion
            const logoutButton = document.createElement('button');
            logoutButton.textContent = "Se déconnecter";
            logoutButton.addEventListener('click', function() {
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
            authButton.parentNode.insertBefore(logoutButton, authButton.nextSibling);
        }
    }
}
