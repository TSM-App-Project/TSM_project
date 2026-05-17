import React, {useState} from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <nav className="fixed h-full w-[260px] left-0 top-0 bg-surface dark:bg-on-surface flex flex-col p-6 gap-stack-md border-r border-outline-variant/30 hidden md:flex z-20">
            <div className="flex items-center gap-3 mb-8">
                <div
                    className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center text-on-primary">
                 <span className="material-symbols-outlined">diamond</span>
                </div>
                <h1 className="text-headline-md font-headline-md font-bold text-on-surface dark:text-surface-bright">TSM</h1>
            </div>

            <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider mb-2">Main</span>

            <div className="flex flex-col gap-2">
                <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-primary dark:text-primary-fixed bg-surface-container-high dark:bg-secondary-container/20 rounded-lg font-bold font-title-sm text-title-sm scale-98 transition-transform duration-200 hover:bg-surface-container-low dark:hover:bg-surface-variant/10 transition-colors">
                    <span className="material-symbols-outlined fill">dashboard</span>
                    <span>Dashboard</span>
                </Link>
                <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed rounded-lg font-title-sm text-title-sm hover:bg-surface-container-low dark:hover:bg-surface-variant/10 transition-colors">
                    <span className="material-symbols-outlined">shopping_cart</span>
                    <span>Orders</span>
                </Link>
                <Link to="/inventory" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed rounded-lg font-title-sm text-title-sm hover:bg-surface-container-low dark:hover:bg-surface-variant/10 transition-colors">
                    <span className="material-symbols-outlined">inventory_2</span>
                    <span>Inventory</span>
                </Link>
                <Link to="/customers" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed rounded-lg font-title-sm text-title-sm hover:bg-surface-container-low dark:hover:bg-surface-variant/10 transition-colors">
                    <span className="material-symbols-outlined">group</span>
                    <span>Customers</span>
                </Link>
                <Link to="/reports" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed rounded-lg font-title-sm text-title-sm hover:bg-surface-container-low dark:hover:bg-surface-variant/10 transition-colors">
                    <span className="material-symbols-outlined">bar_chart</span>
                    <span>Reports & Analytics</span>
                </Link>
            </div>

            <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider mt-6 mb-2">Other</span>

            <div className="flex flex-col gap-2">
                <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed rounded-lg font-title-sm text-title-sm hover:bg-surface-container-low dark:hover:bg-surface-variant/10 transition-colors">
                    <span className="material-symbols-outlined">settings</span>
                    <span>Settings</span>
                </Link>
                <Link to="/support" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed rounded-lg font-title-sm text-title-sm hover:bg-surface-container-low dark:hover:bg-surface-variant/10 transition-colors">
                    <span className="material-symbols-outlined">help</span>
                    <span>Help/Support</span>
                </Link>
                <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed rounded-lg font-title-sm text-title-sm hover:bg-surface-container-low dark:hover:bg-surface-variant/10 transition-colors">
                    <span className="material-symbols-outlined">logout</span>
                    <span>Logout</span>
                </Link>
            </div>

            <div className="mt-auto bg-primary-fixed-dim/20 rounded-xl p-4 flex flex-col items-start gap-3 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container opacity-10 rounded-full blur-xl"></div>
                <h4 className="font-title-sm text-title-sm text-on-surface font-bold z-10">Need Help?</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant z-10">Contact support team</p>
                <button className="bg-primary-container text-on-primary font-title-sm text-title-sm py-2 px-4 rounded-lg w-full mt-2 z-10 hover:bg-primary transition-colors">Get Support</button>
            </div>
        </nav>
    );
}