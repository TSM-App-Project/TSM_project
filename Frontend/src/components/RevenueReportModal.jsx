import React, { useState, useEffect } from "react";
import { api } from "../services/apiClient";

export default function RevenueReportModal({ isOpen, onClose }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchReport();
    }
  }, [isOpen, month, year]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/reports/revenue?month=${month}&year=${year}`);
      setData(res);
    } catch (error) {
      console.error("Failed to fetch revenue report", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm no-print">
      <div className="bg-surface-container-lowest w-full max-w-3xl rounded-xl shadow-lg border border-outline-variant/30 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-bright">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Xuất Báo Cáo Doanh Thu (BM16)</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body & Print Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-white print-area text-black flex-1">
          <div className="border border-black p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl">BM16:</h3>
              <h3 className="font-bold text-2xl uppercase tracking-wider">Báo Cáo Doanh Thu</h3>
              <div className="w-16"></div> {/* Spacer for center alignment */}
            </div>

            <div className="mb-8 flex gap-4 items-center no-print">
              <span className="font-medium text-lg">Chọn Tháng/Năm:</span>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border border-gray-300 rounded p-1">
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                ))}
              </select>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="border border-gray-300 rounded p-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                ))}
              </select>
            </div>

            <div className="mb-8 hidden print:block">
              <span className="font-medium text-lg">Trong tháng/năm: {month < 10 ? `0${month}` : month}/{year}</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-500">Đang tải dữ liệu...</div>
            ) : data ? (
              <div className="grid grid-cols-2 gap-y-8 gap-x-12 text-lg">
                <div className="flex justify-between border-b border-gray-300 pb-2">
                  <span className="font-medium">Doanh thu bán hàng:</span>
                  <span>{formatCurrency(data.salesRevenue)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-2">
                  <span className="font-medium">Doanh thu dịch vụ:</span>
                  <span>{formatCurrency(data.serviceRevenue)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-2">
                  <span className="font-medium">Tiền nhập hàng:</span>
                  <span>{formatCurrency(data.purchaseCost)}</span>
                </div>
                <div className="col-span-1"></div> {/* Empty space */}
                <div className="flex justify-between border-b border-gray-300 pb-2">
                  <span className="font-bold">Tổng doanh thu:</span>
                  <span className="font-bold">{formatCurrency(data.totalRevenue)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-2">
                  <span className="font-bold text-red-600 print:text-black">Tổng lợi nhuận:</span>
                  <span className="font-bold text-red-600 print:text-black">{formatCurrency(data.totalProfit)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-2 col-span-2">
                  <span className="font-medium">Tỷ lệ tăng trưởng so với tháng gần nhất:</span>
                  <span>{data.growthRate}</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">Không có dữ liệu</div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/20 flex justify-end gap-3 bg-surface-bright no-print">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium border border-outline-variant/30 text-on-surface hover:bg-surface-container-low transition-colors">
            Hủy (ESC)
          </button>
          <button onClick={handlePrint} className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-container text-on-primary hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">print</span>
            Xuất PDF / In
          </button>
        </div>
      </div>
    </div>
  );
}
