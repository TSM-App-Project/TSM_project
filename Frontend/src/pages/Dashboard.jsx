import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';

const initialSales = [
    { invoice_id: 'INV-001', created_at: '2026-05-15', customer_id: 'CUS-001', user_id: 'USR-001', total_amount: 15500000, details: [{ detail_id: 1, product_id: 'PRD-001', quantity: 1, unit_price: 15500000 }] },
    { invoice_id: 'INV-002', created_at: '2026-05-18', customer_id: 'CUS-002', user_id: 'USR-001', total_amount: 8500000, details: [{ detail_id: 2, product_id: 'PRD-002', quantity: 1, unit_price: 8500000 }] }
];

const initialPurchases = [
    { purchase_id: 'REC-001', purchase_date: '2026-05-10', supplier_id: 'SUP-001', user_id: 'USR-002', total_amount: 50000000, details: [{ detail_id: 1, product_id: 'PRD-001', quantity: 5, purchase_price: 10000000 }] }
];

export default function Trading() {
    const [activeTab, setActiveTab] = useState('sales');
    const [salesList, setSalesList] = useState(initialSales);
    const [purchasesList, setPurchasesList] = useState(initialPurchases);
    const [searchQuery, setSearchQuery] = useState('');

    const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [deleteConfirmRecord, setDeleteConfirmRecord] = useState(null);

    const [salesForm, setSalesForm] = useState({
        invoice_id: '', created_at: new Date().toISOString().split('T')[0], customer_id: '', user_id: 'USR-001', items: [{ detail_id: Date.now(), product_id: '', quantity: 1, unit_price: 0 }]
    });

    const [purchaseForm, setPurchaseForm] = useState({
        purchase_id: '', purchase_date: new Date().toISOString().split('T')[0], supplier_id: '', user_id: 'USR-001', items: [{ detail_id: Date.now(), product_id: '', quantity: 1, purchase_price: 0 }]
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsSalesModalOpen(false);
                setIsPurchaseModalOpen(false);
                setDeleteConfirmRecord(null);
            }
        };

        if (isSalesModalOpen || isPurchaseModalOpen || deleteConfirmRecord) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isSalesModalOpen, isPurchaseModalOpen, deleteConfirmRecord]);

    const handleOpenSalesModal = () => {
        const maxNum = salesList.reduce((max, s) => {
            const num = parseInt(s.invoice_id.replace('INV-', ''), 10);
            return !isNaN(num) && num > max ? num : max;
        }, 0);
        setSalesForm({
            invoice_id: `INV-${(maxNum + 1).toString().padStart(3, '0')}`,
            created_at: new Date().toISOString().split('T')[0],
            customer_id: '',
            user_id: 'USR-001',
            items: [{ detail_id: Date.now(), product_id: '', quantity: 1, unit_price: 0 }]
        });
        setIsSalesModalOpen(true);
    };

    const handleOpenPurchaseModal = () => {
        const maxNum = purchasesList.reduce((max, p) => {
            const num = parseInt(p.purchase_id.replace('REC-', ''), 10);
            return !isNaN(num) && num > max ? num : max;
        }, 0);
        setPurchaseForm({
            purchase_id: `REC-${(maxNum + 1).toString().padStart(3, '0')}`,
            purchase_date: new Date().toISOString().split('T')[0],
            supplier_id: '',
            user_id: 'USR-001',
            items: [{ detail_id: Date.now(), product_id: '', quantity: 1, purchase_price: 0 }]
        });
        setIsPurchaseModalOpen(true);
    };

    const handleAddSalesItem = () => setSalesForm(prev => ({ ...prev, items: [...prev.items, { detail_id: Date.now(), product_id: '', quantity: 1, unit_price: 0 }] }));
    const handleRemoveSalesItem = (detail_id) => setSalesForm(prev => ({ ...prev, items: prev.items.filter(item => item.detail_id !== detail_id) }));

    const handleAddPurchaseItem = () => setPurchaseForm(prev => ({ ...prev, items: [...prev.items, { detail_id: Date.now(), product_id: '', quantity: 1, purchase_price: 0 }] }));
    const handleRemovePurchaseItem = (detail_id) => setPurchaseForm(prev => ({ ...prev, items: prev.items.filter(item => item.detail_id !== detail_id) }));

    const handleSalesItemChange = (detail_id, field, value) => {
        setSalesForm(prev => ({
            ...prev, items: prev.items.map(item => item.detail_id === detail_id ? { ...item, [field]: value } : item)
        }));
    };

    const handlePurchaseItemChange = (detail_id, field, value) => {
        setPurchaseForm(prev => ({
            ...prev, items: prev.items.map(item => item.detail_id === detail_id ? { ...item, [field]: value } : item)
        }));
    };

    const calculateTotal = (items, priceField) => items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item[priceField])), 0);

    const handleSaveSales = (e) => {
        e.preventDefault();
        const total = calculateTotal(salesForm.items, 'unit_price');
        const payloadToBackend = {
            invoice_id: salesForm.invoice_id,
            customer_id: salesForm.customer_id,
            user_id: salesForm.user_id,
            total_amount: total,
            created_at: salesForm.created_at,
            details: salesForm.items.map(item => ({
                product_id: item.product_id,
                quantity: Number(item.quantity),
                unit_price: Number(item.unit_price)
            }))
        };

        setSalesList([payloadToBackend, ...salesList]);
        setIsSalesModalOpen(false);
    };

    const handleSavePurchase = (e) => {
        e.preventDefault();
        const total = calculateTotal(purchaseForm.items, 'purchase_price');
        const payloadToBackend = {
            purchase_id: purchaseForm.purchase_id,
            supplier_id: purchaseForm.supplier_id,
            user_id: purchaseForm.user_id,
            total_amount: total,
            purchase_date: purchaseForm.purchase_date,
            details: purchaseForm.items.map(item => ({
                product_id: item.product_id,
                quantity: Number(item.quantity),
                purchase_price: Number(item.purchase_price)
            }))
        };

        setPurchasesList([payloadToBackend, ...purchasesList]);
        setIsPurchaseModalOpen(false);
    };

    const confirmDelete = () => {
        if (deleteConfirmRecord) {
            if (activeTab === 'sales') {
                setSalesList(salesList.filter(s => s.invoice_id !== deleteConfirmRecord.invoice_id));
            } else {
                setPurchasesList(purchasesList.filter(p => p.purchase_id !== deleteConfirmRecord.purchase_id));
            }
            setDeleteConfirmRecord(null);
        }
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const filteredSales = salesList.filter(s => s.invoice_id.toLowerCase().includes(searchQuery.toLowerCase()) || s.customer_id.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredPurchases = purchasesList.filter(p => p.purchase_id.toLowerCase().includes(searchQuery.toLowerCase()) || p.supplier_id.toLowerCase().includes(searchQuery.toLowerCase()));

    const totalSalesRevenue = salesList.reduce((sum, s) => sum + s.total_amount, 0);
    const totalPurchaseCost = purchasesList.reduce((sum, p) => sum + p.total_amount, 0);

    return (
        <MainLayout title="Trading & Transactions" subtitle="Manage Sales Invoices and Purchase Receipts">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
                    <div>
                        <span className="text-sm text-on-surface-variant block mb-1">Total Sales Revenue</span>
                        <span className="font-headline-md text-headline-md font-bold text-primary">
                            {formatCurrency(totalSalesRevenue)}
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-primary-container/30 text-primary rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">trending_up</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
                    <div>
                        <span className="text-sm text-on-surface-variant block mb-1">Total Purchase Costs</span>
                        <span className="font-headline-md text-headline-md font-bold text-error">
                            {formatCurrency(totalPurchaseCost)}
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-error-container/30 text-error rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">shopping_cart</span>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex p-1 bg-surface-container-low rounded-lg inline-flex">
                        <button
                            onClick={() => { setActiveTab('sales'); setSearchQuery(''); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'sales' ? 'bg-surface-bright text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            Sales Invoices
                        </button>
                        <button
                            onClick={() => { setActiveTab('purchases'); setSearchQuery(''); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'purchases' ? 'bg-surface-bright text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            Purchase Receipts
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                            <input
                                type="text"
                                placeholder={`Search by ID...`}
                                className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={activeTab === 'sales' ? handleOpenSalesModal : handleOpenPurchaseModal}
                            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-fixed-dim transition-colors whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span> {activeTab === 'sales' ? 'Add Invoice' : 'Add Receipt'}
                        </button>
                    </div>
                </div>

                <div className="w-full max-h-[500px] overflow-y-auto custom-scrollbar border border-outline-variant/10 rounded-lg">
                    {activeTab === 'sales' ? (
                        <table className="w-full text-left border-collapse min-w-[900px] relative">
                            <thead>
                            <tr className="text-xs text-on-surface-variant border-b border-outline-variant/20 uppercase tracking-wider bg-surface-container-lowest sticky top-0 z-10 shadow-sm">
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Invoice ID</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Created At</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Customer ID</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">User ID</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest text-right">Total Amount</th>
                                <th className="pb-3 font-medium px-4 py-3 text-right bg-surface-container-lowest">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm">
                            {filteredSales.map((sale) => (
                                <tr key={sale.invoice_id} className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors">
                                    <td className="py-3 px-4 font-medium text-on-surface">{sale.invoice_id}</td>
                                    <td className="py-3 px-4 text-on-surface-variant">{sale.created_at}</td>
                                    <td className="py-3 px-4 font-medium text-primary">{sale.customer_id}</td>
                                    <td className="py-3 px-4 text-on-surface-variant">{sale.user_id}</td>
                                    <td className="py-3 px-4 font-bold text-primary text-right">{formatCurrency(sale.total_amount)}</td>
                                    <td className="py-3 px-4 flex justify-end gap-2">
                                        <button onClick={() => setDeleteConfirmRecord(sale)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded transition-colors" title="Delete">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[900px] relative">
                            <thead>
                            <tr className="text-xs text-on-surface-variant border-b border-outline-variant/20 uppercase tracking-wider bg-surface-container-lowest sticky top-0 z-10 shadow-sm">
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Purchase ID</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Purchase Date</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Supplier ID</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">User ID</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest text-right">Total Amount</th>
                                <th className="pb-3 font-medium px-4 py-3 text-right bg-surface-container-lowest">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm">
                            {filteredPurchases.map((purchase) => (
                                <tr key={purchase.purchase_id} className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors">
                                    <td className="py-3 px-4 font-medium text-on-surface">{purchase.purchase_id}</td>
                                    <td className="py-3 px-4 text-on-surface-variant">{purchase.purchase_date}</td>
                                    <td className="py-3 px-4 font-medium text-error">{purchase.supplier_id}</td>
                                    <td className="py-3 px-4 text-on-surface-variant">{purchase.user_id}</td>
                                    <td className="py-3 px-4 font-bold text-error text-right">{formatCurrency(purchase.total_amount)}</td>
                                    <td className="py-3 px-4 flex justify-end gap-2">
                                        <button onClick={() => setDeleteConfirmRecord(purchase)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded transition-colors" title="Delete">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* MODAL SALES */}
            {isSalesModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-outline-variant/20">
                            <h3 className="text-title-lg font-semibold text-on-surface">Create Sales Invoice</h3>
                            <button onClick={() => setIsSalesModalOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-5 overflow-y-auto custom-scrollbar">
                            <form id="salesForm" onSubmit={handleSaveSales} className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-1">Invoice ID</label>
                                        <input type="text" disabled value={salesForm.invoice_id} className="w-full p-2.5 bg-surface-variant/30 text-on-surface-variant border border-outline-variant/30 rounded-lg cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-1">Created At <span className="text-error">*</span></label>
                                        <input type="date" required value={salesForm.created_at} onChange={(e) => setSalesForm({...salesForm, created_at: e.target.value})} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-1">Customer ID <span className="text-error">*</span></label>
                                        <input type="text" required value={salesForm.customer_id} onChange={(e) => setSalesForm({...salesForm, customer_id: e.target.value})} placeholder="CUS-001" className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-1">User ID (Cashier) <span className="text-error">*</span></label>
                                        <input type="text" required value={salesForm.user_id} onChange={(e) => setSalesForm({...salesForm, user_id: e.target.value})} placeholder="USR-001" className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="border border-outline-variant/30 rounded-lg overflow-hidden">
                                    <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant/30 flex justify-between items-center">
                                        <h4 className="font-medium text-on-surface">Invoice Details</h4>
                                        <button type="button" onClick={handleAddSalesItem} className="text-sm font-medium text-primary hover:bg-primary-container/30 px-3 py-1.5 rounded transition-colors flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[18px]">add</span> Add Row
                                        </button>
                                    </div>
                                    <div className="p-4 bg-surface-bright flex flex-col gap-3">
                                        {salesForm.items.map((item) => (
                                            <div key={item.detail_id} className="flex flex-wrap md:flex-nowrap gap-3 items-end">
                                                <div className="w-full md:w-[40%]">
                                                    <label className="block text-xs text-on-surface-variant mb-1">Product ID <span className="text-error">*</span></label>
                                                    <input required type="text" value={item.product_id} onChange={(e) => handleSalesItemChange(item.detail_id, 'product_id', e.target.value)} placeholder="PRD-001" className="w-full p-2 border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm" />
                                                </div>
                                                <div className="w-full md:w-[20%]">
                                                    <label className="block text-xs text-on-surface-variant mb-1">Quantity <span className="text-error">*</span></label>
                                                    <input required type="number" min="1" value={item.quantity} onChange={(e) => handleSalesItemChange(item.detail_id, 'quantity', e.target.value)} className="w-full p-2 border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm" />
                                                </div>
                                                <div className="w-full md:w-[30%]">
                                                    <label className="block text-xs text-on-surface-variant mb-1">Unit Price <span className="text-error">*</span></label>
                                                    <input required type="number" min="0" value={item.unit_price} onChange={(e) => handleSalesItemChange(item.detail_id, 'unit_price', e.target.value)} className="w-full p-2 border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm" />
                                                </div>
                                                <div className="w-full md:w-[10%] flex justify-end">
                                                    <button type="button" onClick={() => handleRemoveSalesItem(item.detail_id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors" title="Remove Row">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-surface-container-low px-4 py-3 border-t border-outline-variant/30 flex justify-between items-center">
                                        <span className="font-medium text-on-surface-variant">Total Amount:</span>
                                        <span className="font-bold text-title-lg text-primary">{formatCurrency(calculateTotal(salesForm.items, 'unit_price'))}</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-5 border-t border-outline-variant/20 flex justify-end gap-3 bg-surface-container-lowest">
                            <button type="button" onClick={() => setIsSalesModalOpen(false)} className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors">Cancel</button>
                            <button type="submit" form="salesForm" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary hover:bg-primary-fixed-dim rounded-lg transition-colors shadow-sm">Save Invoice</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL PURCHASES */}
            {isPurchaseModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-outline-variant/20">
                            <h3 className="text-title-lg font-semibold text-on-surface">Create Purchase Receipt</h3>
                            <button onClick={() => setIsPurchaseModalOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-5 overflow-y-auto custom-scrollbar">
                            <form id="purchaseForm" onSubmit={handleSavePurchase} className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-1">Purchase ID</label>
                                        <input type="text" disabled value={purchaseForm.purchase_id} className="w-full p-2.5 bg-surface-variant/30 text-on-surface-variant border border-outline-variant/30 rounded-lg cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-1">Purchase Date <span className="text-error">*</span></label>
                                        <input type="date" required value={purchaseForm.purchase_date} onChange={(e) => setPurchaseForm({...purchaseForm, purchase_date: e.target.value})} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-1">Supplier ID <span className="text-error">*</span></label>
                                        <input type="text" required value={purchaseForm.supplier_id} onChange={(e) => setPurchaseForm({...purchaseForm, supplier_id: e.target.value})} placeholder="SUP-001" className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface mb-1">User ID (Staff) <span className="text-error">*</span></label>
                                        <input type="text" required value={purchaseForm.user_id} onChange={(e) => setPurchaseForm({...purchaseForm, user_id: e.target.value})} placeholder="USR-001" className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="border border-outline-variant/30 rounded-lg overflow-hidden">
                                    <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant/30 flex justify-between items-center">
                                        <h4 className="font-medium text-on-surface">Receipt Details</h4>
                                        <button type="button" onClick={handleAddPurchaseItem} className="text-sm font-medium text-primary hover:bg-primary-container/30 px-3 py-1.5 rounded transition-colors flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[18px]">add</span> Add Row
                                        </button>
                                    </div>
                                    <div className="p-4 bg-surface-bright flex flex-col gap-3">
                                        {purchaseForm.items.map((item) => (
                                            <div key={item.detail_id} className="flex flex-wrap md:flex-nowrap gap-3 items-end">
                                                <div className="w-full md:w-[40%]">
                                                    <label className="block text-xs text-on-surface-variant mb-1">Product ID <span className="text-error">*</span></label>
                                                    <input required type="text" value={item.product_id} onChange={(e) => handlePurchaseItemChange(item.detail_id, 'product_id', e.target.value)} placeholder="PRD-001" className="w-full p-2 border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm" />
                                                </div>
                                                <div className="w-full md:w-[20%]">
                                                    <label className="block text-xs text-on-surface-variant mb-1">Quantity <span className="text-error">*</span></label>
                                                    <input required type="number" min="1" value={item.quantity} onChange={(e) => handlePurchaseItemChange(item.detail_id, 'quantity', e.target.value)} className="w-full p-2 border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm" />
                                                </div>
                                                <div className="w-full md:w-[30%]">
                                                    <label className="block text-xs text-on-surface-variant mb-1">Purchase Price <span className="text-error">*</span></label>
                                                    <input required type="number" min="0" value={item.purchase_price} onChange={(e) => handlePurchaseItemChange(item.detail_id, 'purchase_price', e.target.value)} className="w-full p-2 border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm" />
                                                </div>
                                                <div className="w-full md:w-[10%] flex justify-end">
                                                    <button type="button" onClick={() => handleRemovePurchaseItem(item.detail_id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors" title="Remove Row">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-surface-container-low px-4 py-3 border-t border-outline-variant/30 flex justify-between items-center">
                                        <span className="font-medium text-on-surface-variant">Total Cost:</span>
                                        <span className="font-bold text-title-lg text-error">{formatCurrency(calculateTotal(purchaseForm.items, 'purchase_price'))}</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-5 border-t border-outline-variant/20 flex justify-end gap-3 bg-surface-container-lowest">
                            <button type="button" onClick={() => setIsPurchaseModalOpen(false)} className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors">Cancel</button>
                            <button type="submit" form="purchaseForm" className="px-4 py-2 text-sm font-medium bg-error text-white hover:bg-[#b91c1c] rounded-lg transition-colors shadow-sm">Save Receipt</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XÓA */}
            {deleteConfirmRecord && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-error-container/30 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">delete</span>
                            </div>
                            <h3 className="text-title-lg font-bold text-on-surface mb-2">Delete Record?</h3>
                            <p className="text-on-surface-variant text-sm mb-6">
                                Are you sure you want to delete <span className="font-bold text-on-surface">{deleteConfirmRecord.invoice_id || deleteConfirmRecord.purchase_id}</span>? This action cannot be undone.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button onClick={() => setDeleteConfirmRecord(null)} className="px-5 py-2.5 text-sm font-medium bg-surface-container-low text-on-surface hover:bg-surface-container-high rounded-lg transition-colors">Cancel</button>
                                <button onClick={confirmDelete} className="px-5 py-2.5 text-sm font-medium bg-error text-white hover:bg-[#b91c1c] rounded-lg transition-colors shadow-sm">Yes, Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </MainLayout>
    );
}