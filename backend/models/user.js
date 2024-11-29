const pool = require('../db');
const bcrypt = require('bcryptjs');

// Fonction pour créer un utilisateur
const createUser = async (firstName, lastName, email, role, password, resume) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO people (first_name, last_name, email, password, role, resume) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, role, resume]
    );
  } catch (error) {
    console.error('Error inserting user into database:', error);
    throw error;
  }
};

// Fonction pour trouver un utilisateur par email
const findUserByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM people WHERE email = ?', [email]);

    // Directement retourner l'objet utilisateur s'il existe
    return result && result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Erreur lors de la requête à la base de données:', error);
    throw error;
  }
};

// Fonction pour lister tous les utilisateurs
const getAllUsers = async () => {
  try {
    const result = await pool.query('SELECT * FROM people');
    return result;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

const getAllUsersWithoutResume = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const [results, totalResult] = await Promise.all([
      pool.query(
        'SELECT id, first_name, last_name, email, role, password FROM people LIMIT ? OFFSET ?',
        [limit, offset]
      ),
      pool.query('SELECT COUNT(*) AS total FROM people')
    ]);

    // Convertir le total en nombre si c'est un BigInt
    const total = Number(totalResult[0].total);
    return {
      users: results,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};



//fonction pour trouver l'user via l'id
const findUserById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM people WHERE id = ?', [id]);

    // Directement retourner l'objet utilisateur s'il existe
    return result && result.length > 0 ? result[0] : null;
  } catch (error) {
    throw error;
  }
};

// Fonction pour supprimer un utilisateur par son ID
const deleteUserById = async (userId) => {
  try {
    await pool.query('DELETE FROM people WHERE id = ?', [userId]);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    throw error;
  }
};

//Fonction pour trouver le role d'un user
const findUserRoleById = async (userId) => {
  try {
    const result = await pool.query('SELECT role FROM people WHERE id = ?', [userId]);
    // Return the role if found
    return result && result.length > 0 ? result[0].role : null;
  } catch (error) {
    console.error('Erreur lors de la récupération du rôle:', error);
    throw error;
  }
};

// Fonction pour obtenir le profil de l'utilisateur
async function getUserProfile(req, res) {
  try {
    const email = req.user.email; // Récupérer l'email de l'utilisateur depuis le token
    const user = await findUserByEmail(email); // Utilisation de la fonction findUserByEmail
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Retourne les informations de l'utilisateur
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getUserRole(req, res) {
  const userId = req.user.id;
  try {
    const result = await pool.query('SELECT role FROM people WHERE id = ?', [userId]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'User role not found' });
    }

    const role = result[0].role;
    res.json({ role });
  } catch (error) {
    console.error('Erreur lors de la récupération du rôle utilisateur:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const updateUserById = async (id, updateData) => {
  try {
    await pool.query('UPDATE people SET ? WHERE id = ?', [updateData, id]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    throw error;
  }
};

module.exports = { createUser, findUserByEmail, getAllUsers, getAllUsersWithoutResume, deleteUserById, findUserRoleById, getUserProfile, getUserRole, updateUserById };
