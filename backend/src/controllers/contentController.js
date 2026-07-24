const { getDB } = require('../config/db');

// @route   GET /api/v1/content
// @desc    Get all pages
// @access  Public
exports.getPages = async (req, res, next) => {
  try {
    const db = getDB();
    const pages = db.prepare('SELECT id, title, slug, createdAt FROM pages').all();
    res.status(200).json({ success: true, count: pages.length, data: pages });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/v1/content/:slug
// @desc    Get single page by slug
// @access  Public
exports.getPage = async (req, res, next) => {
  try {
    const db = getDB();
    const page = db.prepare('SELECT * FROM pages WHERE slug = ?').get(req.params.slug);
    
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    
    page.blocks = JSON.parse(page.blocks); // parse stringified JSON
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/v1/content
// @desc    Create a page
// @access  Private
exports.createPage = async (req, res, next) => {
  try {
    const db = getDB();
    const { title, slug, blocks } = req.body;
    const blocksStr = JSON.stringify(blocks || []);
    
    const info = db.prepare('INSERT INTO pages (title, slug, blocks) VALUES (?, ?, ?)').run(title, slug, blocksStr);
    
    const newPage = db.prepare('SELECT * FROM pages WHERE id = ?').get(info.lastInsertRowid);
    newPage.blocks = JSON.parse(newPage.blocks);
    
    res.status(201).json({ success: true, data: newPage });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/v1/content/:id
// @desc    Update a page
// @access  Private
exports.updatePage = async (req, res, next) => {
  try {
    const db = getDB();
    const { title, slug, blocks } = req.body;
    const blocksStr = JSON.stringify(blocks || []);

    const info = db.prepare('UPDATE pages SET title = ?, slug = ?, blocks = ? WHERE id = ?').run(title, slug, blocksStr, req.params.id);

    if (info.changes === 0) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    const updatedPage = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id);
    updatedPage.blocks = JSON.parse(updatedPage.blocks);

    res.status(200).json({ success: true, data: updatedPage });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/v1/content/:id
// @desc    Delete a page
// @access  Private
exports.deletePage = async (req, res, next) => {
  try {
    const db = getDB();
    const info = db.prepare('DELETE FROM pages WHERE id = ?').run(req.params.id);
    
    if (info.changes === 0) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
