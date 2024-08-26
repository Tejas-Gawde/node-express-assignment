// Import the database connection
const db = require('../config/database');

/**
 * School class for handling school-related database operations
 */
class School {
    /**
     * Create a new school in the database
     * @param {string} name - The name of the school
     * @param {string} address - The address of the school
     * @param {number} latitude - The latitude coordinate of the school
     * @param {number} longitude - The longitude coordinate of the school
     * @returns {Promise<number>} The ID of the newly created school
     */
    static async create(name, address, latitude, longitude) {
        try {
            const [result] = await db.execute(
                'INSERT INTO school (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
                [name, address, latitude, longitude]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error creating school:', error);
            throw error;
        }
    }

    /**
     * Retrieve all schools from the database
     * @returns {Promise<Array>} An array of all school objects
     */
    static async findAll() {
        try {
            const [rows] = await db.query('SELECT * FROM schools');
            return rows;
        } catch (error) {
            console.error('Error fetching all schools:', error);
            throw error;
        }
    }

    /**
     * Retrieve all schools sorted by proximity to a given location
     * @param {number} userLat - The latitude of the user's location
     * @param {number} userLon - The longitude of the user's location
     * @returns {Promise<Array>} An array of school objects sorted by distance
     */
    static async findAllSortedByProximity(userLat, userLon) {
        try {
            const [rows] = await db.query(
                `SELECT *, 
                (6371 * acos(cos(radians(?)) * cos(radians(latitude)) 
                * cos(radians(longitude) - radians(?)) + sin(radians(?)) 
                * sin(radians(latitude)))) AS distance 
                FROM school 
                ORDER BY distance`,
                [userLat, userLon, userLat]
            );
            return rows;
        } catch (error) {
            console.error('Error fetching schools sorted by proximity:', error);
            throw error;
        }
    }
}

module.exports = School;