import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../layouts/MainLayout';
import { CUSTOMERS, TIER_CONFIG } from '../mocks/customers.mock';

export default function Customers() {
    const currentUserRole = 'QUAN_LY';

    const [customersList, setCustomersList] = useState(CUSTOMERS);
    const [searchQuery, setSearchQuery] = useState('');

    // --- States Modals ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [formData, setFormData] = useState({
        id: '', name: '', email: '', phone: '', address: '',
        totalOrders: 0, totalSpent: 0, tier: 'standard',
        status: 'active', memberSince: '', lastPurchase: '', notes: ''
    });
    const [deleteConfirmCustomer, setDeleteConfirmCustomer] = useState(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // ================= XỬ LÝ PHÍM TẮT =================
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsModalOpen(false);
                setIsDetailModalOpen(false);
                setDeleteConfirmCustomer(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // ================= THỐNG KÊ NHANH =================
    const stats = useMemo(() => {
        const totalCustomers = customersList.length;
        const totalRevenue = customersList.reduce((sum, c) => sum + c.totalSpent, 0);
        const top3 = [...customersList].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 3);
        return { totalCustomers, totalRevenue, top3 };
    }, [customersList]);

    // Bộ lọc dữ liệu theo ô Tìm kiếm
    const filteredCustomers = customersList.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const calculateTier = (spent) => {
        if (spent >= 50000000) return 'platinum';
        if (spent >= 20000000) return 'gold';
        if (spent >= 5000000) return 'silver';
        return 'standard';
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    const formatNumberInput = (amount) => amount ? Number(amount).toLocaleString('en-US') : '';

    // ================= LOGIC FORM THAO TÁC =================
    const handleOpenAdd = () => {
        const maxIdNum = customersList.length > 0 ? Math.max(...customersList.map(c => parseInt(c.id.replace('cus_', '')) || 0)) : 0;
        const nextId = `cus_${(maxIdNum + 1).toString().padStart(3, '0')}`;

        setFormData({
            id: nextId, name: '', email: '', phone: '', address: '',
            totalOrders: 0, totalSpent: 0, tier: 'standard',
            status: 'active', memberSince: new Date().toISOString().split('T')[0], lastPurchase: '', notes: ''
        });
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (customer) => {
        setFormData(customer);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            setCustomersList([formData, ...customersList]);
        } else {
            setCustomersList(customersList.map(c => c.id === formData.id ? formData : c));
        }
        setIsModalOpen(false);
    };

    const confirmDelete = () => {
        if (deleteConfirmCustomer) {
            setCustomersList(customersList.filter(c => c.id !== deleteConfirmCustomer.id));
            setDeleteConfirmCustomer(null);
        }
    };

    const handleDoubleClick = (customer) => {
        setSelectedCustomer(customer);
        setIsDetailModalOpen(true);
    };

    return (
        <MainLayout title="Customers" subtitle="Manage client profiles and view purchasing history">

            {/* THỐNG KÊ NHANH */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col gap-4">
                    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-sm flex items-center justify-between flex-1">
                        <div>
                            <span className="text-sm text-on-surface-variant block mb-1">Total Customers</span>
                            <span className="font-headline-md text-headline-md font-bold text-on-surface">{stats.totalCustomers}</span>
                        </div>
                        <div className="w-12 h-12 bg-primary-container/30 text-primary rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-sm flex items-center justify-between flex-1">
                        <div>
                            <span className="text-sm text-on-surface-variant block mb-1">Total Customer Spending</span>
                            <span className="font-headline-md text-headline-md font-bold text-primary">{formatCurrency(stats.totalRevenue)}</span>
                        </div>
                        <div className="w-12 h-12 bg-tertiary-container/30 text-tertiary rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                        </div>
                    </div>
                </div>

                {/* BẢNG TOP 3 VIP CUSTOMERS */}
                <div className="lg:col-span-2 bg-gradient-to-br from-surface-container-lowest to-surface-bright border border-outline-variant/20 rounded-xl p-card-padding shadow-sm flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-on-surface-variant uppercase mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-warning text-[20px]">workspace_premium</span> Top 3 VIP Customers
                    </h3>
                    <div className="flex flex-col gap-3">
                        {stats.top3.map((vip, index) => (
                            <div key={vip.id} className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/10 shadow-sm transition-transform hover:scale-[1.01] cursor-pointer" onDoubleClick={() => handleDoubleClick(vip)}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'}`}>
                                        <span className="material-symbols-outlined text-[18px]">trophy</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-on-surface text-base">{vip.name}</h4>
                                            <span className={`material-symbols-outlined text-[14px] ${TIER_CONFIG[vip.tier].color.split(' ')[1]}`} title={TIER_CONFIG[vip.tier].label}>{TIER_CONFIG[vip.tier].icon}</span>
                                        </div>
                                        <p className="text-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">call</span> {vip.phone}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-black text-primary block">{formatCurrency(vip.totalSpent)}</span>
                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">{vip.totalOrders} Orders</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* KHUNG BẢNG DỮ LIỆU */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-sm flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="font-title-lg font-bold text-on-surface">Customers Directory</h3>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                            <input type="text" placeholder="Search name, phone, email..." className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant/30 rounded-lg outline-none focus:border-primary text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-fixed-dim transition-colors whitespace-nowrap">
                            <span className="material-symbols-outlined text-[18px]">person_add</span> Add Customer
                        </button>
                    </div>
                </div>

                <div className="w-full max-h-[480px] overflow-y-auto custom-scrollbar border border-outline-variant/10 rounded-lg">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="sticky top-0 bg-surface-container-lowest z-10 shadow-sm font-bold uppercase text-xs text-on-surface-variant">
                        <tr>
                            <th className="p-4 bg-surface-container-lowest">ID</th>
                            <th className="p-4 bg-surface-container-lowest">Customer Name</th>
                            <th className="p-4 bg-surface-container-lowest">Phone Number</th> {/* Cột số điện thoại nằm độc lập ở bảng ngoài */}
                            <th className="p-4 bg-surface-container-lowest">Tier</th>
                            <th className="p-4 bg-surface-container-lowest">Total Spent</th>
                            <th className="p-4 text-center bg-surface-container-lowest">Status</th>
                            <th className="p-4 text-right bg-surface-container-lowest">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm">
                        {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
                            <tr key={c.id} onDoubleClick={() => handleDoubleClick(c)} className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors cursor-pointer" title="Double click to view profile">
                                <td className="p-4 font-bold text-on-surface-variant uppercase">{c.id}</td>
                                <td className="p-4 font-bold text-primary">{c.name}</td>
                                <td className="p-4 text-on-surface font-medium">{c.phone}</td> {/* Hiển thị số điện thoại ở bảng ngoài */}
                                <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${TIER_CONFIG[c.tier].color} border border-current/10`}>
                                            <span className="material-symbols-outlined text-[14px]">{TIER_CONFIG[c.tier].icon}</span>
                                            {TIER_CONFIG[c.tier].label}
                                        </span>
                                </td>
                                <td className="p-4">
                                    <p className="font-semibold text-on-surface">{formatCurrency(c.totalSpent)}</p>
                                    <p className="text-[10px] text-on-surface-variant uppercase">{c.totalOrders} Orders</p>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${c.status === 'active' ? 'bg-green-500' : 'bg-outline-variant'}`}></div>
                                        <span className="text-on-surface-variant text-xs capitalize font-medium">{c.status}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    {currentUserRole === 'QUAN_LY' ? (
                                        <>
                                            <button onClick={() => handleOpenEdit(c)} className="p-1.5 hover:bg-primary-container/20 text-on-surface-variant hover:text-primary rounded mr-2" title="Edit"><span className="material-symbols-outlined text-[20px]">edit_square</span></button>
                                            <button onClick={() => setDeleteConfirmCustomer(c)} className="p-1.5 hover:bg-error-container/20 text-on-surface-variant hover:text-error rounded" title="Delete"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                                        </>
                                    ) : (
                                        <span className="text-xs text-outline italic">Read only</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" className="p-8 text-center text-on-surface-variant">No customers found.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= MODALS: DIALOG POP-UPS ================= */}

            {/* 1. Modal Thêm / Sửa khách hàng */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b flex justify-between items-center bg-primary/5">
                            <h3 className="font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined">{modalMode === 'add' ? 'person_add' : 'manage_accounts'}</span>
                                {modalMode === 'add' ? 'Add New Customer' : 'Edit Customer Profile'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="material-symbols-outlined hover:text-error">close</button>
                        </div>
                        <form className="p-5 flex flex-col gap-5 overflow-y-auto custom-scrollbar" onSubmit={handleSave}>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-on-surface-variant block mb-1">Customer ID</label>
                                    <input type="text" disabled value={formData.id} className="w-full p-2.5 bg-surface-variant/30 rounded-lg border text-on-surface-variant font-mono" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-on-surface-variant block mb-1">Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full p-2.5 bg-surface-bright rounded-lg border outline-none focus:border-primary font-medium">
                                        <option value="active">Active (Mua trong 6 tháng)</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-on-surface-variant block mb-1">Full Name <span className="text-error">*</span></label>
                                    <input type="text" required autoFocus value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 bg-surface-bright rounded-lg border outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-on-surface-variant block mb-1">Phone Number <span className="text-error">*</span></label>
                                    <input type="text" required pattern="[0-9]{10,11}" title="Phone number must be 10-11 digits" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} className="w-full p-2.5 bg-surface-bright rounded-lg border outline-none focus:border-primary" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-on-surface-variant block mb-1">Email Address</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 bg-surface-bright rounded-lg border outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-on-surface-variant block mb-1">Member Since</label>
                                    <input type="date" required value={formData.memberSince} onChange={(e) => setFormData({...formData, memberSince: e.target.value})} className="w-full p-2.5 bg-surface-bright rounded-lg border outline-none focus:border-primary" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase text-on-surface-variant block mb-1">Address</label>
                                <textarea rows="2" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-2.5 bg-surface-bright rounded-lg border outline-none focus:border-primary resize-none"></textarea>
                            </div>

                            <div className="p-4 bg-surface-container-low border border-outline-variant/30 rounded-lg">
                                <h4 className="text-xs font-bold uppercase text-on-surface mb-3 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">analytics</span> Purchasing Data</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs text-on-surface-variant block mb-1">Total Orders</label>
                                        <input type="number" min="0" value={formData.totalOrders} onChange={(e) => setFormData({...formData, totalOrders: parseInt(e.target.value) || 0})} className="w-full p-2 bg-surface-bright rounded border outline-none focus:border-primary" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-on-surface-variant block mb-1">Total Spent (Auto-calculates Tier)</label>
                                        <input
                                            type="text"
                                            value={formatNumberInput(formData.totalSpent)}
                                            onChange={(e) => {
                                                const rawValue = parseFloat(e.target.value.replace(/\D/g, '')) || 0;
                                                setFormData({...formData, totalSpent: rawValue, tier: calculateTier(rawValue)});
                                            }}
                                            className="w-full p-2 bg-surface-bright rounded border outline-none focus:border-primary text-primary font-bold"
                                        />
                                    </div>
                                    <div className="col-span-3 flex items-center gap-2 mt-1">
                                        <span className="text-xs text-on-surface-variant">Current Tier:</span>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${TIER_CONFIG[formData.tier].color} border border-current/10`}>
                                            <span className="material-symbols-outlined text-[12px]">{TIER_CONFIG[formData.tier].icon}</span> {TIER_CONFIG[formData.tier].label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase text-on-surface-variant block mb-1">Customer Notes</label>
                                <textarea rows="2" placeholder="Ghi chú sở thích, sinh nhật, yêu cầu đặc biệt..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full p-2.5 bg-surface-bright rounded-lg border outline-none focus:border-primary resize-none"></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 mt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-medium bg-surface-container-low rounded-lg hover:bg-surface-variant/50 border">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary-fixed-dim shadow-md">Save Customer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Modal Xác nhận xóa khách hàng */}
            {deleteConfirmCustomer && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-sm text-center p-6 animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-error-container/30 text-error rounded-full flex items-center justify-center mx-auto mb-4"><span className="material-symbols-outlined text-3xl">warning</span></div>
                        <h3 className="text-title-lg font-bold mb-2">Delete Customer?</h3>
                        <p className="text-on-surface-variant text-sm mb-6">Xóa hồ sơ khách hàng <span className="font-bold">{deleteConfirmCustomer.name}</span>? Dữ liệu không thể hoàn tác.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setDeleteConfirmCustomer(null)} className="px-5 py-2.5 text-sm font-medium bg-surface-container-low rounded-lg border">Cancel</button>
                            <button onClick={confirmDelete} className="px-5 py-2.5 text-sm font-bold bg-error text-white rounded-lg shadow-sm">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Modal Xem Chi Tiết Khách hàng (Double-click) */}
            {isDetailModalOpen && selectedCustomer && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-3xl animate-in zoom-in-95 overflow-hidden flex flex-col">
                        <div className="p-6 border-b relative" style={{ backgroundColor: '#f8fafc' }}>
                            <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-4 right-4 material-symbols-outlined hover:text-error bg-white p-1.5 rounded-full shadow-sm border text-on-surface-variant">close</button>
                            <div className="flex gap-6 items-center">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black shadow-md border-4 border-white ${TIER_CONFIG[selectedCustomer.tier].color.split(' ')[0]}`}>
                                    {selectedCustomer.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-headline-sm font-black text-on-surface">{selectedCustomer.name}</h2>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${TIER_CONFIG[selectedCustomer.tier].color} border border-current/20 shadow-sm`}>
                                            <span className="material-symbols-outlined text-[16px]">{TIER_CONFIG[selectedCustomer.tier].icon}</span> {TIER_CONFIG[selectedCustomer.tier].label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-6 mt-2">
                                        <p className="text-sm font-medium text-on-surface-variant flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">call</span> {selectedCustomer.phone}</p>
                                        <p className="text-sm font-medium text-on-surface-variant flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">mail</span> {selectedCustomer.email || 'N/A'}</p>
                                    </div>
                                    <p className="text-sm font-medium text-on-surface-variant flex items-center gap-1.5 mt-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {selectedCustomer.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-3 gap-6 bg-surface-container-lowest">
                            <div className="col-span-3 grid grid-cols-4 gap-4">
                                <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant/30 text-center shadow-sm">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Customer ID</p>
                                    <p className="text-title-md font-mono text-on-surface uppercase">{selectedCustomer.id}</p>
                                </div>
                                <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant/30 text-center shadow-sm">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Member Since</p>
                                    <p className="text-title-md text-on-surface font-semibold">{selectedCustomer.memberSince}</p>
                                </div>
                                <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant/30 text-center shadow-sm">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Last Purchase</p>
                                    <p className="text-title-md text-on-surface font-semibold">{selectedCustomer.lastPurchase || 'N/A'}</p>
                                </div>
                                <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant/30 text-center shadow-sm">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Total Orders</p>
                                    <p className="text-title-md text-primary font-black">{selectedCustomer.totalOrders}</p>
                                </div>
                            </div>

                            <div className="col-span-2 bg-yellow-50/50 dark:bg-yellow-900/10 p-5 rounded-xl border border-yellow-200 dark:border-yellow-900/50">
                                <p className="text-xs font-bold text-yellow-800 dark:text-yellow-500 uppercase mb-2 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">sticky_note_2</span> Customer Notes</p>
                                <p className="text-sm text-on-surface font-medium leading-relaxed italic">{selectedCustomer.notes || 'Không có ghi chú chăm sóc nào cho khách hàng này.'}</p>
                            </div>

                            <div className="col-span-1 bg-primary/5 p-5 rounded-xl border border-primary/20 flex flex-col justify-center text-center">
                                <p className="text-xs font-bold text-primary uppercase mb-1">Total Lifetime Value</p>
                                <p className="text-display-sm font-black text-primary truncate" title={formatCurrency(selectedCustomer.totalSpent)}>{formatCurrency(selectedCustomer.totalSpent)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}