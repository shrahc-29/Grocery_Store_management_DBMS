-- Grocery Store Management System — Database Schema
-- Run this file in MySQL: source schema.sql

CREATE DATABASE IF NOT EXISTS grocery_store_dbms;
USE grocery_store_dbms;

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    category_id   INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id   INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(150) NOT NULL,
    phone         VARCHAR(30),
    email         VARCHAR(150),
    address       TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    product_id     INT AUTO_INCREMENT PRIMARY KEY,
    product_name   VARCHAR(150) NOT NULL,
    category_id    INT,
    price          DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    supplier       VARCHAR(150),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
    customer_id   INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    phone         VARCHAR(30),
    email         VARCHAR(150),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    order_id     INT AUTO_INCREMENT PRIMARY KEY,
    customer_id  INT,
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    order_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    item_id    INT AUTO_INCREMENT PRIMARY KEY,
    order_id   INT NOT NULL,
    product_id INT,
    quantity   INT NOT NULL DEFAULT 1,
    price      DECIMAL(10, 2) NOT NULL,
    subtotal   DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(order_id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
);

-- Seed: Categories
INSERT IGNORE INTO categories (category_id, category_name) VALUES
  (1, 'Fruits'),
  (2, 'Bakery'),
  (3, 'Dairy'),
  (4, 'Vegetables'),
  (5, 'Beverages');

-- Seed: Suppliers
INSERT IGNORE INTO suppliers (supplier_id, supplier_name, phone, email, address) VALUES
  (1, 'Fresh Farms Co.',   '+1-555-0123', 'info@freshfarms.com',    '123 Rural Lane, Farm City, CA 92000'),
  (2, 'Local Bakery',      '+1-555-0456', 'orders@localbakery.com', '456 Main Street, Downtown, CA 92001'),
  (3, 'Farm Direct',       '+1-555-0789', 'contact@farmdirect.com', '789 Countryside Rd, Rural, CA 92002'),
  (4, 'Dairy Plus',        '+1-555-0321', 'sales@dairyplus.com',    '321 Production Ave, Industrial, CA 92003'),
  (5, 'Tropical Imports',  '+1-555-0654', 'imports@tropical.com',   '654 Port Street, Trade Zone, CA 92004');

-- Seed: Products
INSERT IGNORE INTO products (product_id, product_name, category_id, price, stock_quantity, supplier) VALUES
  (1, 'Organic Apples',    1, 4.99,  150, 'Fresh Farms Co.'),
  (2, 'Whole Wheat Bread', 2, 3.49,   12, 'Local Bakery'),
  (3, 'Free Range Eggs',   3, 5.99,   80, 'Farm Direct'),
  (4, 'Broccoli',          4, 2.99,    5, 'Fresh Farms Co.'),
  (5, 'Greek Yogurt',      3, 4.49,   60, 'Dairy Plus'),
  (6, 'Banana Bundle',     1, 1.99,  200, 'Tropical Imports');

-- Seed: Customers
INSERT IGNORE INTO customers (customer_id, customer_name, phone, email) VALUES
  (1, 'Alice Johnson',  '+1-555-1001', 'alice@email.com'),
  (2, 'Bob Smith',      '+1-555-1002', 'bob@email.com'),
  (3, 'Carol Williams', '+1-555-1003', 'carol@email.com');
