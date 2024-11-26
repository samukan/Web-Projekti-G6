CREATE USER 'admin'@'localhost' IDENTIFIED BY 'hashedpassword1';
GRANT ALL PRIVILEGES ON ravintola_db.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
SELECT * FROM Users WHERE email = 'admin@example.com';

-- ALTER TABLE MenuItems ADD COLUMN popular BOOLEAN DEFAULT FALSE;
-- UPDATE MenuItems SET popular = 1;