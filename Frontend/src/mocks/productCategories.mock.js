/**
 * PRODUCT CATEGORIES MOCK DATA — Jewelry category definitions.
 *
 * Purpose:
 *   Provides a static list of product categories for the jewelry store.
 *   Used by product forms, filters, and category breakdowns on the dashboard.
 *
 * Rules:
 *   - Do NOT import this directly into page components yet.
 *   - This will be consumed by productService.js in Phase 3.
 *   - Category IDs are referenced by products.mock.js for cross-referencing.
 */

export const PRODUCT_CATEGORIES = [
    {
        id:          'cat_001',
        name:        'Nhẫn',               // Rings
        nameEn:      'Rings',
        icon:        'circle',
        description: 'Nhẫn vàng, bạch kim, bạc và nhẫn đính đá quý',
        itemCount:   142,
        color:       'bg-primary-fixed-dim/20 text-primary',
    },
    {
        id:          'cat_002',
        name:        'Dây Chuyền',         // Necklaces
        nameEn:      'Necklaces',
        icon:        'link',
        description: 'Dây chuyền vàng, mặt dây chuyền và chuỗi ngọc',
        itemCount:   98,
        color:       'bg-secondary-fixed/50 text-secondary',
    },
    {
        id:          'cat_003',
        name:        'Bông Tai',            // Earrings
        nameEn:      'Earrings',
        icon:        'water_drop',
        description: 'Bông tai, khuyên tai và trang sức tai cao cấp',
        itemCount:   75,
        color:       'bg-tertiary-fixed-dim/20 text-tertiary',
    },
    {
        id:          'cat_004',
        name:        'Vòng Tay',            // Bracelets
        nameEn:      'Bracelets',
        icon:        'toll',
        description: 'Vòng tay, lắc tay và bangles thời trang',
        itemCount:   61,
        color:       'bg-primary-container/20 text-on-primary-container',
    },
    {
        id:          'cat_005',
        name:        'Đồng Hồ',            // Watches
        nameEn:      'Watches',
        icon:        'watch',
        description: 'Đồng hồ cao cấp và đồng hồ trang sức',
        itemCount:   34,
        color:       'bg-surface-container text-on-surface-variant',
    },
    {
        id:          'cat_006',
        name:        'Bộ Trang Sức',        // Jewelry Sets
        nameEn:      'Jewelry Sets',
        icon:        'diamond',
        description: 'Bộ trang sức đầy đủ gồm nhẫn, dây chuyền và bông tai',
        itemCount:   27,
        color:       'bg-error-container/30 text-error',
    },
];
