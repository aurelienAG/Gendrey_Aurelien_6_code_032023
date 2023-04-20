const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const path = require('path');
const cors = require('cors'); // Importer cors

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces.route');

const app = express();

mongoose.connect('mongodb+srv://AurelienGendrey:Peanut1989$@cluster0.qamdhy1.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cors()); // Utiliser cors pour ajouter les en-têtes CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes); 
 
module.exports = app;


