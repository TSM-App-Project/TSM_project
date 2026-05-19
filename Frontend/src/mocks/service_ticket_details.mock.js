export const mockServiceTicketDetails = [
    // Chi tiết phiếu 1: Khắc chữ. Giá: 150k + phụ phí 10k = 160k. SL 2 => 320k. Trả trước: 200k (>= 50%).
    { detail_id: 1, ticket_id: 1, service_id: 3, service_name: 'Khắc chữ Laser', service_price: 150000, extra_cost: 10000, quantity: 2, calculated_price: 160000, subtotal: 320000, prepaid_amount: 200000, remaining_amount: 120000, delivery_date: '2026-06-01', status: 'CHƯA GIAO' },

    // Chi tiết phiếu 2: Đánh bóng. Giá: 50k + phụ phí 0 = 50k. SL 2 => 100k. Trả trước: 50k (50%).
    { detail_id: 2, ticket_id: 2, service_id: 1, service_name: 'Đánh bóng trang sức', service_price: 50000, extra_cost: 0, quantity: 2, calculated_price: 50000, subtotal: 100000, prepaid_amount: 50000, remaining_amount: 50000, delivery_date: '2026-05-16', status: 'ĐÃ GIAO' },

    // Chi tiết phiếu 3: Đính đá thay thế. Giá: 200k + phụ phí 25k = 225k. SL 2 => 450k. Trả trước: 450k (100%).
    { detail_id: 3, ticket_id: 3, service_id: 4, service_name: 'Đính đá thay thế', service_price: 200000, extra_cost: 25000, quantity: 2, calculated_price: 225000, subtotal: 450000, prepaid_amount: 450000, remaining_amount: 0, delivery_date: '2026-05-20', status: 'CHƯA GIAO' }
];