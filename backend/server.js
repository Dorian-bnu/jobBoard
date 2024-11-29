const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/user');
const adsRoutes = require('./routes/ads');
const adminRoutes = require('./routes/admin');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Configuration de CORS pour autoriser plusieurs origines
const allowedOrigins = ['http://localhost:8080', 'https://web501.sitam.me'];

app.use(
  cors({
    origin: function (origin, callback) {
      // Autoriser les requêtes sans origin (par exemple, Postman ou des outils locaux)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'L\'origine CORS n\'est pas autorisée.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Si vous avez besoin de partager les cookies entre les domaines
  })
);

// Servir les fichiers statiques du dossier '/app/public'
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/admin', adminRoutes);

// Gérer les routes SPA en redirigeant vers index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
