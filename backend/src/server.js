const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, getDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/content', require('./routes/contentRoutes'));

// Error handler middleware
app.use(errorHandler);

// Seed default admin user and pages for testing
const seedDatabase = () => {
  try {
    const db = getDB();
    const adminExists = db.prepare('SELECT * FROM admins WHERE username = ?').get('admin');
    if (!adminExists) {
      db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', 'admin123');
      console.log('Default admin seeded (admin / admin123)');
    }

    const pagesExist = db.prepare('SELECT COUNT(*) as count FROM pages').get();
    if (pagesExist.count === 0) {
      // Seed an About Page with rich text, KaTeX, and lists
      const aboutBlocks = [
        { id: '1', type: 'h1', content: 'About RenewCred CMS' },
        { id: '2', type: 'p', content: 'This is a headless CMS built exactly to specifications, supporting rich text, images, and math equations.' },
        { id: '3', type: 'h2', content: 'Features Included:' },
        { id: '4', type: 'list', items: ['Decoupled Architecture', 'Vercel Deployment', 'Rich Block Rendering'] },
        { id: '5', type: 'h2', content: 'Advanced Math (KaTeX)' },
        { id: '6', type: 'math', content: 'c = \\pm\\sqrt{a^2 + b^2}' }
      ];
      db.prepare('INSERT INTO pages (title, slug, blocks) VALUES (?, ?, ?)').run('About Us', 'about-us', JSON.stringify(aboutBlocks));

      // Seed a Contact Page
      const contactBlocks = [
        { id: '1', type: 'h1', content: 'Contact Us' },
        { id: '2', type: 'p', content: 'Reach out to our team at support@renewcred.com' }
      ];
      db.prepare('INSERT INTO pages (title, slug, blocks) VALUES (?, ?, ?)').run('Contact', 'contact', JSON.stringify(contactBlocks));

      console.log('Default pages seeded');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedDatabase();
});

// Export for vercel serverless
module.exports = app;
