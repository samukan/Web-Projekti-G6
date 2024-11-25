-- **********************************************
-- OSIO 1: Tietokannan ja taulujen alustaminen
-- **********************************************

-- 1.1 Pudottaa olemassa olevat taulut, jos ne ovat olemassa
DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Roles;

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
  customer_name VARCHAR(255) NOT NULL, -- Lisätty customer_name
  order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Lisätty order_date
  status VARCHAR(50) DEFAULT 'Aktiivinen',
  PRIMARY KEY (order_id)
  -- Poistettu user_id, koska sovelluskoodisi ei käytä sitä
);

-- 2.4 Luo OrderItems-taulu
CREATE TABLE OrderItems (
  order_item_id INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (order_item_id),
  FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
  -- Poistettu product_id, koska sovelluskoodisi ei käytä sitä
);

-- **********************************************
-- OSIO 3: Testidatan lisääminen
-- **********************************************

-- 3.1 Lisää roolit
INSERT INTO Roles (role_name) VALUES ('admin'), ('asiakas');

-- 3.2 Lisää käyttäjiä
INSERT INTO Users (role_id, email, password)
VALUES
  (1, 'admin@example.com', 'hashedpassword1'),
  (2, 'maija@example.com', 'hashedpassword2'),
  (2, 'matti@example.com', 'hashedpassword3');

-- 3.3 Lisää tilauksia

-- Tilauksen 1 lisääminen
INSERT INTO Orders (customer_name, order_date, status)
VALUES
  ('Maija Meikäläinen', NOW(), 'Aktiivinen');

-- Hakee tilauksen 1 order_id
SET @order_id1 = LAST_INSERT_ID();

-- Tilauksen 1 tuotteiden lisääminen
INSERT INTO OrderItems (order_id, product_name, price, quantity)
VALUES
  (@order_id1, 'Pizza Margherita', 10.00, 1),
  (@order_id1, 'Coca Cola', 2.50, 2),
  (@order_id1, 'Tiramisu', 6.40, 1);

-- Tilauksen 2 lisääminen
INSERT INTO Orders (customer_name, order_date, status)
VALUES
  ('Matti Virtanen', NOW(), 'Aktiivinen');

-- Hakee tilauksen 2 order_id
SET @order_id2 = LAST_INSERT_ID();

-- Tilauksen 2 tuotteiden lisääminen
INSERT INTO OrderItems (order_id, product_name, price, quantity)
VALUES
  (@order_id2, 'Kana Kebab', 8.90, 1),
  (@order_id2, 'Coca Cola', 2.50, 1),
  (@order_id2, 'Vesi', 0.00, 1);

-- **********************************************
-- OSIO 4: Käyttötapaukset ja esimerkit
-- **********************************************

-- *** Käyttötapaus 1: Admin haluaa nähdä kaikki aktiiviset tilaukset ***

-- Hakee kaikki aktiiviset tilaukset
SELECT o.order_id, o.customer_name AS asiakas, o.order_date, o.status
FROM Orders o
WHERE o.status = 'Aktiivinen';

-- *** Käyttötapaus 2: Asiakas haluaa nähdä oman tilauksensa yksityiskohdat ***

-- Oletetaan, että Maija haluaa nähdä tilauksensa
SELECT o.order_id, o.customer_name, o.order_date, o.status, oi.product_name, oi.price, oi.quantity
FROM Orders o
JOIN OrderItems oi ON o.order_id = oi.order_id
WHERE o.customer_name = 'Maija Meikäläinen';

-- *** Käyttötapaus 3: Admin haluaa päivittää tilauksen statuksen "Arkistoitu" ***

-- Päivittää tilauksen 1 status "Arkistoitu" tilaan
UPDATE Orders
SET status = 'Arkistoitu'
WHERE order_id = @order_id1;

-- *** Käyttötapaus 4: Admin haluaa poistaa tilauksen ***

-- Poistaa tilauksen 2 ja siihen liittyvät tilausrivit
DELETE FROM Orders WHERE order_id = @order_id2;

-- *** Käyttötapaus 5: Admin haluaa lisätä uuden käyttäjän ***

-- Lisää uuden asiakkaan Laura
INSERT INTO Users (role_id, email, password)
VALUES
  (2, 'laura@example.com', 'hashedpassword4');

-- *** Käyttötapaus 6: Admin haluaa päivittää käyttäjän sähköpostiosoitteen ***

-- Päivittää Maijan sähköpostiosoitteen
UPDATE Users
SET email = 'maija.uusi@example.com'
WHERE email = 'maija@example.com';

-- *** Käyttötapaus 7: Admin haluaa nähdä kaikki käyttäjät ja heidän roolinsa ***

SELECT u.user_id, u.email, r.role_name
FROM Users u
JOIN Roles r ON u.role_id = r.role_id;

-- *** Käyttötapaus 8: Hae tilauksen kokonaishinta ja tuotteiden määrä ***

-- Hakee tilauksen 1 tuotteiden summan ja määrän
SELECT o.order_id, SUM(oi.price * oi.quantity) AS total_price, SUM(oi.quantity) AS total_items
FROM Orders o
JOIN OrderItems oi ON o.order_id = oi.order_id
WHERE o.order_id = @order_id1
GROUP BY o.order_id;

-- *** Käyttötapaus 9: Asiakas haluaa peruuttaa tilauksensa ***

-- Oletetaan, että Maija haluaa peruuttaa tilauksensa
-- Päivitetään tilauksen status "Peruutettu" tilaan
UPDATE Orders
SET status = 'Peruutettu'
WHERE order_id = @order_id1 AND customer_name = 'Maija Meikäläinen';

-- *** Käyttötapaus 10: Admin haluaa hakea tilaukset tietyltä aikaväliltä ***

-- Hakee tilaukset viimeisen 7 päivän ajalta
SELECT o.order_id, o.customer_name AS asiakas, o.order_date, o.status
FROM Orders o
WHERE o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY);

-- Skriptin loppu
