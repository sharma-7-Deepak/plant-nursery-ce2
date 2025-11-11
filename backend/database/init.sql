-- ======================================
-- 🪴 CE-2 PostgreSQL Schema Setup
-- ======================================

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100),
  price NUMERIC(10,2) DEFAULT 0,
  badge VARCHAR(50),
  description TEXT,
  instock BOOLEAN DEFAULT true,
  image TEXT,
  lightRequirement VARCHAR(100),
  wateringFrequency VARCHAR(100),
  humidity VARCHAR(100),
  toxicity VARCHAR(100),
  origin VARCHAR(100),
  adultSize VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- CONTACTS TABLE
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- CARTS TABLE
CREATE TABLE IF NOT EXISTS carts (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  added_at TIMESTAMP DEFAULT NOW()
);

-- NEWSLETTER TABLE
CREATE TABLE IF NOT EXISTS newsletter (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(100),
    items JSONB NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

