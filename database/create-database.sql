-- **********************************************
-- OSIO 1: Tietokannan ja taulujen alustaminen
-- **********************************************

-- 1.1 Pudottaa olemassa olevat taulut, jos ne ovat olemassa
DROP TABLE IF EXISTS Order_Items;
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
  user_id INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'Aktiivinen',
  PRIMARY KEY (order_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- 2.4 Luo Order_Items-taulu
CREATE TABLE Order_Items (
  order_item_id INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (order_item_id),
  FOREIGN KEY (order_id) REFERENCES Orders(order_id)
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
INSERT INTO Orders (user_id, total_price, status)
VALUES
  ((SELECT user_id FROM Users WHERE email = 'maija@example.com'), 21.40, 'Aktiivinen');

-- Hakee tilauksen 1 order_id
SET @order_id1 = LAST_INSERT_ID();

-- Tilauksen 1 tuotteiden lisääminen
INSERT INTO Order_Items (order_id, product_id, product_name, price, quantity)
VALUES
  (@order_id1, 101, 'Pizza Margherita', 10.00, 1),
  (@order_id1, 205, 'Coca Cola', 2.50, 2),
  (@order_id1, 305, 'Tiramisu', 6.40, 1);

-- Tilauksen 2 lisääminen
INSERT INTO Orders (user_id, total_price, status)
VALUES
  ((SELECT user_id FROM Users WHERE email = 'matti@example.com'), 15.90, 'Aktiivinen');

-- Hakee tilauksen 2 order_id
SET @order_id2 = LAST_INSERT_ID();

-- Tilauksen 2 tuotteiden lisääminen
INSERT INTO Order_Items (order_id, product_id, product_name, price, quantity)
VALUES
  (@order_id2, 102, 'Kana Kebab', 8.90, 1),
  (@order_id2, 205, 'Coca Cola', 2.50, 1),
  (@order_id2, 206, 'Vesi', 0.00, 1);

-- **********************************************
-- OSIO 4: Käyttötapaukset ja esimerkit
-- **********************************************

-- *** Käyttötapaus 1: Admin haluaa nähdä kaikki aktiiviset tilaukset ***

-- Hakee kaikki aktiiviset tilaukset ja niiden tekijät
SELECT o.order_id, u.email AS asiakas, o.total_price, o.created_at, o.status
FROM Orders o
JOIN Users u ON o.user_id = u.user_id
WHERE o.status = 'Aktiivinen';

-- *** Käyttötapaus 2: Asiakas haluaa nähdä oman tilauksensa yksityiskohdat ***

-- Oletetaan, että Maija haluaa nähdä tilauksensa
SELECT o.order_id, o.total_price, o.created_at, o.status, oi.product_name, oi.price, oi.quantity
FROM Orders o
JOIN Order_Items oi ON o.order_id = oi.order_id
WHERE o.user_id = (SELECT user_id FROM Users WHERE email = 'maija@example.com');

-- *** Käyttötapaus 3: Admin haluaa päivittää tilauksen statuksen "Arkistoitu" ***

-- Päivittää tilauksen 1 status "Arkistoitu" tilaan
UPDATE Orders
SET status = 'Arkistoitu'
WHERE order_id = @order_id1;

-- *** Käyttötapaus 4: Admin haluaa poistaa tilauksen ***

-- Poistaa tilauksen 2 ja siihen liittyvät tilausrivit
DELETE FROM Order_Items WHERE order_id = @order_id2;
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

-- Hakee tilauksen 1 kokonaishinnan ja tuotteiden määrän
SELECT o.order_id, o.total_price, SUM(oi.quantity) AS total_items
FROM Orders o
JOIN Order_Items oi ON o.order_id = oi.order_id
WHERE o.order_id = @order_id1
GROUP BY o.order_id;

-- *** Käyttötapaus 9: Asiakas haluaa peruuttaa tilauksensa ***

-- Oletetaan, että Maija haluaa peruuttaa tilauksensa
-- Päivitetään tilauksen status "Peruutettu" tilaan
UPDATE Orders
SET status = 'Peruutettu'
WHERE order_id = @order_id1 AND user_id = (SELECT user_id FROM Users WHERE email = 'maija.uusi@example.com');

-- *** Käyttötapaus 10: Admin haluaa hakea tilaukset tietyltä aikaväliltä ***

-- Hakee tilaukset viimeisen 7 päivän ajalta
SELECT o.order_id, u.email AS asiakas, o.total_price, o.created_at, o.status
FROM Orders o
JOIN Users u ON o.user_id = u.user_id
WHERE o.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY);

-- Skriptin loppu
