import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { DASHBOARD_CHART_DATA, DASHBOARD_STAT_CARDS } from '../mocks/dashboard.mock';

const StatCard = ({ id, activeCard, onClick, icon, title, value, percent, isUp, iconBgColor }) => {
    const isActive = activeCard === id;

    const baseClass = "cursor-pointer rounded-xl p-card-padding flex flex-col gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all duration-300";
    const activeClass = "bg-primary-container text-on-primary scale-105";
    const inactiveClass = "bg-surface-container-lowest border border-outline-variant/20 hover:border-primary-container/50";

    const strokeColor = isActive ? "#ffffff" : (isUp ? "#10b981" : "#ef4444");
    const pathData = isUp
        ? "M0 25L20 15L40 20L60 5L80 10L100 0"
        : "M0 5L20 15L40 10L60 25L80 20L100 30";

    return (
        <div onClick={() => onClick(id)} className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}>
            {isActive && <div className="absolute -right-10 -top-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>}
            <div className="flex justify-between items-start z-10">
                <div className={`flex items-center gap-2 ${isActive ? '' : 'text-on-surface-variant'}`}>
                    <span className={`material-symbols-outlined p-1.5 rounded-lg text-sm ${isActive ? 'bg-white/20' : iconBgColor}`}>{icon}</span>
                    <span className="font-title-sm text-title-sm font-medium">{title}</span>
                </div>
                <span className={`material-symbols-outlined p-1 rounded-full text-xs ${isActive ? 'bg-white/20' : 'text-outline-variant border border-outline-variant/30'}`}>arrow_outward</span>
            </div>
            <div className="flex justify-between items-end mt-2 z-10">
                <div>
                    <h3 className={`font-display-lg text-display-lg ${isActive ? '' : 'text-on-surface'}`}>{value}</h3>
                    <div className={`flex items-center gap-1 text-sm mt-1 ${isActive ? '' : (isUp ? 'text-primary-container' : 'text-error')}`}>
                        <span className="material-symbols-outlined text-[16px]">{isUp ? 'arrow_upward' : 'arrow_downward'}</span>
                        <span>{percent}</span>
                    </div>
                </div>

                <svg className="w-20 h-10" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d={pathData} stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

            </div>
        </div>
    );
};

export default function Dashboard() {
    const [activeCard, setActiveCard] = useState('revenue');

    const chartData = DASHBOARD_CHART_DATA;

    const currentChart = chartData[activeCard];

    return (
        <MainLayout title="Dashboard Overview" subtitle="Welcome back! Your grocery store's performance view" headerActions={
            <button className="flex items-center gap-2 h-10 px-4 bg-[#10b981] hover:bg-[#0e9f6e] text-white active:scale-95 transition-all duration-200 rounded-full font-title-sm text-sm font-semibold shadow-md">
                <span className="material-symbols-outlined text-[18px]">download</span>Export
            </button>}>
            <div className="flex flex-col gap-4 lg:flex-1 lg:min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
                    {DASHBOARD_STAT_CARDS.map((card) => (
                        <StatCard
                            key={card.id}
                            id={card.id}
                            activeCard={activeCard}
                            onClick={setActiveCard}
                            icon={card.icon}
                            title={card.title}
                            value={card.value}
                            percent={card.percent}
                            isUp={card.isUp}
                            iconBgColor={card.iconBgColor}
                        />
                    ))}

                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:flex-1 lg:min-h-0 lg:grid-rows-1">
                    <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col lg:h-full lg:min-h-0">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-headline-md text-headline-md text-on-surface">{currentChart.title}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="font-display-lg text-display-lg text-on-surface">{currentChart.value}</span>
                                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-medium ${currentChart.isUp ? 'bg-primary-fixed-dim/20 text-primary' : 'bg-error-container text-error'}`}>
                                    <span className="material-symbols-outlined text-[16px]">{currentChart.isUp ? 'arrow_upward' : 'arrow_downward'}</span>
                                        {currentChart.percent}
                                </span>
                                </div>
                            </div>
                            <select className="bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg focus:ring-primary-container focus:border-primary-container block p-2">
                                <option>Weekly</option>
                                <option>Monthly</option>
                                <option>Yearly</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full min-h-[180px] lg:min-h-0 relative mt-2 border-l border-b border-outline-variant/20 transition-all duration-500">

                            {/* Cột mốc số trục Y động */}
                            <div className="absolute left-[-40px] top-0 h-full flex flex-col justify-between text-xs text-on-surface-variant pb-8">
                                {currentChart.yLabels.map((label, idx) => (
                                    <span key={idx}>{label}</span>
                                ))}
                            </div>

                            {/* SVG Vẽ biểu đồ động */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                                {/* Phần đổ màu bóng mờ dưới đường line */}
                                <path
                                    d={currentChart.fillPath}
                                    fill={currentChart.fillColor}
                                    className="transition-all duration-500"
                                />
                                {/* Đường line biểu đồ */}
                                <path
                                    d={currentChart.path}
                                    stroke={currentChart.color}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                    className="transition-all duration-500"
                                />
                            </svg>

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

                    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center relative lg:h-full lg:min-h-0">
                        <div className="w-full flex justify-between items-center mb-4 lg:mb-2">
                            <h3 className="font-title-sm text-title-sm text-on-surface font-semibold">Sales By Category</h3>
                            <select className="bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg focus:ring-primary-container focus:border-primary-container block p-1.5">
                                <option>Weekly</option>
                                <option>Monthly</option>
                                <option>Yearly</option>
                            </select>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center w-full gap-6 lg:gap-8">

                            {/* Vòng tròn Donut */}
                            <div className="relative w-[160px] h-[160px] lg:w-[130px] lg:h-[130px] xl:w-[160px] xl:h-[160px] donut-mockup">
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="font-headline-md text-headline-md font-bold text-on-surface">16,100</span>
                                    <span className="bg-primary-container text-on-primary text-xs px-2 py-0.5 rounded-full mt-1">+ 45%</span>
                                </div>
                            </div>

                            {/* Bảng chú thích */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full px-4">
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
                        </div>
                        <div className="mt-auto text-center border-t border-outline-variant/20 pt-2 w-full">
                            <span className="text-xs text-on-surface-variant block mb-1">Total Number of Sales</span>
                            <span className="font-headline-md text-headline-md font-bold text-on-surface">3,40,0031</span>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}