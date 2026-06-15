import React, {useState} from 'react';
import Sidebar from '../components/Sidebar';
import { getUserFullName, getUserRole } from '../utils/auth';

export default function MainLayout({ children, title = "Tổng Quan", subtitle = "Chào mừng trở lại!", headerActions  }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const fullName = getUserFullName() || "Người dùng ẩn danh";
    const role = getUserRole() || "Vai trò";

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

                        <div className="flex items-center gap-3">
                            <img alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-surface-container-highest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY-WUOxrHMkvzH9Gydi7O_4mv4MZZsZGxLxLpzwvh33d7rknBIMKJmJuFnAd8rSJQE2Q6oCY_OJ5yxVv4MRX86x7-odgXFA00JFPH6z9A58Rk6vnI4Gkyk-p3BZLYQi5xQUj4CI6eqVuRY8QtoBEeIY0mBJyf40xlFECMP21WwBMNUDv0Z7V_xx2xTYeuks7qluOhaPKdGSx0S8Mr4lw24M8XcMrbA6vPQXJrMW87bAJD9vwmMIy2JRY1eDNdBq51lXRYaTyyR4bmm" />
                            <div className="hidden md:flex flex-col items-start">
                                <span className="font-title-sm text-title-sm text-on-surface font-bold">
                                    {fullName}
                                </span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                                    {role}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-gutter pt-2 flex flex-col gap-stack-md overflow-y-auto custom-scrollbar lg:min-h-0">
                    {children}
                </main>
            </div>
        </div>
    );
}