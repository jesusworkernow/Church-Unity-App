// routes/churches.js - CRUD and search for churches
const express = require('express');
const model = require('../models/churchModel');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Create
// Example: POST /api/churches
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('denomination').notEmpty().withMessage('Denomination is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('contact_email').isEmail().withMessage('Valid email is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, denomination, city, country, contact_email } = req.body;
    if (!name || !denomination || !city || !country || !contact_email) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    try {
      const church = await model.createChurch(req.body);
      res.status(201).json(church);
    } catch (err) {
      console.error('Error creating church:', err);
      res.status(500).json({ error: 'Failed to create church' });
    }
  }
);

// Read all
// Example: GET /api/churches
router.get('/', async (req, res) => {
  try {
    const churches = await model.getAllChurches();
    res.json(churches);
  } catch (err) {
    console.error('Error fetching churches:', err);
    res.status(500).json({ error: 'Failed to fetch churches' });
  }
});

// Read a single church by ID
// Example: GET /api/churches/1
router.get('/:id', async (req, res) => {
  try {
    const church = await model.getChurchById(req.params.id);
    if (!church) return res.status(404).json({ error: 'Church not found' });
    res.json(church);
  } catch (err) {
    console.error('Error fetching church:', err);
    res.status(500).json({ error: 'Failed to fetch church' });
  }
});

// Update
// Example: PUT /api/churches/1
router.put('/:id', async (req, res) => {
  try {
    const church = await model.updateChurch(req.params.id, req.body);
    if (!church) return res.status(404).json({ error: 'Church not found' });
    res.json(church);
  } catch (err) {
    console.error('Error updating church:', err);
    res.status(500).json({ error: 'Failed to update church' });
  }
});

// Delete
// Example: DELETE /api/churches/1
router.delete('/:id', async (req, res) => {
  try {
    const church = await model.deleteChurch(req.params.id);
    if (!church) return res.status(404).json({ error: 'Church not found' });
    res.json({ message: 'Church deleted' });
  } catch (err) {
    console.error('Error deleting church:', err);
    res.status(500).json({ error: 'Failed to delete church' });
  }
});

// Search
// Example: GET /api/churches/search?city=NewYork
router.get('/search', async (req, res) => {
  try {
    const churches = await model.searchChurches(req.query);
    res.json(churches);
  } catch (err) {
    console.error('Error searching churches:', err);
    res.status(500).json({ error: 'Failed to search churches' });
  }
});

module.exports = router;
