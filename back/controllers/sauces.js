const Sauce = require('../models/Sauce');
const fs = require('fs');

// Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
  try {
    const sauceObj = JSON.parse(req.body.sauce);
    delete sauceObj._id;
    delete sauceObj.userId; // On ignore le userId du front

    const sauce = new Sauce({
      ...sauceObj,
      userId: req.auth.userId, // Toujours depuis le token
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
    });

    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
      .catch(error => res.status(400).json({ error }));
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

  delete sauceObject.userId; // Sécurité

  Sauce.updateOne({ _id: req.params.id, userId: req.auth.userId }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch(error => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ message: "Non autorisé" });
      }
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Obtenir toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

// Récupération d'une sauce par son ID
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// Like / Dislike
exports.likeSauce = (req, res, next) => {
  const sauceId = req.params.id;
  const userId = req.auth.userId; // Toujours depuis le token
  const like = req.body.like;

  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      if (like === 1) {
        if (!sauce.usersLiked.includes(userId)) {
          sauce.usersLiked.push(userId);
          sauce.likes++;
        }
      } else if (like === -1) {
        if (!sauce.usersDisliked.includes(userId)) {
          sauce.usersDisliked.push(userId);
          sauce.dislikes++;
        }
      } else {
        if (sauce.usersLiked.includes(userId)) {
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
          sauce.likes--;
        }
        if (sauce.usersDisliked.includes(userId)) {
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
          sauce.dislikes--;
        }
      }
      return sauce.save();
    })
    .then(() => res.status(200).json({ message: 'Sauce mise à jour !' }))
    .catch((error) => res.status(400).json({ error }));
};

