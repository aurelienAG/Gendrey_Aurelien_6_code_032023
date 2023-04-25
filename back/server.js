// Importation des modules nécessaires
const http = require('http'); // module pour créer un serveur HTTP
const app = require('./app'); // fichier app.js qui contient l'application Express

// Fonction pour normaliser le numéro de port
const normalizePort = val => {
  const port = parseInt(val, 10); // convertir en entier

  if (isNaN(port)) {
    return val; // si ce n'est pas un numéro, retourner la valeur telle quelle
  }
  if (port >= 0) {
    return port; // si c'est un nombre positif, retourner le numéro de port
  }
  return false; // sinon, retourner faux
};

// Configuration du numéro de port
const port = normalizePort(process.env.PORT ||'3000'); // utiliser le numéro de port défini dans les variables d'environnement ou 3000 si non défini
app.set('port', port); // définir le port de l'application Express

// Fonction de gestion des erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error; // si ce n'est pas une erreur de connexion, renvoyer l'erreur
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1); // si les privilèges élevés sont requis, quitter l'application avec code d'erreur 1
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1); // si le port est déjà utilisé, quitter l'application avec code d'erreur 1
      break;
    default:
      throw error; // sinon, renvoyer l'erreur
  }
};

// Création du serveur HTTP
const server = http.createServer(app);

// Gestion des erreurs et démarrage du serveur
server.on('error', errorHandler); // en cas d'erreur, appeler la fonction errorHandler
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // afficher un message dans la console quand le serveur est démarré
});

server.listen(port); // écouter le port défini

