import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { api } from "../services/apiClient";
import RevenueReportModal from "../components/RevenueReportModal";

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

  // 1. TẠO BIẾN QUYẾT ĐỊNH MÀU SẮC CHO ĐƯỜNG KẺ SVG
  // Nếu được chọn -> Màu trắng (#ffffff)
  // Nếu không được chọn -> Xét xem đi lên (Xanh: #10b981) hay đi xuống (Đỏ: #ef4444)
  const strokeColor = isActive ? "#ffffff" : isUp ? "#10b981" : "#ef4444";

  // 2. TẠO BIẾN QUYẾT ĐỊNH HÌNH DÁNG ĐƯỜNG KẺ
  const pathData = isUp
    ? "M0 25L20 15L40 20L60 5L80 10L100 0" // Tọa độ vẽ đường đi lên
    : "M0 5L20 15L40 10L60 25L80 20L100 30"; // Tọa độ vẽ đường đi xuống

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

        {/* 3. VỨT THẺ <div> CŨ ĐI, THAY BẰNG THẺ <svg> NÀY */}
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
  });
  const [showRevenueModal, setShowRevenueModal] = useState(false);

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
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  const formatNumber = (value) => (value || 0).toLocaleString("en-US");

  const chartData = {
    revenue: {
      title: "Total Revenue",
      value: formatCurrency(summary.totalSales),
      percent: "8.24%",
      isUp: true,
    },
    orders: {
      title: "Total Purchases",
      value: formatNumber(summary.totalOrders),
      percent: "12.50%",
      isUp: true,
    },
    products: {
      title: "Product Inventory",
      value: formatNumber(summary.totalProducts),
      percent: "2.30%",
      isUp: false,
    },
    customers: {
      title: "Customer Growth",
      value: formatNumber(summary.totalCustomers),
      percent: "24.60%",
      isUp: true,
    },
  };

  const currentChart = chartData[activeCard];

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
      title="Dashboard Overview"
      subtitle="Welcome back! Your jewelry store performance view"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="revenue"
          activeCard={activeCard}
          onClick={setActiveCard}
          icon="attach_money"
          title="Total Revenue"
          value={formatCurrency(summary.totalSales)}
          percent="18.2% this week"
          isUp={true}
          sparklineClass="sparkline-up-green"
          iconBgColor="bg-primary-fixed-dim/20 text-primary"
        />
        <StatCard
          id="orders"
          activeCard={activeCard}
          onClick={setActiveCard}
          icon="shopping_cart"
          title="Total Orders"
          value={formatNumber(summary.totalOrders)}
          percent="12.5% this week"
          isUp={true}
          sparklineClass="sparkline-up-green"
          iconBgColor="bg-primary-fixed-dim/20 text-primary"
        />
        <StatCard
          id="products"
          activeCard={activeCard}
          onClick={setActiveCard}
          icon="inventory_2"
          title="Total Product"
          value={formatNumber(summary.totalProducts)}
          percent="2.3% this week"
          isUp={false}
          sparklineClass="sparkline-down-red"
          iconBgColor="bg-secondary-fixed/50 text-secondary"
        />
        <StatCard
          id="customers"
          activeCard={activeCard}
          onClick={setActiveCard}
          icon="group"
          title="Active Customers"
          value={formatNumber(summary.totalCustomers)}
          percent="24.6% this week"
          isUp={true}
          sparklineClass="sparkline-up-green"
          iconBgColor="bg-tertiary-fixed-dim/20 text-tertiary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {currentChart.title}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-display-lg text-display-lg text-on-surface">
                  {currentChart.value}
                </span>
                <span
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-medium ${currentChart.isUp ? "bg-primary-fixed-dim/20 text-primary" : "bg-error-container text-error"}`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {currentChart.isUp ? "arrow_upward" : "arrow_downward"}
                  </span>
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
          <div className="flex-1 w-full min-h-[250px] relative chart-mockup mt-4 border-l border-b border-outline-variant/20 transition-all duration-500">
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
            <h3 className="font-title-sm text-title-sm text-on-surface font-semibold">
              Sales By Category
            </h3>
            <select className="bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg focus:ring-primary-container focus:border-primary-container block p-1.5">
              <option>Monthly</option>
            </select>
          </div>
          <div className="relative w-[200px] h-[200px] donut-mockup mt-4">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">
                {formatCurrency(summary.totalSales)}
              </span>
              <span className="bg-primary-container text-on-primary text-xs px-2 py-0.5 rounded-full mt-1">
                + 45%
              </span>
            </div>
          </div>

          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-8 w-full px-4">
            {categorySales.map((cat, index) => {
              const colors = ['bg-outline-variant', 'bg-primary-container', 'bg-primary-fixed-dim', 'bg-surface-variant', 'bg-secondary', 'bg-error'];
              const colorClass = colors[index % colors.length];
              return (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                  <div>
                    <span className="text-xs text-on-surface-variant block truncate w-24" title={cat.categoryName}>
                      {cat.categoryName}
                    </span>
                    <span className="font-semibold text-sm text-on-surface">
                      {formatCurrency(cat.totalSales)}
                    </span>
                  </div>
                </div>
              );
            })}
            {categorySales.length === 0 && (
              <span className="text-sm text-on-surface-variant col-span-2 text-center">No category data</span>
            )}
          </div>



          <div className="mt-8 text-center border-t border-outline-variant/20 pt-4 w-full">
            <span className="text-xs text-on-surface-variant block mb-1">
              Total Number of Sales
            </span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              {formatNumber(summary.totalOrders)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-8">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Top Jewelry
            </h3>
            <select className="bg-surface-bright border border-outline-variant/30 text-on-surface text-sm rounded-lg p-1.5">
              <option>Monthly</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-4">
            {topProducts.map((product, index) => {
              const icons = ['diamond', 'watch', 'auto_awesome', 'workspace_premium', 'star'];
              const icon = icons[index % icons.length];
              return (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-surface-bright rounded-lg transition-colors border border-transparent hover:border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-variant rounded-md overflow-hidden flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline">
                        {icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-title-sm text-title-sm text-on-surface font-semibold max-w-[150px] truncate" title={product.productName}>
                        {product.productName}
                      </h4>
                      <span className="text-xs text-on-surface-variant">
                        {product.totalSold} sold
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-on-surface">
                    {formatCurrency(product.totalRevenue)}
                  </span>
                </div>
              );
            })}
            {topProducts.length === 0 && (
              <div className="p-4 text-center text-on-surface-variant text-sm">No products sold yet</div>
            )}
          </div>

        </div>

        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Recent Jewelry Orders
            </h3>
            <button className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface px-3 py-1.5 border border-outline-variant/30 rounded-lg">
              <span className="material-symbols-outlined text-[18px]">
                filter_list
              </span>{" "}
              Filter
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
                  <tr><td colSpan="6" className="py-8 text-center text-on-surface-variant">No recent orders found</td></tr>
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
