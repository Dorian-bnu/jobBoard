// backend/controllers/admin.js
const {
  getAllUsersWithoutResume: getAllUsersModel,
  createUser: createUserModel,
  findUserById,
  updateUserById,
  deleteUserById,
} = require('../models/user');
const {
  getAllAds: getAllAdsModel,
  createAd: createAdModel,
  findAdById,
  updateAdById,
  deleteAdById,
} = require('../models/ads');

// Contrôleur pour récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
        try {
            const users = await getAllUsersModel(page, limit);
            res.json(users);
        } catch (err) {
            console.error('Error fetching users in controller:', err);
            res.status(500).json({ message: 'Error fetching users' });
        }
};

// Contrôleur pour créer un utilisateur
const createUser = async (req, res) => {
  const { firstName, lastName, email, role, password } = req.body;

  if (!firstName || !lastName || !email || !role || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newUser = await createUserModel(
      firstName,
      lastName,
      email,
      role,
      password
    );
    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('Error creating user in controller:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Contrôleur pour mettre à jour un utilisateur
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await updateUserById(id, updateData);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user in controller:', err);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Contrôleur pour supprimer un utilisateur
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await deleteUserById(id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user in controller:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Contrôleur pour récupérer toutes les annonces
const getAllAds = async (req, res) => {
  try {
    const ads = await getAllAdsModel();
    res.json(ads);
  } catch (err) {
    console.error('Error fetching ads in controller:', err);
    res.status(500).json({ message: 'Error fetching ads' });
  }
};

// Contrôleur pour créer une nouvelle annonce
const createAd = async (req, res) => {
  const { title, description, companyId } = req.body;

  if (!title || !description || !companyId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newAd = await createAdModel(title, description, companyId);
    res.status(201).json({ message: 'Ad created successfully', ad: newAd });
  } catch (err) {
    console.error('Error creating ad in controller:', err);
    res.status(500).json({ message: 'Error creating ad' });
  }
};

// Contrôleur pour mettre à jour une annonce
const updateAd = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const ad = await findAdById(id);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    await updateAdById(id, updateData);
    res.json({ message: 'Ad updated successfully' });
  } catch (err) {
    console.error('Error updating ad in controller:', err);
    res.status(500).json({ message: 'Error updating ad' });
  }
};

// Contrôleur pour supprimer une annonce
const deleteAd = async (req, res) => {
  const { id } = req.params;

  try {
    const ad = await findAdById(id);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    await deleteAdById(id);
    res.json({ message: 'Ad deleted successfully' });
  } catch (err) {
    console.error('Error deleting ad in controller:', err);
    res.status(500).json({ message: 'Error deleting ad' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllAds,
  createAd,
  updateAd,
  deleteAd,
};
