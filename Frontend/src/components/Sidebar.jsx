import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(window.sidebarExpanded || false);

    const handleMouseEnter = () => {
        window.sidebarExpanded = true;
        setIsExpanded(true);
    };

    const handleMouseLeave = () => {
        window.sidebarExpanded = false;
        setIsExpanded(false);
    };
    const location = useLocation();

    // Giả lập role hiện tại (Thay đổi thành 'NHAN_VIEN' để test ẩn tab Master)
    const currentUserRole = 'QUAN_LY';

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
        { path: '/login', icon: 'logout', label: 'Logout' }
    ];

    const renderMenuItem = (item) => {
        // Kiểm tra xem URL hiện tại có khớp với đường dẫn không
        const isActive = location.pathname.startsWith(item.path);

        const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg font-title-sm text-title-sm transition-all duration-200 hover:bg-surface-container-low dark:hover:bg-surface-variant/10 whitespace-nowrap";
        const activeClass = "text-primary dark:text-primary-fixed bg-surface-container-high dark:bg-secondary-container/20 font-bold scale-98";
        const inactiveClass = "text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed";

        return (
            <Link
                key={item.path}
                to={item.path}
                className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
            >
                <span className={`material-symbols-outlined shrink-0 ${isActive ? 'fill' : ''}`}>
                    {item.icon}
                </span>
                <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
            </Link>
        );
    };

    return (
        <nav
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`peer fixed h-full transition-all duration-300 ease-in-out left-0 top-0 bg-surface dark:bg-on-surface flex-col py-6 px-4 gap-stack-md border-r border-outline-variant/30 hidden md:flex z-50 overflow-x-hidden overflow-y-auto custom-scrollbar ${isExpanded ? 'w-[260px] is-expanded' : 'w-[88px]'}`}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8 shrink-0 px-2 whitespace-nowrap">
                <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center text-on-primary shrink-0">
                    <span className="material-symbols-outlined">diamond</span>
                </div>
                <h1 className={`text-headline-md font-headline-md font-bold text-on-surface dark:text-surface-bright transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>TSM</h1>
            </div>

            {/* Menu Main */}
            <div className="shrink-0">
                <div className="flex flex-col gap-2">
                    {/* Render menu dựa theo quyền (Roles) */}
                    {mainMenuItems
                        .filter(item => item.roles.includes(currentUserRole))
                        .map(renderMenuItem)}
                </div>
            </div>

            {/* Menu Other — Đã thêm mt-auto để đẩy sát xuống đáy */}
            <div className="mt-auto shrink-0 pt-6">
                <div className="flex flex-col gap-2">
                    {otherMenuItems.map(renderMenuItem)}
                </div>
            </div>
        </nav>
    );
}