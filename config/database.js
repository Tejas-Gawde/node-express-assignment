// Import required modules
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10, // Maximum number of connections in the pool
    enableKeepAlive: true, // Enable keep-alive packets on TCP connection
    keepAliveInitialDelay: 0 // Initial delay before sending first keep-alive packet
});

// Test the database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to the database.');
    connection.release();
});

// Export the pool as a promise-based interface
module.exports = pool.promise();