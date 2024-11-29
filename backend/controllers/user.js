const { createUser, findUserByEmail } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserById } = require('../models/user');
const { deleteUserById } = require('../models/user');
const pool = require('../db');

const JWT_SECRET =
  '5cef06b29f9589d4c4beff7ee4864334ca6ffde7b136f42f4237a3e8f349ff00cbecf8ee703b1a925dc52c968c40cc253cc0307aec47483ea89d1d0f5c2ab0a06e5e93cef692c0af10f3eccd57782d564a0476b8494502c35ed1058eb46094ed39abea11110e65ed1f992a728ed7ea9945ec291a4deb75c8ce45beef07e88589'; // Remplacez par une vraie clé secrète

// Fonction d'inscription
const registerUser = async (req, res) => {
  const { firstName, lastName, email, role, password, companyName, companyField, companySize, address, logoUrl } = req.body;
  const resume = req.file ? req.file.buffer : null; // Capture the uploaded CV file

  if (!firstName || !lastName || !email || !role || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const validRoles = ['Applicant', 'Manager'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      message: 'Invalid role. Only "Applicant" or "Manager" is allowed.',
    });
  }

  let connection;
  try {
    const user = await findUserByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const result = await connection.query(
      'INSERT INTO people (first_name, last_name, email, role, password, resume) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, role, hashedPassword, resume]
    );

    const newUserId = result.insertId; 
    if (role === 'Manager') {
      if (!companyName || !companyField || !companySize || !address || !logoUrl) {
        throw new Error('All company fields are required for managers');
      }

      await connection.query(
        'INSERT INTO companies (name, field, company_size, address, logo_url, people_id) VALUES (?, ?, ?, ?, ?, ?)',
        [companyName, companyField, companySize, address, logoUrl, newUserId]
      );
    }

    await connection.commit();

    return res.status(201).json({ message: 'User and company created successfully' });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error during user registration:', error);
    return res.status(500).json({ message: 'Internal server error: ' + error.message });
  } finally {
    if (connection) connection.release();
  }
};

// Fonction de connexion
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('Tentative de connexion avec email:', email);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Correspondance du mot de passe:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '14d' });
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Erreur lors de la tentative de connexion:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const changepwd = async (req, res) => {
  const { password } = req.body;
  console.log('Password received in backend:', password);

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    // Utilisation de la fonction findUserById pour rechercher l'utilisateur par ID
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Mettre à jour le mot de passe de l'utilisateur dans la base de données
    await pool.query('UPDATE people SET password = ? WHERE id = ?', [
      hashedPassword,
      req.user,
    ]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fonction de suppression de compte
const deleteaccount = async (req, res) => {
  try {
    const userId = req.user.id; // récupère l'ID de l'utilisateur depuis le middleware auth
    await deleteUserById(userId); // Appelle la fonction qui supprime l'utilisateur de la base de données
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error while deleting account' });
  }
};

// Fetch job applications for a specific applicant
const fetchJobApplications = async (req, res) => {
  try {
    const userId = req.user.id; // Retrieve the user ID from the auth middleware
    const result = await pool.query(
      `SELECT job_applications.id, job_applications.status, advertisements.title 
       FROM job_applications
       JOIN advertisements ON job_applications.advertisement_id = advertisements.id
       WHERE job_applications.applicant_id = ?`,
      [userId]
    );
    res.json(result); // Send back the list of job applications
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: 'Error fetching job applications' });
  }
};

const fetchJobOffers = async (req, res) => {
  try {
    const userId = req.user.id;
    // Step 1: Get the company ID for the manager (userId corresponds to people.id)
    const companyQuery = await pool.query(
      'SELECT id FROM companies WHERE people_id = ?',
      [userId]
    );

    if (companyQuery.length === 0) {
      return res.status(404).json({ message: 'Company not found for this manager' });
    }
    const companyId = companyQuery[0].id;
    // Step 2: Fetch job offers and associated applications with candidate details
    const result = await pool.query(
      `SELECT advertisements.title, job_applications.id AS application_id, 
              job_applications.status,  job_applications.message, people.first_name, people.last_name, people.resume 
       FROM advertisements 
       LEFT JOIN job_applications ON advertisements.id = job_applications.advertisement_id 
       LEFT JOIN people ON job_applications.applicant_id = people.id
       WHERE advertisements.company_id = ?`,
      [companyId]
    );
    res.json(result); // Send back the list of job offers and associated applications
  } catch (error) {
    console.error('Error fetching job offers and applications:', error);
    res.status(500).json({ message: 'Error fetching job offers and applications' });
  }
};

const jobapply = async (req, res) => {
  try {
    const { advertisementId } = req.body;
    const applicantId = req.user.id;
    await pool.query(
      'INSERT INTO job_applications (advertisement_id, applicant_id, status, application_date) VALUES (?, ?, ?, NOW())',
      [advertisementId, applicantId, 'in_review']
    );

    // Répondre avec un message de succès
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const submitApplication = async (req, res) => {
  const { advertisement_id, message } = req.body;
  const applicant_id = req.user.id;  // L'ID de l'utilisateur est récupéré depuis le token JWT
  const cv_buffer = req.file ? req.file.buffer : null;  // Le fichier est en mémoire sous forme de buffer

  if (!advertisement_id || !message) {
    return res.status(400).json({ message: 'L\'identifiant de l\'annonce et le message sont requis.' });
  }

  try {
    if (cv_buffer) {
      await pool.query(
        'UPDATE people SET resume = ? WHERE id = ?',
        [cv_buffer, applicant_id]
      );
    }

    await pool.query(
      'INSERT INTO job_applications (advertisement_id, applicant_id, message, application_date, status) VALUES (?, ?, ?, NOW(), "submitted")',
      [advertisement_id, applicant_id, message]
    );

    res.status(201).json({ message: 'Candidature envoyée avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la soumission de la candidature:', error);
    res.status(500).json({ message: 'Erreur lors de la soumission de la candidature.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changepwd,
  deleteaccount,
  fetchJobApplications,
  fetchJobOffers,
  jobapply,
  submitApplication
};
