document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(b => b.id == bookId);

    if (book) {
        // Afficher les infos du livre principal
        document.getElementById('book-title').textContent = book.title;
        document.getElementById('book-author').textContent = `Auteur: ${book.author}`;
        document.getElementById('book-category').textContent = `Catégorie: ${book.category}`;
        document.getElementById('book-condition').textContent = `État: ${book.condition === "new" ? "Neuf" : "Occasion"}`;
        document.getElementById('book-location').textContent = `Localisation: ${book.location}`;
        document.getElementById('book-seller').textContent = `Vendeur: ${book.seller}`;
        document.getElementById('description-text').textContent = book.description || "Pas de description disponible";

        // Image du livre principal
        const bookImage = document.getElementById('book-image');
        if (book.image) {
            bookImage.src = book.image;
        }

        // Gestion de la section d'échange
        const exchangeSection = document.getElementById('exchange-section');
        if (book.exchange) {
            document.getElementById('exchange-title').textContent = book.exchange;
            document.getElementById('exchange-description').textContent = book.exchangeDescription || "Pas de description disponible";

            if (book.exchangeImage) {
                document.getElementById('exchange-image').src = book.exchangeImage;
            }
        } else {
            exchangeSection.style.display = 'none';
        }

        // Bouton de contact
        document.querySelector('.contact-button').addEventListener('click', function() {
            alert(`Contactez ${book.seller} à propos de "${book.title}"\n\nLocalisation: ${book.location}`);
        });
    } else {
        document.getElementById('book-details-container').innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <h2 style="color: #d32f2f;">Livre non trouvé</h2>
                <p>Le livre que vous recherchez n'existe pas ou a été supprimé.</p>
                <a href="BookSwipe.html" style="
                    display: inline-block;
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                ">Retour à l'accueil</a>
            </div>
        `;
    }
});
const addToFavoritesButton = document.getElementById('add-to-favorites');

addToFavoritesButton.addEventListener('click', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert("Vous devez être connecté pour ajouter aux favoris.");
        window.location.href = "login.html";
        return;
    }

    let favoris = JSON.parse(localStorage.getItem('favoris')) || [];
    
    const isAlreadyFavorite = favoris.some(fav => fav.id == book.id);
    if (isAlreadyFavorite) {
        alert("Ce livre est déjà dans vos favoris.");
        return;
    }

    favoris.push(book);
    localStorage.setItem('favoris', JSON.stringify(favoris));
    alert("Livre ajouté à vos favoris !");
});

document.addEventListener('DOMContentLoaded', function() {
    const authButton = document.getElementById('auth-button');
    const favorisButton = document.getElementById('favoris-button');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (authButton) {
        if (currentUser) {
            authButton.textContent = currentUser.name;
            authButton.setAttribute('aria-label', `Profil de ${currentUser.name}`);
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
    const addToFavoritesButton = document.getElementById('add-to-favorites');

    // Fonction pour ajouter aux favoris
    addToFavoritesButton.addEventListener('click', function () {
        const bookDetails = {
            id: new Date().getTime(), // Création d'un ID unique basé sur l'heure
            title: document.getElementById('book-title').innerText,
            author: document.getElementById('book-author').innerText,
            category: document.getElementById('book-category').innerText,
            condition: document.getElementById('book-condition').innerText,
            location: document.getElementById('book-location').innerText,
            seller: document.getElementById('book-seller').innerText,
            description: document.getElementById('description-text').innerText,
            image: document.getElementById('book-image').src
        };

        // Récupérer les favoris existants ou initialiser un tableau vide
        let favorites = JSON.parse(localStorage.getItem('favoris')) || [];

        // Vérification pour éviter la duplication basée sur le titre et l'auteur
        const isAlreadyFavorite = favorites.some(book => 
            book.title === bookDetails.title && book.author === bookDetails.author);
        
        if (!isAlreadyFavorite) {
            favorites.push(bookDetails);
            localStorage.setItem('favoris', JSON.stringify(favorites));
            alert('Livre ajouté aux favoris!');
        } else {
            alert('Ce livre est déjà dans vos favoris.');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const addToFavoritesButton = document.getElementById('add-to-favorites');

    // Ajouter un ID unique pour chaque livre
    const bookId = "book-" + Date.now(); // Utilisation du timestamp pour générer un ID unique

    // Fonction pour ajouter aux favoris
    addToFavoritesButton.addEventListener('click', function () {
      const bookDetails = {
        id: bookId,
        title: document.getElementById('book-title').innerText,
        author: document.getElementById('book-author').innerText,
        category: document.getElementById('book-category').innerText,
        condition: document.getElementById('book-condition').innerText,
        location: document.getElementById('book-location').innerText,
        seller: document.getElementById('book-seller').innerText,
        description: document.getElementById('description-text').innerText,
        image: document.getElementById('book-image').src
      };

      // Récupérer les favoris existants ou initialiser un tableau vide
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

      // Ajouter le livre aux favoris (s'il n'est pas déjà dans la liste)
      const isAlreadyFavorite = favorites.some(book => book.id === bookDetails.id);
      if (!isAlreadyFavorite) {
        favorites.push(bookDetails);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Livre ajouté aux favoris!');
      } else {
        alert('Ce livre est déjà dans vos favoris.');
      }
    });
  });