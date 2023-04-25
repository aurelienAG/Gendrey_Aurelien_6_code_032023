const multer = require('multer'); 

// Définition des types de fichiers acceptés et de leurs extensions correspondantes
const MIME_TYPES = {
    'image/jpg': 'jpg', 
    'image/jpeg': 'jpg', 
    'image/png': 'png'
};

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
    // Configuration du répertoire de destination des images
    destination: (req, file, callback) => {
        callback(null, 'images')
    }, 
    // Configuration du nom de fichier unique pour chaque image téléchargée
    filename: (req, file, callback) => {
        // Remplacement des espaces par des underscores dans le nom de fichier original
        const name = file.originalname.split(' ').join('_');
        // Récupération de l'extension du fichier à partir de son type MIME
        const extension = MIME_TYPES[file.mimetype];
        // Construction du nom de fichier complet en ajoutant la date actuelle
        callback(null, name + Date.now() + '.' + extension);
    }
}); 

// Export du middleware de multer configuré pour la gestion d'un seul fichier image
module.exports = multer({storage}).single('image');
