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

// Seed default admin user for testing
const seedAdmin = () => {
  try {
    const db = getDB();
    const adminExists = db.prepare('SELECT * FROM admins WHERE username = ?').get('admin');
    if (!adminExists) {
      db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', 'admin123');
      console.log('Default admin seeded (admin / admin123)');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedAdmin();
});

// Export for vercel serverless
module.exports = app;
