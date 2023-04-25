// Importation du modèle Sauce et du module fs pour la gestion des fichiers
const Sauce = require('../models/Sauce');
const fs = require('fs');

// Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
  // Conversion de la chaîne de caractères en objet JavaScript
  const sauceObj = JSON.parse(req.body.sauce);
  // Suppression de l'identifiant généré automatiquement par MongoDB
  delete sauceObj._id;
  // Création d'une instance du modèle Sauce avec les données de la requête
  const sauce = new Sauce({
    ...sauceObj, 
    // Construction de l'URL de l'image en utilisant le protocole et le nom d'hôte de la requête
    // ainsi que le nom du fichier généré par multer lors de l'enregistrement de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
  });
  // Enregistrement de la sauce dans la base de données
  sauce.save()
    .then(() => {
      // Envoi d'une réponse avec le code de statut 201 et un message de succès
      res.status(201).json({
        message: 'Sauce enregistrée !'
      });
      next();
    })
    .catch(error => {
      // Envoi d'une réponse avec le code de statut 400 et l'erreur générée par Mongoose
      res.status(400).json({
        error: error
      });
    });
};


// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
 Sauce.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
 .then(() => res.status(200).json({ message: "Sauce modifiée !"}))
 .catch(error => readSync.status(400).json({error}));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({
            _id: req.params.id
          })
          .then(() => {
            res.status(200).json({
              message: 'Sauce supprimée !'
            });
          })
          .catch(error => {
            res.status(400).json({
              error: error
            });
          });
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
};

//Obtenir toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

// Récupération d'une sauce par son ID
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => {
      res.status(200).json(sauce);
    })
    .catch(error => {
      res.status(404).json({
        error: error
      });
    });
};

exports.likeSauce = (req, res, next) => {
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;

  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      if (like === 1 ) {
        if (!sauce.usersLiked.includes(userId)) {
          sauce.usersLiked.push(userId);
          sauce.likes++;
          // si l'utilisateur a disliké la sauce, on retire son dislike
          if (sauce.usersDisliked.includes(userId)) {
            sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
            sauce.dislikes--;
          }
        } else {
          // si l'utilisateur a déjà liké la sauce, on retire son like
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
          sauce.likes--;
        }
      } else if (like === -1) {
        if (!sauce.usersDisliked.includes(userId)) {
          sauce.usersDisliked.push(userId);
          sauce.dislikes++;
          // si l'utilisateur a liké la sauce, on retire son like
          if (sauce.usersLiked.includes(userId)) {
            sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
            sauce.likes--;
          }
        } else {
          // si l'utilisateur a déjà disliké la sauce, on retire son dislike
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
          sauce.dislikes--;
        }
      } else {
        // si l'utilisateur annule son like ou dislike, on retire son vote
        if (sauce.usersLiked.includes(userId)) {
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
          sauce.likes--;
        }
        if (sauce.usersDisliked.includes(userId)) {
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
          sauce.dislikes--;
        }
      }
      sauce.save()
        .then(() => res.status(200).json({ message: 'Sauce mise à jour !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};

