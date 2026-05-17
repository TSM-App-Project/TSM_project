import React, {useState} from 'react';
import Sidebar from '../components/Sidebar';

export default function MainLayout({ children, title = "Dashboard Overview", subtitle = "Welcome back!" }) {
    return (
        <div className="bg-background text-on-background font-body-md min-h-screen">

            <Sidebar />

            <div className="md:ml-[260px] flex flex-col min-h-screen">

                <header className="w-full h-auto bg-transparent flex justify-between items-center py-4 px-gutter z-10 sticky top-0 bg-background/80 backdrop-blur-md">
                    <div className="flex flex-col">
                        <h2 className="font-headline-md text-headline-md text-on-surface font-bold">{title}</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden lg:block w-80">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                            <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-full font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container transition-all" placeholder="Search users, orders, products..." type="text" />
                        </div>

                        <button className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-all relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
                        </button>

                        <div className="flex items-center gap-3">
                            <img alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-surface-container-highest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY-WUOxrHMkvzH9Gydi7O_4mv4MZZsZGxLxLpzwvh33d7rknBIMKJmJuFnAd8rSJQE2Q6oCY_OJ5yxVv4MRX86x7-odgXFA00JFPH6z9A58Rk6vnI4Gkyk-p3BZLYQi5xQUj4CI6eqVuRY8QtoBEeIY0mBJyf40xlFECMP21WwBMNUDv0Z7V_xx2xTYeuks7qluOhaPKdGSx0S8Mr4lw24M8XcMrbA6vPQXJrMW87bAJD9vwmMIy2JRY1eDNdBq51lXRYaTyyR4bmm" />
                            <div className="hidden md:flex flex-col items-start">
                                <span className="font-title-sm text-title-sm text-on-surface font-bold">Admin User</span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">admin@company.com</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-gutter pt-2 flex flex-col gap-stack-md">
                    {children}
                </main>
            </div>
        </div>
    );
}