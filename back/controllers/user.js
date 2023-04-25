// Import des modules nécessaires
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
require('dotenv').config();

// Fonction d'inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  // Utilisation de bcrypt pour hasher le mot de passe de l'utilisateur
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    // Création d'un nouvel utilisateur avec son email et son mot de passe hashé
    const user =  new User({
        email: req.body.email, 
        password: hash
    }); 
    // Sauvegarde du nouvel utilisateur dans la base de données
    user.save()
    .then(() => res.status(201).json({ message: 'Utilisateur créé!'}))
    .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};

// Fonction de connexion d'un utilisateur existant
exports.login = (req, res, next) => {
  // Recherche de l'utilisateur dans la base de données en utilisant son email
  User.findOne({ email: req.body.email })
  .then((user) => {
      if (!user) {
          // Si l'utilisateur n'est pas trouvé, retourne une erreur d'authentification
          return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
      }
      // Utilisation de bcrypt pour comparer le mot de passe fourni avec le mot de passe hashé stocké en base de données
      bcrypt.compare(req.body.password, user.password)
          .then((valid) => {
              if (!valid) {
                  // Si les mots de passe ne correspondent pas, retourne une erreur d'authentification
                  return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
              }
              // Si l'utilisateur est authentifié, génère un token JWT pour cette session de connexion
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    // Encode l'ID de l'utilisateur dans le token pour être sûr que la requête correspond bien à cet utilisateur
                    { userId: user._id },
                    // Clé secrète pour l'encodage du token
                    `${config.JWT_TOKEN_SECRET}`,
                    // Définit la durée de validité du token, au bout de 24h l'utilisateur doit se reconnecter
                    { expiresIn: '24h' }
                ),
              });
          })
          .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};
