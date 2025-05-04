document.addEventListener('DOMContentLoaded', async function () {
  const annonceForm = document.getElementById('annonce-form');
  const titleSelect = document.getElementById('titleSelect');
  const authorInput = document.getElementById('author');
  const cityInput = document.getElementById('city');
  const citySuggestionsList = document.getElementById('city-suggestions');
  const submitButton = document.querySelector('.submit-button');
  const buttonText = submitButton.querySelector('.button-text');
  const loadingElement = submitButton.querySelector('.loading');
  const confirmationMessage = document.querySelector('.confirmation-message');
  const errorMessage = document.querySelector('.error-message');
  const token = localStorage.getItem('token');

  // Remplir la liste déroulante avec les livres depuis la base de données
  try {
    const response = await fetch('http://localhost:3001/api/Livres_Populaires');
    const textResponse = await response.text(); // Lire la réponse comme du texte brut
    console.log('Réponse brute du serveur (livres populaires):', textResponse); // Afficher la réponse brute dans la console
    const livres = JSON.parse(textResponse);

    livres.forEach(livre => {
      const option = document.createElement('option');
      option.value = livre.nom_livre;
      option.textContent = livre.nom_livre;
      option.dataset.auteur = livre.auteur;  // Stocker l'auteur dans un attribut data
      titleSelect.appendChild(option);
    });

    // Quand un livre est sélectionné, remplir le champ auteur
    titleSelect.addEventListener('change', function () {
      const selectedOption = titleSelect.options[titleSelect.selectedIndex];
      const auteur = selectedOption.dataset.auteur || '';
      authorInput.value = auteur;
    });
  } catch (error) {
    console.error('Erreur lors du chargement des livres populaires:', error);
  }

  // Gérer l'événement de saisie dans le champ de ville
  cityInput.addEventListener('input', async function () {
    const query = cityInput.value.trim();

    // Si le champ est vide ou si la saisie est trop courte, on ne fait rien
    if (query.length < 2) {
      citySuggestionsList.innerHTML = '';
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/adresse?query=${query}`);
      const textResponse = await response.text(); // Lire la réponse comme du texte brut
      console.log('Réponse brute du serveur (villes):', textResponse); // Afficher la réponse brute dans la console
      const villes = JSON.parse(textResponse);

      // Vider la liste des suggestions avant de la remplir
      citySuggestionsList.innerHTML = '';

      // Si des villes sont trouvées, on les affiche dans la liste déroulante
      if (villes.length > 0) {
        villes.forEach(ville => {
          const li = document.createElement('li');
          li.textContent = `${ville.Nom_de_la_commune} (${ville.Code_postal})`;
          li.addEventListener('click', function () {
            // Lorsqu'une ville est sélectionnée, on la met dans le champ de texte
            cityInput.value = ville.Nom_de_la_commune;
            citySuggestionsList.innerHTML = ''; // Effacer la liste après sélection
          });
          citySuggestionsList.appendChild(li);
        });
      } else {
        // Si aucune ville n'est trouvée, on affiche un message dans la liste
        const li = document.createElement('li');
        li.textContent = 'Aucune ville trouvée';
        citySuggestionsList.appendChild(li);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de la ville:', error);
    }
  });

  // Cacher la liste des suggestions si l'utilisateur clique ailleurs
  document.addEventListener('click', function(event) {
    if (!cityInput.contains(event.target) && !citySuggestionsList.contains(event.target)) {
      citySuggestionsList.innerHTML = ''; // Fermer la liste si on clique en dehors
    }
  });

  // Gestion du formulaire d'annonce
  if (annonceForm) {
    annonceForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      buttonText.style.display = 'none';
      loadingElement.style.display = 'flex';
      errorMessage.style.display = 'none';

      // Récupération des valeurs du formulaire
      const titre = titleSelect.value;
      const auteur = authorInput.value;
      const categorie = document.getElementById('category').value;
      const statut = document.getElementById('condition').value === 'new' ? 'Neuf' : 'Occasion';
      const ville = cityInput.value;
      const description = document.getElementById('description').value;
      const imageInput = document.getElementById('image');

      // Validation des champs requis
      if (!titre || !auteur || !categorie || !statut || !ville || !description || !imageInput.files[0]) {
        errorMessage.textContent = "Veuillez remplir tous les champs obligatoires";
        errorMessage.style.display = 'block';
        buttonText.style.display = 'inline';
        loadingElement.style.display = 'none';
        return;
      }

      const formData = new FormData();
      formData.append('titre', titre);
      formData.append('auteur', auteur);
      formData.append('categorie', categorie);
      formData.append('statut', statut);
      formData.append('ville', ville);
      formData.append('description', description);
      formData.append('image', imageInput.files[0]);

      try {
        const response = await fetch('http://localhost:3001/api/annonces_livres', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });

        const textResponse = await response.text(); // Lire la réponse comme du texte brut
        console.log('Réponse brute du serveur (soumission annonce):', textResponse); // Afficher la réponse brute dans la console
        const result = JSON.parse(textResponse);

        if (!response.ok) {
          throw new Error(result.message || 'Erreur lors de l\'enregistrement du livre');
        }

        // Afficher le message de confirmation
        confirmationMessage.style.display = 'block';

        // Redirection après un délai
        setTimeout(() => {
          window.location.href = 'BookSwipe.html';
        }, 2000);
      } catch (error) {
        console.error("Erreur lors de la soumission:", error);
        errorMessage.textContent = `Une erreur est survenue: ${error.message}`;
        errorMessage.style.display = 'block';
        buttonText.style.display = 'inline';
        loadingElement.style.display = 'none';
      }
    });
  }
});
