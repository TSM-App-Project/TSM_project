import React, {useState} from 'react';
import MainLayout from '../layouts/MainLayout';

export default function Dashboard() {
    return (
        <MainLayout title="Dashboard Overview" subtitle="Welcome back! Your grocery store's performance view">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="bg-primary-container text-on-primary rounded-xl p-card-padding flex flex-col gap-4 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start z-10">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined bg-white/20 p-1.5 rounded-lg text-sm">attach_money</span>
                            <span className="font-title-sm text-title-sm font-medium">Total Revenue</span>
                        </div>
                        <span className="material-symbols-outlined bg-white/20 p-1 rounded-full text-xs">arrow_outward</span>
                    </div>
                    <div className="flex justify-between items-end mt-2 z-10">
                        <div>
                            <h3 className="font-display-lg text-display-lg">$24,582</h3>
                            <div className="flex items-center gap-1 text-sm mt-1">
                                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                                <span>18.2% this week</span>
                            </div>
                        </div>
                        <div className="w-20 h-10 sparkline-up"></div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding flex flex-col gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined bg-primary-fixed-dim/20 text-primary p-1.5 rounded-lg text-sm">shopping_cart</span>
                            <span className="font-title-sm text-title-sm font-medium">Total Orders</span>
                        </div>
                        <span className="material-symbols-outlined text-outline-variant p-1 rounded-full text-xs border border-outline-variant/30">arrow_outward</span>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                        <div>
                            <h3 className="font-display-lg text-display-lg text-on-surface">3,842</h3>
                            <div className="flex items-center gap-1 text-sm mt-1 text-primary-container">
                                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                                <span>12.5% this week</span>
                            </div>
                        </div>
                        <div className="w-20 h-10 sparkline-up-green"></div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding flex flex-col gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined bg-secondary-fixed/50 text-secondary p-1.5 rounded-lg text-sm">inventory_2</span>
                            <span className="font-title-sm text-title-sm font-medium">Total Product</span>
                        </div>
                        <span className="material-symbols-outlined text-outline-variant p-1 rounded-full text-xs border border-outline-variant/30">arrow_outward</span>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                        <div>
                            <h3 className="font-display-lg text-display-lg text-on-surface">1,247</h3>
                            <div className="flex items-center gap-1 text-sm mt-1 text-error">
                                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                                <span>2.3% this week</span>
                            </div>
                        </div>
                        <div className="w-20 h-10 sparkline-down-red"></div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding flex flex-col gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined bg-tertiary-fixed-dim/20 text-tertiary p-1.5 rounded-lg text-sm">group</span>
                            <span className="font-title-sm text-title-sm font-medium">Active Customers</span>
                        </div>
                        <span className="material-symbols-outlined text-outline-variant p-1 rounded-full text-xs border border-outline-variant/30">arrow_outward</span>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                        <div>
                            <h3 className="font-display-lg text-display-lg text-on-surface">8,234</h3>
                            <div className="flex items-center gap-1 text-sm mt-1 text-primary-container">
                                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                                <span>24.6% this week</span>
                            </div>
                        </div>
                        <div className="w-20 h-10 sparkline-up-green"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-headline-md text-headline-md text-on-surface">Sales By Category</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="font-display-lg text-display-lg text-on-surface">$18,200.82</span>
                                <span className="flex items-center gap-1 bg-primary-fixed-dim/20 text-primary px-2 py-0.5 rounded-md text-sm font-medium">
                                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 8.24%
                                </span>
                            </div>
                        </div>
                        <select className="bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg focus:ring-primary-container focus:border-primary-container block p-2">
                            <option>Weekly</option>
                            <option>Monthly</option>
                            <option>Yearly</option>
                        </select>
                    </div>
                    <div className="flex-1 w-full min-h-[250px] relative chart-mockup mt-4 border-l border-b border-outline-variant/20">
                        <div className="absolute left-[-40px] top-0 h-full flex flex-col justify-between text-xs text-on-surface-variant pb-8">
                            <span>$4,700</span>
                            <span>$4,600</span>
                            <span>$4,500</span>
                            <span>$4,400</span>
                            <span>$0</span>
                        </div>
                        <div className="absolute bottom-[-30px] w-full flex justify-between text-xs text-on-surface-variant px-4">
                            <span>MON</span>
                            <span>TUE</span>
                            <span>WEB</span>
                            <span>THU</span>
                            <span>FRI</span>
                            <span>SAT</span>
                            <span>SUN</span>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center relative">
                    <div className="w-full flex justify-between items-center mb-6">
                        <h3 className="font-title-sm text-title-sm text-on-surface font-semibold">Sales By Category</h3>
                        <select className="bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg focus:ring-primary-container focus:border-primary-container block p-1.5">
                            <option>Monthly</option>
                        </select>
                    </div>
                    <div className="relative w-[200px] h-[200px] donut-mockup mt-4">
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-headline-md text-headline-md font-bold text-on-surface">16,100</span>
                            <span className="bg-primary-container text-on-primary text-xs px-2 py-0.5 rounded-full mt-1">+ 45%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-8 w-full px-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
                            <div>
                                <span className="text-xs text-on-surface-variant block">Dairy</span>
                                <span className="font-semibold text-sm text-on-surface">25,500</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary-container"></div>
                            <div>
                                <span className="text-xs text-on-surface-variant block">Fruits</span>
                                <span className="font-semibold text-sm text-on-surface">34,000</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary-fixed-dim"></div>
                            <div>
                                <span className="text-xs text-on-surface-variant block">Vegetables</span>
                                <span className="font-semibold text-sm text-on-surface">25,600</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
                            <div>
                                <span className="text-xs text-on-surface-variant block">Meat</span>
                                <span className="font-semibold text-sm text-on-surface">17,000</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center border-t border-outline-variant/20 pt-4 w-full">
                        <span className="text-xs text-on-surface-variant block mb-1">Total Number of Sales</span>
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">3,40,0031</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-8">

                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Top Products</h3>
                        <select className="bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg p-1.5">
                            <option>Monthly</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between p-3 hover:bg-surface-bright rounded-lg transition-colors border border-transparent hover:border-outline-variant/10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-surface-variant rounded-md overflow-hidden flex items-center justify-center">
                                    <span className="material-symbols-outlined text-outline">local_drink</span>
                                </div>
                                <div>
                                    <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">Fresh Milk</h4>
                                    <span className="text-xs text-on-surface-variant">342 sold</span>
                                </div>
                            </div>
                            <span className="font-semibold text-on-surface">$684.00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 hover:bg-surface-bright rounded-lg transition-colors border border-transparent hover:border-outline-variant/10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-surface-variant rounded-md overflow-hidden flex items-center justify-center">
                                    <span className="material-symbols-outlined text-outline">bakery_dining</span>
                                </div>
                                <div>
                                    <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">Wheat Bread</h4>
                                    <span className="text-xs text-on-surface-variant">256 sold</span>
                                </div>
                            </div>
                            <span className="font-semibold text-on-surface">$512.00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 hover:bg-surface-bright rounded-lg transition-colors border border-transparent hover:border-outline-variant/10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-surface-variant rounded-md overflow-hidden flex items-center justify-center">
                                    <span className="material-symbols-outlined text-outline">eco</span>
                                </div>
                                <div>
                                    <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">Emerald Velvet</h4>
                                    <span className="text-xs text-on-surface-variant">120 sold</span>
                                </div>
                            </div>
                            <span className="font-semibold text-on-surface">$355.90</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Recent Order</h3>
                        <button className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface px-3 py-1.5 border border-outline-variant/30 rounded-lg">
                            <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
                        </button>
                    </div>
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="text-xs text-on-surface-variant border-b border-outline-variant/20 uppercase tracking-wider">
                                <th className="pb-3 font-medium px-4">#</th>
                                <th className="pb-3 font-medium px-4">Product</th>
                                <th className="pb-3 font-medium px-4">Date</th>
                                <th className="pb-3 font-medium px-4">Status</th>
                                <th className="pb-3 font-medium px-4">Price</th>
                                <th className="pb-3 font-medium px-4">Customer</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm">
                            <tr className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors">
                                <td className="py-4 px-4 text-on-surface-variant">1</td>
                                <td className="py-4 px-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-surface-variant rounded flex items-center justify-center">
                                        <span className="material-symbols-outlined text-sm">local_drink</span>
                                    </div>
                                    <span className="font-medium text-on-surface">Fresh Dairy</span>
                                </td>
                                <td className="py-4 px-4 text-on-surface-variant">May 5</td>
                                <td className="py-4 px-4">
                                    <span className="inline-block bg-primary-fixed-dim/20 text-primary-container px-3 py-1 rounded-full text-xs font-medium">Received</span>
                                </td>
                                <td className="py-4 px-4 font-medium text-on-surface">$145.80</td>
                                <td className="py-4 px-4 text-on-surface-variant">M-Starlight</td>
                            </tr>
                            <tr className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors">
                                <td className="py-4 px-4 text-on-surface-variant">2</td>
                                <td className="py-4 px-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-surface-variant rounded flex items-center justify-center">
                                        <span className="material-symbols-outlined text-sm">local_florist</span>
                                    </div>
                                    <span className="font-medium text-on-surface">Vegetables</span>
                                </td>
                                <td className="py-4 px-4 text-on-surface-variant">May 4</td>
                                <td className="py-4 px-4">
                                    <span className="inline-block bg-primary-fixed-dim/20 text-primary-container px-3 py-1 rounded-full text-xs font-medium">Received</span>
                                </td>
                                <td className="py-4 px-4 font-medium text-on-surface">$210.30</td>
                                <td className="py-4 px-4 text-on-surface-variant">Serene W</td>
                            </tr>
                            <tr className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors">
                                <td className="py-4 px-4 text-on-surface-variant">3</td>
                                <td className="py-4 px-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-surface-variant rounded flex items-center justify-center">
                                        <span className="material-symbols-outlined text-sm">egg</span>
                                    </div>
                                    <span className="font-medium text-on-surface">Rang Eggs</span>
                                </td>
                                <td className="py-4 px-4 text-on-surface-variant">May 3</td>
                                <td className="py-4 px-4">
                                    <span className="inline-block bg-primary-fixed-dim/20 text-primary-container px-3 py-1 rounded-full text-xs font-medium">Received</span>
                                </td>
                                <td className="py-4 px-4 font-medium text-on-surface">$298.40</td>
                                <td className="py-4 px-4 text-on-surface-variant">James D</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}