import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();

    // Giả lập role hiện tại (Thay đổi thành 'NHAN_VIEN' để test ẩn tab Master)
    const currentUserRole = 'QUAN_LY';

    // ĐÃ SỬA CHUẨN ĐƯỜNG DẪN KHỚP VỚI CÁC FILE MÀU XANH LÁ BẠN VỪA TẠO
    const mainMenuItems = [
        { path: '/dashboard', icon: 'dashboard', label: 'Dashboard', roles: ['QUAN_LY', 'NHAN_VIEN'] },
        { path: '/master', icon: 'manage_accounts', label: 'Master', roles: ['QUAN_LY'] },
        { path: '/products', icon: 'diamond', label: 'Products', roles: ['QUAN_LY', 'NHAN_VIEN'] },
        { path: '/trading', icon: 'receipt_long', label: 'Sell / Buy', roles: ['QUAN_LY', 'NHAN_VIEN'] },
        { path: '/services', icon: 'handyman', label: 'Services', roles: ['QUAN_LY', 'NHAN_VIEN'] },
        { path: '/customers', icon: 'group', label: 'Customers', roles: ['QUAN_LY', 'NHAN_VIEN'] },
        { path: '/suppliers', icon: 'local_shipping', label: 'Suppliers', roles: ['QUAN_LY', 'NHAN_VIEN'] },
        { path: '/inventory', icon: 'inventory_2', label: 'Inventory', roles: ['QUAN_LY', 'NHAN_VIEN'] }
    ];

    const otherMenuItems = [
        { path: '/settings', icon: 'settings', label: 'Settings' },
        { path: '/support', icon: 'help', label: 'Help/Support' },
        { path: '/login', icon: 'logout', label: 'Logout' }
    ];

    const renderMenuItem = (item) => {
        // Kiểm tra xem URL hiện tại có khớp với đường dẫn không
        const isActive = location.pathname.startsWith(item.path);

        const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg font-title-sm text-title-sm transition-all duration-200 hover:bg-surface-container-low dark:hover:bg-surface-variant/10";
        const activeClass = "text-primary dark:text-primary-fixed bg-surface-container-high dark:bg-secondary-container/20 font-bold scale-98";
        const inactiveClass = "text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed";

        return (
            <Link
                key={item.path}
                to={item.path}
                className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
            >
                <span className={`material-symbols-outlined ${isActive ? 'fill' : ''}`}>
                    {item.icon}
                </span>
                <span>{item.label}</span>
            </Link>
        );
    };

    return (
        // Thêm overflow-y-auto để có thanh cuộn nếu menu quá dài
        <nav className="fixed h-full w-[260px] left-0 top-0 bg-surface dark:bg-on-surface flex flex-col p-6 gap-stack-md border-r border-outline-variant/30 hidden md:flex z-20 overflow-y-auto custom-scrollbar">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8 shrink-0">
                <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined">diamond</span>
                </div>
                <h1 className="text-headline-md font-headline-md font-bold text-on-surface dark:text-surface-bright">TSM</h1>
            </div>

            {/* Menu Main */}
            <div className="shrink-0">
                <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider mb-2 block">Main</span>
                <div className="flex flex-col gap-2">
                    {/* Render menu dựa theo quyền (Roles) */}
                    {mainMenuItems
                        .filter(item => item.roles.includes(currentUserRole))
                        .map(renderMenuItem)}
                </div>
            </div>

            {/* Menu Other */}
            <div className="mt-6 shrink-0">
                <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider mb-2 block">Other</span>
                <div className="flex flex-col gap-2">
                    {otherMenuItems.map(renderMenuItem)}
                </div>
            </div>

            {/* Khối Need Help */}
            <div className="mt-auto pt-6 shrink-0">
                <div className="bg-primary-fixed-dim/20 rounded-xl p-4 flex flex-col items-start gap-3 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container opacity-10 rounded-full blur-xl"></div>
                    <h4 className="font-title-sm text-title-sm text-on-surface font-bold z-10">Need Help?</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant z-10">Contact support team</p>
                    <button className="bg-primary-container text-on-primary font-title-sm text-title-sm py-2 px-4 rounded-lg w-full mt-2 z-10 hover:bg-primary transition-colors">Get Support</button>
                </div>
            </div>
        </nav>
    );
}