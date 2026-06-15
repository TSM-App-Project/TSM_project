import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/apiClient";
import RevenueReportModal from "../components/RevenueReportModal";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

const StatCard = ({
  id,
  activeCard,
  onClick,
  icon,
  title,
  value,
  percent,
  isUp,
  iconBgColor,
}) => {
  const isActive = activeCard === id;

  const baseClass =
    "cursor-pointer rounded-xl p-card-padding flex flex-col gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all duration-300";
  const activeClass = "bg-primary-container text-on-primary scale-105";
  const inactiveClass =
    "bg-surface-container-lowest border border-outline-variant/20 hover:border-primary-container/50";

  const strokeColor = isActive ? "#ffffff" : isUp ? "#10b981" : "#ef4444";

  const pathData = isUp
    ? "M0 25L20 15L40 20L60 5L80 10L100 0"
    : "M0 5L20 15L40 10L60 25L80 20L100 30";

  return (
    <div
      onClick={() => onClick(id)}
      className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
    >
      {isActive && (
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
      )}
      <div className="flex justify-between items-start z-10">
        <div
          className={`flex items-center gap-2 ${isActive ? "" : "text-on-surface-variant"}`}
        >
          <span
            className={`material-symbols-outlined p-1.5 rounded-lg text-sm ${isActive ? "bg-white/20" : iconBgColor}`}
          >
            {icon}
          </span>
          <span className="font-title-sm text-title-sm font-medium">
            {title}
          </span>
        </div>
        <span
          className={`material-symbols-outlined p-1 rounded-full text-xs ${isActive ? "bg-white/20" : "text-outline-variant border border-outline-variant/30"}`}
        >
          arrow_outward
        </span>
      </div>
      <div className="flex justify-between items-end mt-2 z-10">
        <div>
          <h3
            className={`font-display-lg text-display-lg ${isActive ? "" : "text-on-surface"}`}
          >
            {value}
          </h3>
          <div
            className={`flex items-center gap-1 text-sm mt-1 ${isActive ? "" : isUp ? "text-primary-container" : "text-error"}`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isUp ? "arrow_upward" : "arrow_downward"}
            </span>
            <span>{percent}</span>
          </div>
        </div>

        <svg
          className="w-20 h-10"
          viewBox="0 0 100 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={pathData}
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

// Custom tooltip cho biểu đồ
const CustomTooltip = ({ active, payload, label, formatCurrency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 shadow-lg">
        <p className="text-xs text-on-surface-variant font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-xs text-on-surface-variant">{entry.name}:</span>
            <span className="text-sm font-semibold text-on-surface">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [activeCard, setActiveCard] = useState("revenue");
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    totalServices: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalOrders: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    productsGrowth: 0,
  });
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState("0"); // "0"=all, "7", "30", "90"

  const loadChartData = async (days) => {
    try {
      const data = await api.get(`/api/dashboard/daily-revenue?days=${days}`);
      setChartData(data || []);
    } catch (e) {
      console.error("Chart data load error:", e);
    }
  };

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const [sumData, recentData, topData, catData] = await Promise.all([
          api.get("/api/dashboard/summary"),
          api.get("/api/dashboard/recent-invoices"),
          api.get("/api/dashboard/top-products"),
          api.get("/api/dashboard/sales-by-category")
        ]);
        setSummary(sumData || summary);
        setRecentInvoices(recentData || []);
        setTopProducts(topData || []);
        setCategorySales(catData || []);
      } catch (e) {
        console.error("Dashboard data load error:", e);
      }
    };

    loadSummary();
    loadChartData(chartPeriod);
  }, []);

  useEffect(() => {
    loadChartData(chartPeriod);
  }, [chartPeriod]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  const formatNumber = (value) => (value || 0).toLocaleString("en-US");

  const formatGrowth = (value) => {
    const absValue = Math.abs(value || 0);
    return `${absValue.toFixed(1)}% tháng này`;
  };

  const statCards = {
    revenue: {
      title: "Tổng Doanh Thu",
      value: formatCurrency(summary.totalSales),
      percent: formatGrowth(summary.salesGrowth),
      isUp: (summary.salesGrowth || 0) >= 0,
    },
    orders: {
      title: "Tổng Lượt Bán",
      value: formatNumber(summary.totalOrders),
      percent: formatGrowth(summary.ordersGrowth),
      isUp: (summary.ordersGrowth || 0) >= 0,
    },
    products: {
      title: "Tổng Sản Phẩm",
      value: formatNumber(summary.totalProducts),
      percent: formatGrowth(summary.productsGrowth),
      isUp: (summary.productsGrowth || 0) >= 0,
    },
    customers: {
      title: "Khách Hoạt Động",
      value: formatNumber(summary.totalCustomers),
      percent: formatGrowth(summary.customersGrowth),
      isUp: (summary.customersGrowth || 0) >= 0,
    },
  };

  const currentStat = statCards[activeCard];

  const periodLabels = {
    "7": "7 ngày qua",
    "30": "30 ngày qua",
    "90": "90 ngày qua",
  };

  const DONUT_COLORS = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6'];

  return (
    <MainLayout
      headerActions={
        <button
          onClick={() => setShowRevenueModal(true)}
          className="px-4 py-2 bg-primary-container text-on-primary rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2 no-print"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Xuất Báo Cáo
        </button>
      }
      title="Tổng Quan"
      subtitle="Hiệu suất kinh doanh cửa hàng trang sức của bạn"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="revenue"
          activeCard={activeCard}
          onClick={setActiveCard}
          icon="attach_money"
          title="Tổng Doanh Thu"
          value={formatCurrency(summary.totalSales)}
          percent={formatGrowth(summary.salesGrowth)}
          isUp={(summary.salesGrowth || 0) >= 0}
          iconBgColor="bg-primary-fixed-dim/20 text-primary"
        />
        <StatCard
          id="orders"
          activeCard={activeCard}
          onClick={setActiveCard}
          icon="shopping_cart"
          title="Tổng Lượt Bán"
          value={formatNumber(summary.totalOrders)}
          percent={formatGrowth(summary.ordersGrowth)}
          isUp={(summary.ordersGrowth || 0) >= 0}
          iconBgColor="bg-primary-fixed-dim/20 text-primary"
        />
        <StatCard
          id="products"
          activeCard={activeCard}
          onClick={setActiveCard}
          icon="inventory_2"
          title="Tổng Sản Phẩm"
          value={formatNumber(summary.totalProducts)}
          percent={formatGrowth(summary.productsGrowth)}
          isUp={(summary.productsGrowth || 0) >= 0}
          iconBgColor="bg-secondary-fixed/50 text-secondary"
        />
        <StatCard
          id="customers"
          activeCard={activeCard}
          onClick={setActiveCard}
          icon="group"
          title="Khách Hoạt Động"
          value={formatNumber(summary.totalCustomers)}
          percent={formatGrowth(summary.customersGrowth)}
          isUp={(summary.customersGrowth || 0) >= 0}
          iconBgColor="bg-tertiary-fixed-dim/20 text-tertiary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* BIỂU ĐỒ DOANH THU & CHI PHÍ THEO NGÀY */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {currentStat.title}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-display-lg text-display-lg text-on-surface">
                  {currentStat.value}
                </span>
                <span
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-medium ${currentStat.isUp ? "bg-primary-fixed-dim/20 text-primary" : "bg-error-container text-error"}`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {currentStat.isUp ? "arrow_upward" : "arrow_downward"}
                  </span>
                  {currentStat.percent}
                </span>
              </div>
            </div>
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg focus:ring-primary-container focus:border-primary-container block p-2"
            >
              <option value="0">Tất cả</option>
              <option value="7">7 ngày qua</option>
              <option value="30">30 ngày qua</option>
              <option value="90">90 ngày qua</option>
            </select>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#6366f1]"></div>
              <span className="text-xs text-on-surface-variant">Doanh thu bán hàng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f43f5e]"></div>
              <span className="text-xs text-on-surface-variant">Chi phí nhập hàng</span>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[280px] mt-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradPurchases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    dy={10}
                    interval={chartPeriod === "7" ? 0 : chartPeriod === "30" ? 4 : Math.max(0, Math.floor(chartData.length / 8) - 1)}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickFormatter={(val) => {
                      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                      if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                      return val;
                    }}
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#gradRevenue)"
                    dot={chartPeriod === "7"}
                  />
                  <Area
                    type="monotone"
                    dataKey="purchases"
                    name="Nhập hàng"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#gradPurchases)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-on-surface-variant text-sm">
                <span className="material-symbols-outlined mr-2 text-outline">bar_chart</span>
                Chưa có dữ liệu giao dịch
              </div>
            )}
          </div>
        </div>

        {/* BIỂU ĐỒ TRÒN DONUT - DOANH THU THEO DANH MỤC */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center relative">
          <div className="w-full flex justify-between items-center mb-6">
            <h3 className="font-title-sm text-title-sm text-on-surface font-semibold">
              Doanh Thu Theo Danh Mục
            </h3>
          </div>
          <div className="relative w-[200px] h-[200px] mt-4 flex items-center justify-center">
            {categorySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySales}
                    dataKey="totalSales"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    stroke="none"
                    paddingAngle={3}
                  >
                    {categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)', fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-on-surface-variant text-sm">Chưa có dữ liệu</div>
            )}
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-on-surface-variant">Tổng</span>
              <span className="font-bold text-lg text-on-surface">
                {formatCurrency(summary.totalSales)}
              </span>
            </div>
          </div>

          
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-8 w-full px-2">
            {categorySales.map((cat, index) => {
              const totalAll = categorySales.reduce((sum, c) => sum + Number(c.totalSales || 0), 0);
              const percentage = totalAll > 0 ? ((Number(cat.totalSales || 0) / totalAll) * 100).toFixed(1) : 0;
              return (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }}></div>
                  <div className="min-w-0">
                    <span className="text-xs text-on-surface-variant block truncate" title={cat.categoryName}>
                      {cat.categoryName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-on-surface">
                        {formatCurrency(cat.totalSales)}
                      </span>
                      <span className="text-xs text-on-surface-variant">({percentage}%)</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {categorySales.length === 0 && (
              <span className="text-sm text-on-surface-variant col-span-2 text-center">Chưa có dữ liệu danh mục</span>
            )}
          </div>

          <div className="mt-6 text-center border-t border-outline-variant/20 pt-4 w-full">
            <span className="text-xs text-on-surface-variant block mb-1">
              Tổng Lượt Bán
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              {formatNumber(summary.totalOrders)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-8">
        {/* SẢN PHẨM BÁN CHẠY */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Trang Sức Bán Chạy
            </h3>
            <div className="flex items-center gap-1 text-xs text-on-surface-variant bg-surface-variant/30 px-2.5 py-1 rounded-full">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              Top {topProducts.length}
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            {topProducts.map((product, index) => {
              const icons = ['diamond', 'watch', 'auto_awesome', 'workspace_premium', 'star'];
              const icon = icons[index % icons.length];
              const medalColors = ['text-amber-500', 'text-slate-400', 'text-amber-700'];
              return (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-surface-bright rounded-xl transition-colors border border-transparent hover:border-outline-variant/10 group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 bg-surface-variant/60 rounded-lg overflow-hidden flex items-center justify-center group-hover:bg-primary-container/20 transition-colors">
                        <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                          {icon}
                        </span>
                      </div>
                      <span className={`absolute -top-1 -left-1 material-symbols-outlined text-[16px] ${medalColors[index] || 'text-outline'}`}>
                        {index < 3 ? 'emoji_events' : ''}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-title-sm text-title-sm text-on-surface font-semibold max-w-[150px] truncate" title={product.productName}>
                        {product.productName}
                      </h4>
                      <span className="text-xs text-on-surface-variant">
                        Đã bán <strong className="text-primary">{product.totalSold}</strong> sản phẩm
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-on-surface text-sm">
                    {formatCurrency(product.totalRevenue)}
                  </span>
                </div>
              );
            })}
            {topProducts.length === 0 && (
              <div className="p-6 text-center text-on-surface-variant text-sm flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-outline">storefront</span>
                Chưa có sản phẩm nào được bán
              </div>
            )}
          </div>

        </div>

        {/* ĐƠN HÀNG GẦN ĐÂY */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Đơn Hàng Gần Đây
            </h3>
            <div className="flex items-center gap-1 text-xs text-on-surface-variant bg-surface-variant/30 px-2.5 py-1 rounded-full">
              <span className="material-symbols-outlined text-[14px]">receipt_long</span>
              {recentInvoices.length} đơn mới nhất
            </div>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-on-surface-variant border-b border-outline-variant/20 uppercase tracking-wider">
                  <th className="pb-3 font-medium px-4">#</th>
                  <th className="pb-3 font-medium px-4">Sản phẩm</th>
                  <th className="pb-3 font-medium px-4">Ngày</th>
                  <th className="pb-3 font-medium px-4">Trạng thái</th>
                  <th className="pb-3 font-medium px-4">Giá</th>
                  <th className="pb-3 font-medium px-4">Khách hàng</th>
                </tr>
              </thead>
              
              <tbody className="text-sm">
                {recentInvoices.map((invoice, index) => {
                  const icons = ['diamond', 'auto_awesome', 'watch', 'star'];
                  const icon = icons[index % icons.length];
                  return (
                    <tr key={index} className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors">
                      <td className="py-4 px-4 text-on-surface-variant">{invoice.invoiceId}</td>
                      <td className="py-4 px-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-variant rounded flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">
                            {icon}
                          </span>
                        </div>
                        <span className="font-medium text-on-surface truncate max-w-[180px]" title={invoice.firstProductName}>
                          {invoice.firstProductName}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-on-surface-variant">{invoice.date.split("T")[0]}</td>
                      <td className="py-4 px-4">
                        <span className="inline-block bg-primary-fixed-dim/20 text-primary-container px-3 py-1 rounded-full text-xs font-medium">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-on-surface">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td className="py-4 px-4 text-on-surface-variant">
                        {invoice.customerName}
                      </td>
                    </tr>
                  );
                })}
                {recentInvoices.length === 0 && (
                  <tr><td colSpan="6" className="py-8 text-center text-on-surface-variant">Không tìm thấy đơn hàng gần đây</td></tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
      <RevenueReportModal isOpen={showRevenueModal} onClose={() => setShowRevenueModal(false)} />
    </MainLayout>
  );
}
