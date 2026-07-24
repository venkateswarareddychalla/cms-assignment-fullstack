const express = require('express');
const {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage
} = require('../controllers/contentController');
const protectRoute = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getPages);
router.get('/:slug', getPage);

// Protected administrative routes
router.post('/', protectRoute, createPage);
router.put('/:id', protectRoute, updatePage);
router.delete('/:id', protectRoute, deletePage);

module.exports = router;
