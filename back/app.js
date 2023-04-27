// Importation des modules nécessaires
const express = require('express'); // framework Node.js pour créer des applications web
const bodyParser = require('body-parser'); // middleware pour parser les corps de requêtes HTTP
const mongoose = require('mongoose'); // module pour interagir avec MongoDB
mongoose.set('strictQuery', true); // utilisation des requêtes strictes

const path = require('path'); // module pour manipuler les chemins d'accès aux fichiers
const cors = require('cors'); // middleware pour gérer les en-têtes CORS
const dotenv = require("dotenv"); 
dotenv.config();

// Importation des routes
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

// Initialisation de l'application Express
const app = express();

// Connexion à la base de données MongoDB
mongoose.connect(`${process.env.MONGO_URI}`,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Configuration des middlewares
app.use(bodyParser.json()); // parser les corps de requêtes HTTP en JSON
app.use(cors()); // permettre les requêtes cross-origin (CORS)
app.use('/images', express.static(path.join(__dirname, 'images'))); // servir les images statiques

// Configuration des en-têtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // autoriser toutes les origines
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Expose-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // autoriser les en-têtes spécifiés
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // autoriser les méthodes HTTP spécifiées
  // res.setHeader('Access-Control-Expose-Headers', 'Content-Type, Authorization'); // autoriser l'exposition des en-têtes spécifiés
  next();
});

// Configuration des routes
app.use('/api/auth', userRoutes); // routes liées à l'authentification des utilisateurs
app.use('/api/sauces', saucesRoutes); // routes liées aux sauces

// Exportation de l'application
module.exports = app;


