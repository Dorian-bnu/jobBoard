// backend/routes/ads.js
const express = require('express');
const router = express.Router();
const adsController = require('../controllers/ads');
const { auth } = require('../middleware/auth');

// Route pour récupérer toutes les annonces
router.get('/getads', adsController.getAds);

// Route pour récupérer les détails d'une annonce par ID
router.get('/getads/:id', adsController.getAdById);

// Route pour mettre à jour le statut d'une candidature
router.put('/:id/status', auth, adsController.updateApplicationStatus);

// Route pour obtenir les offres d'emploi par le manager
router.get('/joboffers', auth, adsController.getJobOffers);

// Route pour créer une offre d'emploi
router.post('/joboffers', auth, adsController.createJobOffer);

module.exports = router;
