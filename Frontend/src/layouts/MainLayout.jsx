import React, {useState} from 'react';
import Sidebar from '../components/Sidebar';

export default function MainLayout({ children, title = "Dashboard Overview", subtitle = "Welcome back!", headerActions  }) {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="bg-background text-on-background font-body-md min-h-screen lg:h-screen lg:overflow-hidden">

            <Sidebar />

            <div className="md:ml-[88px] peer-[.is-expanded]:md:ml-[260px] flex flex-col min-h-screen lg:h-screen lg:overflow-hidden transition-all duration-300 ease-in-out">

                <header className="w-full h-auto bg-transparent flex justify-between items-center py-4 px-gutter z-50 sticky top-0 bg-background/80 backdrop-blur-md">
                    <div className="flex flex-col">
                        <h2 className="font-headline-md text-headline-md text-on-surface font-bold">{title}</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p>
                    </div>

                    <div className="flex items-center gap-6">
                        {headerActions}
                        <div className="relative hidden lg:block w-80">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                            <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-full font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container transition-all" placeholder="Search users, orders, products..." type="text" />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-all relative"
                            >
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-outline-variant/20 flex justify-between items-center bg-surface-bright">
                                        <span className="font-title-sm text-title-sm font-bold text-on-surface">Thông báo</span>
                                        <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Đánh dấu đã đọc</span>
                                    </div>

                                    {/* Khung chứa danh sách có thanh cuộn */}
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">

                                        {/* Thông báo 1 */}
                                        <div className="px-4 py-3 border-b border-outline-variant/10 hover:bg-surface-bright transition-colors cursor-pointer flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-sm">local_shipping</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-on-surface">Đơn hàng mới #1024</span>
                                                <span className="text-xs text-on-surface-variant mt-0.5">Khách hàng Serene W vừa đặt một đơn hàng.</span>
                                                <span className="text-[11px] text-primary mt-1">2 phút trước</span>
                                            </div>
                                        </div>

                                        {/* Thông báo 2 */}
                                        <div className="px-4 py-3 border-b border-outline-variant/10 hover:bg-surface-bright transition-colors cursor-pointer flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-sm">inventory_2</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-on-surface">Cảnh báo tồn kho</span>
                                                <span className="text-xs text-on-surface-variant mt-0.5">Fresh Milk đang sắp hết (chỉ còn 5 hộp).</span>
                                                <span className="text-[11px] text-primary mt-1">1 giờ trước</span>
                                            </div>
                                        </div>

                                        {/* Thông báo 3 */}
                                        <div className="px-4 py-3 hover:bg-surface-bright transition-colors cursor-pointer flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-sm">person_add</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-on-surface">Khách hàng mới</span>
                                                <span className="text-xs text-on-surface-variant mt-0.5">James D vừa đăng ký tài khoản thành công.</span>
                                                <span className="text-[11px] text-primary mt-1">Hôm qua</span>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="px-4 py-3 border-t border-outline-variant/20 text-center bg-surface-bright cursor-pointer hover:bg-surface-container-low transition-colors">
                                        <span className="text-sm text-primary font-medium">Xem tất cả thông báo</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <img alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-surface-container-highest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY-WUOxrHMkvzH9Gydi7O_4mv4MZZsZGxLxLpzwvh33d7rknBIMKJmJuFnAd8rSJQE2Q6oCY_OJ5yxVv4MRX86x7-odgXFA00JFPH6z9A58Rk6vnI4Gkyk-p3BZLYQi5xQUj4CI6eqVuRY8QtoBEeIY0mBJyf40xlFECMP21WwBMNUDv0Z7V_xx2xTYeuks7qluOhaPKdGSx0S8Mr4lw24M8XcMrbA6vPQXJrMW87bAJD9vwmMIy2JRY1eDNdBq51lXRYaTyyR4bmm" />
                            <div className="hidden md:flex flex-col items-start">
                                <span className="font-title-sm text-title-sm text-on-surface font-bold">Admin User</span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">admin@company.com</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-gutter pt-2 flex flex-col gap-stack-md lg:overflow-hidden lg:min-h-0">
                    {children}
                </main>
            </div>
        </div>
    );
}