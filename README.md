# School Management API

## 📚 Overview

The School Management API is a robust Node.js application designed to help manage school data efficiently. It provides endpoints for adding new schools and retrieving a list of schools sorted by proximity to a specified location.

## 🚀 Features

- Add new schools with details including name, address, latitude, and longitude
- Retrieve a list of all schools
- Get schools sorted by proximity to a given location
- RESTful API design
- MySQL database integration
- Secure environment variable configuration

## 🛠 Tech Stack

- Node.js
- Express.js
- MySQL
- Vercel and AWS RDS for deployment

## 🏁 Getting Started

### Prerequisites

- Node.js (v14 or later)
- MySQL

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/school-management-api.git
   ```

2. Navigate to the project directory:
   ```
   cd school-management-api
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your configuration:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   PORT=your_port
   ```

5. Set up your MySQL database and run the following SQL to create the necessary table:
   ```sql
   CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    UNIQUE (address, latitude, longitude)
   );
   ```

6. Start the server:
   ```
   node app.js
   ```

## 🔧 API Endpoints

- `POST /addSchool`: Add a new school
  - Body: `{ "name": "School Name", "address": "School Address", "latitude": 40.7128, "longitude": -74.0060 }`

- `GET /listSchools`: Get all schools
  - Query parameters: `latitude` and `longitude` for proximity sorting

## 🚀 Deployment

This project is configured for easy deployment on Vercel and the MySQL database was deployed on AWS Relational Database Service. Make sure to set up your environment variables in the Vercel dashboard.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/yourusername/school-management-api/issues).
