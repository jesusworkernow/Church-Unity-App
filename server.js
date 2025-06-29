// server.js - Main entry for Church Unity App API
// Usage: npm run dev (with nodemon) or npm start

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Routers
const churchRoutes = require('./routes/churches');
const youtubeRoutes = require('./routes/youtube');
const donationRoutes = require('./routes/donations');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Root route
// Example: curl http://localhost:5000/
app.get('/', (req, res) => {
  res.json({ message: 'Church Unity App API is running' });
});

// Test DB connection
// Example: curl http://localhost:5000/api/test-db
app.get('/api/test-db', async (req, res) => {
  const pool = require('./db');
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Mount routers
app.use('/api/churches', churchRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/donations', donationRoutes);

// Serve favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Check for required env vars
const requiredEnvs = ['DATABASE_URL', 'YOUTUBE_API_KEY'];
const missingEnvs = requiredEnvs.filter((key) => !process.env[key]);
if (missingEnvs.length > 0) {
  console.warn('Warning: Missing env vars:', missingEnvs.join(', '));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n====================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`====================================\n`);
});

/*
Example test queries:

# Root
curl http://localhost:5000/

# Test DB
curl http://localhost:5000/api/test-db

# Create church
curl -X POST http://localhost:5000/api/churches -H "Content-Type: application/json" -d '{"name":"First Church","denomination":"Baptist","city":"Boston","country":"USA","contact_email":"info@firstchurch.com"}'

# Get all churches
curl http://localhost:5000/api/churches

# Get church by ID
curl http://localhost:5000/api/churches/1

# Update church
curl -X PUT http://localhost:5000/api/churches/1 -H "Content-Type: application/json" -d '{"name":"Updated Church","denomination":"Baptist","city":"Boston","country":"USA","contact_email":"info@firstchurch.com"}'

# Delete church
curl -X DELETE http://localhost:5000/api/churches/1

# YouTube latest video for church
curl "http://localhost:5000/api/youtube?name=First%20Church"
*/
