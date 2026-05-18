/**
 * PRODUCTS MOCK DATA — Jewelry product catalog.
 *
 * Purpose:
 *   Provides the full product list for inventory, product management,
 *   dashboard top-products widget, and order item selection screens.
 *
 * Rules:
 *   - Do NOT import this directly into page components yet.
 *   - This will be consumed by productService.js in Phase 3.
 *   - categoryId references IDs from productCategories.mock.js.
 *   - supplierId references IDs from suppliers.mock.js.
 *
 * Product status values:
 *   'in_stock'     — Available for sale
 *   'low_stock'    — Stock <= 10 units, needs reorder
 *   'out_of_stock' — Stock = 0
 *   'discontinued' — No longer sold
 */

import { PRODUCT_CATEGORIES } from './productCategories.mock';

// Helper: look up category name by id
const catName = (id) => PRODUCT_CATEGORIES.find(c => c.id === id)?.name ?? '';

export const PRODUCTS = [
    // ── RINGS (cat_001) ──────────────────────────────────────────
    {
        id:           'prd_001',
        sku:          'RNG-DIA-001',
        name:         'Nhẫn Kim Cương Solitaire',
        nameEn:       'Solitaire Diamond Ring',
        categoryId:   'cat_001',
        categoryName: catName('cat_001'),
        supplierId:   'sup_003',
        material:     'Vàng trắng 18K + Kim cương 0.5ct GIA',
        price:        12500000,              // VND
        costPrice:    8000000,
        stock:        24,
        sold:         342,
        status:       'in_stock',
        imageIcon:    'diamond',
        description:  'Nhẫn kim cương solitaire cổ điển, chứng nhận GIA, thiết kế tinh tế.',
        createdAt:    '2024-01-10',
        updatedAt:    '2025-04-20',
    },
    {
        id:           'prd_002',
        sku:          'RNG-GLD-002',
        name:         'Nhẫn Vàng Đính Ngọc',
        nameEn:       'Gold Ring with Pearl',
        categoryId:   'cat_001',
        categoryName: catName('cat_001'),
        supplierId:   'sup_001',
        material:     'Vàng 18K + Ngọc trai Akoya',
        price:        4800000,
        costPrice:    2900000,
        stock:        8,
        sold:         156,
        status:       'low_stock',
        imageIcon:    'circle',
        description:  'Nhẫn vàng 18K đính ngọc trai Akoya tự nhiên, sang trọng và tinh tế.',
        createdAt:    '2024-02-14',
        updatedAt:    '2025-05-01',
    },
    {
        id:           'prd_003',
        sku:          'RNG-SLV-003',
        name:         'Nhẫn Bạc Hoa Văn Huế',
        nameEn:       'Hue Silver Pattern Ring',
        categoryId:   'cat_001',
        categoryName: catName('cat_001'),
        supplierId:   'sup_004',
        material:     'Bạc 925 thủ công',
        price:        850000,
        costPrice:    420000,
        stock:        45,
        sold:         98,
        status:       'in_stock',
        imageIcon:    'circle',
        description:  'Nhẫn bạc chạm khắc hoa văn truyền thống Huế, thủ công 100%.',
        createdAt:    '2024-03-01',
        updatedAt:    '2025-03-15',
    },

    // ── NECKLACES (cat_002) ───────────────────────────────────────
    {
        id:           'prd_004',
        sku:          'NCK-PRL-001',
        name:         'Dây Chuyền Ngọc Trai Akoya',
        nameEn:       'Akoya Pearl Necklace',
        categoryId:   'cat_002',
        categoryName: catName('cat_002'),
        supplierId:   'sup_002',
        material:     'Ngọc trai Akoya 7–7.5mm + Khóa vàng 14K',
        price:        9200000,
        costPrice:    5500000,
        stock:        15,
        sold:         256,
        status:       'in_stock',
        imageIcon:    'spa',
        description:  'Chuỗi ngọc trai Akoya Nhật Bản, màu trắng ánh hồng, khóa vàng 14K.',
        createdAt:    '2024-01-20',
        updatedAt:    '2025-04-10',
    },
    {
        id:           'prd_005',
        sku:          'NCK-GLD-002',
        name:         'Dây Chuyền Vàng Chữ Tâm',
        nameEn:       'Gold Heart Necklace',
        categoryId:   'cat_002',
        categoryName: catName('cat_002'),
        supplierId:   'sup_001',
        material:     'Vàng 18K',
        price:        3600000,
        costPrice:    2100000,
        stock:        0,
        sold:         411,
        status:       'out_of_stock',
        imageIcon:    'favorite',
        description:  'Dây chuyền vàng 18K mặt chữ Tâm, thiết kế mỏng nhẹ, phù hợp đeo hàng ngày.',
        createdAt:    '2024-01-05',
        updatedAt:    '2025-05-10',
    },

    // ── EARRINGS (cat_003) ────────────────────────────────────────
    {
        id:           'prd_006',
        sku:          'ERR-DIA-001',
        name:         'Bông Tai Kim Cương Halo',
        nameEn:       'Halo Diamond Earrings',
        categoryId:   'cat_003',
        categoryName: catName('cat_003'),
        supplierId:   'sup_003',
        material:     'Vàng trắng 18K + Kim cương',
        price:        18900000,
        costPrice:    12000000,
        stock:        6,
        sold:         120,
        status:       'low_stock',
        imageIcon:    'water_drop',
        description:  'Bông tai thiết kế Halo với kim cương trung tâm và hàng kim cương xung quanh.',
        createdAt:    '2024-02-01',
        updatedAt:    '2025-04-30',
    },
    {
        id:           'prd_007',
        sku:          'ERR-PRL-002',
        name:         'Bông Tai Ngọc Trai Nước Ngọt',
        nameEn:       'Freshwater Pearl Earrings',
        categoryId:   'cat_003',
        categoryName: catName('cat_003'),
        supplierId:   'sup_002',
        material:     'Ngọc trai nước ngọt + Bạc 925',
        price:        1200000,
        costPrice:    650000,
        stock:        38,
        sold:         287,
        status:       'in_stock',
        imageIcon:    'water_drop',
        description:  'Bông tai ngọc trai nước ngọt tự nhiên, thanh lịch và dễ phối đồ.',
        createdAt:    '2024-03-10',
        updatedAt:    '2025-02-20',
    },

    // ── BRACELETS (cat_004) ───────────────────────────────────────
    {
        id:           'prd_008',
        sku:          'BRC-GLD-001',
        name:         'Lắc Tay Vàng Nhật Ký',
        nameEn:       'Gold Journal Bracelet',
        categoryId:   'cat_004',
        categoryName: catName('cat_004'),
        supplierId:   'sup_001',
        material:     'Vàng 18K',
        price:        6700000,
        costPrice:    4200000,
        stock:        19,
        sold:         189,
        status:       'in_stock',
        imageIcon:    'toll',
        description:  'Lắc tay vàng 18K mỏng nhẹ, khắc tên theo yêu cầu, quà tặng ý nghĩa.',
        createdAt:    '2024-01-25',
        updatedAt:    '2025-04-05',
    },
    {
        id:           'prd_009',
        sku:          'BRC-SLV-002',
        name:         'Vòng Bạc Thủ Công Đà Lạt',
        nameEn:       'Da Lat Handmade Silver Bangle',
        categoryId:   'cat_004',
        categoryName: catName('cat_004'),
        supplierId:   'sup_004',
        material:     'Bạc 925 thủ công',
        price:        720000,
        costPrice:    360000,
        stock:        52,
        sold:         143,
        status:       'in_stock',
        imageIcon:    'toll',
        description:  'Vòng bạc nguyên khối được chế tác thủ công, hoa văn thiên nhiên độc đáo.',
        createdAt:    '2024-04-01',
        updatedAt:    '2025-03-28',
    },

    // ── WATCHES (cat_005) ─────────────────────────────────────────
    {
        id:           'prd_010',
        sku:          'WCH-LUX-001',
        name:         'Đồng Hồ Trang Sức Nữ',
        nameEn:       'Ladies Luxury Watch',
        categoryId:   'cat_005',
        categoryName: catName('cat_005'),
        supplierId:   'sup_005',
        material:     'Thép không gỉ + Mặt kính sapphire',
        price:        24500000,
        costPrice:    16000000,
        stock:        0,
        sold:         41,
        status:       'discontinued',
        imageIcon:    'watch',
        description:  'Đồng hồ trang sức nữ cao cấp, viền đính đá, chống nước 50m.',
        createdAt:    '2023-10-01',
        updatedAt:    '2024-12-01',
    },

    // ── JEWELRY SETS (cat_006) ────────────────────────────────────
    {
        id:           'prd_011',
        sku:          'SET-DIA-001',
        name:         'Bộ Trang Sức Cô Dâu Kim Cương',
        nameEn:       'Bridal Diamond Jewelry Set',
        categoryId:   'cat_006',
        categoryName: catName('cat_006'),
        supplierId:   'sup_003',
        material:     'Vàng trắng 18K + Kim cương tổng 1.2ct',
        price:        68000000,
        costPrice:    44000000,
        stock:        4,
        sold:         27,
        status:       'low_stock',
        imageIcon:    'diamond',
        description:  'Bộ cô dâu hoàn chỉnh gồm nhẫn, dây chuyền, bông tai kim cương — sang trọng và đẳng cấp.',
        createdAt:    '2024-01-01',
        updatedAt:    '2025-05-01',
    },
];
