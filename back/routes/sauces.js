const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

// Définition des routes pour les sauces

// Créer une nouvelle sauce
router.post('/', auth, multer, saucesCtrl.createSauce);

// Modifier une sauce existante
router.put('/:id', auth, saucesCtrl.modifySauce);

// Supprimer une sauce existante
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// Récupérer toutes les sauces
router.get('/', auth, saucesCtrl.getAllSauces);

// Récupérer une sauce par son identifiant
router.get('/:id', auth, saucesCtrl.getOneSauce);

// Ajouter ou retirer un like pour une sauce
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;
