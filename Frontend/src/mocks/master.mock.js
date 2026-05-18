export const mockUsers = [
    { id: 1, username: 'admin', fullName: 'Huỳnh Long Bảo Khanh', role: 'QUAN_LY', status: 'Active' },
    { id: 2, username: 'nhanvien1', fullName: 'Nguyễn Thị Bán Hàng', role: 'NHAN_VIEN', status: 'Active' },
    { id: 3, username: 'nhanvien2', fullName: 'Trần Văn Kỹ Thuật', role: 'NHAN_VIEN', status: 'Inactive' },
    { id: 4, username: 'kythuat1', fullName: 'Lê Văn Luyện', role: 'NHAN_VIEN', status: 'Active' },
    { id: 5, username: 'kythuat2', fullName: 'Phạm Thị Thợ', role: 'NHAN_VIEN', status: 'Active' },
    { id: 6, username: 'ketoan1', fullName: 'Vũ Tài Chính', role: 'NHAN_VIEN', status: 'Active' },
    { id: 7, username: 'manager2', fullName: 'Hoàng Quản Lý', role: 'QUAN_LY', status: 'Active' },
    { id: 8, username: 'nhanvien3', fullName: 'Đinh Tập Sự', role: 'NHAN_VIEN', status: 'Inactive' },
    { id: 9, username: 'baove1', fullName: 'Ngô An Ninh', role: 'NHAN_VIEN', status: 'Active' },
    { id: 10, username: 'cskh1', fullName: 'Lý Chăm Sóc', role: 'NHAN_VIEN', status: 'Active' },
];

export const mockLogs = [
    { logId: 101, time: '2026-05-18 14:30:00', user: 'admin', action: 'UPDATE', table: 'products', desc: 'Cập nhật giá bán Nhẫn vàng 24K từ 8.0M lên 8.4M' },
    { logId: 102, time: '2026-05-18 10:15:22', user: 'nhanvien1', action: 'INSERT', table: 'invoices', desc: 'Lập hóa đơn bán hàng #HD001 tổng 8.400.000đ' },
    { logId: 103, time: '2026-05-17 16:45:10', user: 'nhanvien2', action: 'INSERT', table: 'service_tickets', desc: 'Lập phiếu dịch vụ #DV001 khách Lê Thị VIP' },
    { logId: 104, time: '2026-05-17 09:00:05', user: 'admin', action: 'DELETE', table: 'customers', desc: 'Xóa hồ sơ khách hàng rác ID #99' },
    { logId: 105, time: '2026-05-16 14:20:00', user: 'manager2', action: 'UPDATE', table: 'product_categories', desc: 'Thay đổi % lợi nhuận Vàng 24K thành 5%' },
    { logId: 106, time: '2026-05-16 11:10:00', user: 'ketoan1', action: 'INSERT', table: 'purchase_receipts', desc: 'Nhập hàng từ PNJ tổng 50.000.000đ' },
    { logId: 107, time: '2026-05-15 08:30:00', user: 'admin', action: 'INSERT', table: 'users', desc: 'Thêm tài khoản nhân viên mới: baove1' },
    { logId: 108, time: '2026-05-15 08:35:00', user: 'admin', action: 'UPDATE', table: 'users', desc: 'Khóa tài khoản nhanvien3' },
    { logId: 109, time: '2026-05-14 15:40:00', user: 'nhanvien1', action: 'DELETE', table: 'invoice_details', desc: 'Xóa dòng sản phẩm lỗi khỏi hóa đơn #HD005' },
    { logId: 110, time: '2026-05-14 10:00:00', user: 'kythuat1', action: 'UPDATE', table: 'service_ticket_details', desc: 'Cập nhật trạng thái phiếu #DV002 thành ĐÃ GIAO' },
];