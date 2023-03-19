const express = require('express'); 
const mongoose = require('mongoose');
const app = express(); 

mongoose.connect('mongodb+srv://AurelienGendrey:Peanut1989$@cluster0.qamdhy1.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


module.exports = app; 

