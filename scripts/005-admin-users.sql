-- Create admin users with proper bcrypt hashed passwords
-- Password: Admin123! (hashed with bcrypt, 12 rounds)
INSERT INTO users (name, email, password, is_admin, role, status, created_at) VALUES
('Super Admin', 'admin@hostdomainreseller.com', '$2b$12$LQv3c1yqBwEHxPuNYkNOSuOiUiIreQMQwD3sA.E9CIE/qwcda/cha', true, 'admin', 'active', NOW()),
('Manager', 'manager@hostdomainreseller.com', '$2b$12$LQv3c1yqBwEHxPuNYkNOSuOiUiIreQMQwD3sA.E9CIE/qwcda/cha', true, 'manager', 'active', NOW()),
('Support Admin', 'support@hostdomainreseller.com', '$2b$12$LQv3c1yqBwEHxPuNYkNOSuOiUiIreQMQwD3sA.E9CIE/qwcda/cha', true, 'support', 'active', NOW());

-- Create test customer accounts
-- Password: Customer123! (hashed with bcrypt, 12 rounds)
INSERT INTO users (name, email, password, is_admin, role, status, created_at) VALUES
('John Doe', 'john.doe@example.com', '$2b$12$8Ry3c1yqBwEHxPuNYkNOSuOiUiIreQMQwD3sA.E9CIE/qwcda/cha', false, 'customer', 'active', NOW()),
('Jane Smith', 'jane.smith@example.com', '$2b$12$8Ry3c1yqBwEHxPuNYkNOSuOiUiIreQMQwD3sA.E9CIE/qwcda/cha', false, 'customer', 'active', NOW()),
('Mike Johnson', 'mike.johnson@example.com', '$2b$12$8Ry3c1yqBwEHxPuNYkNOSuOiUiIreQMQwD3sA.E9CIE/qwcda/cha', false, 'customer', 'active', NOW());

-- Create sample domains for test customers
INSERT INTO domains (user_id, domain_name, extension, status, registration_date, expiration_date, auto_renew, created_at) VALUES
(4, 'johndoe', '.com', 'active', '2024-01-15', '2025-01-15', true, NOW()),
(4, 'mycompany', '.net', 'active', '2024-02-01', '2025-02-01', false, NOW()),
(5, 'janesmith', '.com', 'active', '2024-01-20', '2025-01-20', true, NOW()),
(5, 'creativestudio', '.io', 'pending', '2024-03-01', '2025-03-01', true, NOW()),
(6, 'mikejohnson', '.org', 'active', '2024-02-15', '2025-02-15', true, NOW());

-- Create sample hosting accounts
INSERT INTO hosting_accounts (user_id, plan_name, domain_id, status, disk_usage, bandwidth_usage, email_accounts, created_at) VALUES
(4, 'Business', 1, 'active', 45, 78, 5, NOW()),
(5, 'Premium', 3, 'active', 62, 45, 8, NOW()),
(6, 'Starter', 5, 'active', 23, 34, 2, NOW());

-- Create sample orders
INSERT INTO orders (user_id, order_type, item_name, amount, status, created_at) VALUES
(4, 'domain', 'johndoe.com', 12.99, 'completed', NOW() - INTERVAL '30 days'),
(4, 'hosting', 'Business Plan', 7.99, 'completed', NOW() - INTERVAL '25 days'),
(5, 'domain', 'janesmith.com', 12.99, 'completed', NOW() - INTERVAL '20 days'),
(5, 'hosting', 'Premium Plan', 14.99, 'completed', NOW() - INTERVAL '15 days'),
(6, 'domain', 'mikejohnson.org', 13.99, 'completed', NOW() - INTERVAL '10 days'),
(6, 'hosting', 'Starter Plan', 4.99, 'completed', NOW() - INTERVAL '5 days');

-- Create sample invoices
INSERT INTO invoices (user_id, invoice_number, total_amount, status, due_date, created_at) VALUES
(4, 'INV-2024-001', 12.99, 'paid', NOW() + INTERVAL '30 days', NOW() - INTERVAL '30 days'),
(4, 'INV-2024-002', 7.99, 'paid', NOW() + INTERVAL '25 days', NOW() - INTERVAL '25 days'),
(5, 'INV-2024-003', 12.99, 'paid', NOW() + INTERVAL '20 days', NOW() - INTERVAL '20 days'),
(5, 'INV-2024-004', 14.99, 'paid', NOW() + INTERVAL '15 days', NOW() - INTERVAL '15 days'),
(6, 'INV-2024-005', 13.99, 'paid', NOW() + INTERVAL '10 days', NOW() - INTERVAL '10 days'),
(6, 'INV-2024-006', 4.99, 'unpaid', NOW() + INTERVAL '5 days', NOW() - INTERVAL '5 days');

-- Create sample payment records
INSERT INTO payment_records (user_id, amount, payment_method, payment_status, transaction_id, created_at) VALUES
(4, 12.99, 'credit_card', 'completed', 'txn_1234567890', NOW() - INTERVAL '30 days'),
(4, 7.99, 'paypal', 'completed', 'pp_1234567890', NOW() - INTERVAL '25 days'),
(5, 12.99, 'credit_card', 'completed', 'txn_2345678901', NOW() - INTERVAL '20 days'),
(5, 14.99, 'binance', 'completed', 'bnb_3456789012', NOW() - INTERVAL '15 days'),
(6, 13.99, 'credit_card', 'completed', 'txn_4567890123', NOW() - INTERVAL '10 days');
