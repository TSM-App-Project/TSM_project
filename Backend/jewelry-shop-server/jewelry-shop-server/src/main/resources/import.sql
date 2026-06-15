INSERT INTO users (username, password_hash, full_name, role, status, created_at) VALUES ('admin', '$2b$10$aWFoyV4coreoHifdjTagNeGeJC/7j1JWIvMMe8JRV2hkUBlhLILV6', 'Nguyễn Văn Admin', 'ADMIN', 'ACTIVE', '2026-05-01 08:00:00');
INSERT INTO users (username, password_hash, full_name, role, status, created_at) VALUES ('quanly1', '$2b$10$aWFoyV4coreoHifdjTagNeGeJC/7j1JWIvMMe8JRV2hkUBlhLILV6', 'Trần Thị Quản Lý', 'QUAN_LY', 'ACTIVE', '2026-05-01 08:00:00');
INSERT INTO users (username, password_hash, full_name, role, status, created_at) VALUES ('ketoan1', '$2b$10$aWFoyV4coreoHifdjTagNeGeJC/7j1JWIvMMe8JRV2hkUBlhLILV6', 'Phạm Văn Kế Toán', 'KE_TOAN', 'ACTIVE', '2026-05-01 08:00:00');
INSERT INTO users (username, password_hash, full_name, role, status, created_at) VALUES ('nhanvien1', '$2b$10$aWFoyV4coreoHifdjTagNeGeJC/7j1JWIvMMe8JRV2hkUBlhLILV6', 'Lê Văn Nhân Viên', 'NHAN_VIEN', 'ACTIVE', '2026-05-01 08:00:00');
INSERT INTO product_categories (category_name, unit_name, profit_percentage) VALUES ('Nhẫn Vàng Tây', 'Chiếc', 5.0);
INSERT INTO product_categories (category_name, unit_name, profit_percentage) VALUES ('Dây Chuyền', 'Sợi', 10.0);
INSERT INTO product_categories (category_name, unit_name, profit_percentage) VALUES ('Bông Tai', 'Đôi', 8.0);
INSERT INTO product_categories (category_name, unit_name, profit_percentage) VALUES ('Lắc Tay', 'Chiếc', 7.0);
INSERT INTO product_categories (category_name, unit_name, profit_percentage) VALUES ('Nhẫn Kim Cương', 'Chiếc', 15.0);
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status, version) VALUES (1, 'Nhẫn nam vàng 18K', 2.5, 300000, 8500000, 15, 'ACTIVE', 0);
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status, version) VALUES (1, 'Nhẫn nữ vàng ý 18K', 1.2, 200000, 4200000, 25, 'ACTIVE', 0);
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status, version) VALUES (2, 'Dây chuyền bi vàng 24K', 5.0, 800000, 35000000, 5, 'ACTIVE', 0);
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status, version) VALUES (3, 'Bông tai hoa mai vàng 18K', 1.0, 250000, 3600000, 30, 'ACTIVE', 0);
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status, version) VALUES (4, 'Lắc tay bạc ý sành điệu', 1.2, 120000, 600000, 50, 'ACTIVE', 0);
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status, version) VALUES (5, 'Nhẫn Kim Cương Solitaire', 1.5, 2000000, 45000000, 4, 'ACTIVE', 0);
INSERT INTO services (service_name, base_price, unit_name, status) VALUES ('Đánh bóng làm mới', 50000, 'Lần', 'ACTIVE');
INSERT INTO services (service_name, base_price, unit_name, status) VALUES ('Nong ni nhẫn', 100000, 'Lần', 'ACTIVE');
INSERT INTO services (service_name, base_price, unit_name, status) VALUES ('Khắc tên Laser', 150000, 'Lần', 'ACTIVE');
INSERT INTO supplier_categories (category_name, description, status) VALUES ('Công ty Vàng Bạc', 'Các công ty lớn', 'ACTIVE');
INSERT INTO supplier_categories (category_name, description, status) VALUES ('Xưởng Gia Công', 'Các xưởng gia công nhỏ lẻ', 'ACTIVE');
INSERT INTO suppliers (category_id, supplier_name, phone, tax_code, address, status, version) VALUES (1, 'Công ty SJC', '02839291111', '0300624956', 'TP HCM', 'ACTIVE', 0);
INSERT INTO suppliers (category_id, supplier_name, phone, tax_code, address, status, version) VALUES (1, 'Tập đoàn DOJI', '02433633633', '0100234234', 'Hà Nội', 'ACTIVE', 0);
INSERT INTO suppliers (category_id, supplier_name, phone, tax_code, address, status, version) VALUES (2, 'Xưởng chế tác Phú Quý', '0989123456', '0311223344', 'TP HCM', 'ACTIVE', 0);
INSERT INTO customers (phone_number, full_name, dob, total_points, created_at, version) VALUES ('0901234111', 'Nguyễn Minh Ánh', '1990-01-01', 12500, '2026-05-01 10:00:00', 0);
INSERT INTO customers (phone_number, full_name, dob, total_points, created_at, version) VALUES ('0912345222', 'Trần Thị Bích', '1992-05-15', 3670, '2026-05-01 10:00:00', 0);
INSERT INTO customers (phone_number, full_name, dob, total_points, created_at, version) VALUES ('0938456333', 'Lê Quốc Hùng', '1985-08-20', 1420, '2026-05-01 10:00:00', 0);
INSERT INTO purchase_receipts (supplier_id, user_id, total_amount, purchase_date) VALUES (1, 1, 169000000, '2026-05-01 10:00:00');
INSERT INTO purchase_receipts (supplier_id, user_id, total_amount, purchase_date) VALUES (2, 2, 340000000, '2026-05-05 14:30:00');
INSERT INTO purchase_receipt_details (purchase_id, product_id, quantity, purchase_price) VALUES (1, 1, 10, 8500000);
INSERT INTO purchase_receipt_details (purchase_id, product_id, quantity, purchase_price) VALUES (1, 2, 20, 4200000);
INSERT INTO purchase_receipt_details (purchase_id, product_id, quantity, purchase_price) VALUES (2, 3, 5, 35000000);
INSERT INTO invoices (customer_id, user_id, total_amount, created_at) VALUES (1, 3, 18445000.0, '2026-05-02 09:10:00');
INSERT INTO invoices (customer_id, user_id, total_amount, created_at) VALUES (2, 3, 39300000.0, '2026-05-06 15:20:00');
INSERT INTO invoice_details (invoice_id, product_id, quantity, unit_price) VALUES (1, 1, 1, 9225000.0);
INSERT INTO invoice_details (invoice_id, product_id, quantity, unit_price) VALUES (1, 2, 2, 4610000.0);
INSERT INTO invoice_details (invoice_id, product_id, quantity, unit_price) VALUES (2, 3, 1, 39300000.0);
INSERT INTO service_tickets (customer_id, user_id, grand_total, created_at) VALUES (1, 3, 140000, '2026-06-01 10:00:00');
INSERT INTO service_tickets (customer_id, user_id, grand_total, created_at) VALUES (2, 3, 100000, '2026-06-02 11:30:00');
INSERT INTO service_ticket_details (ticket_id, service_id, service_price, extra_cost, quantity, calculated_price, subtotal, prepaid_amount, remaining_amount, delivery_date, status) VALUES (1, 1, 50000, 20000, 2, 70000, 140000, 100000, 40000, '2026-06-03', 'ĐÃ GIAO');
INSERT INTO service_ticket_details (ticket_id, service_id, service_price, extra_cost, quantity, calculated_price, subtotal, prepaid_amount, remaining_amount, delivery_date, status) VALUES (2, 2, 100000, 0, 1, 100000, 100000, 50000, 50000, '2026-06-04', 'ĐÃ GIAO');
INSERT INTO debt_payments (supplier_id, user_id, amount, document_type, payment_status, created_at) VALUES (1, 1, 20000000, 'THANH TOÁN', 'ĐÃ XỬ LÝ', '2026-05-15 10:00:00');
INSERT INTO debt_payments (supplier_id, user_id, amount, document_type, payment_status, created_at) VALUES (2, 2, 15000000, 'THANH TOÁN', 'ĐÃ XỬ LÝ', '2026-05-20 14:00:00');
INSERT INTO audit_logs (user_id, action_type, affected_table, description, log_time) VALUES (1, 'INSERT', 'users', 'Admin created new account quanly1', '2026-05-01 08:00:00');
INSERT INTO audit_logs (user_id, action_type, affected_table, description, log_time) VALUES (1, 'INSERT', 'product_categories', 'Created category Nhẫn Vàng Tây', '2026-05-01 08:30:00');
INSERT INTO inventory_reports (report_month, report_year, created_at) VALUES (5, 2026, '2026-06-01 00:00:00');
INSERT INTO inventory_report_details (report_id, product_id, opening_stock, in_quantity, out_quantity, closing_stock) VALUES (1, 1, 5, 10, 0, 15);
INSERT INTO inventory_report_details (report_id, product_id, opening_stock, in_quantity, out_quantity, closing_stock) VALUES (1, 2, 5, 20, 0, 25);
INSERT INTO revenue_reports (report_month, report_year, total_revenue, created_at) VALUES (5, 2026, 57745000.0, '2026-06-01 00:00:00');
INSERT INTO revenue_report_details (report_id, category_id, revenue_amount, percentage) VALUES (1, 1, 18445000.0, 31.94);
INSERT INTO revenue_report_details (report_id, category_id, revenue_amount, percentage) VALUES (1, 2, 39300000.0, 68.06);

-- Thêm Customer từ mock data
INSERT INTO customers (phone_number, full_name, dob, total_points, created_at, version) VALUES ('0977567444', 'Phạm Thu Hà', '1988-11-30', 5190, '2026-05-01 10:00:00', 0);
INSERT INTO customers (phone_number, full_name, dob, total_points, created_at, version) VALUES ('0345678555', 'Hoàng Văn Nam', '1995-08-01', 380, '2026-05-01 10:00:00', 0);
INSERT INTO customers (phone_number, full_name, dob, total_points, created_at, version) VALUES ('0862789666', 'Vũ Thị Lan', '1993-04-11', 810, '2026-05-01 10:00:00', 0);
INSERT INTO customers (phone_number, full_name, dob, total_points, created_at, version) VALUES ('0793890777', 'Đặng Minh Tú', '1991-07-19', 2950, '2026-05-01 10:00:00', 0);
INSERT INTO customers (phone_number, full_name, dob, total_points, created_at, version) VALUES ('0919901888', 'Bùi Thị Ngọc', '1998-12-25', 215, '2026-05-01 10:00:00', 0);

-- Thêm Categories từ mock data
INSERT INTO product_categories (category_name, unit_name, profit_percentage) VALUES ('Đồng Hồ', 'Chiếc', 20.0);
INSERT INTO product_categories (category_name, unit_name, profit_percentage) VALUES ('Bộ Trang Sức', 'Bộ', 12.0);

-- Thêm Products từ mock data
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status, version) VALUES (2, 'Dây Chuyền Vàng Chữ Tâm', 2.0, 300000, 3600000, 0, 'INACTIVE', 0);
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status, version) VALUES (3, 'Bông Tai Kim Cương Halo', 1.5, 500000, 18900000, 6, 'ACTIVE', 0);
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status, version) VALUES (3, 'Bông Tai Ngọc Trai Nước Ngọt', 1.0, 150000, 1200000, 38, 'ACTIVE', 0);
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status, version) VALUES (4, 'Lắc Tay Vàng Nhật Ký', 3.0, 400000, 6700000, 19, 'ACTIVE', 0);
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status, version) VALUES (4, 'Vòng Bạc Thủ Công Đà Lạt', 2.5, 200000, 720000, 52, 'ACTIVE', 0);
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status, version) VALUES (6, 'Đồng Hồ Trang Sức Nữ', 5.0, 1000000, 24500000, 0, 'INACTIVE', 0);
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status, version) VALUES (7, 'Bộ Trang Sức Cô Dâu Kim Cương', 10.0, 2000000, 68000000, 4, 'ACTIVE', 0);

-- Thêm Suppliers từ mock data
INSERT INTO suppliers (category_id, supplier_name, phone, tax_code, address, status, version) VALUES (1, 'Kim Hoàn Bảo Tín', '02812345678', '0300123456', 'TP HCM', 'ACTIVE', 0);
INSERT INTO suppliers (category_id, supplier_name, phone, tax_code, address, status, version) VALUES (2, 'Ngọc Trai Phương Nam', '03628765432', '0300654321', 'Đà Nẵng', 'ACTIVE', 0);
INSERT INTO suppliers (category_id, supplier_name, phone, tax_code, address, status, version) VALUES (1, 'Đá Quý Sài Gòn', '09081112233', '0300987654', 'TP HCM', 'ACTIVE', 0);
INSERT INTO suppliers (category_id, supplier_name, phone, tax_code, address, status, version) VALUES (2, 'Bạc Mỹ Nghệ Huế', '02347654321', '0300456789', 'Thừa Thiên Huế', 'ACTIVE', 0);
INSERT INTO suppliers (category_id, supplier_name, phone, tax_code, address, status, version) VALUES (1, 'Đồng Hồ Cao Cấp Việt', '02489990011', '0300765432', 'Hà Nội', 'INACTIVE', 0);