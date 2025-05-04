// ===== CORRECTION DU FICHIER FRONTEND: profil.js =====
document.addEventListener('DOMContentLoaded', async function () {
    const bookList = document.getElementById('book-list');
    const token = localStorage.getItem('token');
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const passwordChangeForm = document.getElementById('password-change-form');
    const passwordChangeMessage = document.getElementById('password-change-message');
    const logoutButton = document.getElementById('logout-button');

    if (!token) {
        window.location.href = "login.html"; // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        return;
    }

    let userBooks = [];
    let userInfo = {};

    // Fonction pour afficher les livres
    function displayBooks(books) {
        bookList.innerHTML = '';

        if (books.length === 0) {
            bookList.innerHTML = '<p class="no-results">Aucun livre trouvé</p>';
            return;
        }

        books.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('book-card');

            // Gérer l'image (si elle existe, afficher)
            let imageSrc;
            if (book.image) {
                imageSrc = `data:image/jpeg;base64,${book.image}`;
            } else {
                imageSrc = '../images/default-book.jpg';
            }

            card.innerHTML = `
                <div class="book-image">
                    <img src="${imageSrc}" alt="${book.titre}" />
                </div>
                <div class="book-info">
                    <h3>${book.titre}</h3>
                    <p><strong>Auteur:</strong> ${book.auteur}</p>
                    <p><strong>Catégorie:</strong> ${book.categorie}</p>
                    <p><strong>État:</strong> ${book.statut}</p>
                    <p><strong>Ville:</strong> ${book.ville}</p>
                    <p class="book-description">${book.description.substring(0, 100)}${book.description.length > 100 ? '...' : ''}</p>
                    <p class="book-date">Ajouté le: ${new Date(book.date_ajout).toLocaleDateString()}</p>
                </div>
            `;

            // Ajouter un événement de clic pour voir les détails du livre
            card.addEventListener('click', () => {
                // Rediriger vers la page de détails du livre
                window.location.href = `Detaille_livre.html?id=${book.id}`;
            });

            bookList.appendChild(card);
        });
    }

    // Récupérer les informations de l'utilisateur connecté seulement
    try {
        const userResponse = await fetch('http://localhost:3001/api/user_info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (userResponse.ok) {
            userInfo = await userResponse.json();
            userNameElement.textContent = userInfo.nom;
            userEmailElement.textContent = userInfo.email;
        } else {
            throw new Error('Erreur lors de la récupération des informations de l\'utilisateur');
        }
    } catch (error) {
        console.error('Erreur:', error);
        passwordChangeMessage.textContent = `Erreur: ${error.message}`;
    }

    // Récupérer les livres de l'utilisateur connecté
    try {
        bookList.innerHTML = '<p class="loading-message">Chargement des livres...</p>';

        const response = await fetch(`http://localhost:3001/api/annonces_utilisateur`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const textResponse = await response.text(); // Lire la réponse comme du texte brut
        console.log('Réponse brute du serveur:', textResponse); // Afficher la réponse brute dans la console
        if (response.ok) {
            userBooks = JSON.parse(textResponse); // Parser le texte en JSON
            displayBooks(userBooks);
        } else {
            throw new Error('Erreur lors de la récupération des livres');
        }
    } catch (error) {
        console.error('Erreur:', error);
        bookList.innerHTML = `<p class="error-message">Impossible de charger les livres. Erreur: ${error.message}</p>`;
    }

    // Gestion du changement de mot de passe de l'utilisateur connecté UNIQUEMENT
    passwordChangeForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        passwordChangeMessage.textContent = '';

        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        // Validation des mots de passe
        if (newPassword !== confirmNewPassword) {
            passwordChangeMessage.textContent = "Les mots de passe ne correspondent pas";
            return;
        }

        if (newPassword.length < 6) {
            passwordChangeMessage.textContent = "Le nouveau mot de passe doit contenir au moins 6 caractères";
            return;
        }

        try {
            // Requête sécurisée qui n'utilise que le token pour identifier l'utilisateur
            // Aucun ID d'utilisateur n'est envoyé dans la requête
            const response = await fetch('http://localhost:3001/api/change_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    currentPassword, 
                    newPassword 
                })
            });

            const data = await response.json();

            if (response.ok) {
                passwordChangeMessage.textContent = "Mot de passe mis à jour avec succès!";
                // Réinitialiser le formulaire
                passwordChangeForm.reset();
            } else {
                passwordChangeMessage.textContent = data.error || "Erreur lors du changement de mot de passe";
            }
        } catch (err) {
            console.error(err);
            passwordChangeMessage.textContent = "Erreur réseau";
        }
    });

    // Gestion de la déconnexion
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        window.location.href = "login.html"; // Redirection vers la page de connexion
    });
});

// ===== CORRECTION DU FICHIER BACKEND (exemple avec Node.js/Express) =====
// Fichier: routes/auth.js ou similaire

/**
 * Route sécurisée pour changer le mot de passe d'un utilisateur.
 * Cette route utilise le middleware authenticateToken pour s'assurer que 
 * l'utilisateur ne peut modifier QUE son propre mot de passe.
 */
router.post('/change_password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // req.user contient les informations de l'utilisateur extraites du token JWT
        // On n'accepte JAMAIS d'ID d'utilisateur dans le corps de la requête
        const userId = req.user.id; // Obtenu UNIQUEMENT à partir du token
        
        // Récupérer l'utilisateur depuis la base de données
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        
        // Vérifier le mot de passe actuel
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ error: "Mot de passe actuel incorrect" });
        }
        
        // Hasher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Mettre à jour le mot de passe
        user.password = hashedPassword;
        await user.save();
        
        res.json({ message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/**
 * Middleware pour authentifier le token JWT et extraire les informations utilisateur
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: "Accès non autorisé" });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token invalide" });
        }
        
        req.user = user; // Stocke les informations de l'utilisateur extraites du token
        next();
    });
}