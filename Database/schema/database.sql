
create table users
(
    user_id       serial
        primary key,
    username      varchar(50)  not null
        unique,
    password_hash varchar(255) not null,
    full_name     varchar(100) not null,
    role          varchar(50)  not null,
    status        varchar(20) default 'ACTIVE'::character varying,
    created_at    timestamp   default CURRENT_TIMESTAMP
);

alter table users
    owner to postgres;

create table product_categories
(
    category_id       serial
        primary key,
    category_name     varchar(255) not null
        unique,
    unit_name         varchar(50)  not null,
    profit_percentage numeric(5, 2) default 0
        constraint product_categories_profit_percentage_check
            check (profit_percentage >= (0)::numeric)
);

alter table product_categories
    owner to postgres;

create table products
(
    product_id     serial
        primary key,
    category_id    integer                  not null
        constraint fk_product_category
            references product_categories,
    product_name   varchar(255)             not null
        unique,
    weight         numeric(18, 3)           not null
        constraint products_weight_check
            check (weight > (0)::numeric),
    labor_cost     numeric(18, 2) default 0 not null
        constraint products_labor_cost_check
            check (labor_cost >= (0)::numeric),
    stock_quantity integer        default 0,
    status         varchar(20)    default 'ACTIVE'::character varying,
    purchase_price numeric(18, 2) default 0
        constraint products_purchase_price_check
            check (purchase_price >= (0)::numeric)
);

alter table products
    owner to postgres;

create table services
(
    service_id   serial
        primary key,
    service_name varchar(255)   not null
        unique,
    base_price   numeric(18, 2) not null
        constraint services_base_price_check
            check (base_price >= (0)::numeric),
    status       varchar(20) default 'ACTIVE'::character varying
);

alter table services
    owner to postgres;

create table suppliers
(
    supplier_id   serial
        primary key,
    supplier_name varchar(255) not null
        unique,
    phone         varchar(15),
    address       text,
    tax_code      varchar(50)
        unique,
    total_debt    numeric(18, 2) default 0
        constraint suppliers_total_debt_check
            check (total_debt >= (0)::numeric),
    status        varchar(20)    default 'ACTIVE'::character varying
);

alter table suppliers
    owner to postgres;

create table debt_payments
(
    payment_id     serial
        primary key,
    supplier_id    integer        not null
        constraint fk_debt_supplier
            references suppliers,
    user_id        integer        not null
        constraint fk_debt_user
            references users,
    amount         numeric(18, 2) not null
        constraint debt_payments_amount_check
            check (amount > (0)::numeric),
    document_type  varchar(50)    not null,
    payment_status varchar(50),
    created_at     timestamp default CURRENT_TIMESTAMP
);

alter table debt_payments
    owner to postgres;

create table customers
(
    customer_id  serial
        primary key,
    phone_number varchar(15)  not null
        unique,
    full_name    varchar(100) not null,
    dob          date,
    total_points integer     default 0
        constraint customers_total_points_check
            check (total_points >= 0),
    member_tier  varchar(50) default 'Thành viên'::character varying,
    created_at   timestamp   default CURRENT_TIMESTAMP
);

alter table customers
    owner to postgres;

create table invoices
(
    invoice_id   serial
        primary key,
    customer_id  integer
        references customers,
    user_id      integer        not null
        references users,
    total_amount numeric(18, 2) not null,
    created_at   timestamp default CURRENT_TIMESTAMP
);

alter table invoices
    owner to postgres;

create table invoice_details
(
    detail_id  serial
        primary key,
    invoice_id integer
        references invoices
            on delete cascade,
    product_id integer        not null
        references products,
    quantity   integer        not null
        constraint invoice_details_quantity_check
            check (quantity > 0),
    unit_price numeric(18, 2) not null
);

alter table invoice_details
    owner to postgres;

create table purchase_receipts
(
    purchase_id   serial
        primary key,
    supplier_id   integer                  not null
        constraint fk_pr_supplier
            references suppliers,
    user_id       integer                  not null
        constraint fk_pr_user
            references users,
    purchase_date timestamp      default CURRENT_TIMESTAMP,
    total_amount  numeric(18, 2) default 0 not null
);

alter table purchase_receipts
    owner to postgres;

create table purchase_receipt_details
(
    detail_id      serial
        primary key,
    purchase_id    integer        not null
        constraint fk_prd_receipt
            references purchase_receipts
            on delete cascade,
    product_id     integer        not null
        constraint fk_prd_product
            references products,
    quantity       integer        not null
        constraint purchase_receipt_details_quantity_check
            check (quantity > 0),
    purchase_price numeric(18, 2) not null
        constraint purchase_receipt_details_purchase_price_check
            check (purchase_price > (0)::numeric)
);

alter table purchase_receipt_details
    owner to postgres;

create table service_tickets
(
    ticket_id   serial
        primary key,
    customer_id integer not null
        constraint fk_st_customer
            references customers,
    user_id     integer not null
        constraint fk_st_user
            references users,
    created_at  timestamp      default CURRENT_TIMESTAMP,
    grand_total numeric(18, 2) default 0
);

alter table service_tickets
    owner to postgres;

create table service_ticket_details
(
    detail_id        serial
        primary key,
    ticket_id        integer        not null
        constraint fk_std_ticket
            references service_tickets
            on delete cascade,
    service_id       integer        not null
        constraint fk_std_service
            references services,
    service_price    numeric(18, 2) not null,
    extra_cost       numeric(18, 2) default 0
        constraint service_ticket_details_extra_cost_check
            check (extra_cost >= (0)::numeric),
    quantity         integer        not null
        constraint service_ticket_details_quantity_check
            check (quantity > 0),
    calculated_price numeric(18, 2) not null,
    subtotal         numeric(18, 2) not null,
    prepaid_amount   numeric(18, 2) not null,
    remaining_amount numeric(18, 2) not null,
    delivery_date    date           not null,
    status           varchar(50)    default 'CHƯA GIAO'::character varying
        constraint service_ticket_details_status_check
            check ((status)::text = ANY ((ARRAY ['ĐÃ GIAO'::character varying, 'CHƯA GIAO'::character varying])::text[]))
);

alter table service_ticket_details
    owner to postgres;

create table inventory_reports
(
    report_id    serial
        primary key,
    report_month integer not null
        constraint inventory_reports_report_month_check
            check ((report_month >= 1) AND (report_month <= 12)),
    report_year  integer not null,
    created_at   timestamp default CURRENT_TIMESTAMP,
    constraint unique_report_period
        unique (report_month, report_year)
);

alter table inventory_reports
    owner to postgres;

create table inventory_report_details
(
    detail_id     serial
        primary key,
    report_id     integer not null
        constraint fk_ird_report
            references inventory_reports
            on delete cascade,
    product_id    integer not null
        constraint fk_ird_product
            references products,
    opening_stock integer default 0,
    in_quantity   integer default 0,
    out_quantity  integer default 0,
    closing_stock integer default 0
);

alter table inventory_report_details
    owner to postgres;

create table revenue_reports
(
    report_id     serial
        primary key,
    report_month  integer not null
        constraint revenue_reports_report_month_check
            check ((report_month >= 1) AND (report_month <= 12)),
    report_year   integer not null,
    total_revenue numeric(18, 2) default 0,
    created_at    timestamp      default CURRENT_TIMESTAMP,
    constraint unique_revenue_period
        unique (report_month, report_year)
);

alter table revenue_reports
    owner to postgres;

create table revenue_report_details
(
    detail_id      serial
        primary key,
    report_id      integer not null
        constraint fk_rrd_report
            references revenue_reports
            on delete cascade,
    category_id    integer not null
        constraint fk_rrd_category
            references product_categories,
    revenue_amount numeric(18, 2) default 0,
    percentage     numeric(5, 2)  default 0
);

alter table revenue_report_details
    owner to postgres;

create table audit_logs
(
    log_id         serial
        primary key,
    user_id        integer      not null
        constraint fk_audit_user
            references users,
    log_time       timestamp default CURRENT_TIMESTAMP,
    action_type    varchar(50)  not null,
    affected_table varchar(100) not null,
    description    text
);

alter table audit_logs
    owner to postgres;

create view view_product_search
            ("Tên sản phẩm", "Loại sản phẩm", "Đơn vị tính", "Đơn giá mua", "Đơn giá bán", "Tình trạng") as
SELECT p.product_name                                                           AS "Tên sản phẩm",
       c.category_name                                                          AS "Loại sản phẩm",
       c.unit_name                                                              AS "Đơn vị tính",
       p.purchase_price                                                         AS "Đơn giá mua",
       p.purchase_price + p.purchase_price * c.profit_percentage / 100::numeric AS "Đơn giá bán",
       p.status                                                                 AS "Tình trạng"
FROM products p
         JOIN product_categories c ON p.category_id = c.category_id;

alter table view_product_search
    owner to postgres;

create view view_service_ticket_search
            ("Mã phiếu", "Khách hàng", "Ngày lập", "Tổng tiền", "Số tiền trả trước", "Số tiền còn lại", "Tình trạng") as
SELECT st.ticket_id              AS "Mã phiếu",
       c.full_name               AS "Khách hàng",
       st.created_at             AS "Ngày lập",
       st.grand_total            AS "Tổng tiền",
       sum(std.prepaid_amount)   AS "Số tiền trả trước",
       sum(std.remaining_amount) AS "Số tiền còn lại",
       CASE
           WHEN NOT (EXISTS (SELECT 1
                             FROM service_ticket_details
                             WHERE service_ticket_details.ticket_id = st.ticket_id
                               AND service_ticket_details.status::text = 'CHƯA GIAO'::text)) THEN 'Hoàn thành'::text
           ELSE 'Chưa hoàn thành'::text
           END                   AS "Tình trạng"
FROM service_tickets st
         JOIN customers c ON st.customer_id = c.customer_id
         JOIN service_ticket_details std ON st.ticket_id = std.ticket_id
GROUP BY st.ticket_id, c.full_name, st.created_at, st.grand_total;

alter table view_service_ticket_search
    owner to postgres;

create view view_inventory_search(product_name, category_name, stock_quantity, unit_name) as
SELECT p.product_name,
       c.category_name,
       p.stock_quantity,
       c.unit_name
FROM products p
         JOIN product_categories c ON p.category_id = c.category_id;

alter table view_inventory_search
    owner to postgres;


