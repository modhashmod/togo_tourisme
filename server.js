require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api', apiRoutes);

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve destinations.html
app.get('/destinations', (req, res) => {
    res.sendFile(path.join(__dirname, 'destinations.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ success: false, error: 'Erreur serveur interne' });
});

// Start server
app.listen(PORT, () => {
    const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS &&
        process.env.EMAIL_USER !== 'votre-email@gmail.com';

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║          🇹🇬 TOGO TOURISM SERVER RUNNING 🇹🇬              ║
╠═══════════════════════════════════════════════════════════╣
║  🌐 Local:      http://localhost:${PORT}                     ║
║  📡 API:        http://localhost:${PORT}/api                 ║
║  📧 Email:      ${emailConfigured ? '✅ Configured' : '⚠️  Not configured (check .env)'}             ║
╠═══════════════════════════════════════════════════════════╣
║  📌 Endpoints disponibles:                                ║
║     POST /api/contact     - Envoyer un message            ║
║     POST /api/newsletter  - S'inscrire à la newsletter    ║
║     GET  /api/contacts    - Liste des contacts            ║
║     GET  /api/newsletters - Liste des abonnés             ║
║     POST /api/test-email  - Tester la configuration email ║
╚═══════════════════════════════════════════════════════════╝
    `);

    if (!emailConfigured) {
        console.log(`
⚠️  CONFIGURATION EMAIL REQUISE:
   1. Ouvrez le fichier .env
   2. Remplacez EMAIL_USER par votre Gmail
   3. Créez un App Password sur https://myaccount.google.com/apppasswords
   4. Remplacez EMAIL_PASS par le mot de passe d'application
   5. Redémarrez le serveur avec: npm start
        `);
    }
});

module.exports = app;
