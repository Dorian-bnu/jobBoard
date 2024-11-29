// backend/routes/user.js
const express = require('express');
const {
  registerUser,
  loginUser,
  changepwd,
  deleteaccount,
  fetchJobApplications,
  fetchJobOffers,
  jobapply,
  submitApplication,
} = require('../controllers/user');
const { auth } = require('../middleware/auth');
const { getUserRole, getUserProfile } = require('../models/user');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

//route envoie job application
router.post('/job', auth, upload.single('cv'), submitApplication);

// Route d'inscription
router.post('/register', upload.single('resume'), registerUser);

// Route de connexion
router.post('/login', loginUser);

//Route modification pwd
router.post('/changepwd', auth, changepwd);

// Route pour supprimer le compte
router.delete('/deleteaccount', auth, deleteaccount);

//Route pour obtenir le role
router.get('/info', auth, getUserRole);

// Route for fetching job applications for an applicant
router.get('/applications', auth, fetchJobApplications);

// Route for fetching job offers for a manager
router.get('/offers', auth, fetchJobOffers);

// Route protégée pour obtenir les informations de l'utilisateur connecté
router.get('/profile', auth, getUserProfile);

//Route pour job application
router.post('/jobapplication', auth, jobapply);

module.exports = router;
