-- =====================================================
-- Plant Nursery Database Schema
-- PostgreSQL Initialization Script
-- =====================================================
-- This script creates all necessary tables for the
-- Plant Nursery Website application with payment,
-- contact, and newsletter features.
-- =====================================================

-- =====================================================
-- 1. ORDERS TABLE
-- =====================================================
-- Stores all customer orders with payment information
-- =====================================================

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL,
    items JSONB NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(user_email);

-- Create index on order_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Add comments to table
COMMENT ON TABLE orders IS 'Stores customer orders and payment information';
COMMENT ON COLUMN orders.items IS 'JSONB array of cart items with product details';
COMMENT ON COLUMN orders.payment_status IS 'Current status of payment: pending, success, failed, or refunded';
COMMENT ON COLUMN orders.order_number IS 'Unique order identifier for tracking';

-- =====================================================
-- 2. CONTACTS TABLE
-- =====================================================
-- Stores customer contact form submissions
-- =====================================================

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    is_read BOOLEAN DEFAULT false,
    is_replied BOOLEAN DEFAULT false,
    replied_at TIMESTAMP,
    admin_notes TEXT
);

-- Create index on email for customer lookup
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- Create index on is_read for filtering unread messages
CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON contacts(is_read);

-- Add comments to table
COMMENT ON TABLE contacts IS 'Stores customer contact form submissions';
COMMENT ON COLUMN contacts.is_read IS 'Whether admin has read the message';
COMMENT ON COLUMN contacts.is_replied IS 'Whether admin has replied to the message';
COMMENT ON COLUMN contacts.admin_notes IS 'Internal notes for admin reference';

-- =====================================================
-- 3. NEWSLETTER TABLE
-- =====================================================
-- Stores newsletter subscriber emails
-- =====================================================

CREATE TABLE IF NOT EXISTS newsletter (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    unsubscribed_at TIMESTAMP,
    source VARCHAR(50) DEFAULT 'website',
    preferences JSONB
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter(email);

-- Create index on is_active for filtering active subscribers
CREATE INDEX IF NOT EXISTS idx_newsletter_is_active ON newsletter(is_active);

-- Create index on subscribed_at for sorting
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON newsletter(subscribed_at DESC);

-- Add comments to table
COMMENT ON TABLE newsletter IS 'Stores newsletter subscriber information';
COMMENT ON COLUMN newsletter.is_active IS 'Whether subscription is currently active';
COMMENT ON COLUMN newsletter.source IS 'Where the subscription came from (website, contact form, etc.)';
COMMENT ON COLUMN newsletter.preferences IS 'JSONB object storing user preferences for newsletters';

-- =====================================================
-- 4. PRODUCTS TABLE (if not exists)
-- =====================================================
-- Stores plant product information
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10,2),
    category VARCHAR(50) NOT NULL,
    image VARCHAR(500),
    instock BOOLEAN DEFAULT true,
    rating NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    badge VARCHAR(20),
    size VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create index on instock for filtering
CREATE INDEX IF NOT EXISTS idx_products_instock ON products(instock);

-- Add comments to table
COMMENT ON TABLE products IS 'Stores plant product catalog';
COMMENT ON COLUMN products.badge IS 'Product badge: popular, new, sale, etc.';
COMMENT ON COLUMN products.rating IS 'Product rating from 0 to 5';

-- =====================================================
-- SAMPLE DATA INSERTION (Optional)
-- =====================================================
-- Uncomment below to insert sample data

/*
-- Sample Newsletter Subscribers
INSERT INTO newsletter (email, source) VALUES
('john.doe@example.com', 'website'),
('jane.smith@example.com', 'contact_form')
ON CONFLICT (email) DO NOTHING;

-- Sample Contact Messages
INSERT INTO contacts (name, email, subject, message) VALUES
('John Doe', 'john.doe@example.com', 'Question about plant care', 'I would like to know more about caring for succulents.'),
('Jane Smith', 'jane.smith@example.com', 'Shipping inquiry', 'How long does shipping typically take?')
ON CONFLICT DO NOTHING;
*/

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to orders table
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to products table
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- View for order statistics
CREATE OR REPLACE VIEW order_stats AS
SELECT 
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_order_value,
    COUNT(*) FILTER (WHERE payment_status = 'success') as successful_orders,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as orders_today,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as orders_this_week,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as orders_this_month
FROM orders;

-- View for newsletter statistics
CREATE OR REPLACE VIEW newsletter_stats AS
SELECT 
    COUNT(*) as total_subscribers,
    COUNT(*) FILTER (WHERE is_active = true) as active_subscribers,
    COUNT(*) FILTER (WHERE is_active = false) as unsubscribed,
    COUNT(*) FILTER (WHERE subscribed_at > NOW() - INTERVAL '7 days') as new_this_week,
    COUNT(*) FILTER (WHERE subscribed_at > NOW() - INTERVAL '30 days') as new_this_month
FROM newsletter;

-- View for contact message statistics
CREATE OR REPLACE VIEW contact_stats AS
SELECT 
    COUNT(*) as total_messages,
    COUNT(*) FILTER (WHERE is_read = false) as unread_messages,
    COUNT(*) FILTER (WHERE is_replied = false) as unreplied_messages,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as messages_today,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as messages_this_week
FROM contacts;

-- =====================================================
-- GRANT PERMISSIONS (Adjust as needed)
-- =====================================================

-- Grant permissions to application user (if needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- =====================================================
-- END OF SCRIPT
-- =====================================================

COMMENT ON DATABASE postgres IS 'Plant Nursery E-commerce Database';

-- Print success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema created successfully!';
    RAISE NOTICE '📊 Tables created: orders, contacts, newsletter, products';
    RAISE NOTICE '📈 Views created: order_stats, newsletter_stats, contact_stats';
    RAISE NOTICE '🔄 Triggers created: auto-update timestamps';
END $$;
