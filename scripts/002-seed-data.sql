-- Insert domain extensions
INSERT INTO domain_extensions (extension, registration_price, renewal_price, transfer_price, is_popular, description) VALUES
('.com', 12.99, 14.99, 12.99, true, 'Most popular and trusted domain extension'),
('.net', 14.99, 16.99, 14.99, true, 'Perfect for network and tech companies'),
('.org', 13.99, 15.99, 13.99, true, 'Ideal for organizations and non-profits'),
('.io', 49.99, 59.99, 49.99, true, 'Popular choice for tech startups'),
('.co', 29.99, 34.99, 29.99, false, 'Short and memorable alternative to .com'),
('.app', 19.99, 24.99, 19.99, true, 'Perfect for mobile apps and software'),
('.dev', 15.99, 19.99, 15.99, false, 'Ideal for developers and tech projects'),
('.tech', 24.99, 29.99, 24.99, false, 'Perfect for technology companies'),
('.store', 19.99, 24.99, 19.99, false, 'Great for e-commerce businesses'),
('.online', 9.99, 12.99, 9.99, false, 'Affordable option for online presence'),
('.blog', 14.99, 18.99, 14.99, false, 'Ideal for bloggers'),
('.info', 11.99, 14.99, 11.99, false, 'General information domain'),
('.biz', 13.99, 16.99, 13.99, false, 'Business-focused domain'),
('.me', 19.99, 24.99, 19.99, false, 'Personal domain'),
('.tv', 39.99, 44.99, 39.99, false, 'Domain for TV-related content')
ON CONFLICT (extension) DO NOTHING;

-- Insert hosting plans
INSERT INTO hosting_plans (plan_name, plan_type, disk_space_gb, bandwidth_gb, email_accounts, databases, subdomains, websites, price, is_popular, features) VALUES
('Starter', 'shared', 10, 100, 5, 2, 5, 1, 7.99, false, ARRAY['Free SSL Certificate', '24/7 Support', 'Free Domain (1st year)', 'Website Builder']),
('Business', 'shared', 50, 500, 25, 10, 25, 0, 15.99, true, ARRAY['Free SSL Certificate', 'Priority Support', 'Free Domain (1st year)', 'Daily Backups', 'Advanced Security']),
('Premium', 'shared', 100, 1000, 50, 25, 50, 0, 29.99, false, ARRAY['Free SSL Certificate', 'VIP Support', 'Free Domain (1st year)', 'Daily Backups', 'Advanced Security', 'Free CDN', 'Staging Environment']),
('VPS Starter', 'vps', 80, 2000, 100, 50, 0, 0, 59.99, false, ARRAY['2 CPU Cores', '4 GB RAM', 'Full Root Access', 'Free SSL Certificate', '24/7 Support']),
('VPS Pro', 'vps', 160, 4000, 200, 100, 0, 0, 119.99, false, ARRAY['4 CPU Cores', '8 GB RAM', 'Full Root Access', 'Free SSL Certificate', 'Priority Support', 'Free Migration']),
('Dedicated Server', 'dedicated', 1000, 10000, 500, 200, 0, 0, 199.99, false, ARRAY['Intel Xeon Processor', '32 GB RAM', 'Full Server Control', 'Free SSL Certificate', 'VIP Support', 'Free Setup & Migration']),
('Dedicated Basic', 'dedicated', 1000, 10000, 500, 200, 0, 0, 199.99, false, ARRAY['Intel Xeon Processor', '32 GB RAM', 'Full Server Control', 'Free SSL Certificate', 'VIP Support', 'Free Setup & Migration']),
('Dedicated Pro', 'dedicated', 2000, 20000, 1000, 500, 0, 0, 399.99, false, ARRAY['Intel Xeon Processor', '64 GB RAM', 'Full Server Control', 'Free SSL Certificate', 'VIP Support', 'Free Setup & Migration'])
ON CONFLICT (plan_name) DO NOTHING;

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, company_name, is_admin, plan_type) VALUES
('admin@hostdomain.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'Host Domain', true, 'enterprise')
ON CONFLICT (email) DO NOTHING;

-- Insert sample customer (password: customer123)
INSERT INTO users (email, password_hash, full_name, company_name, phone, plan_type) VALUES
('john@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQgOzJqQqQqQqQqQqQqQqQqOzJqQqQgQgQg', 'John Doe', 'Example Corp', '+1-555-123-4567', 'business')
ON CONFLICT (email) DO NOTHING;

-- Insert sample domains for the customer
INSERT INTO domains (user_id, domain_name, extension, registration_date, expiration_date, price) VALUES
((SELECT id FROM users WHERE email = 'john@example.com'), 'example', '.com', '2024-01-01', '2024-12-31', 12.99),
((SELECT id FROM users WHERE email = 'john@example.com'), 'mybusiness', '.net', '2024-02-01', '2025-01-31', 14.99),
((SELECT id FROM users WHERE email = 'john@example.com'), 'mystore', '.org', '2024-03-01', '2025-02-28', 13.99);

-- Insert sample hosting accounts
INSERT INTO hosting_accounts (user_id, domain_id, plan_name, plan_type, disk_space_gb, email_accounts, databases, setup_date, expiration_date, price) VALUES
((SELECT id FROM users WHERE email = 'john@example.com'), (SELECT id FROM domains WHERE domain_name = 'example'), 'Business', 'shared', 50, 25, 10, '2024-01-01', '2024-12-31', 15.99),
((SELECT id FROM users WHERE email = 'john@example.com'), (SELECT id FROM domains WHERE domain_name = 'mybusiness'), 'Premium', 'shared', 100, 50, 25, '2024-02-01', '2025-01-31', 29.99);

-- Insert sample orders
INSERT INTO orders (user_id, order_number, order_type, status, subtotal, total_amount, payment_status) VALUES
((SELECT id FROM users WHERE email = 'john@example.com'), 'ORD-2024-001', 'domain', 'completed', 12.99, 12.99, 'paid'),
((SELECT id FROM users WHERE email = 'john@example.com'), 'ORD-2024-002', 'hosting', 'completed', 15.99, 15.99, 'paid'),
((SELECT id FROM users WHERE email = 'john@example.com'), 'ORD-2024-003', 'domain', 'completed', 14.99, 14.99, 'paid');

-- Insert sample order items
INSERT INTO order_items (order_id, item_type, item_name, unit_price, total_price, domain_id) VALUES
((SELECT id FROM orders WHERE order_number = 'ORD-2024-001'), 'domain', 'example.com Registration', 12.99, 12.99, (SELECT id FROM domains WHERE domain_name = 'example')),
((SELECT id FROM orders WHERE order_number = 'ORD-2024-002'), 'hosting', 'Business Hosting Plan', 15.99, 15.99, (SELECT id FROM hosting_accounts WHERE plan_name = 'Business' LIMIT 1)),
((SELECT id FROM orders WHERE order_number = 'ORD-2024-003'), 'domain', 'mybusiness.net Registration', 14.99, 14.99, (SELECT id FROM domains WHERE domain_name = 'mybusiness'));

-- Insert sample invoices
INSERT INTO invoices (user_id, order_id, invoice_number, status, due_date, subtotal, total_amount, paid_amount, payment_date) VALUES
((SELECT id FROM users WHERE email = 'john@example.com'), (SELECT id FROM orders WHERE order_number = 'ORD-2024-001'), 'INV-2024-001', 'paid', '2024-01-15', 12.99, 12.99, 12.99, '2024-01-01 10:30:00'),
((SELECT id FROM users WHERE email = 'john@example.com'), (SELECT id FROM orders WHERE order_number = 'ORD-2024-002'), 'INV-2024-002', 'paid', '2024-02-15', 15.99, 15.99, 15.99, '2024-01-15 14:20:00'),
((SELECT id FROM users WHERE email = 'john@example.com'), (SELECT id FROM orders WHERE order_number = 'ORD-2024-003'), 'INV-2024-003', 'pending', '2024-02-20', 14.99, 14.99, 0, NULL);
