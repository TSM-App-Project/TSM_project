import React, { useState, useEffect } from "react";
import { api } from "../services/apiClient";

export default function InventoryReportModal({ isOpen, onClose }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchReport();
    }
  }, [isOpen, month, year]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/reports/inventory?month=${month}&year=${year}`);
      setData(res || []);
    } catch (error) {
      console.error("Failed to fetch inventory report", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm no-print">
      <div className="bg-surface-container-lowest w-full max-w-5xl rounded-xl shadow-lg border border-outline-variant/30 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-bright">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Xuất Báo Cáo Tồn Kho (BM12)</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body & Print Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-white print-area text-black flex-1">
          <div className="border border-black">
            <div className="flex border-b border-black">
              <div className="w-1/4 p-4 border-r border-black font-bold text-xl flex items-center justify-center">BM12:</div>
              <div className="w-3/4 p-4 font-bold text-2xl uppercase tracking-wider flex items-center justify-center">Báo Cáo Tồn Kho</div>
            </div>

            <div className="p-4 border-b border-black flex gap-4 items-center">
              <span className="font-medium text-lg">Tháng/Năm:</span>
              <div className="no-print flex gap-2">
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
              <span className="hidden print:inline font-medium text-lg">{month < 10 ? `0${month}` : month}/{year}</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-500">Đang tải dữ liệu...</div>
            ) : (
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-gray-100 print:bg-white text-sm font-bold">
                    <th className="border-r border-black p-3 w-16">STT</th>
                    <th className="border-r border-black p-3">Sản phẩm</th>
                    <th className="border-r border-black p-3">Đơn vị tính</th>
                    <th className="border-r border-black p-3">Tồn đầu</th>
                    <th className="border-r border-black p-3">Số lượng mua vào</th>
                    <th className="border-r border-black p-3">Số lượng bán ra</th>
                    <th className="p-3">Tồn cuối</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={item.productId} className="border-t border-black">
                        <td className="border-r border-black p-3">{index + 1}</td>
                        <td className="border-r border-black p-3 text-left">{item.productName}</td>
                        <td className="border-r border-black p-3">{item.unit}</td>
                        <td className="border-r border-black p-3">{item.openingStock}</td>
                        <td className="border-r border-black p-3">{item.purchasedQuantity}</td>
                        <td className="border-r border-black p-3">{item.soldQuantity}</td>
                        <td className="p-3 font-bold">{item.closingStock}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t border-black">
                      <td colSpan="7" className="p-8 text-gray-500">Không có dữ liệu tồn kho</td>
                    </tr>
                  )}
                </tbody>
              </table>
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
