import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { PRODUCTS } from '../mocks/products.mock.js';
import { PRODUCT_CATEGORIES } from '../mocks/productCategories.mock.js';

export default function Products() {
    // ========================================================================
    // 1. KHỞI TẠO DỮ LIỆU & STATE CHO PRODUCTS (SẢN PHẨM)
    // ========================================================================
    const initialProducts = PRODUCTS.map((product, index) => {
        return {
            product_id: product.id || `PRD-${(index + 1).toString().padStart(3, '0')}`,
            sku: product.sku || '',
            category_id: product.categoryId || '',
            product_name: product.nameEn || product.name || 'Sản phẩm chưa có tên',
            gold_rate_id: 1,
            weight: Number(product.weight) || 0,
            gemstone_cost: Number(product.costPrice) || 0,
            labor_cost: Number(product.price) || 0,
            supplier_id: product.supplierId || '',
            stock_quantity: Number(product.stock) || 0,
            status: product.status === 'discontinued' ? 'HIDDEN' : 'ACTIVE'
        };
    });

    const [productList, setProductList] = useState(initialProducts);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        product_id: '', sku: '', category_id: '', product_name: '', gold_rate_id: 1, weight: 0, gemstone_cost: 0, labor_cost: 0, supplier_id: '', stock_quantity: 0, status: 'ACTIVE'
    });

    // ========================================================================
    // 2. KHỞI TẠO DỮ LIỆU & STATE CHO CATEGORIES (LOẠI SẢN PHẨM)
    // ========================================================================
    const initialCategories = PRODUCT_CATEGORIES.map((cat, index) => {
        return {
            category_id: cat.id || `CAT-${(index + 1).toString().padStart(3, '0')}`,
            category_code: cat.nameEn ? cat.nameEn.substring(0, 3).toUpperCase() : 'CAT',
            category_name: cat.name || 'Chưa có tên',
            unit: 'Piece', // Mặc định do file mock chưa có
            status: 'ACTIVE'
        };
    });

    const [categoryList, setCategoryList] = useState(initialCategories);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [deleteConfirmCategory, setDeleteConfirmCategory] = useState(null);
    const [categoryForm, setCategoryForm] = useState({
        category_id: '', category_code: '', category_name: '', unit: 'Piece', status: 'ACTIVE'
    });

    // ========================================================================
    // 3. STATE CHUNG TỔNG HỢP (TABS & TÌM KIẾM)
    // ========================================================================
    const [activeTab, setActiveTab] = useState('products'); // 'products' hoặc 'categories'
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [modalMode, setModalMode] = useState('add');

    // --- Lắng nghe phím ESC để đóng mọi Modal ---
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsProductModalOpen(false);
                setDeleteConfirmProduct(null);
                setIsCategoryModalOpen(false);
                setDeleteConfirmCategory(null);
            }
        };

        if (isProductModalOpen || deleteConfirmProduct || isCategoryModalOpen || deleteConfirmCategory) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isProductModalOpen, deleteConfirmProduct, isCategoryModalOpen, deleteConfirmCategory]);

    // ========================================================================
    // 4. LOGIC XỬ LÝ SẢN PHẨM (PRODUCTS)
    // ========================================================================
    const filteredProducts = productList.filter(p =>
        p.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenProductAddModal = () => {
        const maxNum = productList.reduce((max, p) => {
            const num = parseInt(p.product_id.replace('PRD-', ''), 10);
            return !isNaN(num) && num > max ? num : max;
        }, 0);

        setProductForm({
            product_id: `PRD-${(maxNum + 1).toString().padStart(3, '0')}`,
            sku: '', category_id: '', product_name: '', gold_rate_id: 1, weight: 0, gemstone_cost: 0, labor_cost: 0, supplier_id: '', stock_quantity: 0, status: 'ACTIVE'
        });
        setModalMode('add');
        setErrorMessage('');
        setIsProductModalOpen(true);
    };

    const handleProductInputChange = (e) => {
        const { name, value } = e.target;
        setProductForm(prev => {
            const rawData = { ...prev, [name]: value };
            const numberFields = ['weight', 'gemstone_cost', 'labor_cost', 'stock_quantity', 'gold_rate_id'];
            if (numberFields.includes(name)) {
                rawData[name] = value === '' ? '' : (Number(value) || 0);
            }
            return rawData;
        });
        setErrorMessage('');
    };

    const handleSaveProduct = (e) => {
        e.preventDefault();
        const isDuplicateName = productList.some(p => p.product_name.toLowerCase() === productForm.product_name.toLowerCase() && p.product_id !== productForm.product_id);
        if (isDuplicateName) {
            setErrorMessage('This product name already exists in the system (QĐ4).');
            return;
        }

        const productToSave = {
            ...productForm,
            weight: Number(productForm.weight) || 0,
            gemstone_cost: Number(productForm.gemstone_cost) || 0,
            labor_cost: Number(productForm.labor_cost) || 0,
            stock_quantity: Number(productForm.stock_quantity) || 0,
            gold_rate_id: Number(productForm.gold_rate_id) || 1
        };

        if (modalMode === 'add') {
            setProductList([...productList, productToSave]);
        } else {
            setProductList(productList.map(p => p.product_id === productForm.product_id ? { ...p, ...productToSave } : p));
        }
        setIsProductModalOpen(false);
    };

    const confirmDeleteProduct = () => {
        if (deleteConfirmProduct) {
            setProductList(productList.map(p => p.product_id === deleteConfirmProduct.product_id ? { ...p, status: 'HIDDEN' } : p));
            setDeleteConfirmProduct(null);
        }
    };

    // ========================================================================
    // 5. LOGIC XỬ LÝ LOẠI SẢN PHẨM (CATEGORIES)
    // ========================================================================
    const filteredCategories = categoryList.filter(c =>
        c.category_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenCategoryAddModal = () => {
        const maxNum = categoryList.reduce((max, c) => {
            const num = parseInt(c.category_id.replace('CAT-', ''), 10);
            return !isNaN(num) && num > max ? num : max;
        }, 0);

        setCategoryForm({
            category_id: `CAT-${(maxNum + 1).toString().padStart(3, '0')}`,
            category_code: '', category_name: '', unit: 'Piece', status: 'ACTIVE'
        });
        setModalMode('add');
        setErrorMessage('');
        setIsCategoryModalOpen(true);
    };

    const handleCategoryInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryForm(prev => ({ ...prev, [name]: value }));
        setErrorMessage('');
    };

    const handleSaveCategory = (e) => {
        e.preventDefault();
        const isDuplicateCode = categoryList.some(c => c.category_code.toLowerCase() === categoryForm.category_code.toLowerCase() && c.category_id !== categoryForm.category_id);
        if (isDuplicateCode) {
            setErrorMessage('This Category Code already exists. Please use a unique code.');
            return;
        }

        if (modalMode === 'add') {
            setCategoryList([...categoryList, categoryForm]);
        } else {
            setCategoryList(categoryList.map(c => c.category_id === categoryForm.category_id ? { ...c, ...categoryForm } : c));
        }
        setIsCategoryModalOpen(false);
    };

    const confirmDeleteCategory = () => {
        if (deleteConfirmCategory) {
            setCategoryList(categoryList.map(c => c.category_id === deleteConfirmCategory.category_id ? { ...c, status: 'HIDDEN' } : c));
            setDeleteConfirmCategory(null);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <MainLayout title="Product & Categories" subtitle="Manage your jewelry catalog, classifications, and properties">

            {/* Các thẻ thống kê (Dựa trên dữ liệu Sản phẩm) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
                    <div>
                        <span className="text-sm text-on-surface-variant block mb-1">Total Products</span>
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">
                            {productList.length}
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-primary-container/30 text-primary rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">diamond</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
                    <div>
                        <span className="text-sm text-on-surface-variant block mb-1">Total Categories</span>
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">
                            {categoryList.filter(c => c.status === 'ACTIVE').length}
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-tertiary-container/30 text-tertiary rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">category</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
                    <div>
                        <span className="text-sm text-on-surface-variant block mb-1">Low Stock Products</span>
                        <span className="font-headline-md text-headline-md font-bold text-on-surface text-error">
                            {productList.filter(p => p.stock_quantity <= 5).length}
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-error-container/30 text-error rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">inventory_2</span>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">

                {/* --- HEADER TABS & TÌM KIẾM --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">

                    {/* Component Tabs */}
                    <div className="flex p-1 bg-surface-container-low rounded-lg inline-flex">
                        <button
                            onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'products' ? 'bg-surface-bright text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            Products List
                        </button>
                        <button
                            onClick={() => { setActiveTab('categories'); setSearchQuery(''); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'categories' ? 'bg-surface-bright text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            Product Categories
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                            <input
                                type="text"
                                placeholder={activeTab === 'products' ? "Search Products..." : "Search Categories..."}
                                className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={activeTab === 'products' ? handleOpenProductAddModal : handleOpenCategoryAddModal}
                            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-fixed-dim transition-colors whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            {activeTab === 'products' ? 'Add Product' : 'Add Category'}
                        </button>
                    </div>
                </div>

                {/* --- BODY RENDERING TABLES DỰA THEO TAB --- */}
                <div className="w-full max-h-[500px] overflow-y-auto custom-scrollbar border border-outline-variant/10 rounded-lg">

                    {activeTab === 'products' ? (
                        /* BẢNG PRODUCTS */
                        <table className="w-full text-left border-collapse min-w-[1200px] relative">
                            <thead>
                            <tr className="text-xs text-on-surface-variant border-b border-outline-variant/20 uppercase tracking-wider bg-surface-container-lowest sticky top-0 z-10 shadow-sm">
                                <th className="pb-3 font-medium px-4 py-3">Product ID</th>
                                <th className="pb-3 font-medium px-4 py-3">SKU</th>
                                <th className="pb-3 font-medium px-4 py-3">Product Name</th>
                                <th className="pb-3 font-medium px-4 py-3">Category ID</th>
                                <th className="pb-3 font-medium px-4 py-3">Weight</th>
                                <th className="pb-3 font-medium px-4 py-3">Labor Cost</th>
                                <th className="pb-3 font-medium px-4 py-3">Stock</th>
                                <th className="pb-3 font-medium px-4 py-3">Status</th>
                                <th className="pb-3 font-medium px-4 py-3 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm">
                            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                <tr key={product.product_id} className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors">
                                    <td className="py-3 px-4 font-medium text-on-surface">{product.product_id}</td>
                                    <td className="py-3 px-4 font-mono text-xs text-on-surface-variant">{product.sku}</td>
                                    <td className="py-3 px-4 font-medium text-on-surface max-w-[250px] truncate" title={product.product_name}>{product.product_name}</td>
                                    <td className="py-3 px-4 text-on-surface-variant">{product.category_id}</td>
                                    <td className="py-3 px-4 text-on-surface-variant">{product.weight}</td>
                                    <td className="py-3 px-4 font-medium">{formatCurrency(product.labor_cost)}</td>
                                    <td className="py-3 px-4">
                                            <span className={`font-bold ${product.stock_quantity <= 5 ? 'text-error' : 'text-on-surface'}`}>
                                                {product.stock_quantity}
                                            </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${product.status === 'ACTIVE' ? 'bg-primary' : 'bg-outline-variant'}`}></div>
                                            <span className={`text-xs font-bold ${product.status === 'ACTIVE' ? 'text-primary' : 'text-on-surface-variant'}`}>{product.status}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 flex justify-end gap-2">
                                        <button onClick={() => { setModalMode('edit'); setProductForm({ ...product }); setIsProductModalOpen(true); }} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded transition-colors" title="Edit">
                                            <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                        </button>
                                        {product.status === 'ACTIVE' && (
                                            <button onClick={() => setDeleteConfirmProduct(product)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded transition-colors" title="Hide Product">
                                                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="9" className="py-8 text-center text-on-surface-variant">No products found.</td></tr>
                            )}
                            </tbody>
                        </table>
                    ) : (
                        /* BẢNG CATEGORIES */
                        <table className="w-full text-left border-collapse min-w-[800px] relative">
                            <thead>
                            <tr className="text-xs text-on-surface-variant border-b border-outline-variant/20 uppercase tracking-wider bg-surface-container-lowest sticky top-0 z-10 shadow-sm">
                                <th className="pb-3 font-medium px-4 py-3">Category ID</th>
                                <th className="pb-3 font-medium px-4 py-3">Category Code</th>
                                <th className="pb-3 font-medium px-4 py-3">Category Name</th>
                                <th className="pb-3 font-medium px-4 py-3">Default Unit</th>
                                <th className="pb-3 font-medium px-4 py-3">Status</th>
                                <th className="pb-3 font-medium px-4 py-3 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm">
                            {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
                                <tr key={cat.category_id} className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors">
                                    <td className="py-3 px-4 font-medium text-on-surface">{cat.category_id}</td>
                                    <td className="py-3 px-4 font-mono text-xs text-primary font-bold bg-primary-container/20 px-2 py-1 rounded inline-block mt-2 ml-4">{cat.category_code}</td>
                                    <td className="py-3 px-4 font-medium text-on-surface">{cat.category_name}</td>
                                    <td className="py-3 px-4 text-on-surface-variant">{cat.unit}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${cat.status === 'ACTIVE' ? 'bg-primary' : 'bg-outline-variant'}`}></div>
                                            <span className={`text-xs font-bold ${cat.status === 'ACTIVE' ? 'text-primary' : 'text-on-surface-variant'}`}>{cat.status}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 flex justify-end gap-2">
                                        <button onClick={() => { setModalMode('edit'); setCategoryForm({ ...cat }); setIsCategoryModalOpen(true); }} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded transition-colors" title="Edit Category">
                                            <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                        </button>
                                        {cat.status === 'ACTIVE' && (
                                            <button onClick={() => setDeleteConfirmCategory(cat)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded transition-colors" title="Hide Category">
                                                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="py-8 text-center text-on-surface-variant">No categories found.</td></tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ======================= MODALS CHO PRODUCTS ======================= */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-outline-variant/20">
                            <h3 className="text-title-lg font-semibold text-on-surface">{modalMode === 'add' ? 'Add New Product' : 'Update Product'}</h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="p-5 flex flex-col gap-4">
                            {errorMessage && <div className="p-3 bg-error-container/30 border border-error/50 rounded-lg text-error text-sm font-medium">{errorMessage}</div>}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Product ID</label><input type="text" disabled value={productForm.product_id} className="w-full p-2.5 bg-surface-variant/30 text-on-surface-variant border border-outline-variant/30 rounded-lg cursor-not-allowed font-medium" /></div>
                                <div><label className="block text-sm font-medium mb-1">SKU Code <span className="text-error">*</span></label><input type="text" name="sku" required value={productForm.sku} onChange={handleProductInputChange} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category <span className="text-error">*</span></label>
                                    <select name="category_id" required value={productForm.category_id} onChange={handleProductInputChange} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none">
                                        <option value="" disabled>Select Category</option>
                                        {categoryList.filter(c => c.status === 'ACTIVE').map(cat => (
                                            <option key={cat.category_id} value={cat.category_id}>{cat.category_name} ({cat.category_code})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-3"><label className="block text-sm font-medium mb-1">Product Name <span className="text-error">*</span></label><input type="text" name="product_name" required value={productForm.product_name} onChange={handleProductInputChange} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
                                <div><label className="block text-sm font-medium mb-1">Weight <span className="text-error">*</span></label><input type="number" name="weight" min="0" step="0.01" required value={productForm.weight} onChange={handleProductInputChange} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
                                <div><label className="block text-sm font-medium mb-1">Gemstone Cost (VND)</label><input type="number" name="gemstone_cost" min="0" value={productForm.gemstone_cost} onChange={handleProductInputChange} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
                                <div><label className="block text-sm font-medium mb-1">Labor Cost (VND) <span className="text-error">*</span></label><input type="number" name="labor_cost" min="0" required value={productForm.labor_cost} onChange={handleProductInputChange} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
                                <div><label className="block text-sm font-medium mb-1">Supplier ID</label><input type="text" name="supplier_id" value={productForm.supplier_id} onChange={handleProductInputChange} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
                                <div><label className="block text-sm font-medium mb-1">Stock Quantity <span className="text-error">*</span></label><input type="number" name="stock_quantity" min="0" required value={productForm.stock_quantity} onChange={handleProductInputChange} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
                                {modalMode === 'edit' && (
                                    <div><label className="block text-sm font-medium mb-1">Status</label><select name="status" value={productForm.status} onChange={handleProductInputChange} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none"><option value="ACTIVE">ACTIVE</option><option value="HIDDEN">HIDDEN</option></select></div>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant/20">
                                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-variant/50 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary hover:bg-primary-fixed-dim rounded-lg">{modalMode === 'add' ? 'Add Product' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirmProduct && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md p-6 text-center">
                        <div className="w-16 h-16 bg-error-container/30 text-error rounded-full flex items-center justify-center mx-auto mb-4"><span className="material-symbols-outlined text-3xl">visibility_off</span></div>
                        <h3 className="text-title-lg font-bold mb-2">Confirm Hide Product?</h3>
                        <p className="text-sm text-on-surface-variant mb-6">Are you sure you want to hide <span className="font-bold text-on-surface">{deleteConfirmProduct.product_name}</span>?</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setDeleteConfirmProduct(null)} className="px-5 py-2.5 bg-surface-container-low rounded-lg">Cancel</button>
                            <button onClick={confirmDeleteProduct} className="px-5 py-2.5 bg-error text-white rounded-lg">Yes, Hide</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================= MODALS CHO CATEGORIES ======================= */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-outline-variant/20">
                            <h3 className="text-title-lg font-semibold text-on-surface">{modalMode === 'add' ? 'Add Category' : 'Update Category'}</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSaveCategory} className="p-5 flex flex-col gap-4">
                            {errorMessage && <div className="p-3 bg-error-container/30 border border-error/50 rounded-lg text-error text-sm font-medium">{errorMessage}</div>}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Category ID</label><input type="text" disabled value={categoryForm.category_id} className="w-full p-2.5 bg-surface-variant/30 border border-outline-variant/30 rounded-lg cursor-not-allowed" /></div>
                                <div><label className="block text-sm font-medium mb-1">Category Code <span className="text-error">*</span></label><input type="text" name="category_code" required value={categoryForm.category_code} onChange={handleCategoryInputChange} placeholder="e.g. RNG" className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
                                <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Category Name <span className="text-error">*</span></label><input type="text" name="category_name" required value={categoryForm.category_name} onChange={handleCategoryInputChange} placeholder="e.g. Diamond Rings" className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
                                <div><label className="block text-sm font-medium mb-1">Default Unit <span className="text-error">*</span></label><input type="text" name="unit" required value={categoryForm.unit} onChange={handleCategoryInputChange} placeholder="Piece, Pair..." className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
                                {modalMode === 'edit' && (
                                    <div><label className="block text-sm font-medium mb-1">Status</label><select name="status" value={categoryForm.status} onChange={handleCategoryInputChange} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary outline-none"><option value="ACTIVE">ACTIVE</option><option value="HIDDEN">HIDDEN</option></select></div>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant/20">
                                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 text-sm font-medium bg-surface-container-low rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-lg">{modalMode === 'add' ? 'Add Category' : 'Save Category'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirmCategory && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md p-6 text-center">
                        <div className="w-16 h-16 bg-error-container/30 text-error rounded-full flex items-center justify-center mx-auto mb-4"><span className="material-symbols-outlined text-3xl">visibility_off</span></div>
                        <h3 className="text-title-lg font-bold mb-2">Confirm Hide Category?</h3>
                        <p className="text-sm text-on-surface-variant mb-6">Are you sure you want to hide <span className="font-bold text-on-surface">{deleteConfirmCategory.category_name}</span>?</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setDeleteConfirmCategory(null)} className="px-5 py-2.5 bg-surface-container-low rounded-lg">Cancel</button>
                            <button onClick={confirmDeleteCategory} className="px-5 py-2.5 bg-error text-white rounded-lg">Yes, Hide</button>
                        </div>
                    </div>
                </div>
            )}

        </MainLayout>
    );
}