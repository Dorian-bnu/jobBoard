// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllAds,
  createAd,
  updateAd,
  deleteAd,
} = require('../controllers/admin');
console.log({
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllAds,
  createAd,
  updateAd,
  deleteAd,
});

const { auth, adminAuth } = require('../middleware/auth');

// Vérification des routes pour les utilisateurs
router.get('/users', auth, adminAuth, getAllUsers);
router.post('/users', auth, adminAuth, createUser);
router.put('/users/:id', auth, adminAuth, updateUser);
router.delete('/users/:id', auth, adminAuth, deleteUser);

// Vérification des routes pour les annonces
router.get('/ads', auth, adminAuth, getAllAds);
router.post('/ads', auth, adminAuth, createAd);
router.put('/ads/:id', auth, adminAuth, updateAd);
router.delete('/ads/:id', auth, adminAuth, deleteAd);

module.exports = router;
