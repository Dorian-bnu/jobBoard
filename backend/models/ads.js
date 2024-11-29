const pool = require('../db');

// Fonction pour récupérer toutes les annonces
const getAllAds = async () => {
  try {
    const connection = await pool.getConnection();
    const rows = await connection.query(`
      SELECT advertisements.*, companies.logo_url 
      FROM advertisements 
      JOIN companies ON advertisements.company_id = companies.id
    `);
    connection.release();
    return rows;
  } catch (err) {
    console.error('Error fetching ads from model:', err);
    throw err;
  }
};

// Fonction pour récupérer une annonce par ID
const getAdById = async (id) => {
  try {
    const connection = await pool.getConnection();
    const [ad] = await connection.query(
      'SELECT * FROM advertisements WHERE id = ?',
      [id]
    );
    connection.release();
    return ad;
  } catch (err) {
    console.error('Error fetching ad by ID from model:', err);
    throw err;
  }
};

// Fonction pour mettre à jour le statut d'une candidature
const updateApplicationStatus = async (id, status) => {
  try {
    const validStatuses = ['submitted', 'in_review', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    const result = await pool.query(
      'UPDATE job_applications SET status = ? WHERE id = ?',
      [status, id]
    );
    return result;
  } catch (error) {
    console.error('Error updating application status in model:', error);
    throw error;
  }
};

// Fonction pour récupérer les offres d'emploi d'un utilisateur
const getJobOffers = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT advertisements.*, COUNT(job_applications.id) AS application_count
      FROM advertisements
      LEFT JOIN job_applications ON advertisements.id = job_applications.advertisement_id
      WHERE advertisements.company_id = (
        SELECT id FROM companies WHERE people_id = ?
      )
      GROUP BY advertisements.id`,
      [userId]
    );
    return result.map((row) => ({
      ...row,
      id: row.id.toString(),
      application_count: row.application_count.toString(),
    }));
  } catch (error) {
    console.error('Error fetching job offers from model:', error);
    throw error;
  }
};

// Fonction pour créer une nouvelle offre d'emploi
const createJobOffer = async (
  userId,
  title,
  description,
  salary,
  location,
  working_time
) => {
  try {
    const companyQuery = await pool.query(
      'SELECT id FROM companies WHERE people_id = ?',
      [userId]
    );
    if (companyQuery.length === 0) {
      throw new Error('Company not found for this manager');
    }
    const companyId = companyQuery[0].id;

    await pool.query(
      'INSERT INTO advertisements (title, description, salary, location, company_id, working_time) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, salary, location, companyId, working_time]
    );
  } catch (error) {
    console.error('Error creating job offer in model:', error);
    throw error;
  }
};

module.exports = {
  getAllAds,
  getAdById,
  updateApplicationStatus,
  getJobOffers,
  createJobOffer,
};
