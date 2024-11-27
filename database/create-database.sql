-- **********************************************
-- OSIO 1: Tietokannan ja taulujen alustaminen
-- **********************************************

-- 1.1 Pudottaa olemassa olevat taulut, jos ne ovat olemassa
DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS MenuItems;

-- 1.2 Pudottaa olemassa olevan tietokannan ja luo sen uudelleen
DROP DATABASE IF EXISTS ravintola_db;
CREATE DATABASE ravintola_db;
ALTER DATABASE ravintola_db CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
USE ravintola_db;

-- **********************************************
-- OSIO 2: Taulujen luominen
-- **********************************************

-- 2.1 Luo Roles-taulu
CREATE TABLE Roles (
  role_id INT NOT NULL AUTO_INCREMENT,
  role_name VARCHAR(20) NOT NULL UNIQUE,
  PRIMARY KEY (role_id)
);

-- 2.2 Luo Users-taulu
CREATE TABLE Users (
  user_id INT NOT NULL AUTO_INCREMENT,
  role_id INT NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

-- 2.3 Luo Orders-taulu
CREATE TABLE Orders (
  order_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Aktiivinen',
  PRIMARY KEY (order_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- 2.4 Luo OrderItems-taulu
CREATE TABLE OrderItems (
  order_item_id INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (order_item_id),
  FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES MenuItems(item_id)
);

-- 2.5 Luo MenuItems-taulu
CREATE TABLE MenuItems (
  item_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(255),
  popular TINYINT(1) DEFAULT 0,
  PRIMARY KEY (item_id)
);

-- **********************************************
-- OSIO 3: Testidatan lisääminen
-- **********************************************

-- 3.1 Lisää roolit
INSERT INTO Roles (role_name) VALUES ('admin'), ('asiakas');

-- 3.2 Lisää käyttäjiä (muista korvata 'hashedpasswordX' oikeilla hashatuilla salasanoilla)

INSERT INTO Users (role_id, email, password)
VALUES
  (1, 'admin@example.com', 'hashedpassword1'),
  (2, 'maija@example.com', 'hashedpassword2'),
  (2, 'matti@example.com', 'hashedpassword3');

-- 3.3 Lisää tilauksia

-- Tilauksen 1 lisääminen
INSERT INTO Orders (user_id, customer_name, order_date, status)
VALUES
  (2, 'Maija Meikäläinen', NOW(), 'Aktiivinen');

-- Hakee tilauksen 1 order_id
SET @order_id1 = LAST_INSERT_ID();

-- Tilauksen 1 tuotteiden lisääminen
-- Oletetaan, että 'Pizza Margherita' on item_id 5
INSERT INTO OrderItems (order_id, item_id, price, quantity)
VALUES
  (@order_id1, 5, 10.00, 1),
  (@order_id1, 8, 2.50, 2),
  (@order_id1, 9, 6.40, 1);

-- 3.4 Lisää menu items

INSERT INTO MenuItems (name, description, price, category, image_url, popular)
VALUES
  ('Kana Kebab', 'Maukasta kanaa tuoreilla vihanneksilla ja kastikkeella.', 8.90, 'Kebabit', '/images/kana_kebab.jpg', 1),
  ('Naudanliha Kebab', 'Herkullista naudanlihaa mausteisella kastikkeella.', 9.50, 'Kebabit', '/images/naudanliha_kebab.jpg', 0),
  ('Falafel', 'Kasvisvaihtoehto kikherneistä valmistettuna.', 7.90, 'Kebabit', '/images/falafel.jpg', 1),
  ('Kasvis Kebab', 'Maukasta kasvisproteiinia tuoreilla lisukkeilla.', 7.50, 'Kebabit', '/images/kasvis_kebab.jpg', 0),
  ('Pizza Margherita', 'Perinteinen italialainen pizza tomaattikastikkeella ja mozzarellajuustolla.', 10.00, 'Pizzat', '/images/pizza_margherita.jpg', 1),
  ('Spaghetti Bolognese', 'Klassinen italialainen pasta-annos naudanlihakastikkeella.', 11.50, 'Pastat', '/images/spaghetti_bolognese.jpg', 0),
  ('Caesar Salaatti', 'Rapea salaatti kanan, krutonkien ja parmesaanin kera.', 9.00, 'Salaatit', '/images/caesar_salaatti.jpg', 0);

-- Skriptin loppu
