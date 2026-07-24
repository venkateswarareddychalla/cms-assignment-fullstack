const express = require('express');
const { loginAdmin, getMe } = require('../controllers/authController');
const protectRoute = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protectRoute, getMe);

module.exports = router;
