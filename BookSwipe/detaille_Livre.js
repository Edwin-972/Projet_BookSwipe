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
