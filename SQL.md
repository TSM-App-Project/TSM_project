```sql

-- 1. BẢNG NGƯỜI DÙNG & PHÂN QUYỀN (Không có khóa ngoại)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, 
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG KHÁCH HÀNG (Không có khóa ngoại)
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    dob DATE,
    total_points INT DEFAULT 0 CHECK (total_points >= 0),
    member_tier VARCHAR(50) DEFAULT 'Thành viên',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG NHÀ CUNG CẤP (Không có khóa ngoại)
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    tax_code VARCHAR(50),
    total_debt DECIMAL(18, 2) DEFAULT 0 CHECK (total_debt >= 0),
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- 4. BẢNG DANH MỤC LOẠI SẢN PHẨM (Không có khóa ngoại)
CREATE TABLE product_categories (
    category_id SERIAL PRIMARY KEY,
    category_code VARCHAR(20) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- 5. BẢNG LOẠI DỊCH VỤ (Không có khóa ngoại)
CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) UNIQUE NOT NULL,
    base_price DECIMAL(18, 2) NOT NULL CHECK (base_price >= 0),
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- 6. BẢNG TỶ GIÁ VÀNG (Có khóa ngoại tham chiếu users)
CREATE TABLE gold_exchange_rates (
    rate_id SERIAL PRIMARY KEY,
    gold_type VARCHAR(50) NOT NULL,
    buy_price DECIMAL(18, 2) NOT NULL CHECK (buy_price >= 0),
    sell_price DECIMAL(18, 2) NOT NULL CHECK (sell_price >= 0),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES users(user_id),
    is_current BOOLEAN DEFAULT TRUE
);

-- 7. BẢNG NHẬT KÝ HỆ THỐNG / AUDIT LOGS (Có khóa ngoại tham chiếu users)
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    action_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    old_data TEXT,
    new_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. BẢNG SẢN PHẨM & TỒN KHO (Có khóa ngoại tham chiếu categories, suppliers)
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    category_id INT REFERENCES product_categories(category_id),
    product_name VARCHAR(255) NOT NULL,
    gold_rate_id INT REFERENCES gold_exchange_rates(rate_id),
    weight DECIMAL(10, 4) NOT NULL CHECK (weight >= 0),
    gemstone_cost DECIMAL(18, 2) DEFAULT 0 CHECK (gemstone_cost >= 0),
    labor_cost DECIMAL(18, 2) NOT NULL CHECK (labor_cost >= 0),
    supplier_id INT REFERENCES suppliers(supplier_id),
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. BẢNG HÓA ĐƠN BÁN HÀNG (Có khóa ngoại tham chiếu customers, users)
CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    user_id INT REFERENCES users(user_id) NOT NULL,
    transaction_type VARCHAR(20) DEFAULT 'SELL' CHECK (transaction_type IN ('SELL', 'BUYBACK')), 
    total_amount DECIMAL(18, 2) NOT NULL CHECK (total_amount >= 0),
    amount_tendered DECIMAL(18, 2) NOT NULL CHECK (amount_tendered >= 0),
    change_amount DECIMAL(18, 2) NOT NULL CHECK (change_amount >= 0),
    status VARCHAR(50) DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. BẢNG CHI TIẾT HÓA ĐƠN (Có khóa ngoại tham chiếu invoices, products)
CREATE TABLE invoice_details (
    detail_id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    weight DECIMAL(10, 4) NOT NULL,
    current_gold_price DECIMAL(18, 2) NOT NULL,
    labor_cost DECIMAL(18, 2) NOT NULL,
    sub_total DECIMAL(18, 2) NOT NULL CHECK (sub_total >= 0)
);

-- 11. BẢNG PHIẾU MUA HÀNG / NHẬP KHO (Có khóa ngoại tham chiếu suppliers, users)
CREATE TABLE purchase_orders (
    po_id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(supplier_id) NOT NULL,
    user_id INT REFERENCES users(user_id) NOT NULL,
    total_amount DECIMAL(18, 2) NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. BẢNG CHI TIẾT PHIẾU MUA HÀNG (Có khóa ngoại tham chiếu purchase_orders, products)
CREATE TABLE purchase_order_details (
    po_detail_id SERIAL PRIMARY KEY,
    po_id INT REFERENCES purchase_orders(po_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(18, 2) NOT NULL CHECK (unit_price > 0),
    sub_total DECIMAL(18, 2) NOT NULL CHECK (sub_total >= 0)
);

-- 13. BẢNG PHIẾU XUẤT KHO KHÁC (Có khóa ngoại tham chiếu users)
CREATE TABLE inventory_exports (
    export_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) NOT NULL,
    export_type VARCHAR(50) NOT NULL,
    reference_note TEXT,
    status VARCHAR(50) DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. BẢNG CHI TIẾT PHIẾU XUẤT KHO (Có khóa ngoại tham chiếu inventory_exports, products)
CREATE TABLE inventory_export_details (
    export_detail_id SERIAL PRIMARY KEY,
    export_id INT REFERENCES inventory_exports(export_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    note VARCHAR(255)
);

-- 15. BẢNG THANH TOÁN CÔNG NỢ NHÀ CUNG CẤP (Có khóa ngoại tham chiếu suppliers, users)
CREATE TABLE debt_payments (
    payment_id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(supplier_id) NOT NULL,
    user_id INT REFERENCES users(user_id) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL CHECK (amount > 0),
    document_type VARCHAR(50),
    payment_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. BẢNG PHIẾU DỊCH VỤ (Có khóa ngoại tham chiếu customers, services, users)
CREATE TABLE service_tickets (
    ticket_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id) NOT NULL,
    service_id INT REFERENCES services(service_id) NOT NULL,
    user_id INT REFERENCES users(user_id) NOT NULL,
    expected_delivery_date DATE NOT NULL,
    total_amount DECIMAL(18, 2) NOT NULL CHECK (total_amount >= 0),
    prepaid_amount DECIMAL(18, 2) DEFAULT 0 CHECK (prepaid_amount >= 0),
    remaining_amount DECIMAL(18, 2) NOT NULL CHECK (remaining_amount >= 0),
    item_description TEXT,
    estimated_weight DECIMAL(10, 4),
    note TEXT,
    status VARCHAR(50) DEFAULT 'CHƯA GIAO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```