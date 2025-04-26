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
        if (file.size > 5 * 1024 * 1024) {
            dropZone.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>Fichier trop volumineux (max 5MB)</p>
                <p class="small">Veuillez choisir une image plus petite</p>
            `;
            return;
        }

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
            
            // Elements UI
            const submitButton = annonceForm.querySelector('.submit-button');
            const buttonText = submitButton.querySelector('.button-text');
            const loadingElement = submitButton.querySelector('.loading');
            const confirmationMessage = document.querySelector('.confirmation-message');
            
            // Afficher le loader
            buttonText.style.display = 'none';
            loadingElement.style.display = 'flex';
            
            // Récupération des valeurs
            const formData = {
                title: document.getElementById('title').value,
                author: document.getElementById('author').value,
                category: document.getElementById('category').value,
                condition: document.getElementById('condition').value,
                location: document.getElementById('location').value,
                description: document.getElementById('description').value,
                imageUpload: document.getElementById('image-upload')
            };

            // Validation
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

            // Traitement de l'image
            let imageBase64 = null;
            if (formData.imageUpload.files[0]) {
                try {
                    imageBase64 = await readFileAsDataURL(formData.imageUpload.files[0]);
                } catch (error) {
                    console.error("Erreur de lecture de l'image:", error);
                }
            }

            // Création du livre
            const newBook = {
                id: Date.now(),
                title: formData.title,
                author: formData.author,
                category: formData.category,
                condition: formData.condition,
                location: formData.location,
                description: formData.description,
                image: imageBase64
            };

            // Sauvegarde
            let books = JSON.parse(localStorage.getItem('books')) || [];
            books.push(newBook);
            localStorage.setItem('books', JSON.stringify(books));

            // Affichage confirmation
            confirmationMessage.style.display = 'block';
            
            // Redirection
            setTimeout(() => {
                window.location.href = 'BookSwipe.html';
            }, 2000);
        });
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }
});