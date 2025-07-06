-- Insert sample billing cycles
INSERT INTO billing_cycles (user_id, cycle_type, amount, next_billing_date) VALUES
(1, 'monthly', 29.99, '2024-02-15'),
(2, 'yearly', 299.99, '2024-12-01'),
(3, 'quarterly', 79.99, '2024-03-01');

-- Insert sample payment records
INSERT INTO payment_records (user_id, amount, payment_method, payment_status, transaction_id, payment_date) VALUES
(1, 29.99, 'credit_card', 'completed', 'ch_1234567890', '2024-01-15 10:30:00'),
(2, 299.99, 'paypal', 'completed', 'PAYID-ABC123', '2024-01-01 14:20:00'),
(3, 79.99, 'binance', 'completed', 'BNB_TX_789', '2024-01-10 09:15:00');

-- Insert sample invoices
INSERT INTO invoices (user_id, invoice_number, status, due_date, subtotal, tax_amount, total_amount, paid_amount, payment_date) VALUES
(1, 'INV-2024-001', 'paid', '2024-02-15', 29.99, 2.40, 32.39, 32.39, '2024-01-15 10:30:00'),
(2, 'INV-2024-002', 'paid', '2024-01-31', 299.99, 24.00, 323.99, 323.99, '2024-01-01 14:20:00'),
(3, 'INV-2024-003', 'unpaid', '2024-02-10', 79.99, 6.40, 86.39, 0, NULL);

-- Insert sample payment methods
INSERT INTO user_payment_methods (user_id, payment_type, provider_customer_id, provider_payment_method_id, last_four, brand, exp_month, exp_year, is_default) VALUES
(1, 'credit_card', 'cus_stripe123', 'pm_card456', '4242', 'visa', 12, 2025, TRUE),
(2, 'paypal', 'paypal_customer_789', 'ba_paypal123', NULL, 'paypal', NULL, NULL, TRUE),
(3, 'binance', 'binance_user_456', NULL, NULL, 'binance', NULL, NULL, TRUE);

-- Insert sample crypto addresses
INSERT INTO crypto_payment_addresses (user_id, currency, address, network) VALUES
(1, 'BTC', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'bitcoin'),
(2, 'ETH', '0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4', 'ethereum'),
(3, 'BNB', 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2', 'binance-smart-chain');

-- Insert some sample crypto addresses for demo purposes
-- In production, these would be generated dynamically
INSERT INTO crypto_payment_addresses (user_id, currency, address) VALUES
(1, 'BTC', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'),
(1, 'ETH', '0x742d35Cc6634C0532925a3b8D4C9db96590b4c5d'),
(1, 'USDT', 'TQn9Y2khEsLJW1ChVWFMSMeRDow5CNYY7r')
ON CONFLICT DO NOTHING;
