const jwt = require('jsonwebtoken');
const config = require('../config');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    // Récupérer le token de l'en-tête "Authorization" de la requête
    const token = req.headers.authorization.split(' ')[1];
    console.log('token:', token);
    
    // Décoder le token à l'aide de la clé secrète JWT
    const decodedToken = jwt.verify(token, `${config.JWT_SECRET}`);
    console.log('decodedToken:', decodedToken);
    
    // Récupérer l'ID de l'utilisateur à partir du token décodé
    const userId = decodedToken.userId;
    
    // Vérifier si l'ID de l'utilisateur dans la requête correspond à celui dans le token décodé
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      // Si l'ID de l'utilisateur est valide, ajouter le token et l'ID de l'utilisateur à la requête
      req.body.token = token;
      req.body.user = userId;
      next();
    }
  } catch (error) {
    // Si une erreur se produit pendant la vérification du token, renvoyer une réponse d'erreur 401
    res.status(401).json({ error: error });
  }
};

