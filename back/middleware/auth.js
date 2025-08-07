const jwt = require('jsonwebtoken');
const config = require('../config');
require('dotenv').config();
console.log(config);
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
    
    req.auth = {
      userId: userId
    };
    next();
    // Vérifier si l'ID de l'utilisateur dans la requête correspond à celui dans le token décodé

  } catch (error) {
    // Si une erreur se produit pendant la vérification du token, renvoyer une réponse d'erreur 401
    res.status(401).json({ error: error });
  }
};

