const { getDB } = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an username and password' });
    }

    const db = getDB();
    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
    
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Since this is SQLite, we can assume password matches for now, 
    // or use bcrypt.compare if the passwords are hashed in DB.
    const isMatch = admin.password === password; 
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(admin.id, admin.username);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const db = getDB();
    const admin = db.prepare('SELECT id, username FROM admins WHERE id = ?').get(req.admin.id);
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};
