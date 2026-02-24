-- ============================================================
--  ElectroMart - MySQL Database Schema
--  Technology: MySQL 8.x
-- ============================================================

CREATE DATABASE IF NOT EXISTS electromart_db;
USE electromart_db;

-- ─── USERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    role        ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    phone       VARCHAR(20),
    address     TEXT,
    created_at  DATETIME        DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── PRODUCTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id              BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200)    NOT NULL,
    description     TEXT,
    price           DECIMAL(10,2)   NOT NULL,
    stock_quantity  INT             NOT NULL DEFAULT 100,
    category        VARCHAR(100)    NOT NULL,
    brand           VARCHAR(100),
    image_url       VARCHAR(500),
    status          ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── CART ITEMS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
    id          BIGINT  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT  NOT NULL,
    product_id  BIGINT  NOT NULL,
    quantity    INT     NOT NULL DEFAULT 1,
    added_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_product (user_id, product_id)
);

-- ─── SEED DATA ────────────────────────────────────────────────
-- Default Admin (password: admin123)
INSERT INTO users (full_name, email, password, role) VALUES
('swarupa', 'admin@electromart.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN')
ON DUPLICATE KEY UPDATE id = id;

-- Sample Products
INSERT INTO products (name, description, price, stock_quantity, category, brand, image_url) VALUES
('Ear Phone',       'Boat Latest Ear Phone',          399.00,    200,  'Headphones', 'Boat',    '/images/earphone2.png'),
('Acer Laptop',     'Latest Acer Aspire Lite Laptop', 39999.00,  50,   'Laptops',    'Acer',    '/images/acer.jpeg'),
('Rice Cooker',     'Latest Home Appliances',         999.00,    150,  'Appliances', 'Prestige','/images/Rice Cooker.jpg'),
('Apple I Phone',   'Latest iPhone 15 Series',        129999.00, 30,   'Mobiles',    'Apple',   '/images/iphone.jpeg'),
('Asus Laptop',     'Asus Chromebook Latest',         29999.00,  40,   'Laptops',    'Asus',    '/images/Asus.jpeg'),
('Boat BT EarPhone','Latest Best Headphones BT',      1999.00,   300,  'Headphones', 'Boat',    '/images/earphone1.png'),
('Lenovo Laptop',   'Latest Lenovo Laptop',           19999.00,  60,   'Laptops',    'Lenovo',  '/images/Lenovo.jpeg'),
('One Plus 5G',     'OnePlus Nord CE5',               39999.00,  80,   'Mobiles',    'OnePlus', '/images/oneplus.jpeg'),
('Apple MacBook',   'Apple MacBook Air M2',           99999.00,  20,   'Laptops',    'Apple',   '/images/MacBook.jpg'),
('Realme 5G Phone', 'Realme P3x 5G',                 19999.00,  100,  'Mobiles',    'Realme',  '/images/realme.jpeg'),
('Redmi Laptop',    'RedmiBook 15',                  69999.00,  45,   'Laptops',    'Redmi',   '/images/redmi.jpeg'),
('BT Speaker',      'Best Bluetooth Speaker',         5999.00,   200,  'Headphones', 'Boat',    '/images/BT Speaker1.jpg'),
('Coffee Machine',  'Premium Coffee Machine',         3599.00,   80,   'Appliances', 'Philips', '/images/Coffee Machine.jpg'),
('HP Laptop',       'Latest HP Laptop',              55999.00,  35,   'Laptops',    'HP',      '/images/Hp Laptop.jpeg'),
('Induction Stove', 'Smart Induction Stove',         2499.00,   120,  'Appliances', 'Prestige','/images/Induction Stove.jpg')
ON DUPLICATE KEY UPDATE id = id;
