const adsModel = require('../models/ads');

// Contrôleur pour récupérer toutes les annonces
const getAds = async (req, res) => {
  try {
    const ads = await adsModel.getAllAds();
    res.json(ads);
  } catch (err) {
    console.error('Error fetching ads in controller:', err);
    res.status(500).send('Error fetching ads');
  }
};

// Contrôleur pour récupérer une annonce par ID
const getAdById = async (req, res) => {
  const { id } = req.params;
  try {
    const ad = await adsModel.getAdById(id);
    if (!ad) {
      return res.status(404).send({ message: 'Ad not found' });
    }
    res.json(ad);
  } catch (err) {
    console.error('Error fetching ad details:', err);
    res.status(500).send({ message: 'Server error' });
  }
};

// Contrôleur pour mettre à jour le statut d'une candidature
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const result = await adsModel.updateApplicationStatus(id, status);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Error updating application status' });
  }
};

// Contrôleur pour récupérer les offres d'emploi
const getJobOffers = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobOffers = await adsModel.getJobOffers(userId);
    if (jobOffers.length === 0) {
      return res.status(404).json({ message: 'No job offers found' });
    }
    res.json(jobOffers);
  } catch (error) {
    console.error('Error fetching job offers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Contrôleur pour créer une nouvelle offre d'emploi
const createJobOffer = async (req, res) => {
  try {
    const { title, description, salary, location, working_time } = req.body;
    const userId = req.user.id;
    await adsModel.createJobOffer(
      userId,
      title,
      description,
      salary,
      location,
      working_time
    );
    res.status(201).json({ message: 'Job offer created successfully' });
  } catch (error) {
    console.error('Error creating job offer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAds,
  getAdById,
  updateApplicationStatus,
  getJobOffers,
  createJobOffer,
};
