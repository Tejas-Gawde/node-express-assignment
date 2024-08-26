const express = require('express');
const router = express.Router();
const School = require('../models/school');

/**
 * @route GET /
 * @description Landing point of the API
 * @access Public
 * @returns {object} - Welcome message
 */
router.get('/', (req, res) => {
  try {
    res.json({ message: 'Welcome to the School Finder API' });
  } catch (error) {
    console.error('Error on landing route:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

/**
 * @route POST /addSchool
 * @description Add a new school to the database
 * @access Public
 * @param {string} name - The name of the school
 * @param {string} address - The address of the school
 * @param {number} latitude - The latitude of the school location
 * @param {number} longitude - The longitude of the school location
 * @returns {object} - Success message and school object or error details
 */
router.post('/addSchool', async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Check if the request body is empty
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ error: 'All fields (name, address, latitude, longitude) are required' });
    }

    // Validate input types
    if (typeof name !== 'string' || typeof address !== 'string') {
      return res.status(400).json({ error: 'Name and address must be strings' });
    }
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Latitude and longitude must be numbers' });
    }

    // Convert latitude and longitude to floats
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Validate geographical limits
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({ error: 'Latitude and longitude must be within valid ranges' });
    }

    // Attempt to create a new school entry
    const schoolInfo = await School.create(name, address, lat, lon);
    res.status(201).json({ message: 'School added successfully', schoolInfo });
  } catch (error) {
    console.error('Error adding school:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'School with the same name already exists' });
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      res.status(400).json({ error: 'Invalid fields or data format' });
    } else {
      res.status(500).json({ error: 'An error occurred while adding the school' });
    }
  }
});

/**
 * @route GET /listSchools
 * @description List schools sorted by proximity to a given location
 * @access Public
 * @param {number} latitude - Latitude of the reference location
 * @param {number} longitude - Longitude of the reference location
 * @returns {object[]} - List of schools sorted by proximity or error details
 */
router.get('/listSchools', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Validate input
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Latitude and longitude must be numbers' });
    }

    // Convert latitude and longitude to floats
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Validate geographical limits
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({ error: 'Latitude and longitude must be within valid ranges' });
    }

    // Attempt to fetch and sort schools by proximity
    const schools = await School.findAllSortedByProximity(lat, lon);
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'An error occurred while fetching schools' });
  }
});

module.exports = router;
