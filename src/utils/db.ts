// src/utils/db.ts

/**
 * @api {general} /database Database Configuration
 * @apiName Database
 * @apiGroup Configuration
 * @apiVersion 1.0.0
 *
 * @apiDescription MySQL database connection configuration using connection pool
 *
 * Required environment variables:
 * - DB_HOST: Database host address
 * - DB_USER: Database username
 * - DB_PASSWORD: Database password
 * - DB_NAME: Database name
 *
 * @apiError (500) {Object} DatabaseError Connection to database failed
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Database connection failed"
 *     }
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;
