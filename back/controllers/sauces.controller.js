const Sauce = require('../models/Sauce.model');
const fs = require('fs');


// Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObj = JSON.parse(req.body.sauce);
  delete sauceObj._id;
  const sauce = new Sauce({
    ...sauceObj,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`, 
  });
  sauce.save()
    .then(() => {
      res.status(201).json({
        message: 'Sauce enregistrée !'
      });
      next();
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({
    _id: req.params.id
  });
  if (req.file) {
    sauce = {
      ...sauce,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    };
  }
  sauce = {
    ...sauce,
    userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    heat: req.body.heat,
  };
  Sauce.updateOne({
      _id: req.params.id
    }, sauce)
    .then(() => {
      res.status(200).json({
        message: 'Sauce modifiée !'
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
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


// Gestion des likes et dislikes des sauces
exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  Sauce.findOne({_id: sauceId})
  .then(sauce => {
    switch (like) {
      // Cas où l'utilisateur aime la sauce
      case 1:
        // Si l'utilisateur a déjà aimé la sauce, on ne fait rien
        if (sauce.usersLiked.includes(userId)) {
          res.status(200).json({message: "Vous avez déjà aimé cette sauce"});
        } else {
          // On ajoute l'utilisateur aux personnes ayant aimé la sauce et on met à jour le nombre de likes
          Sauce.updateOne({_id: sauceId}, {$push: {usersLiked: userId}, $inc: {likes: 1}})
            .then(() => res.status(200).json({message: "Vous avez aimé la sauce"}))
            .catch(error => res.status(400).json({error}));
        }
        break;

      // Cas où l'utilisateur n'aime ni n'aime pas la sauce
      case 0:
        // Si l'utilisateur a déjà aimé ou n'aime pas la sauce, on annule son choix
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne({_id: sauceId}, {$pull: {usersLiked: userId}, $inc: {likes: -1}})
            .then(() => res.status(200).json({message: "Vous avez annulé votre like"}))
            .catch(error => res.status(400).json({error}));
        } else if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne({_id: sauceId}, {$pull: {usersDisliked: userId}, $inc: {dislikes: -1}})
            .then(() => res.status(200).json({message: "Vous avez annulé votre dislike"}))
            .catch(error => res.status(400).json({error}));
        }
        break;

      // Cas où l'utilisateur n'aime pas la sauce
      case -1:
        // Si l'utilisateur a déjà disliké la sauce, on ne fait rien
        if (sauce.usersDisliked.includes(userId)) {
          res.status(200).json({message: "Vous avez déjà disliké cette sauce"});
        } else {
          // On ajoute l'utilisateur aux personnes ayant disliké la sauce et on met à jour le nombre de dislikes
          Sauce.updateOne({_id: sauceId}, {$push: {usersDisliked: userId}, $inc: {dislikes: 1}})
            .then(() => res.status(200).json({message: "Vous avez disliké la sauce"}))
            .catch(error => res.status(400).json({error}));
        }
        break;

      default:
        res.status(400).json({message: "Valeur du like invalide"});
    }
  })
  .catch(error => res.status(500).json({error}));
};
