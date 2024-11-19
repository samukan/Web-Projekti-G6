// Tämän skriptin avulla Hashataan käyttäjien salasanat tietokannassa.
// Käyttö tapahtuu ajamalla komento "node hashPasswords.js" terminaalissa.

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [users] = await connection.query(
      'SELECT user_id, password FROM Users'
    );
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await connection.query(
        'UPDATE Users SET password = ? WHERE user_id = ?',
        [hashedPassword, user.user_id]
      );
    }
    console.log('Passwords hashed successfully!');
  } catch (error) {
    console.error('Error hashing passwords:', error.message);
  } finally {
    connection.end();
  }
})();
