//fichier utilisant dotenv library pour charger les fichiers .env
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
});

// exports pour retrouver les valeurs contenues dans fichier .env
module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,

    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 3000,
};