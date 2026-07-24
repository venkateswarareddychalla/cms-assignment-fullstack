const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

let db;

const connectDB = () => {
  try {
    // Vercel serverless functions are read-only except for /tmp
    const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
    const dbPath = isVercel 
      ? path.join('/tmp', 'database.sqlite')
      : path.resolve(__dirname, '../../database.sqlite');
    
    // Connect to SQLite
    db = new Database(dbPath, { verbose: console.log });
    console.log(`SQLite Connected at ${dbPath}`);

    // Create Admins Table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `).run();

    // Create Pages Table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS pages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        blocks TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

  } catch (error) {
    console.error(`Error connecting to SQLite: ${error.message}`);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

module.exports = { connectDB, getDB };
