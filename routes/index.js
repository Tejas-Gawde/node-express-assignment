const express = require('express');
const router = express.Router();
const School = require('../models/school');

/**
 * @route POST /addSchool
 * @description Add a new school to the database
 * @access Public
 * @param {string} name - The name of the school
 * @param {string} address - The address of the school
 * @param {number} latitude - The latitude of the school location
 * @param {number} longitude - The longitude of the school location
 * @returns {object} - Success message and school ID or error details
 */
router.post('/addSchool', async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validate input
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Latitude and longitude must be numbers' });
    }

    // Convert latitude and longitude to floats
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Attempt to create a new school entry
    const schoolId = await School.create(name, address, lat, lon);
    res.status(201).json({ message: 'School added successfully', schoolId });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ error: 'An error occurred while adding the school' });
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

    // Attempt to fetch and sort schools by proximity
    const schools = await School.findAllSortedByProximity(lat, lon);
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'An error occurred while fetching schools' });
  }
});

module.exports = router;
