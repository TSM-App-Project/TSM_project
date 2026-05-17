-- =========================================================================
-- DỮ LIỆU MẪU ĐỂ TEST HỆ THỐNG QUẢN LÝ CỬA HÀNG VÀNG BẠC ĐÁ QUÝ
-- =========================================================================

-- 1. THÊM NGƯỜI DÙNG (Tài khoản để đăng nhập test)
-- Mật khẩu được set đơn giản là '123456' để dễ test (nếu hệ thống bạn có băm mật khẩu, hãy nhập đoạn mã băm của '123456' vào đây)
INSERT INTO users (username, password_hash, full_name, role) VALUES
                                                                 ('admin', '123456', 'Huỳnh Long Bảo Khanh', 'QUAN_LY'),
                                                                 ('nhanvien1', '123456', 'Nguyễn Thị Bán Hàng', 'NHAN_VIEN'),
                                                                 ('nhanvien2', '123456', 'Trần Văn Kỹ Thuật', 'NHAN_VIEN');

-- 2. THÊM LOẠI SẢN PHẨM (Đã bao gồm Đơn vị tính và % Lợi nhuận)
INSERT INTO product_categories (category_name, unit_name, profit_percentage) VALUES
                                                                                 ('Vàng 24K', 'Chỉ', 5.00),    -- Lợi nhuận 5%
                                                                                 ('Bạc 925', 'Chỉ', 10.00),    -- Lợi nhuận 10%
                                                                                 ('Kim cương', 'Viên', 15.00), -- Lợi nhuận 15%
                                                                                 ('Nhẫn cưới', 'Cặp', 8.00);   -- Lợi nhuận 8%

-- 3. THÊM SẢN PHẨM (Giá mua và Số lượng tồn đã được cập nhật giả lập từ trước)
INSERT INTO products (category_id, product_name, weight, labor_cost, purchase_price, stock_quantity, status) VALUES
                                                                                                                 (1, 'Nhẫn trơn Vàng 24K 9999', 1.000, 200000, 8000000, 15, 'ACTIVE'),  -- Nhóm 1 (Lợi nhuận 5%)
                                                                                                                 (2, 'Dây chuyền Bạc 925 đính đá', 0.500, 50000, 400000, 30, 'ACTIVE'), -- Nhóm 2 (Lợi nhuận 10%)
                                                                                                                 (3, 'Kim cương tự nhiên 5ly', 0.100, 0, 15000000, 5, 'ACTIVE'),        -- Nhóm 3 (Lợi nhuận 15%)
                                                                                                                 (1, 'Lắc tay Vàng 24K Tứ Linh', 2.000, 500000, 16000000, 0, 'INACTIVE'); -- Đã hết hàng/Ngừng bán

-- 4. THÊM LOẠI DỊCH VỤ (QĐ11)
INSERT INTO services (service_name, base_price, status) VALUES
                                                            ('Đánh bóng trang sức', 50000, 'ACTIVE'),
                                                            ('Cắt/Nong ni nhẫn', 100000, 'ACTIVE'),
                                                            ('Khắc chữ Laser', 150000, 'ACTIVE'),
                                                            ('Đính đá thay thế', 200000, 'ACTIVE');

-- 5. THÊM NHÀ CUNG CẤP & CÔNG NỢ (QĐ6)
INSERT INTO suppliers (supplier_name, phone, address, tax_code, total_debt, status) VALUES
                                                                                        ('Công ty Vàng bạc đá quý SJC', '0281234567', 'Q1, TP.HCM', '0301234567', 50000000, 'ACTIVE'),
                                                                                        ('Xưởng chế tác Bạc PNJ', '0289876543', 'Phú Nhuận, TP.HCM', '0309876543', 0, 'ACTIVE'),
                                                                                        ('Công ty Kim Cương Doji', '0241112223', 'Ba Đình, Hà Nội', '0101112223', 15000000, 'ACTIVE');

-- 6. THÊM LỊCH SỬ THANH TOÁN CÔNG NỢ (QĐ7)
INSERT INTO debt_payments (supplier_id, user_id, amount, document_type, payment_status) VALUES
                                                                                            (1, 1, 20000000, 'THANH TOÁN', 'ĐÃ XỬ LÝ'),
                                                                                            (3, 1, 5000000, 'TĂNG NỢ', 'ĐÃ XỬ LÝ');

-- 7. THÊM KHÁCH HÀNG (QĐ8 - Tích điểm và phân hạng)
INSERT INTO customers (phone_number, full_name, dob, total_points, member_tier) VALUES
                                                                                    ('0901234567', 'Lê Thị Khách VIP', '1990-05-15', 5000, 'Khách hàng VIP'),
                                                                                    ('0987654321', 'Trần Văn Mua Mới', '1995-10-20', 100, 'Thành viên'),
                                                                                    ('0911222333', 'Phạm Khách Tiềm Năng', '1985-02-28', 1500, 'Thành viên Bạc');

-- 8. THÊM PHIẾU MUA HÀNG & CHI TIẾT (QĐ10)
-- Phiếu 1: Nhập Kim cương từ Doji (Nhập 2 viên giá 15tr = 30tr)
INSERT INTO purchase_receipts (supplier_id, user_id, total_amount) VALUES (3, 1, 30000000);
INSERT INTO purchase_receipt_details (purchase_id, product_id, quantity, purchase_price) VALUES
    (1, 3, 2, 15000000);

-- 9. THÊM HÓA ĐƠN BÁN HÀNG & CHI TIẾT (QĐ9 - Kiểm tra logic tính giá)
-- LOGIC TEST HÓA ĐƠN 1: Bán 1 Nhẫn vàng 24K (Lợi nhuận 5%)
-- Giá mua hiện hành: 8,000,000 -> Giá bán = 8,000,000 + (8,000,000 * 5%) = 8,400,000
INSERT INTO invoices (customer_id, user_id, total_amount) VALUES (1, 2, 8400000);
INSERT INTO invoice_details (invoice_id, product_id, quantity, unit_price) VALUES
    (1, 1, 1, 8400000);

-- LOGIC TEST HÓA ĐƠN 2: Bán 2 Dây chuyền bạc (Lợi nhuận 10%)
-- Giá mua: 400,000 -> Giá bán = 400,000 + (400,000 * 10%) = 440,000. Mua 2 cái = 880,000
INSERT INTO invoices (customer_id, user_id, total_amount) VALUES (2, 2, 8800000);
INSERT INTO invoice_details (invoice_id, product_id, quantity, unit_price) VALUES
    (2, 2, 2, 440000);

-- 10. THÊM PHIẾU DỊCH VỤ & CHI TIẾT (QĐ11 & QĐ14 - Kiểm tra logic trả trước và tình trạng)
-- Phiếu 1: Tổng tiền 320,000.
INSERT INTO service_tickets (customer_id, user_id, grand_total) VALUES (1, 3, 320000);

-- Chi tiết 1 (Phiếu 1): Khắc chữ. Giá 150k + phụ phí 10k = 160k. SL: 2 -> Thành tiền 320k.
-- Trả trước: 200k (Thỏa mãn >= 50% là 160k). Trạng thái: CHƯA GIAO
INSERT INTO service_ticket_details (ticket_id, service_id, service_price, extra_cost, quantity, calculated_price, subtotal, prepaid_amount, remaining_amount, delivery_date, status) VALUES
    (1, 3, 150000, 10000, 2, 160000, 320000, 200000, 120000, '2026-06-01', 'CHƯA GIAO');
-- Tình trạng của Phiếu 1 lúc này khi tra cứu (View) sẽ là "Chưa hoàn thành" (QĐ14)


-- Phiếu 2: Tổng tiền 100,000.
INSERT INTO service_tickets (customer_id, user_id, grand_total) VALUES (3, 3, 100000);

-- Chi tiết 1 (Phiếu 2): Đánh bóng. Giá 50k, không phụ phí. SL: 2 -> Thành tiền 100k.
-- Trả trước 50k (= 50%). Trạng thái: ĐÃ GIAO
INSERT INTO service_ticket_details (ticket_id, service_id, service_price, extra_cost, quantity, calculated_price, subtotal, prepaid_amount, remaining_amount, delivery_date, status) VALUES
    (2, 1, 50000, 0, 2, 50000, 100000, 50000, 50000, '2026-05-15', 'ĐÃ GIAO');
-- Tình trạng của Phiếu 2 lúc này khi tra cứu (View) sẽ là "Hoàn thành" (QĐ14)

select * from users;
select * from product_categories;
select * from products;
select * from services;
select * from suppliers;
select * from debt_payments;
select * from customers;
select * from purchase_receipts;
select * from purchase_receipt_details;
select * from invoices;
select * from invoice_details;