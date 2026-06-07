import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';

// Đưa dữ liệu khởi tạo trực tiếp vào file để loại bỏ hoàn toàn lỗi import / trắng màn hình
const MOCK_INVENTORY_DETAILS = [
    { detail_id: 'DTL-001', report_id: 'REP-001', report_month: 5, report_year: 2026, product_id: 'PRD-001', product_name: 'Nhẫn Kim Cương Solitaire', unit: 'Chiếc', opening_stock: 10, in_quantity: 5, out_quantity: 3, closing_stock: 12 },
    { detail_id: 'DTL-002', report_id: 'REP-001', report_month: 5, report_year: 2026, product_id: 'PRD-004', product_name: 'Dây Chuyền Ngọc Trai Akoya', unit: 'Sợi', opening_stock: 5, in_quantity: 10, out_quantity: 10, closing_stock: 5 },
    { detail_id: 'DTL-003', report_id: 'REP-002', report_month: 4, report_year: 2026, product_id: 'PRD-006', product_name: 'Bông Tai Kim Cương Halo', unit: 'Đôi', opening_stock: 20, in_quantity: 0, out_quantity: 20, closing_stock: 0 },
    { detail_id: 'DTL-004', report_id: 'REP-001', report_month: 5, report_year: 2026, product_id: 'PRD-008', product_name: 'Lắc Tay Vàng Nhật Ký', unit: 'Chiếc', opening_stock: 8, in_quantity: 2, out_quantity: 2, closing_stock: 8 }
];

export default function Inventory() {
    const [inventoryList, setInventoryList] = useState(MOCK_INVENTORY_DETAILS);
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [deleteConfirmRecord, setDeleteConfirmRecord] = useState(null);

    // Đã chuẩn hóa toàn bộ tên biến khớp 100% với DB (inventory_reports & inventory_report_details)
    const [formData, setFormData] = useState({
        detail_id: '',
        report_id: '',
        report_month: new Date().getMonth() + 1,
        report_year: new Date().getFullYear(),
        product_id: '',
        product_name: '',
        unit: 'Piece',
        opening_stock: 0,
        in_quantity: 0,
        out_quantity: 0,
        closing_stock: 0
    });

    const filteredInventory = inventoryList.filter(item =>
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.detail_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCloseModal = () => setIsModalOpen(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleCloseModal();
                setDeleteConfirmRecord(null);
            }
        };

        if (isModalOpen || deleteConfirmRecord) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalOpen, deleteConfirmRecord]);

    const handleOpenAddModal = () => {
        const maxNum = inventoryList.reduce((max, item) => {
            const num = parseInt(item.detail_id.replace('DTL-', ''), 10);
            return !isNaN(num) && num > max ? num : max;
        }, 0);

        setFormData({
            detail_id: `DTL-${(maxNum + 1).toString().padStart(3, '0')}`,
            report_id: `REP-${new Date().getMonth() + 1}${new Date().getFullYear()}`, // Tự động tạo mã report dựa trên tháng năm
            report_month: new Date().getMonth() + 1,
            report_year: new Date().getFullYear(),
            product_id: '',
            product_name: '',
            unit: 'Piece',
            opening_stock: 0,
            in_quantity: 0,
            out_quantity: 0,
            closing_stock: 0
        });
        setModalMode('add');
        setErrorMessage('');
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (record) => {
        setFormData({ ...record });
        setModalMode('edit');
        setErrorMessage('');
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const rawData = { ...prev, [name]: value };

            const open = value === '' && name === 'opening_stock' ? '' : (Number(rawData.opening_stock) || 0);
            const inQ = value === '' && name === 'in_quantity' ? '' : (Number(rawData.in_quantity) || 0);
            const outQ = value === '' && name === 'out_quantity' ? '' : (Number(rawData.out_quantity) || 0);

            const closing = (Number(rawData.opening_stock) || 0) +
                (Number(rawData.in_quantity) || 0) -
                (Number(rawData.out_quantity) || 0);

            return {
                ...rawData,
                opening_stock: open,
                in_quantity: inQ,
                out_quantity: outQ,
                closing_stock: closing
            };
        });
        setErrorMessage('');
    };

    const handleSave = (e) => {
        e.preventDefault();

        const isDuplicateProductInMonth = inventoryList.some(item =>
            item.product_id === formData.product_id &&
            item.report_month === Number(formData.report_month) &&
            item.report_year === Number(formData.report_year) &&
            item.detail_id !== formData.detail_id
        );

        if (isDuplicateProductInMonth) {
            setErrorMessage('This product already has an inventory report for the selected month and year.');
            return;
        }

        if (formData.closing_stock < 0) {
            setErrorMessage('Closing stock cannot be negative. Please check opening, in, and out quantities.');
            return;
        }

        const recordToSave = {
            ...formData,
            report_month: Number(formData.report_month),
            report_year: Number(formData.report_year),
            opening_stock: Number(formData.opening_stock),
            in_quantity: Number(formData.in_quantity),
            out_quantity: Number(formData.out_quantity),
            closing_stock: Number(formData.closing_stock)
        };

        if (modalMode === 'add') {
            setInventoryList([...inventoryList, recordToSave]);
        } else {
            setInventoryList(inventoryList.map(item => item.detail_id === formData.detail_id ? { ...item, ...recordToSave } : item));
        }
        setIsModalOpen(false);
    };

    const confirmDelete = () => {
        if (deleteConfirmRecord) {
            setInventoryList(inventoryList.filter(item => item.detail_id !== deleteConfirmRecord.detail_id));
            setDeleteConfirmRecord(null);
        }
    };

    const totalInQuantity = filteredInventory.reduce((sum, item) => sum + item.in_quantity, 0);
    const totalOutQuantity = filteredInventory.reduce((sum, item) => sum + item.out_quantity, 0);
    const totalClosingStock = filteredInventory.reduce((sum, item) => sum + item.closing_stock, 0);

    return (
        <MainLayout title="Inventory Reports" subtitle="Manage monthly stock movements and closing balances">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
                    <div>
                        <span className="text-sm text-on-surface-variant block mb-1">Total Closing Stock</span>
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">
                            {totalClosingStock}
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-primary-container/30 text-primary rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">inventory</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
                    <div>
                        <span className="text-sm text-on-surface-variant block mb-1">Total Purchased (In)</span>
                        <span className="font-headline-md text-headline-md font-bold text-primary">
                            +{totalInQuantity}
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-primary-container/30 text-primary rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
                    <div>
                        <span className="text-sm text-on-surface-variant block mb-1">Total Sold (Out)</span>
                        <span className="font-headline-md text-headline-md font-bold text-error">
                            -{totalOutQuantity}
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-error-container/30 text-error rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">shopping_cart_checkout</span>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">

                <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 gap-4">
                    <div className="relative w-full md:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Search by ID, Product Name..."
                            className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-fixed-dim transition-colors whitespace-nowrap w-full md:w-auto"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span> Add Report Entry
                    </button>
                </div>

                <div className="w-full max-h-[500px] overflow-y-auto custom-scrollbar border border-outline-variant/10 rounded-lg">
                    <table className="w-full text-left border-collapse min-w-[900px] relative">
                        <thead>
                        <tr className="text-xs text-on-surface-variant border-b border-outline-variant/20 uppercase tracking-wider bg-surface-container-lowest sticky top-0 z-10 shadow-sm">
                            <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Period (Rep ID)</th>
                            <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Detail ID</th>
                            <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Product ID</th>
                            <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest text-right">Opening Stock</th>
                            <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest text-right">In (Purchase)</th>
                            <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest text-right">Out (Sales)</th>
                            <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest text-right">Closing Stock</th>
                            <th className="pb-3 font-medium px-4 py-3 text-right bg-surface-container-lowest">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm">
                        {filteredInventory.length > 0 ? filteredInventory.map((item) => (
                            <tr key={item.detail_id} className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors">
                                <td className="py-3 px-4 font-medium text-on-surface">
                                    <div className="flex flex-col">
                                            <span className="bg-surface-variant/40 px-2 py-1 rounded text-xs inline-block w-max">
                                                {item.report_month.toString().padStart(2, '0')}/{item.report_year}
                                            </span>
                                        <span className="text-xs text-outline mt-1">{item.report_id}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-on-surface-variant">{item.detail_id}</td>
                                <td className="py-3 px-4 font-medium text-on-surface max-w-[200px] truncate" title={item.product_name}>
                                    <div className="flex flex-col">
                                        <span>{item.product_id}</span>
                                        <span className="text-xs text-outline font-normal">{item.product_name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-right text-on-surface-variant">{item.opening_stock}</td>
                                <td className="py-3 px-4 text-right font-medium text-primary">+{item.in_quantity}</td>
                                <td className="py-3 px-4 text-right font-medium text-error">-{item.out_quantity}</td>
                                <td className="py-3 px-4 text-right">
                                        <span className={`font-bold ${item.closing_stock <= 5 ? 'text-error' : 'text-on-surface'}`}>
                                            {item.closing_stock}
                                        </span>
                                </td>
                                <td className="py-3 px-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => handleOpenEditModal(item)}
                                        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded transition-colors" title="Edit"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirmRecord(item)}
                                        className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded transition-colors" title="Delete Entry"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" className="py-8 text-center text-on-surface-variant">
                                    No inventory records found matching your search.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-outline-variant/20">
                            <h3 className="text-title-lg font-semibold text-on-surface">
                                {modalMode === 'add' ? 'Add Inventory Record (BM12)' : 'Update Inventory Record'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
                            {errorMessage && (
                                <div className="p-3 bg-error-container/30 border border-error/50 rounded-lg flex items-center gap-2 text-error text-sm font-medium">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {errorMessage}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-on-surface mb-1">Detail ID</label>
                                    <input
                                        type="text" disabled
                                        value={formData.detail_id}
                                        className="w-full p-2.5 bg-surface-variant/30 text-on-surface-variant border border-outline-variant/30 rounded-lg cursor-not-allowed font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Report Month <span className="text-error">*</span></label>
                                    <input
                                        type="number" name="report_month" min="1" max="12" required value={formData.report_month} onChange={handleInputChange}
                                        placeholder="1 - 12"
                                        className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Report Year <span className="text-error">*</span></label>
                                    <input
                                        type="number" name="report_year" min="2000" max="2100" required value={formData.report_year} onChange={handleInputChange}
                                        placeholder="2026"
                                        className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-on-surface mb-1">Product ID <span className="text-error">*</span></label>
                                    <input
                                        type="text" name="product_id" required value={formData.product_id} onChange={handleInputChange}
                                        placeholder="PRD-001"
                                        className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-on-surface mb-1">Product Name <span className="text-error">*</span></label>
                                    <input
                                        type="text" name="product_name" required value={formData.product_name} onChange={handleInputChange}
                                        placeholder="Diamond Ring..."
                                        className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Opening Stock <span className="text-error">*</span></label>
                                    <input
                                        type="number" name="opening_stock" min="0" required value={formData.opening_stock} onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Purchased (In) <span className="text-error">*</span></label>
                                    <input
                                        type="number" name="in_quantity" min="0" required value={formData.in_quantity} onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Sold (Out) <span className="text-error">*</span></label>
                                    <input
                                        type="number" name="out_quantity" min="0" required value={formData.out_quantity} onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Closing Stock</label>
                                    <input
                                        type="number" disabled value={formData.closing_stock}
                                        className="w-full p-2.5 bg-primary-container/20 text-primary border border-primary/20 rounded-lg cursor-not-allowed font-bold text-lg text-center"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant/20">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary hover:bg-primary-fixed-dim rounded-lg transition-colors shadow-sm">
                                    {modalMode === 'add' ? 'Add Record' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirmRecord && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-error-container/30 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">delete</span>
                            </div>
                            <h3 className="text-title-lg font-bold text-on-surface mb-2">Delete Inventory Record?</h3>
                            <p className="text-on-surface-variant text-sm mb-6">
                                Are you sure you want to permanently delete the inventory record for <span className="font-bold text-on-surface">{deleteConfirmRecord.product_name}</span> in <span className="font-bold text-on-surface">{deleteConfirmRecord.report_month}/{deleteConfirmRecord.report_year}</span>?
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setDeleteConfirmRecord(null)}
                                    className="px-5 py-2.5 text-sm font-medium bg-surface-container-low text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-5 py-2.5 text-sm font-medium bg-error text-white hover:bg-[#b91c1c] rounded-lg transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span> Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </MainLayout>
    );
}