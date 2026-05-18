/**
 * SUPPLIERS MOCK DATA — Jewelry supplier / vendor records.
 *
 * Purpose:
 *   Provides a list of suppliers for inventory management, purchase orders,
 *   and product sourcing screens.
 *
 * Rules:
 *   - Do NOT import this directly into page components yet.
 *   - This will be consumed by supplierService.js in Phase 3.
 *   - Supplier IDs are referenced by products.mock.js.
 */

export const SUPPLIERS = [
    {
        id:                 'sup_001',
        name:               'Kim Hoàn Bảo Tín',
        contactPerson:      'Trần Văn Bảo',
        email:              'baotran@baaotin.vn',
        phone:              '0281 234 5678',
        address:            '45 Trần Nhân Tông, Quận 1, TP. Hồ Chí Minh',
        productCategories:  ['cat_001', 'cat_002', 'cat_006'],    // Rings, Necklaces, Sets
        status:             'active',                              // 'active' | 'inactive'
        rating:             5,
        totalOrders:        128,
        joinedDate:         '2022-03-10',
        notes:              'Nhà cung cấp vàng 18K và 24K uy tín, giao hàng nhanh',
    },
    {
        id:                 'sup_002',
        name:               'Ngọc Trai Phương Nam',
        contactPerson:      'Lê Thị Phương',
        email:              'phuong.le@ngoctrai.com',
        phone:              '0362 876 5432',
        address:            '12 Lê Lợi, Quận Hải Châu, Đà Nẵng',
        productCategories:  ['cat_002', 'cat_003'],               // Necklaces, Earrings
        status:             'active',
        rating:             4,
        totalOrders:        74,
        joinedDate:         '2022-09-01',
        notes:              'Chuyên ngọc trai Akoya và ngọc trai nước ngọt cao cấp',
    },
    {
        id:                 'sup_003',
        name:               'Đá Quý Sài Gòn',
        contactPerson:      'Phạm Minh Châu',
        email:              'chau.pham@daquy.vn',
        phone:              '0908 111 2233',
        address:            '78 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
        productCategories:  ['cat_001', 'cat_003', 'cat_006'],    // Rings, Earrings, Sets
        status:             'active',
        rating:             5,
        totalOrders:        95,
        joinedDate:         '2021-11-20',
        notes:              'Nhập khẩu kim cương GIA, ruby và sapphire từ Thái Lan',
    },
    {
        id:                 'sup_004',
        name:               'Bạc Mỹ Nghệ Huế',
        contactPerson:      'Nguyễn Thị Hoa',
        email:              'hoa.nguyen@bacmynghe.vn',
        phone:              '0234 765 4321',
        address:            '23 Lê Huân, TP. Huế, Thừa Thiên Huế',
        productCategories:  ['cat_001', 'cat_004'],               // Rings, Bracelets
        status:             'active',
        rating:             4,
        totalOrders:        52,
        joinedDate:         '2023-02-14',
        notes:              'Sản phẩm bạc thủ công mỹ nghệ truyền thống Huế',
    },
    {
        id:                 'sup_005',
        name:               'Đồng Hồ Cao Cấp Việt',
        contactPerson:      'Hoàng Đức Thắng',
        email:              'thang.hoang@dhcc.vn',
        phone:              '0248 999 0011',
        address:            '10 Hàng Bài, Quận Hoàn Kiếm, Hà Nội',
        productCategories:  ['cat_005'],                          // Watches
        status:             'inactive',
        rating:             3,
        totalOrders:        19,
        joinedDate:         '2023-07-01',
        notes:              'Đang tạm dừng hợp tác do đàm phán hợp đồng mới',
    },
];
