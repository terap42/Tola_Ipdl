const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');
const postRoutes = require('./routes/posts'); // Importez la nouvelle route
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', postRoutes); // Utilisez la nouvelle route

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Serveur exécuté sur le port ${PORT}`);
});
