const jwt = require('jsonwebtoken');
const JWT_SECRET =
  '5cef06b29f9589d4c4beff7ee4864334ca6ffde7b136f42f4237a3e8f349ff00cbecf8ee703b1a925dc52c968c40cc253cc0307aec47483ea89d1d0f5c2ab0a06e5e93cef692c0af10f3eccd57782d564a0476b8494502c35ed1058eb46094ed39abea11110e65ed1f992a728ed7ea9945ec291a4deb75c8ce45beef07e88589';

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Authorization denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Erreur lors de la vérification du token:', error);
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired, please login again' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

// secure the route for admin page by checking if the user is an admin
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden, admin access only' });
  }
  next();
};

module.exports = { auth, adminAuth };
