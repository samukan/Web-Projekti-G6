// src/utils/db.ts
// Tietokanta yhteys

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Hakee inffoo env filestä

// Tää tekee altaan tietokantayhteyksille (uima-allas)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;
