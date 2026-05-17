import React from 'react';
import MainLayout from "../layouts/MainLayout.jsx";
import {Link} from "react-router-dom";

export default function ComingSoon() {
    return (
        <MainLayout title="Đang cập nhật" subtitle="Tính năng đang được xây dựng">
            <div className="flex flex-col items-center justify-center h-[60vh] bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-8 text-center">

                <span className="material-symbols-outlined text-[80px] text-[#9a7a3b] mb-6">
                    construction
                </span>

                <h2 className="text-3xl font-black text-on-surface mb-4">Tính năng đang phát triển</h2>

                <p className="text-on-surface-variant max-w-md text-lg mb-8">
                    Chúng tôi đang nỗ lực hoàn thiện tính năng này để mang lại trải nghiệm tốt nhất cho bạn. Vui lòng quay lại sau nhé!
                </p>

                <Link to="/dashboard" className="bg-gradient-to-r from-[#9a7a3b] to-[#e6d3a1] hover:opacity-90 text-white font-bold py-3 px-8 rounded-xl transition-colors duration-200">
                    Quay về Dashboard
                </Link>

            </div>
        </MainLayout>
    )
}