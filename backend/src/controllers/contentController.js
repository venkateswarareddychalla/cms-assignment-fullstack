const Page = require('../models/Page');

// @route   GET /api/v1/content
// @desc    Get all pages
// @access  Public
exports.getPages = async (req, res, next) => {
  try {
    const pages = await Page.find().select('title slug createdAt updatedAt');
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
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
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
    const page = await Page.create(req.body);
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/v1/content/:id
// @desc    Update a page
// @access  Private
exports.updatePage = async (req, res, next) => {
  try {
    let page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    page = await Page.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/v1/content/:id
// @desc    Delete a page
// @access  Private
exports.deletePage = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    await page.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
