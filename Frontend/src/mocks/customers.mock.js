/**
 * CUSTOMERS MOCK DATA — Customer records for the jewelry store.
 *
 * Purpose:
 *   Provides customer data for the Customers page, customer search,
 *   order associations, and membership tier displays.
 *
 * Rules:
 *   - Do NOT import this directly into page components yet.
 *   - This will be consumed by customerService.js in Phase 3.
 *
 * Membership tier thresholds (VND total spend):
 *   'standard'  — < 5,000,000
 *   'silver'    — 5,000,000 – 19,999,999
 *   'gold'      — 20,000,000 – 49,999,999
 *   'platinum'  — >= 50,000,000
 *
 * Customer status:
 *   'active'   — Has purchased in the last 6 months
 *   'inactive' — No purchase in the last 6 months
 */

export const CUSTOMERS = [
    {
        id:           'cus_001',
        name:         'Nguyễn Minh Ánh',
        email:        'minhanh.nguyen@gmail.com',
        phone:        '0901 234 111',
        address:      '12 Lý Tự Trọng, Quận 1, TP. Hồ Chí Minh',
        totalOrders:  28,
        totalSpent:   82400000,     // VND
        tier:         'platinum',
        status:       'active',
        memberSince:  '2022-03-15',
        lastPurchase: '2025-05-10',
        notes:        'Khách VIP, ưu tiên thông báo bộ sưu tập mới và sự kiện ra mắt.',
    },
    {
        id:           'cus_002',
        name:         'Trần Thị Bích',
        email:        'bich.tran@outlook.com',
        phone:        '0912 345 222',
        address:      '45 Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh',
        totalOrders:  14,
        totalSpent:   36700000,
        tier:         'gold',
        status:       'active',
        memberSince:  '2023-01-08',
        lastPurchase: '2025-04-22',
        notes:        'Thường mua nhẫn và dây chuyền vàng làm quà sinh nhật.',
    },
    {
        id:           'cus_003',
        name:         'Lê Quốc Hùng',
        email:        'quochung.le@company.vn',
        phone:        '0938 456 333',
        address:      '78 Trần Phú, TP. Đà Nẵng',
        totalOrders:  9,
        totalSpent:   14200000,
        tier:         'silver',
        status:       'active',
        memberSince:  '2023-06-20',
        lastPurchase: '2025-03-18',
        notes:        'Mua bộ trang sức cô dâu cho đám cưới. Quan tâm dịch vụ khắc tên.',
    },
    {
        id:           'cus_004',
        name:         'Phạm Thu Hà',
        email:        'thuha.pham@gmail.com',
        phone:        '0977 567 444',
        address:      '5 Đinh Tiên Hoàng, Quận Hoàn Kiếm, Hà Nội',
        totalOrders:  21,
        totalSpent:   51900000,
        tier:         'platinum',
        status:       'active',
        memberSince:  '2021-11-30',
        lastPurchase: '2025-05-05',
        notes:        'Khách quen lâu năm tại Hà Nội. Yêu thích kim cương và ngọc trai.',
    },
    {
        id:           'cus_005',
        name:         'Hoàng Văn Nam',
        email:        'vannam.hoang@yahoo.com',
        phone:        '0345 678 555',
        address:      '33 Lê Lợi, TP. Huế',
        totalOrders:  4,
        totalSpent:   3800000,
        tier:         'standard',
        status:       'active',
        memberSince:  '2024-08-01',
        lastPurchase: '2025-02-14',
        notes:        'Khách mới, mua quà Valentine. Tiềm năng upsell lên Silver.',
    },
    {
        id:           'cus_006',
        name:         'Vũ Thị Lan',
        email:        'thilan.vu@gmail.com',
        phone:        '0862 789 666',
        address:      '90 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh',
        totalOrders:  6,
        totalSpent:   8100000,
        tier:         'silver',
        status:       'inactive',
        memberSince:  '2023-04-11',
        lastPurchase: '2024-10-03',
        notes:        'Không có giao dịch 7 tháng. Nên gửi ưu đãi tái kích hoạt.',
    },
    {
        id:           'cus_007',
        name:         'Đặng Minh Tú',
        email:        'minhtu.dang@icloud.com',
        phone:        '0793 890 777',
        address:      '17 Bà Triệu, Quận Hai Bà Trưng, Hà Nội',
        totalOrders:  18,
        totalSpent:   29500000,
        tier:         'gold',
        status:       'active',
        memberSince:  '2022-07-19',
        lastPurchase: '2025-04-30',
        notes:        'Hay mua bộ trang sức làm quà kỷ niệm. Nhắc sinh nhật vợ vào 15/9.',
    },
    {
        id:           'cus_008',
        name:         'Bùi Thị Ngọc',
        email:        'thingoc.bui@gmail.com',
        phone:        '0919 901 888',
        address:      '55 Hai Bà Trưng, Quận 1, TP. Hồ Chí Minh',
        totalOrders:  3,
        totalSpent:   2150000,
        tier:         'standard',
        status:       'inactive',
        memberSince:  '2024-12-25',
        lastPurchase: '2025-01-10',
        notes:        'Mua quà Tết. Chưa có nhiều giao dịch, cần chăm sóc thêm.',
    },
];

/**
 * Tier metadata — display labels and color styles for each tier.
 * Usage: TIER_CONFIG[customer.tier]
 */
export const TIER_CONFIG = {
    standard: { label: 'Standard', color: 'bg-blue-100 text-blue-700', icon: 'person' },
    silver:   { label: 'Silver',   color: 'bg-slate-200 text-slate-700', icon: 'workspace_premium' },
    gold:     { label: 'Gold',     color: 'bg-yellow-100 text-yellow-700', icon: 'star' },
    platinum: { label: 'Platinum', color: 'bg-secondary-fixed/50 text-secondary', icon: 'diamond' },
};
