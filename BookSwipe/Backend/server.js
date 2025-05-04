const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const port = 3001;
const jwtSecret = 'votre_clé_secrète_très_longue';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '100mb', strict: false }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

// Connexion PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432
});

// ========== AUTH ==========

// Inscription
app.post('/api/register', async (req, res) => {
  const { nom, email, mot_de_passe } = req.body;
  const emailLower = email.toLowerCase();
  try {
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    await pool.query(
      'INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES ($1, $2, $3)',
      [nom, emailLower, hashedPassword]
    );
    res.status(201).json({ message: 'Inscription réussie' });
  } catch (err) {
    console.error('Erreur inscription :', err.message);
    res.status(500).json({ error: 'Erreur lors de l’inscription' });
  }
});

// Connexion
app.post('/api/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;
  const emailLower = email.toLowerCase();
  try {
    const result = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [emailLower]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé' });

    const isValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isValid) return res.status(401).json({ error: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });
    res.json({ message: 'Connexion réussie', token });
  } catch (err) {
    console.error('Erreur connexion :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Middleware JWT (à utiliser si tu veux protéger des routes)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Exemple route protégée
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: `Bienvenue ${req.user.email}` });
});

// ========== ROUTES EXISTANTES ==========

// Récupérer les titres populaires
app.get('/api/Livres_Populaires', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Livres_Populaires"');
    console.log('Réponse Livres_Populaires:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur Livres_Populaires:', err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer toutes les annonces de livres
app.get('/api/annonces_livres', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "annonces_livres" ORDER BY date_ajout DESC');
    console.log('Réponse annonces_livres:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur annonces_livres:', err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Ajouter une annonce avec image
app.post('/api/annonces_livres', authenticateToken, upload.single('image'), async (req, res) => {
  const { titre, auteur, categorie, statut, ville, description } = req.body;
  const date_ajout = new Date().toISOString();
  let image = null;

  if (req.file) {
    image = req.file.buffer.toString('base64');
  }

  if (statut !== 'Neuf' && statut !== 'Occasion') {
    return res.status(400).json({ error: "Statut invalide. Doit être 'Neuf' ou 'Occasion'." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO annonces_livres (titre, auteur, categorie, statut, ville, description, date_ajout, utilisateur_id, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [titre, auteur, categorie, statut, ville, description, date_ajout, req.user.id, image]
    );
    res.status(201).json({
      success: true,
      message: "Annonce ajoutée avec succès",
      id: result.rows[0].id
    });
  } catch (err) {
    console.error('Erreur insertion annonce :', err.message);
    res.status(500).json({ success: false, message: "Erreur insertion", error: err.message });
  }
});

// Recherche de villes pour suggestions
app.get('/api/adresse', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Le paramètre 'query' est requis" });
  }

  try {
    const result = await pool.query(
      `SELECT DISTINCT "nom_de_la_commune" as "Nom_de_la_commune", "code_postal" as "Code_postal"
       FROM "adresse"
       WHERE "nom_de_la_commune" ILIKE $1
       LIMIT 5`, [query + '%']
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur recherche adresse :', err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer les informations de l'utilisateur
app.get('/api/user_info', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT nom, email FROM utilisateurs WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur récupération informations utilisateur :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Changer le mot de passe
app.post('/api/change_password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const result = await pool.query('SELECT mot_de_passe FROM utilisateurs WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.mot_de_passe);
    if (!isValid) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE utilisateurs SET mot_de_passe = $1 WHERE id = $2', [hashedPassword, req.user.id]);

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur changement mot de passe :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Annonces d'un utilisateur spécifique
app.get('/api/annonces_utilisateur', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM annonces_livres WHERE utilisateur_id = $1 ORDER BY date_ajout DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur récupération annonces utilisateur :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ========== LANCEMENT SERVEUR ==========
app.listen(port, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${port}`);
});
