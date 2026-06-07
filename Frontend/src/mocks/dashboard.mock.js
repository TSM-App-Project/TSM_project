/**
 * DASHBOARD MOCK DATA — Dữ liệu cho biểu đồ Dashboard
 */

export const DASHBOARD_CHART_DATA = {
    revenue: {
        title: "Sales By Category",
        value: "$18,200.82",
        percent: "8.24%",
        isUp: true,
        path: "M0 180 C 50 180, 50 120, 100 120 C 150 120, 150 150, 200 150 C 250 150, 250 80, 300 80 C 350 80, 350 140, 400 140 C 450 140, 450 60, 500 60 C 550 60, 550 160, 600 160",
        fillPath: "M0 180 C 50 180, 50 120, 100 120 C 150 120, 150 150, 200 150 C 250 150, 250 80, 300 80 C 350 80, 350 140, 400 140 C 450 140, 450 60, 500 60 C 550 60, 550 160, 600 160 L 600 200 L 0 200 Z",
        color: "#10b981",
        fillColor: "#10b9811a",
        yLabels: ["$4,700", "$4,600", "$4,500", "$4,400", "$0"]
    },
    orders: {
        title: "Orders Trend",
        value: "3,842",
        percent: "12.50%",
        isUp: true,
        path: "M0 150 C 50 150, 70 180, 120 180 C 170 180, 180 100, 230 100 C 280 100, 310 160, 360 160 C 410 160, 430 80, 480 80 C 530 80, 550 120, 600 120",
        fillPath: "M0 150 C 50 150, 70 180, 120 180 C 170 180, 180 100, 230 100 C 280 100, 310 160, 360 160 C 410 160, 430 80, 480 80 C 530 80, 550 120, 600 120 L 600 200 L 0 200 Z",
        color: "#10b981",
        fillColor: "#10b9811a",
        yLabels: ["4,000", "3,000", "2,000", "1,000", "0"]
    },
    products: {
        title: "Product Inventory",
        value: "1,247",
        percent: "2.30%",
        isUp: false,
        path: "M0 50 C 50 50, 70 100, 120 100 C 170 100, 180 150, 230 150 C 280 150, 310 120, 360 120 C 410 120, 430 180, 480 180 C 530 180, 550 190, 600 195",
        fillPath: "M0 50 C 50 50, 70 100, 120 100 C 170 100, 180 150, 230 150 C 280 150, 310 120, 360 120 C 410 120, 430 180, 480 180 C 530 180, 550 190, 600 195 L 600 200 L 0 200 Z",
        color: "#ba1a1a",
        fillColor: "#ba1a1a1a",
        yLabels: ["1,500", "1,200", "900", "600", "0"]
    },
    customers: {
        title: "Customer Growth",
        value: "8,234",
        percent: "24.60%",
        isUp: true,
        path: "M0 190 C 50 190, 70 170, 120 170 C 170 170, 180 130, 230 130 C 280 130, 310 90, 360 90 C 410 90, 430 60, 480 60 C 530 60, 550 40, 600 30",
        fillPath: "M0 190 C 50 190, 70 170, 120 170 C 170 170, 180 130, 230 130 C 280 130, 310 90, 360 90 C 410 90, 430 60, 480 60 C 530 60, 550 40, 600 30 L 600 200 L 0 200 Z",
        color: "#10b981",
        fillColor: "#10b9811a",
        yLabels: ["10,000", "8,000", "6,000", "4,000", "0"]
    }
};

export const DASHBOARD_STAT_CARDS = [
    {
        id: "revenue",
        title: "Total Revenue",
        value: "$24,582",
        percent: "18.2% this week",
        isUp: true,
        icon: "attach_money",
        iconBgColor: "bg-primary-fixed-dim/20 text-primary"
    },
    {
        id: "orders",
        title: "Total Orders",
        value: "3,842",
        percent: "12.5% this week",
        isUp: true,
        icon: "shopping_cart",
        iconBgColor: "bg-primary-fixed-dim/20 text-primary"
    },
    {
        id: "products",
        title: "Total Product",
        value: "1,247",
        percent: "2.3% this week",
        isUp: false,
        icon: "inventory_2",
        iconBgColor: "bg-secondary-fixed/50 text-secondary"
    },
    {
        id: "customers",
        title: "Active Customers",
        value: "8,234",
        percent: "24.6% this week",
        isUp: true,
        icon: "group",
        iconBgColor: "bg-tertiary-fixed-dim/20 text-tertiary"
    }
];
