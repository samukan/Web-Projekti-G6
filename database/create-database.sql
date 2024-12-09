-- Poistetaan ja luodaan tietokanta
DROP DATABASE IF EXISTS ravintola_db;
CREATE DATABASE ravintola_db;
ALTER DATABASE ravintola_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ravintola_db;

-- Luodaan Roles-taulu
CREATE TABLE Roles (
  role_id INT NOT NULL AUTO_INCREMENT,
  role_name VARCHAR(20) NOT NULL UNIQUE,
  PRIMARY KEY (role_id)
) ENGINE=InnoDB;

-- Luodaan Users-taulu (viittaa Roles-tauluun)
CREATE TABLE Users (
  user_id INT NOT NULL AUTO_INCREMENT,
  role_id INT NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  FOREIGN KEY (role_id) REFERENCES Roles(role_id)
) ENGINE=InnoDB;

-- Luodaan MenuItems-taulu
CREATE TABLE MenuItems (
  item_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(255),
  popular TINYINT(1) DEFAULT 0,
  dietary_info VARCHAR(255),
  PRIMARY KEY (item_id)
) ENGINE=InnoDB;

-- Luodaan Orders-taulu
CREATE TABLE Orders (
  order_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Vastaanotettu',
  delivery_address VARCHAR(255) DEFAULT NULL,
  delivery_method VARCHAR(50) DEFAULT 'pickup',
  is_archived TINYINT(1) DEFAULT 0,
  PRIMARY KEY (order_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
) ENGINE=InnoDB;

-- Luodaan OrderItems-taulu
CREATE TABLE OrderItems (
  order_item_id INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (order_item_id),
  FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES MenuItems(item_id)
) ENGINE=InnoDB;

-- Lisää roolit
INSERT INTO Roles (role_name) VALUES ('admin'), ('asiakas'), ('driver');

-- Lisää käyttäjiä
INSERT INTO Users (role_id, email, password)
VALUES
  (1, 'admin@example.com', '123'),
  (2, 'maija@example.com', '1234'),
  (2, 'matti@example.com', '12345'),
  (3, 'driver@example.com', '321');

-- Lisää MenuItems
INSERT INTO MenuItems (name, description, price, category, image_url, popular, dietary_info)
VALUES
  ('Kana Kebab', 'Maukasta kanaa tuoreilla vihanneksilla ja kastikkeella.', 8.90, 'Kebabit', '/images/kana_kebab.jpg', 1, 'Gluteeniton, Laktoositon'),
  ('Naudanliha Kebab', 'Herkullista naudanlihaa mausteisella kastikkeella.', 9.50, 'Kebabit', '/images/naudanliha_kebab.jpg', 0, 'Gluteeniton'),
  ('Falafel', 'Kasvisvaihtoehto kikherneistä valmistettuna.', 7.90, 'Kebabit', '/images/falafel.jpg', 1, 'Vegaaninen, Gluteeniton'),
  ('Kasvis Kebab', 'Maukasta kasvisproteiinia tuoreilla lisukkeilla.', 7.50, 'Kebabit', '/images/kasvis_kebab.jpg', 0, 'Vegaaninen'),
  ('Pizza Margherita', 'Perinteinen italialainen pizza tomaattikastikkeella ja mozzarellajuustolla.', 10.00, 'Pizzat', '/images/pizza_margherita.jpg', 1, 'Kasvis'),
  ('Spaghetti Bolognese', 'Klassinen italialainen pasta-annos naudanlihakastikkeella.', 11.50, 'Pastat', '/images/spaghetti_bolognese.jpg', 0, ''),
  ('Caesar Salaatti', 'Rapea salaatti kanan, krutonkien ja parmesaanin kera.', 9.00, 'Salaatit', '/images/caesar_salaatti.jpg', 0, 'Gluteeniton vaihtoehto saatavilla');