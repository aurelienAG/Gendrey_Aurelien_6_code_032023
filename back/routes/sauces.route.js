const express = require('express');
const router = express.Router();
const saucesCtrl = require('../controllers/sauces.controller');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


// Définition des routes pour les sauces
router.post('/', multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/', saucesCtrl.getAllSauces);
router.get('/:id', saucesCtrl.getOneSauce);


router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;

