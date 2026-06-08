import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang đã có
import Login from './pages/Login';
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import Master from "./pages/Master.jsx";
import Services from "./pages/Services.jsx";
import Customers from "./pages/Customers.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import Products from "./pages/Products.jsx";
import Inventory from "./pages/Inventory.jsx";
import Trading from "./pages/Trading.jsx";
function App() {
    return (
        <HashRouter>
            <Routes>
                {/* Các route cơ bản */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Các route bảo trì/chưa làm */}
                <Route path="/settings" element={<ComingSoon />} />
                <Route path="/support" element={<ComingSoon />} />

                {/* Các route mới cho chức năng phần mềm */}
                <Route path="/master" element={<Master />} />
                <Route path="/products" element={<Products />} />
                <Route path="/trading" element={<Trading />} />
                <Route path="/services" element={<Services />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/inventory" element={<Inventory />} />

                {/* Tự động chuyển hướng về trang login khi nhập sai URL (LUÔN ĐỂ CUỐI CÙNG) */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </HashRouter>
    );
}

export default App;