document.addEventListener('DOMContentLoaded', function() {
    // Configuration du drag and drop
    function setupDropZone(dropZoneId, inputId) {
        const dropZone = document.getElementById(dropZoneId);
        const input = document.getElementById(inputId);

        if (!dropZone || !input) return;

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length && e.dataTransfer.files[0].type.match('image.*')) {
                input.files = e.dataTransfer.files;
                updateDropZonePreview(dropZone, e.dataTransfer.files[0]);
            }
        });

        dropZone.addEventListener('click', () => input.click());
        
        input.addEventListener('change', () => {
            if (input.files.length && input.files[0].type.match('image.*')) {
                updateDropZonePreview(dropZone, input.files[0]);
            }
        });
    }

    function updateDropZonePreview(dropZone, file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            dropZone.innerHTML = `
                <img src="${e.target.result}" class="image-preview">
                <p>${file.name}</p>
                <p class="small">${(file.size / 1024 / 1024).toFixed(2)} MB</p>
            `;
        };
        reader.readAsDataURL(file);
    }

    // Initialisation du drag and drop
    setupDropZone('drop-zone', 'image-upload');

    // Gestion de la soumission du formulaire
    const annonceForm = document.getElementById('annonce-form');
    if (annonceForm) {
        annonceForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const submitButton = annonceForm.querySelector('.submit-button');
            const buttonText = submitButton.querySelector('.button-text');
            const loadingElement = submitButton.querySelector('.loading');
            const confirmationMessage = document.querySelector('.confirmation-message');
            
            buttonText.style.display = 'none';
            loadingElement.style.display = 'flex';
            
            const formData = {
                title: document.getElementById('title').value,
                author: document.getElementById('author').value,
                category: document.getElementById('category').value,
                condition: document.getElementById('condition').value,
                location: document.getElementById('location').value,
                description: document.getElementById('description').value,
                imageUpload: document.getElementById('image-upload')
            };

            const requiredFields = [
                { value: formData.title, name: 'Titre du livre' },
                { value: formData.author, name: 'Auteur' },
                { value: formData.category, name: 'Catégorie' },
                { value: formData.condition, name: 'État du livre' },
                { value: formData.location, name: 'Localisation' },
                { value: formData.description, name: 'Description' }
            ];

            const missingField = requiredFields.find(field => !field.value);
            if (missingField) {
                alert(`Veuillez remplir le champ "${missingField.name}"`);
                buttonText.style.display = 'inline';
                loadingElement.style.display = 'none';
                return;
            }

            try {
                let imageBase64 = null;
                if (formData.imageUpload.files[0]) {
                    // Pas de limite de taille ici, on enregistre directement l'image
                    imageBase64 = await readFileAsDataURL(formData.imageUpload.files[0]);
                }

                const newBook = {
                    id: Date.now(),
                    title: formData.title,
                    author: formData.author,
                    category: formData.category,
                    condition: formData.condition,
                    location: formData.location,
                    description: formData.description,
                    image: imageBase64,
                    createdAt: new Date().toISOString()
                };

                let books = JSON.parse(localStorage.getItem('books')) || [];
                books.push(newBook);
                localStorage.setItem('books', JSON.stringify(books));

                confirmationMessage.style.display = 'block';
                
                setTimeout(() => {
                    window.location.href = 'BookSwipe.html';
                }, 2000);
            } catch (error) {
                console.error("Erreur lors de la soumission:", error);
                alert(`Une erreur est survenue: ${error.message}`);
                buttonText.style.display = 'inline';
                loadingElement.style.display = 'none';
            }
        });
    }

    // Gestion de l'authentification
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
});

// Mettre à jour le bouton de connexion dans la navbar
document.addEventListener('DOMContentLoaded', function() {
    const authButton = document.getElementById('auth-button');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (authButton) {
        if (currentUser) {
            authButton.textContent = "Mon compte"; // Afficher "Mon compte" pour un utilisateur connecté
            authButton.textContent = "Mon compte"; // Afficher "Mon compte" pour un utilisateur connecté
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

// Fonction pour lire l'image et la convertir en base64
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}