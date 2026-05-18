import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { mockUsers, mockLogs } from '../mocks/master.mock';

const formatRole = (roleCode) => {
    if (roleCode === 'QUAN_LY') return 'Quản lý';
    if (roleCode === 'NHAN_VIEN') return 'Nhân viên';
    return roleCode;
};

export default function Master() {
    const currentUserRole = 'QUAN_LY';

    const [userList, setUserList] = useState(mockUsers);
    const [activeTab, setActiveTab] = useState('accounts');
    const [searchQuery, setSearchQuery] = useState('');

    // State Modal Thêm/Sửa
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [formData, setFormData] = useState({
        id: '', username: '', password: '', fullName: '', role: 'NHAN_VIEN', status: 'Active'
    });

    // State Modal Xác nhận Xóa
    const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

    const roleColors = {
        'QUAN_LY': { bg: '#e0f2fe', text: '#0369a1' },
        'NHAN_VIEN': { bg: '#f3f4f6', text: '#374151' }
    };

    const actionColors = {
        'INSERT': { bg: '#a7e4cd', text: '#006d5b' },
        'UPDATE': { bg: '#ffcce0', text: '#9e003a' },
        'DELETE': { bg: '#ffe4e6', text: '#9e0000' }
    };

    // --- Logic Thêm/Sửa ---
    const handleOpenAddModal = () => {
        const maxId = userList.length > 0 ? Math.max(...userList.map(u => u.id)) : 0;
        setFormData({ id: maxId + 1, username: '', password: '', fullName: '', role: 'NHAN_VIEN', status: 'Active' });
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setFormData({ ...user, password: '' });
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            setUserList([...userList, formData]);
        } else {
            setUserList(userList.map(u => u.id === formData.id ? { ...u, ...formData } : u));
        }
        setIsModalOpen(false);
    };

    // --- Logic Xóa ---
    const confirmDelete = () => {
        if (deleteConfirmUser) {
            setUserList(userList.filter(u => u.id !== deleteConfirmUser.id));
            setDeleteConfirmUser(null);
        }
    };

    if (currentUserRole !== 'QUAN_LY') {
        return (
            <MainLayout title="Access Denied" subtitle="Unauthorized Access">
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <span className="material-symbols-outlined text-6xl text-error mb-4">gpp_maybe</span>
                    <h2 className="text-headline-md font-bold text-on-surface">Bạn không có quyền truy cập</h2>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Master Data" subtitle="Manage system accounts and monitor security logs">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
                    <div>
                        <span className="text-sm text-on-surface-variant block mb-1">Total Accounts</span>
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">
                            {userList.length}
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-primary-container/30 text-primary rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">manage_accounts</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
                    <div>
                        <span className="text-sm text-on-surface-variant block mb-1">Total Log Events</span>
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">
                            {mockLogs.length}
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-error-container/30 text-error rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">policy</span>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex p-1 bg-surface-container-low rounded-lg inline-flex">
                        <button
                            onClick={() => setActiveTab('accounts')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'accounts' ? 'bg-surface-bright text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            Account Management
                        </button>
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'logs' ? 'bg-surface-bright text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            System Audit Logs
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                            {/* Placeholder thay đổi theo Tab hiện tại */}
                            <input
                                type="text"
                                placeholder={activeTab === 'accounts' ? "Search users..." : "Search records..."}
                                className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {activeTab === 'accounts' && (
                            <button
                                onClick={handleOpenAddModal}
                                className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-fixed-dim transition-colors whitespace-nowrap"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span> Add User
                            </button>
                        )}
                    </div>
                </div>

                {/* THÊM overflow-y-auto VÀ max-h ĐỂ CUỘN BẢNG. XÓA PHẦN FOOTER PHÂN TRANG */}
                <div className="w-full max-h-[500px] overflow-y-auto custom-scrollbar border border-outline-variant/10 rounded-lg">
                    {activeTab === 'accounts' ? (
                        <table className="w-full text-left border-collapse min-w-[800px] relative">
                            <thead>
                            {/* Thêm sticky top-0 và màu nền để thanh tiêu đề trượt bám phía trên */}
                            <tr className="text-xs text-on-surface-variant border-b border-outline-variant/20 uppercase tracking-wider bg-surface-container-lowest sticky top-0 z-10 shadow-sm">
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">User ID</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Username</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Full Name</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Role</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Status</th>
                                <th className="pb-3 font-medium px-4 py-3 text-right bg-surface-container-lowest">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm">
                            {userList.map((user) => (
                                <tr key={user.id} className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors">
                                    <td className="py-3 px-4 font-medium text-on-surface">USR-{user.id.toString().padStart(3, '0')}</td>
                                    <td className="py-3 px-4 text-on-surface-variant">{user.username}</td>
                                    <td className="py-3 px-4 text-on-surface font-medium">{user.fullName}</td>
                                    <td className="py-3 px-4">
                                            <span
                                                style={{ backgroundColor: roleColors[user.role]?.bg, color: roleColors[user.role]?.text }}
                                                className="inline-block px-3 py-1 rounded-md text-xs font-bold border border-black/5"
                                            >
                                                {formatRole(user.role)}
                                            </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-primary' : 'bg-error'}`}></div>
                                            <span className="text-on-surface-variant">{user.status}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 flex justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenEditModal(user)}
                                            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded transition-colors" title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirmUser(user)} // Kích hoạt Modal Xóa
                                            className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded transition-colors" title="Delete"
                                        >
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
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Time</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">User</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Action</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Affected Table</th>
                                <th className="pb-3 font-medium px-4 py-3 bg-surface-container-lowest">Description / Changes</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm">
                            {mockLogs.map((log) => (
                                <tr key={log.logId} className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors">
                                    <td className="py-3 px-4 text-on-surface-variant whitespace-nowrap">{log.time}</td>
                                    <td className="py-3 px-4 font-medium text-on-surface">{log.user}</td>
                                    <td className="py-3 px-4">
                                            <span style={{ backgroundColor: actionColors[log.action]?.bg, color: actionColors[log.action]?.text }} className="inline-block px-2.5 py-1 rounded-md text-xs font-bold border border-black/5">
                                                {log.action}
                                            </span>
                                    </td>
                                    <td className="py-3 px-4 text-on-surface-variant font-mono text-xs">{log.table}</td>
                                    <td className="py-3 px-4 text-on-surface max-w-md truncate" title={log.desc}>{log.desc}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ======================= GIAO DIỆN MODAL THÊM/SỬA ======================= */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-outline-variant/20">
                            <h3 className="text-title-lg font-semibold text-on-surface">
                                {modalMode === 'add' ? 'Add New User' : 'Edit User Account'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1">User ID</label>
                                <input
                                    type="text" disabled
                                    value={`USR-${formData.id.toString().padStart(3, '0')}`}
                                    className="w-full p-2.5 bg-surface-variant/30 text-on-surface-variant border border-outline-variant/30 rounded-lg cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1">Username <span className="text-error">*</span></label>
                                <input
                                    type="text" name="username" required value={formData.username} onChange={handleInputChange}
                                    placeholder="e.g. jdoe123"
                                    className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1">Full Name <span className="text-error">*</span></label>
                                <input
                                    type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-1">
                                    Password {modalMode === 'add' && <span className="text-error">*</span>}
                                </label>
                                <input
                                    type="password" name="password" required={modalMode === 'add'} value={formData.password} onChange={handleInputChange}
                                    placeholder={modalMode === 'edit' ? "Leave blank to keep current password" : "Enter secure password"}
                                    className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Role</label>
                                    <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none">
                                        <option value="NHAN_VIEN">Nhân viên</option>
                                        <option value="QUAN_LY">Quản lý</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface mb-1">Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2.5 bg-surface-bright border border-outline-variant/50 text-on-surface rounded-lg focus:ring-2 focus:ring-primary outline-none">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant/20">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-on-primary hover:bg-primary-fixed-dim rounded-lg transition-colors shadow-sm">
                                    {modalMode === 'add' ? 'Create User' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================= GIAO DIỆN MODAL XÁC NHẬN XÓA ======================= */}
            {deleteConfirmUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-error-container/30 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">warning</span>
                            </div>
                            <h3 className="text-title-lg font-bold text-on-surface mb-2">Delete User?</h3>
                            <p className="text-on-surface-variant text-sm mb-6">
                                Are you sure you want to delete the account
                                <span className="font-bold text-on-surface"> {deleteConfirmUser.username} </span>?
                                This action cannot be undone.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setDeleteConfirmUser(null)}
                                    className="px-5 py-2.5 text-sm font-medium bg-surface-container-low text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-5 py-2.5 text-sm font-medium bg-error text-white hover:bg-[#b91c1c] rounded-lg transition-colors shadow-sm"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </MainLayout>
    );
}